from datetime import datetime, date
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
import io
from ..database import get_db
from ..models import AttendanceRecord, Person, Department
from ..models.attendance import AttendanceStatus
from ..services.report_service import report_service

router = APIRouter(prefix="/api/reports", tags=["Reports"])

def get_filtered_records(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[AttendanceStatus] = None,
    search: Optional[str] = None
):
    query = db.query(AttendanceRecord).join(Person)

    if start_date:
        query = query.filter(AttendanceRecord.date >= start_date)
    if end_date:
        query = query.filter(AttendanceRecord.date <= end_date)
    if department_id:
        query = query.filter(Person.department_id == department_id)
    if status_filter:
        query = query.filter(AttendanceRecord.status == status_filter)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Person.full_name.ilike(search_fmt),
                Person.identifier.ilike(search_fmt)
            )
        )

    return query.order_by(AttendanceRecord.date.desc(), AttendanceRecord.check_in_time.desc()).all()

@router.get("/csv")
def export_csv(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status"),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    records = get_filtered_records(db, start_date, end_date, department_id, status_filter, search)
    csv_bytes = report_service.generate_csv(records)
    
    filename = f"attendance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return Response(
        content=csv_bytes,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/excel")
def export_excel(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status"),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    records = get_filtered_records(db, start_date, end_date, department_id, status_filter, search)
    excel_bytes = report_service.generate_excel(records)
    
    filename = f"attendance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/pdf")
def export_pdf(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status"),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    records = get_filtered_records(db, start_date, end_date, department_id, status_filter, search)
    pdf_bytes = report_service.generate_pdf(records)
    
    filename = f"attendance_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
