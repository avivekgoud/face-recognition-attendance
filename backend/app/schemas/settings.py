from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class SystemSettingsUpdate(BaseModel):
    organization_name: Optional[str] = None
    face_similarity_threshold: Optional[float] = None
    liveness_threshold: Optional[float] = None
    duplicate_cooldown_minutes: Optional[int] = None
    standard_work_start: Optional[str] = None
    late_grace_minutes: Optional[int] = None
    standard_work_end: Optional[str] = None
    working_days: Optional[List[int]] = None
    require_liveness_check: Optional[bool] = None
    allow_manual_override: Optional[bool] = None

class SystemSettingsOut(BaseModel):
    organization_name: str
    face_similarity_threshold: float
    liveness_threshold: float
    duplicate_cooldown_minutes: int
    standard_work_start: str
    late_grace_minutes: int
    standard_work_end: str
    working_days: List[int]
    require_liveness_check: bool
    allow_manual_override: bool

class AuditLogOut(BaseModel):
    id: int
    username: str
    action: str
    target_type: Optional[str] = None
    target_id: Optional[str] = None
    details: Optional[str] = None
    ip_address: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
