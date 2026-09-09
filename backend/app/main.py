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

def seed_initial_faces():
    import numpy as np
    import cv2
    import uuid
    from .models import BiometricFace
    from .services.crypto_service import crypto_service
    from .services.face_service import face_service

    db = SessionLocal()
    try:
        if db.query(BiometricFace).count() == 0:
            people = db.query(Person).all()
            for idx, p in enumerate(people):
                img = np.full((300, 300, 3), (220, 220, 220), dtype=np.uint8)
                skin_b = 130 + (idx * 7) % 40
                skin_g = 160 + (idx * 11) % 40
                skin_r = 210 + (idx * 5) % 35
                cv2.ellipse(img, (150, 150), (70, 95), 0, 0, 360, (skin_b, skin_g, skin_r), -1)
                eye_y = 130 + (idx % 3) * 4
                cv2.circle(img, (120, eye_y), 8, (40, 30, 30), -1)
                cv2.circle(img, (180, eye_y), 8, (40, 30, 30), -1)
                cv2.line(img, (105, eye_y - 14), (135, eye_y - 12), (30, 20, 20), 3)
                cv2.line(img, (165, eye_y - 12), (195, eye_y - 14), (30, 20, 20), 3)
                cv2.line(img, (150, eye_y + 5), (145, eye_y + 25), (skin_b - 20, skin_g - 20, skin_r - 20), 2)
                cv2.line(img, (145, eye_y + 25), (155, eye_y + 25), (skin_b - 20, skin_g - 20, skin_r - 20), 2)
                cv2.ellipse(img, (150, 205), (25, 10), 0, 0, 180, (40, 40, 150), 3)
                cv2.ellipse(img, (150, 95), (75, 45), 0, 180, 360, (25, 20, 15), -1)

                filename = f"avatar_{p.id}_{uuid.uuid4().hex[:6]}.jpg"
                cv2.imwrite(str(UPLOADS_DIR / filename), img)
                p.profile_photo_url = f"/data/uploads/{filename}"

                vec = face_service.extract_embedding(img)
                if vec:
                    enc = crypto_service.encrypt_vector(vec)
                    bio = BiometricFace(
                        person_id=p.id,
                        encrypted_embedding=enc,
                        angle_label="front",
                        quality_score=0.95
                    )
                    db.add(bio)
            db.commit()
            print("[*] Initial biometric face vectors verified and loaded.")
    except Exception as e:
        print(f"[*] Note: Face seeding info: {e}")
    finally:
        db.close()

seed_initial_faces()

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
