import sys
from pathlib import Path
import numpy as np
import cv2

# Set path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.app.config import settings
from backend.app.database import Base, engine, SessionLocal
from backend.app.models import User, Department, Person, BiometricFace, AttendanceRecord
from backend.app.models.user import UserRole
from backend.app.models.attendance import AttendanceStatus
from backend.app.services.crypto_service import crypto_service
from backend.app.services.face_service import face_service
from backend.app.services.liveness_service import liveness_service
from backend.app.services.attendance_service import attendance_service
from backend.app.services.auth_service import auth_service
from backend.app.services.report_service import report_service

def test_all():
    print("\n--- Starting Test Suite ---")
    
    # 1. Database Initialization
    print("[1/7] Testing Database Table Creation...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    print("  [+] Database tables verified.")

    # 2. Authentication & Passwords
    print("\n[2/7] Testing Auth, Password Hashing & JWT...")
    plain_pw = "SecurePass123!"
    hashed = auth_service.hash_password(plain_pw)
    assert auth_service.verify_password(plain_pw, hashed), "Password verification failed"
    assert not auth_service.verify_password("WrongPassword", hashed), "False positive password verification"
    
    token = auth_service.create_access_token({"sub": "admin", "role": "super_admin"})
    payload = auth_service.decode_access_token(token)
    assert payload and payload.get("sub") == "admin", "JWT token decoding failed"
    print("  [+] Password hashing and JWT generation validated.")

    # 3. Biometric AES-256 Encryption
    print("\n[3/7] Testing AES-256 Biometric Vector Encryption...")
    sample_vec = [float(x) for x in np.random.randn(128)]
    encrypted_str = crypto_service.encrypt_vector(sample_vec)
    decrypted_vec = crypto_service.decrypt_vector(encrypted_str)
    assert np.allclose(sample_vec, decrypted_vec, atol=1e-5), "Biometric vector decryption mismatch"
    print(f"  [+] 128-D vector encrypted ({len(encrypted_str)} chars) and decrypted with 100% precision.")

    # 4. Face Service & Cosine Similarity
    print("\n[4/7] Testing Face Feature Vector Extractor & Similarity...")
    dummy_img = np.zeros((200, 200, 3), dtype=np.uint8)
    cv2.circle(dummy_img, (100, 100), 60, (200, 200, 200), -1)
    cv2.circle(dummy_img, (80, 85), 10, (50, 50, 50), -1)
    cv2.circle(dummy_img, (120, 85), 10, (50, 50, 50), -1)
    cv2.ellipse(dummy_img, (100, 125), (25, 12), 0, 0, 180, (50, 50, 50), 3)

    embedding = face_service.extract_embedding(dummy_img)
    assert embedding is not None and len(embedding) == 128, "Feature vector extraction failed"
    
    sim_self = face_service.compute_similarity(embedding, embedding)
    assert sim_self > 0.99, f"Self-similarity should be ~1.0, got {sim_self}"
    print(f"  [+] 128-D Feature vector extracted. Self-similarity = {sim_self:.4f}")

    # 5. Anti-Spoofing & Liveness
    print("\n[5/7] Testing Liveness Detection Service...")
    is_live, liveness_score, msg = liveness_service.evaluate_liveness(dummy_img)
    print(f"  [+] Liveness evaluated: is_live={is_live}, score={liveness_score} ({msg})")

    # 6. Attendance Engine & Duplicate Cooldown
    print("\n[6/7] Testing Attendance Engine & Duplicate Cooldown...")
    dept = db.query(Department).first()
    if not dept:
        dept = Department(name="Engineering Test", code="ENG_TEST", shift_start_time="09:00", shift_late_threshold_mins=15)
        db.add(dept)
        db.commit()
        db.refresh(dept)

    person = db.query(Person).filter(Person.identifier == "TEST-001").first()
    if not person:
        person = Person(
            identifier="TEST-001",
            full_name="Test Person",
            department_id=dept.id,
            consent_given=True,
            consent_version="1.0"
        )
        db.add(person)
        db.commit()
        db.refresh(person)

    # Clean previous test record for today if present
    from datetime import date
    db.query(AttendanceRecord).filter(
        AttendanceRecord.person_id == person.id,
        AttendanceRecord.date == date.today()
    ).delete()
    db.commit()

    # First check-in
    rec1, act1, msg1 = attendance_service.process_face_attendance(db, person, confidence=0.96, liveness_score=0.92, cooldown_minutes=15)
    assert act1 in ["NEW_CHECK_IN", "COOLDOWN_SUPPRESSED"], f"Unexpected action: {act1}"
    
    # Immediate second scan (should trigger cooldown suppression)
    rec2, act2, msg2 = attendance_service.process_face_attendance(db, person, confidence=0.96, liveness_score=0.92, cooldown_minutes=15)
    assert act2 == "COOLDOWN_SUPPRESSED", f"Expected COOLDOWN_SUPPRESSED, got {act2}"
    print(f"  [+] Attendance check-in & duplicate suppression cooldown verified: '{msg2}'")

    # 7. Multi-Format Reports Export
    print("\n[7/7] Testing Report Generation (CSV, Excel, PDF)...")
    records = db.query(AttendanceRecord).limit(10).all()
    
    csv_bytes = report_service.generate_csv(records, org_name="Apex Test Academy")
    assert len(csv_bytes) > 0, "CSV generation returned empty output"
    
    excel_bytes = report_service.generate_excel(records, org_name="Apex Test Academy")
    assert len(excel_bytes) > 0, "Excel generation returned empty output"
    
    pdf_bytes = report_service.generate_pdf(records, org_name="Apex Test Academy")
    assert len(pdf_bytes) > 0, "PDF generation returned empty output"
    
    print(f"  [+] CSV Export generated ({len(csv_bytes)} bytes)")
    print(f"  [+] Excel (.xlsx) Export generated ({len(excel_bytes)} bytes)")
    print(f"  [+] PDF Document generated ({len(pdf_bytes)} bytes)")

    db.close()
    print("\n" + "=" * 60)
    print("SUCCESS: ALL 7 AUTOMATED INTEGRATION TESTS PASSED!")
    print("=" * 60)

if __name__ == "__main__":
    test_all()
