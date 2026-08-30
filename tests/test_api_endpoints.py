import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Set path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from backend.app.main import app
from backend.app.routers.settings import seed_sample_data
from backend.app.database import SessionLocal

def test_api():
    print("\n--- Starting FastAPI Endpoint Integration Tests ---")
    
    # 1. Seed demo database
    db = SessionLocal()
    seed_sample_data(db)
    db.close()
    
    client = TestClient(app)

    # 2. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print(f"  [+] /api/health: {res.json()['status']}")

    # 3. Static SPA Index
    res = client.get("/")
    assert res.status_code == 200, f"Root SPA failed: {res.status_code}"
    assert "FaceSync" in res.text, "Index.html title missing"
    print("  [+] GET / serves SPA index.html")

    # 4. Admin Login
    res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("  [+] POST /api/auth/login: JWT token acquired")

    # 5. Dashboard Stats
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200, f"Dashboard stats failed: {res.text}"
    stats = res.json()
    print(f"  [+] /api/dashboard/stats: Registered={stats['total_registered']}, Present={stats['present_today']}, Late={stats['late_today']}")

    # 6. Dashboard Trend
    res = client.get("/api/dashboard/trend?days=7")
    assert res.status_code == 200, f"Trend failed: {res.text}"
    print(f"  [+] /api/dashboard/trend: {len(res.json())} days trend retrieved")

    # 7. Persons List & Search
    res = client.get("/api/persons")
    assert res.status_code == 200, f"Persons list failed: {res.text}"
    people = res.json()
    assert len(people) > 0, "No people found in seeded DB"
    first_person = people[0]
    print(f"  [+] /api/persons: {len(people)} profiles retrieved (Sample: {first_person['full_name']})")

    # 8. Person Detail
    res = client.get(f"/api/persons/{first_person['id']}")
    assert res.status_code == 200, f"Person detail failed: {res.text}"
    p_detail = res.json()
    print(f"  [+] /api/persons/{first_person['id']}: Stats={p_detail['stats']}")

    # 9. Attendance Logs
    res = client.get("/api/attendance")
    assert res.status_code == 200, f"Attendance logs failed: {res.text}"
    logs = res.json()
    print(f"  [+] /api/attendance: {len(logs)} records retrieved")

    # 10. Reports Export (CSV, XLSX, PDF)
    res = client.get("/api/reports/csv")
    assert res.status_code == 200 and "text/csv" in res.headers["content-type"]
    
    res = client.get("/api/reports/excel")
    assert res.status_code == 200 and "openxmlformats" in res.headers["content-type"]
    
    res = client.get("/api/reports/pdf")
    assert res.status_code == 200 and "application/pdf" in res.headers["content-type"]
    print("  [+] /api/reports: CSV, Excel (.xlsx), and PDF downloads verified")

    # 11. System Settings
    res = client.get("/api/settings")
    assert res.status_code == 200, f"Settings failed: {res.text}"
    print(f"  [+] /api/settings: Org={res.json()['organization_name']}, Threshold={res.json()['face_similarity_threshold']}")

    # 12. Security Audit Logs
    res = client.get("/api/audit", headers=headers)
    assert res.status_code == 200, f"Audit logs failed: {res.text}"
    print(f"  [+] /api/audit: {len(res.json())} audit log records retrieved")

    print("\n" + "=" * 60)
    print("SUCCESS: ALL 12 API ENDPOINTS VERIFIED AND OPERATIONAL!")
    print("=" * 60)

if __name__ == "__main__":
    test_api()
