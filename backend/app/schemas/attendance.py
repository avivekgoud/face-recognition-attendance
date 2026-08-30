from datetime import datetime, date
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from ..models.attendance import AttendanceStatus, VerificationMode

class RecognizePayload(BaseModel):
    image_base64: str
    liveness_score: Optional[float] = 1.0
    client_landmarks: Optional[Dict[str, Any]] = None

class FaceDetectionBox(BaseModel):
    x: int
    y: int
    width: int
    height: int

class RecognitionResponse(BaseModel):
    recognized: bool
    person_id: Optional[int] = None
    identifier: Optional[str] = None
    full_name: Optional[str] = None
    department_name: Optional[str] = None
    profile_photo_url: Optional[str] = None
    confidence: float = 0.0
    liveness_passed: bool = True
    liveness_score: float = 1.0
    attendance_recorded: bool = False
    status: Optional[str] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    message: str
    bounding_box: Optional[FaceDetectionBox] = None

class AttendanceLogCreate(BaseModel):
    person_id: int
    confidence: float
    liveness_score: float
    snapshot_base64: Optional[str] = None

class AttendanceManualCreate(BaseModel):
    person_id: int
    date: date
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: AttendanceStatus = AttendanceStatus.PRESENT
    notes: Optional[str] = None

class AttendanceUpdate(BaseModel):
    status: Optional[AttendanceStatus] = None
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    modification_reason: str
    notes: Optional[str] = None

class AttendanceOut(BaseModel):
    id: int
    person_id: int
    person_name: str
    person_identifier: str
    department_name: str
    date: date
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    status: AttendanceStatus
    recognition_confidence: float
    liveness_score: float
    verification_mode: VerificationMode
    snapshot_url: Optional[str] = None
    modified_by_username: Optional[str] = None
    modification_reason: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
