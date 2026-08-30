from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr

class BiometricEnrollItem(BaseModel):
    angle_label: str = "front" # front, left, right, expression
    image_base64: str          # Data URL or base64 raw string

class PersonBase(BaseModel):
    identifier: str # Employee or Student ID (e.g. EMP-101, STU-202)
    full_name: str
    department_id: int
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: str = "Member"
    notes: Optional[str] = None

class PersonCreate(PersonBase):
    consent_given: bool = True
    consent_version: str = "1.0"
    # Optional initial face enrollment captures during registration
    face_images: Optional[List[BiometricEnrollItem]] = []

class PersonUpdate(BaseModel):
    full_name: Optional[str] = None
    department_id: Optional[int] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    designation: Optional[str] = None
    notes: Optional[str] = None
    is_active: Optional[bool] = None

class PersonOut(PersonBase):
    id: int
    department_name: Optional[str] = None
    profile_photo_url: Optional[str] = None
    consent_given: bool
    consent_timestamp: Optional[datetime] = None
    consent_version: Optional[str] = None
    is_active: bool
    biometric_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AttendanceSummaryStats(BaseModel):
    total_days: int = 0
    present_days: int = 0
    late_days: int = 0
    absent_days: int = 0
    attendance_rate_pct: float = 0.0
    average_check_in_time: Optional[str] = None

class PersonDetailOut(PersonOut):
    stats: AttendanceSummaryStats
    recent_attendance: List[Any] = []

class FaceEnrollRequest(BaseModel):
    person_id: int
    face_images: List[BiometricEnrollItem]
    replace_existing: bool = True
