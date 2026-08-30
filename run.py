import os
import sys
from pathlib import Path
import uvicorn

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from backend.app.database import SessionLocal, Base, engine
from backend.app.models import Department, Person, User
from backend.app.routers.settings import seed_sample_data
from backend.app.config import settings

def main():
    print("=" * 70)
    print("[*] FaceSync - Face Recognition Attendance Management System")
    print("=" * 70)
    print(f"[*] Base Directory: {BASE_DIR}")
    print(f"[*] Organization:   {settings.ORGANIZATION_NAME}")
    
    # Initialize DB Schema
    Base.metadata.create_all(bind=engine)
    
    # Check if we should seed sample departments and demo attendees
    db = SessionLocal()
    try:
        dept_count = db.query(Department).count()
        if dept_count == 0:
            print("[*] Empty database detected. Seeding sample departments and attendance history...")
            seed_sample_data(db)
            print("[+] Sample data seeded successfully!")
    finally:
        db.close()

    print("\n" + "-" * 70)
    print("[+] Application Ready!")
    print(f"[*] Access Live Dashboard: http://127.0.0.1:8000")
    print(f"[*] Interactive API Docs:  http://127.0.0.1:8000/docs")
    print("[*] Default Admin Login:   Username: admin | Password: admin123")
    print("-" * 70 + "\n")

    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    print(f"[*] Starting server on {host}:{port}...")
    uvicorn.run("backend.app.main:app", host=host, port=port, reload=False)

if __name__ == "__main__":
    main()
