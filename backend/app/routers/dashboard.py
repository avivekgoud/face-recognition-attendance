from datetime import datetime, date, timedelta
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import AttendanceRecord, Person, Department
from ..models.attendance import AttendanceStatus
from ..schemas.analytics import (
    DashboardKPIs, DailyAttendanceTrend, DepartmentAttendanceStat,
    HourlyDistribution, RecentActivityItem
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardKPIs)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today = date.today()
    total_reg = db.query(func.count(Person.id)).filter(Person.is_active == True).scalar() or 0
    total_depts = db.query(func.count(Department.id)).filter(Department.is_active == True).scalar() or 0

    present_cnt = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.date == today,
        AttendanceRecord.status == AttendanceStatus.PRESENT
    ).scalar() or 0

    late_cnt = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.date == today,
        AttendanceRecord.status == AttendanceStatus.LATE
    ).scalar() or 0

    # Absent count is registered members who haven't logged today or are marked ABSENT
    explicit_absent = db.query(func.count(AttendanceRecord.id)).filter(
        AttendanceRecord.date == today,
        AttendanceRecord.status == AttendanceStatus.ABSENT
    ).scalar() or 0

    total_attended = present_cnt + late_cnt
    absent_cnt = max(0, total_reg - total_attended) if explicit_absent == 0 else explicit_absent

    rate = (total_attended / total_reg * 100.0) if total_reg > 0 else 0.0

    return DashboardKPIs(
        total_registered=total_reg,
        present_today=present_cnt,
        late_today=late_cnt,
        absent_today=absent_cnt,
        attendance_rate_today=round(rate, 1),
        total_departments=total_depts,
        active_kiosks=1
    )

@router.get("/trend", response_model=List[DailyAttendanceTrend])
def get_attendance_trend(days: int = Query(7, ge=3, le=90), db: Session = Depends(get_db)):
    today = date.today()
    total_reg = db.query(func.count(Person.id)).filter(Person.is_active == True).scalar() or 0

    results = []
    for i in range(days - 1, -1, -1):
        target_date = today - timedelta(days=i)
        day_str = target_date.strftime("%b %d")
        day_name = target_date.strftime("%a")

        present = db.query(func.count(AttendanceRecord.id)).filter(
            AttendanceRecord.date == target_date,
            AttendanceRecord.status == AttendanceStatus.PRESENT
        ).scalar() or 0

        late = db.query(func.count(AttendanceRecord.id)).filter(
            AttendanceRecord.date == target_date,
            AttendanceRecord.status == AttendanceStatus.LATE
        ).scalar() or 0

        attended = present + late
        absent = max(0, total_reg - attended)
        rate = (attended / total_reg * 100.0) if total_reg > 0 else 0.0

        results.append(DailyAttendanceTrend(
            date=day_str,
            day_name=day_name,
            present=present,
            late=late,
            absent=absent,
            total_expected=total_reg,
            rate_pct=round(rate, 1)
        ))

    return results

@router.get("/departments", response_model=List[DepartmentAttendanceStat])
def get_department_stats(db: Session = Depends(get_db)):
    today = date.today()
    depts = db.query(Department).filter(Department.is_active == True).all()
    results = []

    for d in depts:
        member_cnt = db.query(func.count(Person.id)).filter(
            Person.department_id == d.id,
            Person.is_active == True
        ).scalar() or 0

        present = db.query(func.count(AttendanceRecord.id)).join(Person).filter(
            Person.department_id == d.id,
            AttendanceRecord.date == today,
            AttendanceRecord.status == AttendanceStatus.PRESENT
        ).scalar() or 0

        late = db.query(func.count(AttendanceRecord.id)).join(Person).filter(
            Person.department_id == d.id,
            AttendanceRecord.date == today,
            AttendanceRecord.status == AttendanceStatus.LATE
        ).scalar() or 0

        attended = present + late
        absent = max(0, member_cnt - attended)
        rate = (attended / member_cnt * 100.0) if member_cnt > 0 else 0.0

        results.append(DepartmentAttendanceStat(
            department_id=d.id,
            department_name=d.name,
            total_members=member_cnt,
            present_count=present,
            late_count=late,
            absent_count=absent,
            rate_pct=round(rate, 1)
        ))

    return results

@router.get("/hourly", response_model=List[HourlyDistribution])
def get_hourly_distribution(db: Session = Depends(get_db)):
    today = date.today()
    records = db.query(AttendanceRecord).filter(
        AttendanceRecord.date == today,
        AttendanceRecord.check_in_time != None
    ).all()

    # Bucket into hours from 06:00 to 18:00
    hour_counts = {h: 0 for h in range(6, 19)}
    for r in records:
        if r.check_in_time:
            h = r.check_in_time.hour
            if h in hour_counts:
                hour_counts[h] += 1

    results = []
    for h in sorted(hour_counts.keys()):
        h_str = f"{h:02d}:00"
        results.append(HourlyDistribution(hour=h_str, count=hour_counts[h]))

    return results

@router.get("/recent-activity", response_model=List[RecentActivityItem])
def get_recent_activity(limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    records = db.query(AttendanceRecord).join(Person).order_by(
        AttendanceRecord.updated_at.desc()
    ).limit(limit).all()

    results = []
    for r in records:
        p = r.person
        dept_name = p.department.name if p and p.department else "N/A"
        time_str = r.check_in_time.strftime("%I:%M %p") if r.check_in_time else r.created_at.strftime("%I:%M %p")
        results.append(RecentActivityItem(
            id=r.id,
            person_id=r.person_id,
            person_name=p.full_name if p else "Unknown",
            identifier=p.identifier if p else "N/A",
            department_name=dept_name,
            profile_photo_url=p.profile_photo_url if p else None,
            status=r.status.value,
            check_in_time=time_str,
            confidence=round(r.recognition_confidence * 100, 1),
            verification_mode=r.verification_mode.value
        ))

    return results
