import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from .config import settings, STATIC_DIR, UPLOADS_DIR
from .database import engine, Base, SessionLocal
from .models import User, Department, Person
from .models.user import UserRole
from .services.auth_service import auth_service
from .routers import (
    auth_router,
    departments_router,
    persons_router,
    attendance_router,
    dashboard_router,
    reports_router,
    settings_router,
    audit_router
)

# Initialize Database Schema
Base.metadata.create_all(bind=engine)

def seed_default_admin():
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.username == "avivek").first()
        if not admin_user:
            admin_user = User(
                username="avivek",
                email="avivek@vardhaman.org",
                full_name="A Vivek Goud",
                hashed_password=auth_service.hash_password("avivek1259"),
                role=UserRole.SUPER_ADMIN,
                is_active=True
            )
            db.add(admin_user)
            db.commit()
            print("Default admin created: username='avivek', password='avivek1259'")
        else:
            admin_user.hashed_password = auth_service.hash_password("avivek1259")
            admin_user.full_name = "A Vivek Goud"
            db.commit()
    finally:
        db.close()

seed_default_admin()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Modern Face Recognition Attendance Management System API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static and Upload Assets
app.mount("/data/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Include Routers
app.include_router(auth_router)
app.include_router(departments_router)
app.include_router(persons_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
app.include_router(reports_router)
app.include_router(settings_router)
app.include_router(audit_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
        "org": settings.ORGANIZATION_NAME
    }

# SPA Root Index Route
@app.get("/")
async def serve_spa():
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return JSONResponse({"message": f"{settings.PROJECT_NAME} Backend API is running."})
