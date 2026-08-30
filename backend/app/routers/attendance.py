import uuid
from datetime import datetime, date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
from ..config import settings, UPLOADS_DIR
from ..database import get_db
from ..models import AttendanceRecord, Person, Department, BiometricFace, SystemSetting
from ..models.attendance import AttendanceStatus, VerificationMode
from ..schemas.attendance import (
    RecognizePayload, RecognitionResponse, FaceDetectionBox,
    AttendanceManualCreate, AttendanceUpdate, AttendanceOut
)
from ..services.auth_service import get_current_user
from ..services.crypto_service import crypto_service
from ..services.face_service import face_service
from ..services.liveness_service import liveness_service
from ..services.attendance_service import attendance_service
from ..services.audit_service import audit_service

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

def get_runtime_setting_float(db: Session, key: str, default: float) -> float:
    s = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if s:
        try:
            return float(s.value)
        except Exception:
            pass
    return default

def get_runtime_setting_int(db: Session, key: str, default: int) -> int:
    s = db.query(SystemSetting).filter(SystemSetting.key == key).first()
    if s:
        try:
            return int(s.value)
        except Exception:
            pass
    return default

@router.post("/recognize", response_model=RecognitionResponse)
def recognize_face(payload: RecognizePayload, db: Session = Depends(get_db)):
    """
    Live Camera Real-Time Recognition & Automated Attendance Check-in:
    - Decodes incoming webcam frame
    - Anti-spoofing / Liveness analysis
    - Extracts 128D deep facial feature vector
    - Decrypts AES-256 biometric vectors and performs ensemble cosine similarity matching
    - Determines PRESENT / LATE / DUPLICATE status
    - Unknown faces are NEVER added to attendance database
    """
    img = face_service.decode_image_base64(payload.image_base64)
    if img is None:
        return RecognitionResponse(
            recognized=False,
            confidence=0.0,
            liveness_passed=False,
            liveness_score=0.0,
            attendance_recorded=False,
            message="Invalid image stream"
        )

    # 1. Face detection
    faces = face_service.detect_faces(img)
    if not faces:
        return RecognitionResponse(
            recognized=False,
            confidence=0.0,
            liveness_passed=True,
            liveness_score=1.0,
            attendance_recorded=False,
            message="No face detected in camera view"
        )

    # Select the primary / largest face
    primary_face = max(faces, key=lambda f: f["bbox"]["width"] * f["bbox"]["height"])
    bbox = primary_face["bbox"]
    box_obj = FaceDetectionBox(**bbox)

    # 2. Liveness / Anti-spoofing verification
    liveness_thresh = get_runtime_setting_float(db, "liveness_threshold", settings.LIVENESS_THRESHOLD)
    is_live, liveness_score, liveness_msg = liveness_service.evaluate_liveness(
        img,
        bbox=bbox,
        client_liveness_score=payload.liveness_score,
        min_threshold=liveness_thresh
    )

    if not is_live:
        return RecognitionResponse(
            recognized=False,
            confidence=0.0,
            liveness_passed=False,
            liveness_score=liveness_score,
            attendance_recorded=False,
            message=f"Liveness check failed ({liveness_msg})",
            bounding_box=box_obj
        )

    # 3. Extract Deep Feature Vector
    query_vector = face_service.extract_embedding(img, bbox=bbox)
    if not query_vector:
        return RecognitionResponse(
            recognized=False,
            confidence=0.0,
            liveness_passed=True,
            liveness_score=liveness_score,
            attendance_recorded=False,
            message="Could not extract facial features",
            bounding_box=box_obj
        )

    # 4. Fetch all enrolled encrypted face vectors from database
    enrolled_db_rows = db.query(BiometricFace).join(Person).filter(Person.is_active == True).all()
    if not enrolled_db_rows:
        return RecognitionResponse(
            recognized=False,
            confidence=0.0,
            liveness_passed=True,
            liveness_score=liveness_score,
            attendance_recorded=False,
            message="No registered faces found in database",
            bounding_box=box_obj
        )

    # Decrypt embeddings into memory for fast ensemble cosine match
    enrolled_items = []
    for row in enrolled_db_rows:
        try:
            decrypted_vec = crypto_service.decrypt_vector(row.encrypted_embedding)
            enrolled_items.append({
                "person_id": row.person_id,
                "vector": decrypted_vec,
                "angle": row.angle_label
            })
        except Exception:
            continue

    # 5. Authoritative biometric matching
    sim_threshold = get_runtime_setting_float(db, "face_similarity_threshold", settings.FACE_SIMILARITY_THRESHOLD)
    best_person_id, best_score, best_angle = face_service.match_against_db(
        query_vector, enrolled_items, threshold=sim_threshold
    )

    # If below threshold: UNKNOWN FACE (do NOT add to database)
    if not best_person_id:
        return RecognitionResponse(
            recognized=False,
            confidence=best_score,
            liveness_passed=True,
            liveness_score=liveness_score,
            attendance_recorded=False,
            message=f"Unknown Face (Score: {best_score * 100:.1f}% < {sim_threshold * 100:.1f}%)",
            bounding_box=box_obj
        )

    # 6. Retrieve Person & Process Attendance
    person = db.query(Person).filter(Person.id == best_person_id).first()
    if not person:
        return RecognitionResponse(
            recognized=False,
            confidence=best_score,
            liveness_passed=True,
            liveness_score=liveness_score,
            attendance_recorded=False,
            message="Matched person record not found",
            bounding_box=box_obj
        )

    cooldown_mins = get_runtime_setting_int(db, "duplicate_cooldown_minutes", settings.DUPLICATE_COOLDOWN_MINUTES)
    
    # Save verification snapshot thumbnail
    snap_filename = f"snap_{person.id}_{uuid.uuid4().hex[:6]}.jpg"
    snap_path = UPLOADS_DIR / snap_filename
    import cv2
    cv2.imwrite(str(snap_path), img)
    snapshot_url = f"/data/uploads/{snap_filename}"

    record, action_code, msg = attendance_service.process_face_attendance(
        db,
        person=person,
        confidence=best_score,
        liveness_score=liveness_score,
        snapshot_url=snapshot_url,
        cooldown_minutes=cooldown_mins
    )

    dept_name = person.department.name if person.department else "N/A"
    check_in_str = record.check_in_time.strftime("%I:%M %p") if record.check_in_time else None
    check_out_str = record.check_out_time.strftime("%I:%M %p") if record.check_out_time else None

    return RecognitionResponse(
        recognized=True,
        person_id=person.id,
        identifier=person.identifier,
        full_name=person.full_name,
        department_name=dept_name,
        profile_photo_url=person.profile_photo_url,
        confidence=best_score,
        liveness_passed=True,
        liveness_score=liveness_score,
        attendance_recorded=(action_code in ["NEW_CHECK_IN", "CHECK_OUT_UPDATED"]),
        status=record.status.value,
        check_in_time=check_in_str,
        check_out_time=check_out_str,
        message=msg,
        bounding_box=box_obj
    )

