from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Department, Person
from ..schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentOut
from ..services.auth_service import get_current_user
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/departments", tags=["Departments"])

@router.get("", response_model=List[DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).order_by(Department.name.asc()).all()
    result = []
    for d in departments:
        cnt = db.query(func.count(Person.id)).filter(Person.department_id == d.id, Person.is_active == True).scalar() or 0
        d_out = DepartmentOut.from_orm(d)
        d_out.member_count = cnt
        result.append(d_out)
    return result

@router.post("", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(
    payload: DepartmentCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if db.query(Department).filter(Department.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Department name already exists")
    if db.query(Department).filter(Department.code == payload.code).first():
        raise HTTPException(status_code=400, detail="Department code already exists")

    dept = Department(
        name=payload.name,
        code=payload.code,
        description=payload.description,
        shift_start_time=payload.shift_start_time,
        shift_late_threshold_mins=payload.shift_late_threshold_mins,
        shift_end_time=payload.shift_end_time,
        is_active=payload.is_active
    )
    db.add(dept)
    db.commit()
    db.refresh(dept)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="DEPARTMENT_CREATED",
        user=current_user,
        target_type="Department",
        target_id=str(dept.id),
        details=f"Created department '{dept.name}' ({dept.code})",
        ip_address=client_ip
    )

    d_out = DepartmentOut.from_orm(dept)
    d_out.member_count = 0
    return d_out

@router.put("/{id}", response_model=DepartmentOut)
def update_department(
    id: int,
    payload: DepartmentUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(dept, k, v)

    db.commit()
    db.refresh(dept)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="DEPARTMENT_UPDATED",
        user=current_user,
        target_type="Department",
        target_id=str(dept.id),
        details=f"Updated department '{dept.name}' settings",
        ip_address=client_ip
    )

    cnt = db.query(func.count(Person.id)).filter(Person.department_id == dept.id, Person.is_active == True).scalar() or 0
    d_out = DepartmentOut.from_orm(dept)
    d_out.member_count = cnt
    return d_out

@router.delete("/{id}")
def delete_department(
    id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    dept = db.query(Department).filter(Department.id == id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    member_cnt = db.query(func.count(Person.id)).filter(Person.department_id == dept.id).scalar() or 0
    if member_cnt > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete department with {member_cnt} assigned people. Reassign them first.")

    name = dept.name
    db.delete(dept)
    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="DEPARTMENT_DELETED",
        user=current_user,
        target_type="Department",
        target_id=str(id),
        details=f"Deleted department '{name}'",
        ip_address=client_ip
    )

    return {"message": f"Department '{name}' deleted successfully"}
