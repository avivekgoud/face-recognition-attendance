from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    shift_start_time: str = "09:00"
    shift_late_threshold_mins: int = 15
    shift_end_time: str = "17:00"
    is_active: bool = True

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    shift_start_time: Optional[str] = None
    shift_late_threshold_mins: Optional[int] = None
    shift_end_time: Optional[str] = None
    is_active: Optional[bool] = None

class DepartmentOut(DepartmentBase):
    id: int
    created_at: datetime
    member_count: Optional[int] = 0

    class Config:
        from_attributes = True
