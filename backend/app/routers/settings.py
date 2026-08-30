import json
from datetime import datetime, date, timedelta
import random
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from ..config import settings
from ..database import get_db
from ..models import SystemSetting, Department, Person, BiometricFace, AttendanceRecord, User
from ..models.attendance import AttendanceStatus, VerificationMode
from ..schemas.settings import SystemSettingsUpdate, SystemSettingsOut
from ..services.auth_service import get_current_user, require_super_admin
from ..services.audit_service import audit_service
from ..services.crypto_service import crypto_service
from ..services.face_service import face_service

router = APIRouter(prefix="/api/settings", tags=["Settings"])

DEFAULT_CONFIG = {
    "organization_name": settings.ORGANIZATION_NAME,
    "face_similarity_threshold": str(settings.FACE_SIMILARITY_THRESHOLD),
    "liveness_threshold": str(settings.LIVENESS_THRESHOLD),
    "duplicate_cooldown_minutes": str(settings.DUPLICATE_COOLDOWN_MINUTES),
    "standard_work_start": settings.STANDARD_WORK_START,
    "late_grace_minutes": str(settings.LATE_GRACE_MINUTES),
    "standard_work_end": settings.STANDARD_WORK_END,
    "working_days": json.dumps(settings.WORKING_DAYS),
    "require_liveness_check": "true",
    "allow_manual_override": "true"
}

def get_setting_val(db: Session, key: str, default: str) -> str:
    s = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    return s.value if s else default

@router.get("", response_model=SystemSettingsOut)
def get_settings(db: Session = Depends(get_db)):
    org_name = get_setting_val(db, "organization_name", DEFAULT_CONFIG["organization_name"])
    sim_th = float(get_setting_val(db, "face_similarity_threshold", DEFAULT_CONFIG["face_similarity_threshold"]))
    live_th = float(get_setting_val(db, "liveness_threshold", DEFAULT_CONFIG["liveness_threshold"]))
    cooldown = int(get_setting_val(db, "duplicate_cooldown_minutes", DEFAULT_CONFIG["duplicate_cooldown_minutes"]))
    work_start = get_setting_val(db, "standard_work_start", DEFAULT_CONFIG["standard_work_start"])
    grace = int(get_setting_val(db, "late_grace_minutes", DEFAULT_CONFIG["late_grace_minutes"]))
    work_end = get_setting_val(db, "standard_work_end", DEFAULT_CONFIG["standard_work_end"])
    
    working_days_raw = get_setting_val(db, "working_days", DEFAULT_CONFIG["working_days"])
    try:
        working_days = json.loads(working_days_raw)
    except Exception:
        working_days = [0, 1, 2, 3, 4]

    req_live = get_setting_val(db, "require_liveness_check", "true").lower() == "true"
    allow_override = get_setting_val(db, "allow_manual_override", "true").lower() == "true"

    return SystemSettingsOut(
        organization_name=org_name,
        face_similarity_threshold=sim_th,
        liveness_threshold=live_th,
        duplicate_cooldown_minutes=cooldown,
        standard_work_start=work_start,
        late_grace_minutes=grace,
        standard_work_end=work_end,
        working_days=working_days,
        require_liveness_check=req_live,
        allow_manual_override=allow_override
    )

@router.put("", response_model=SystemSettingsOut)
def update_settings(
    payload: SystemSettingsUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    update_data = payload.dict(exclude_unset=True)
    
    for k, v in update_data.items():
        val_str = json.dumps(v) if isinstance(v, (list, dict, bool)) else str(v)
        s = db.query(SystemSetting).filter(SystemSetting.key == k).first()
        if s:
            s.value = val_str
        else:
            db.add(SystemSetting(key=k, value=val_str))

    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="SETTINGS_UPDATED",
        user=current_user,
        target_type="SystemSetting",
        details=f"Updated system settings: {list(update_data.keys())}",
        ip_address=client_ip
    )

    return get_settings(db)