@router.get("", response_model=List[AttendanceOut])
def get_attendance_logs(
    date_val: Optional[date] = Query(None, alias="date"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    department_id: Optional[int] = None,
    status_filter: Optional[AttendanceStatus] = Query(None, alias="status"),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AttendanceRecord).join(Person)

    if date_val:
        query = query.filter(AttendanceRecord.date == date_val)
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

    records = query.order_by(AttendanceRecord.date.desc(), AttendanceRecord.created_at.desc()).all()
    results = []
    for r in records:
        p = r.person
        dept_name = p.department.name if p and p.department else "N/A"
        results.append(AttendanceOut(
            id=r.id,
            person_id=r.person_id,
            person_name=p.full_name if p else "Unknown",
            person_identifier=p.identifier if p else "N/A",
            department_name=dept_name,
            date=r.date,
            check_in_time=r.check_in_time,
            check_out_time=r.check_out_time,
            status=r.status,
            recognition_confidence=r.recognition_confidence,
            liveness_score=r.liveness_score,
            verification_mode=r.verification_mode,
            snapshot_url=r.snapshot_url,
            modification_reason=r.modification_reason,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at
        ))
    return results

@router.post("/manual", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def manual_attendance(
    payload: AttendanceManualCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    person = db.query(Person).filter(Person.id == payload.person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    existing = db.query(AttendanceRecord).filter(
        AttendanceRecord.person_id == person.id,
        AttendanceRecord.date == payload.date
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail=f"Attendance record already exists for {person.full_name} on {payload.date}")

    new_record = AttendanceRecord(
        person_id=person.id,
        date=payload.date,
        check_in_time=payload.check_in_time or datetime.combine(payload.date, datetime.min.time().replace(hour=9, minute=0)),
        check_out_time=payload.check_out_time,
        status=payload.status,
        recognition_confidence=1.0,
        liveness_score=1.0,
        verification_mode=VerificationMode.ADMIN_MANUAL,
        modified_by_user_id=current_user.id,
        modification_reason="Manual administrative entry",
        notes=payload.notes
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="MANUAL_ATTENDANCE_LOGGED",
        user=current_user,
        target_type="AttendanceRecord",
        target_id=str(new_record.id),
        details=f"Manually logged attendance for '{person.full_name}' on {payload.date} ({payload.status.value})",
        ip_address=client_ip
    )

    dept_name = person.department.name if person.department else "N/A"
    return AttendanceOut(
        id=new_record.id,
        person_id=person.id,
        person_name=person.full_name,
        person_identifier=person.identifier,
        department_name=dept_name,
        date=new_record.date,
        check_in_time=new_record.check_in_time,
        check_out_time=new_record.check_out_time,
        status=new_record.status,
        recognition_confidence=new_record.recognition_confidence,
        liveness_score=new_record.liveness_score,
        verification_mode=new_record.verification_mode,
        snapshot_url=new_record.snapshot_url,
        modification_reason=new_record.modification_reason,
        notes=new_record.notes,
        created_at=new_record.created_at,
        updated_at=new_record.updated_at
    )

@router.put("/{id}", response_model=AttendanceOut)
def update_attendance_record(
    id: int,
    payload: AttendanceUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    old_status = record.status.value
    if payload.status:
        record.status = payload.status
    if payload.check_in_time is not None:
        record.check_in_time = payload.check_in_time
    if payload.check_out_time is not None:
        record.check_out_time = payload.check_out_time
    if payload.notes is not None:
        record.notes = payload.notes

    record.modified_by_user_id = current_user.id
    record.modification_reason = payload.modification_reason
    record.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(record)

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="ATTENDANCE_OVERRIDDEN",
        user=current_user,
        target_type="AttendanceRecord",
        target_id=str(record.id),
        details=f"Modified attendance record ID {record.id}: status changed from '{old_status}' to '{record.status.value}'. Reason: {payload.modification_reason}",
        ip_address=client_ip
    )

    p = record.person
    dept_name = p.department.name if p and p.department else "N/A"
    return AttendanceOut(
        id=record.id,
        person_id=record.person_id,
        person_name=p.full_name if p else "Unknown",
        person_identifier=p.identifier if p else "N/A",
        department_name=dept_name,
        date=record.date,
        check_in_time=record.check_in_time,
        check_out_time=record.check_out_time,
        status=record.status,
        recognition_confidence=record.recognition_confidence,
        liveness_score=record.liveness_score,
        verification_mode=record.verification_mode,
        snapshot_url=record.snapshot_url,
        modification_reason=record.modification_reason,
        notes=record.notes,
        created_at=record.created_at,
        updated_at=record.updated_at
    )

@router.delete("/{id}")
def delete_attendance_record(
    id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    record = db.query(AttendanceRecord).filter(AttendanceRecord.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    rec_id = record.id
    p_name = record.person.full_name if record.person else "Unknown"
    rec_date = str(record.date)
    db.delete(record)
    db.commit()

    client_ip = request.client.host if request.client else "127.0.0.1"
    audit_service.log(
        db,
        action="ATTENDANCE_DELETED",
        user=current_user,
        target_type="AttendanceRecord",
        target_id=str(rec_id),
        details=f"Deleted attendance record #{rec_id} for '{p_name}' on {rec_date}",
        ip_address=client_ip
    )

    return {"message": "Attendance record deleted successfully"}
