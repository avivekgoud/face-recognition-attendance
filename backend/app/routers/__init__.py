from .auth import router as auth_router
from .departments import router as departments_router
from .persons import router as persons_router
from .attendance import router as attendance_router
from .dashboard import router as dashboard_router
from .reports import router as reports_router
from .settings import router as settings_router
from .audit import router as audit_router

__all__ = [
    "auth_router",
    "departments_router",
    "persons_router",
    "attendance_router",
    "dashboard_router",
    "reports_router",
    "settings_router",
    "audit_router",
]
