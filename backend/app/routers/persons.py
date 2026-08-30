import os
import uuid
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from ..config import settings, UPLOADS_DIR
from ..database import get_db
from ..models import Person, Department, BiometricFace, AttendanceRecord
from ..models.attendance import AttendanceStatus
from ..schemas.person import (
    PersonCreate, PersonUpdate, PersonOut, PersonDetailOut, 
    AttendanceSummaryStats, FaceEnrollRequest, BiometricEnrollItem
)
from ..services.auth_service import get_current_user, get_current_user_optional
from ..services.crypto_service import crypto_service
from ..services.face_service import face_service
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/persons", tags=["Persons"])

@router.get("", response_model=List[PersonOut])
def get_persons(
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Person)
    if department_id:
        query = query.filter(Person.department_id == department_id)
    if is_active is not None:
        query = query.filter(Person.is_active == is_active)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Person.full_name.ilike(search_fmt),
                Person.identifier.ilike(search_fmt),
                Person.email.ilike(search_fmt),
                Person.designation.ilike(search_fmt)
            )
        )

    persons = query.order_by(Person.full_name.asc()).all()
    results = []
    for p in persons:
        bio_cnt = db.query(func.count(BiometricFace.id)).filter(BiometricFace.person_id == p.id).scalar() or 0
        p_out = PersonOut.from_orm(p)
        p_out.department_name = p.department.name if p.department else None
        p_out.biometric_count = bio_cnt
        results.append(p_out)

    return results

@router.post("", response_model=PersonOut, status_code=status.HTTP_201_CREATED)
def create_person(
    payload: PersonCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    # Validate identifier uniqueness
    if db.query(Person).filter(Person.identifier == payload.identifier).first():
        raise HTTPException(status_code=400, detail=f"ID '{payload.identifier}' is already registered")

    # Validate department
    dept = db.query(Department).filter(Department.id == payload.department_id).first()
    if not dept:
        raise HTTPException(status_code=400, detail="Selected department does not exist")

    # Require explicit consent
    if not payload.consent_given:
        raise HTTPException(
            status_code=400, 
            detail="Biometric consent is mandatory before enrolling a person in the face recognition database."
        )

    new_person = Person(
        identifier=payload.identifier,
        full_name=payload.full_name,
        department_id=payload.department_id,
        email=payload.email,
        phone=payload.phone,
        designation=payload.designation,
        notes=payload.notes,
        consent_given=payload.consent_given,
        consent_timestamp=datetime.utcnow() if payload.consent_given else None,
        consent_version=payload.consent_version,
        is_active=True
    )
    db.add(new_person)
    db.commit()
    db.refresh(new_person)

    # Process initial face enrollment if images were provided
    enrolled_count = 0
    if payload.face_images:
        for item in payload.face_images:
            img = face_service.decode_image_base64(item.image_base64)
            if img is not None:
                embedding = face_service.extract_embedding(img)
                if embedding:
                    # Save avatar crop for first valid frontal image
                    if not new_person.profile_photo_url:
                        photo_filename = f"avatar_{new_person.id}_{uuid.uuid4().hex[:8]}.jpg"
                        photo_path = UPLOADS_DIR / photo_filename
                        import cv2
                        cv2.imwrite(str(photo_path), img)
                        new_person.profile_photo_url = f"/data/uploads/{photo_filename}"

                    encrypted_vector_str = crypto_service.encrypt_vector(embedding)
                    is_good, _, quality_score = face_service.check_image_quality(img)
                    
                    bio_face = BiometricFace(
                        person_id=new_person.id,
                        encrypted_embedding=encrypted_vector_str,
                        angle_label=item.angle_label or "front",
                        quality_score=quality_score
                    )
                    db.add(bio_face)
                    enrolled_count += 1
        
        db.commit()
        db.refresh(new_person)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="PERSON_REGISTERED",
        user=current_user,
        target_type="Person",
        target_id=str(new_person.id),
        details=f"Registered person '{new_person.full_name}' ({new_person.identifier}) with {enrolled_count} face embeddings",
        ip_address=client_ip
    )

    p_out = PersonOut.from_orm(new_person)
    p_out.department_name = dept.name
    p_out.biometric_count = enrolled_count
    return p_out

