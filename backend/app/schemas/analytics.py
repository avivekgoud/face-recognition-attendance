from datetime import date
from typing import List, Optional
from pydantic import BaseModel

class DashboardKPIs(BaseModel):
    total_registered: int
    present_today: int
    late_today: int
    absent_today: int
    attendance_rate_today: float
    total_departments: int
    active_kiosks: int = 1

class DailyAttendanceTrend(BaseModel):
    date: str
    day_name: str
    present: int
    late: int
    absent: int
    total_expected: int
    rate_pct: float

class DepartmentAttendanceStat(BaseModel):
    department_id: int
    department_name: str
    total_members: int
    present_count: int
    late_count: int
    absent_count: int
    rate_pct: float

class HourlyDistribution(BaseModel):
    hour: str
    count: int

class RecentActivityItem(BaseModel):
    id: int
    person_id: int
    person_name: str
    identifier: str
    department_name: str
    profile_photo_url: Optional[str] = None
    status: str
    check_in_time: str
    confidence: float
    verification_mode: str