@router.post("/seed-sample-data")
def seed_sample_data(db: Session = Depends(get_db)):
    """
    Seeds comprehensive initial data: departments, sample students & employees,
    and historical attendance records across recent dates.
    """
    # 1. Departments
    dept_defs = [
        {"name": "Computer Science & Engineering", "code": "CSE", "start": "09:00", "grace": 15, "end": "17:00"},
        {"name": "Artificial Intelligence & Robotics", "code": "AIR", "start": "09:00", "grace": 15, "end": "17:00"},
        {"name": "Business Administration", "code": "MBA", "start": "09:30", "grace": 15, "end": "17:30"},
        {"name": "Human Resources & Operations", "code": "HRO", "start": "08:30", "grace": 10, "end": "16:30"},
    ]

    dept_map = {}
    for d in dept_defs:
        existing = db.query(Department).filter(Department.code == d["code"]).first()
        if not existing:
            dept = Department(
                name=d["name"],
                code=d["code"],
                shift_start_time=d["start"],
                shift_late_threshold_mins=d["grace"],
                shift_end_time=d["end"]
            )
            db.add(dept)
            db.commit()
            db.refresh(dept)
            dept_map[d["code"]] = dept
        else:
            dept_map[d["code"]] = existing

    # 2. Sample People
    people_defs = [
        {"id": "EMP-1001", "name": "Dr. Sarah Jenkins", "dept": "AIR", "role": "Lead AI Researcher", "email": "sarah.jenkins@apex.edu", "phone": "+1 555-0101"},
        {"id": "EMP-1002", "name": "Rahul Kumar", "dept": "CSE", "role": "Senior Systems Architect", "email": "rahul.kumar@apex.edu", "phone": "+1 555-0102"},
        {"id": "STU-2001", "name": "Alex Chen", "dept": "CSE", "role": "Graduate Scholar", "email": "alex.chen@apex.edu", "phone": "+1 555-0103"},
        {"id": "STU-2002", "name": "Elena Rostova", "dept": "AIR", "role": "Robotics Engineer", "email": "elena.r@apex.edu", "phone": "+1 555-0104"},
        {"id": "EMP-1003", "name": "Marcus Vance", "dept": "HRO", "role": "Operations Director", "email": "marcus.v@apex.edu", "phone": "+1 555-0105"},
        {"id": "STU-2003", "name": "Priya Sharma", "dept": "MBA", "role": "Business Analyst", "email": "priya.s@apex.edu", "phone": "+1 555-0106"},
        {"id": "STU-2004", "name": "David Kim", "dept": "CSE", "role": "Software Fellow", "email": "david.k@apex.edu", "phone": "+1 555-0107"},
        {"id": "EMP-1004", "name": "Amira Al-Mansoor", "dept": "MBA", "role": "Finance Faculty", "email": "amira.m@apex.edu", "phone": "+1 555-0108"},
    ]

    person_objects = []
    for p_info in people_defs:
        existing = db.query(Person).filter(Person.identifier == p_info["id"]).first()
        if not existing:
            dept = dept_map.get(p_info["dept"], list(dept_map.values())[0])
            p = Person(
                identifier=p_info["id"],
                full_name=p_info["name"],
                department_id=dept.id,
                email=p_info["email"],
                phone=p_info["phone"],
                designation=p_info["role"],
                consent_given=True,
                consent_timestamp=datetime.utcnow() - timedelta(days=30),
                consent_version="1.0",
                is_active=True
            )
            db.add(p)
            db.commit()
            db.refresh(p)
            person_objects.append(p)
        else:
            person_objects.append(existing)

    # 3. Generate 14-day Historical Attendance Records
    today = date.today()
    random.seed(42)

    created_records_count = 0
    for day_offset in range(13, -1, -1):
        log_date = today - timedelta(days=day_offset)
        # Skip weekends (Saturday=5, Sunday=6)
        if log_date.weekday() in [5, 6]:
            continue

        for p in person_objects:
            # Check if record already exists
            existing_rec = db.query(AttendanceRecord).filter(
                AttendanceRecord.person_id == p.id,
                AttendanceRecord.date == log_date
            ).first()

            if existing_rec:
                continue

            # Random status simulation: 80% Present, 13% Late, 7% Absent
            roll = random.random()
            if roll < 0.80:
                status = AttendanceStatus.PRESENT
                # Check-in between 08:35 and 09:12
                rand_min = random.randint(35, 72)
                check_in = datetime.combine(log_date, datetime.min.time().replace(hour=8, minute=0)) + timedelta(minutes=rand_min)
                check_out = datetime.combine(log_date, datetime.min.time().replace(hour=17, minute=random.randint(0, 30)))
                conf = round(random.uniform(0.88, 0.98), 3)
            elif roll < 0.93:
                status = AttendanceStatus.LATE
                # Check-in between 09:20 and 10:15
                rand_min = random.randint(20, 75)
                check_in = datetime.combine(log_date, datetime.min.time().replace(hour=9, minute=0)) + timedelta(minutes=rand_min)
                check_out = datetime.combine(log_date, datetime.min.time().replace(hour=17, minute=random.randint(10, 45)))
                conf = round(random.uniform(0.85, 0.97), 3)
            else:
                status = AttendanceStatus.ABSENT
                check_in = None
                check_out = None
                conf = 0.0

            rec = AttendanceRecord(
                person_id=p.id,
                date=log_date,
                check_in_time=check_in,
                check_out_time=check_out,
                status=status,
                recognition_confidence=conf,
                liveness_score=round(random.uniform(0.82, 0.99), 2) if check_in else 0.0,
                verification_mode=VerificationMode.FACE_AUTO if check_in else VerificationMode.ADMIN_MANUAL,
                created_at=check_in or datetime.combine(log_date, datetime.min.time()),
                updated_at=check_out or check_in or datetime.combine(log_date, datetime.min.time())
            )
            db.add(rec)
            created_records_count += 1

    db.commit()

    return {
        "success": True,
        "message": f"Seeded sample data: {len(dept_map)} departments, {len(person_objects)} people, and {created_records_count} attendance records."
    }