@router.get("/{id}", response_model=PersonDetailOut)
def get_person_detail(id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    bio_cnt = db.query(func.count(BiometricFace.id)).filter(BiometricFace.person_id == person.id).scalar() or 0

    # Calculate statistics
    records = db.query(AttendanceRecord).filter(AttendanceRecord.person_id == person.id).order_by(AttendanceRecord.date.desc()).all()
    total_days = len(records)
    present_days = sum(1 for r in records if r.status == AttendanceStatus.PRESENT)
    late_days = sum(1 for r in records if r.status == AttendanceStatus.LATE)
    absent_days = sum(1 for r in records if r.status == AttendanceStatus.ABSENT)
    
    rate = ((present_days + late_days) / total_days * 100.0) if total_days > 0 else 0.0

    recent_history = []
    for r in records[:15]:
        recent_history.append({
            "id": r.id,
            "date": r.date.strftime("%Y-%m-%d"),
            "check_in_time": r.check_in_time.strftime("%I:%M %p") if r.check_in_time else "--",
            "check_out_time": r.check_out_time.strftime("%I:%M %p") if r.check_out_time else "--",
            "status": r.status.value,
            "confidence": round(r.recognition_confidence * 100, 1),
            "verification_mode": r.verification_mode.value
        })

    stats = AttendanceSummaryStats(
        total_days=total_days,
        present_days=present_days,
        late_days=late_days,
        absent_days=absent_days,
        attendance_rate_pct=round(rate, 1)
    )

    p_out = PersonDetailOut(
        id=person.id,
        identifier=person.identifier,
        full_name=person.full_name,
        department_id=person.department_id,
        department_name=person.department.name if person.department else None,
        email=person.email,
        phone=person.phone,
        designation=person.designation,
        notes=person.notes,
        profile_photo_url=person.profile_photo_url,
        consent_given=person.consent_given,
        consent_timestamp=person.consent_timestamp,
        consent_version=person.consent_version,
        is_active=person.is_active,
        biometric_count=bio_cnt,
        created_at=person.created_at,
        updated_at=person.updated_at,
        stats=stats,
        recent_attendance=recent_history
    )
    return p_out

@router.put("/{id}", response_model=PersonOut)
def update_person(
    id: int,
    payload: PersonUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    update_dict = payload.dict(exclude_unset=True)
    if "department_id" in update_dict:
        dept = db.query(Department).filter(Department.id == update_dict["department_id"]).first()
        if not dept:
            raise HTTPException(status_code=400, detail="Selected department does not exist")

    for k, v in update_dict.items():
        setattr(person, k, v)

    db.commit()
    db.refresh(person)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="PERSON_UPDATED",
        user=current_user,
        target_type="Person",
        target_id=str(person.id),
        details=f"Updated details for person '{person.full_name}'",
        ip_address=client_ip
    )

    bio_cnt = db.query(func.count(BiometricFace.id)).filter(BiometricFace.person_id == person.id).scalar() or 0
    p_out = PersonOut.from_orm(person)
    p_out.department_name = person.department.name if person.department else None
    p_out.biometric_count = bio_cnt
    return p_out

@router.post("/{id}/enroll")
def enroll_faces(
    id: int,
    payload: FaceEnrollRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    if not payload.face_images:
        raise HTTPException(status_code=400, detail="No face images provided for enrollment")

    if payload.replace_existing:
        db.query(BiometricFace).filter(BiometricFace.person_id == person.id).delete()

    enrolled = 0
    for item in payload.face_images:
        img = face_service.decode_image_base64(item.image_base64)
        if img is not None:
            embedding = face_service.extract_embedding(img)
            if embedding:
                # Update avatar if needed
                if not person.profile_photo_url or payload.replace_existing:
                    photo_filename = f"avatar_{person.id}_{uuid.uuid4().hex[:8]}.jpg"
                    photo_path = UPLOADS_DIR / photo_filename
                    import cv2
                    cv2.imwrite(str(photo_path), img)
                    person.profile_photo_url = f"/data/uploads/{photo_filename}"

                encrypted_vector_str = crypto_service.encrypt_vector(embedding)
                is_good, _, quality_score = face_service.check_image_quality(img)

                bio_face = BiometricFace(
                    person_id=person.id,
                    encrypted_embedding=encrypted_vector_str,
                    angle_label=item.angle_label or "front",
                    quality_score=quality_score
                )
                db.add(bio_face)
                enrolled += 1

    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="BIOMETRIC_ENROLLED",
        user=current_user,
        target_type="Person",
        target_id=str(person.id),
        details=f"Enrolled {enrolled} biometric face angles for '{person.full_name}'",
        ip_address=client_ip
    )

    return {
        "success": True,
        "enrolled_count": enrolled,
        "profile_photo_url": person.profile_photo_url,
        "message": f"Successfully enrolled {enrolled} face angle representations"
    }

@router.delete("/{id}/biometrics")
def erase_biometric_data(
    id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Right-to-be-Forgotten: Purges all encrypted face vectors and enrollment photos for this person.
    """
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    deleted_count = db.query(BiometricFace).filter(BiometricFace.person_id == person.id).delete()
    person.profile_photo_url = None
    person.consent_given = False
    person.consent_timestamp = None
    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="BIOMETRIC_PURGED",
        user=current_user,
        target_type="Person",
        target_id=str(person.id),
        details=f"Purged all {deleted_count} biometric face embeddings for '{person.full_name}' (Right to Biometric Erasure)",
        ip_address=client_ip
    )

    return {
        "success": True,
        "purged_count": deleted_count,
        "message": f"All biometric data for {person.full_name} has been permanently erased."
    }

@router.delete("/{id}")
def delete_person(
    id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    name = person.full_name
    db.delete(person)
    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="PERSON_DELETED",
        user=current_user,
        target_type="Person",
        target_id=str(id),
        details=f"Deleted person profile '{name}'",
        ip_address=client_ip
    )

    return {"message": f"Person '{name}' deleted successfully"}
