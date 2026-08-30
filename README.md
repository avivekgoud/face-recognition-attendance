# FaceSync — Modern Face Recognition Attendance Management System

**FaceSync** is an enterprise-grade, privacy-compliant Facial Biometric Attendance Management System engineered for organizations, schools, universities, and enterprise workplaces.

---

## 🌟 Key Features

### 1. Multi-Angle Face Registration & Biometric Enrollment
- **Multi-Angle Guided Capture:** Collects 4 facial variations per individual (Frontal, Slight Left 15°, Slight Right 15°, Natural Expression / Smile) for ensemble matching accuracy under varying head poses and illumination.
- **Quality & Lighting Feedback:** Validates blur (Laplacian variance), contrast, and face bounding dimensions before saving.
- **Biometric Privacy Consent:** Mandates and stores cryptographic consent records per individual.
- **Ensemble Matching:** 128-dimensional L2-normalized deep facial feature vectors.

### 2. Live Attendance Kiosk & Real-Time Face Recognition
- **Real-Time Camera Feed & HUD Canvas:** Dynamic color-coded bounding boxes (Green = Recognized, Gray = Unknown / Unregistered, Red = Anti-Spoof Warning).
- **Anti-Spoofing / Liveness Verification:** Passive texture and chromatic variance analysis in YCrCb color space to reject screen replay and paper photo spoof attacks.
- **Duplicate Prevention Cooldown:** Configurable cooldown period (default: 15 minutes) to avoid redundant duplicate check-ins when attendees stand near the kiosk.
- **Audio Feedback:** Synthesizes pleasant Web Audio API chimes upon recognized check-in.
- **Live Recognition Stream Ticker:** Displays real-time side ticker of the latest attendees.

### 3. Smart Attendance Rules Engine & Shift Calculation
- **Department-Specific Shifts:** Each department or class configures its standard start time, late grace period (e.g. 15 mins), and shift end time.
- **Automated Status:**
  - **Present (Green):** Checked in on or before `Shift Start + Grace Period` (e.g. 09:15 AM).
  - **Late (Yellow):** Checked in after grace cutoff.
  - **Absent (Red):** Unrecorded active personnel.
  - **Check-Out (Blue):** Automatic departure logging for second scans after cooldown.

### 4. Interactive Analytics Dashboard
- **KPI Metrics:** Total Registered, Present Today, Late Today, Absent Today, Turnout Rate %.
- **Interactive Visualizations (Chart.js):**
  - Multi-day Attendance Trends (Stacked bar chart for Present, Late, Absent).
  - Department Turnout Breakdown (Doughnut chart with percentage legend).
  - Hourly Arrival Peak Distribution (Area curve).
  - Live Activity Stream.

### 5. Person Profiles & Right-to-be-Forgotten Biometric Erasure
- **Global Search:** Instant fuzzy search by Name, Student/Employee ID, or Email.
- **Comprehensive Profile Modal:**
  - Monthly attendance activity calendar with status color codes.
  - Historical check-in / check-out timeline.
  - **One-Click Biometric Erasure:** Permanently deletes encrypted face embedding vectors and enrollment thumbnails while preserving anonymized attendance records.

### 6. Multi-Format Report Generator
- **Excel (.xlsx):** Formatted spreadsheets with summary KPI headers, status badges, and auto-sized columns using `openpyxl`.
- **PDF Export:** Professional landscape PDF documents generated via `ReportLab` featuring organization branding, date range filters, summary statistics table, and detailed records table.
- **CSV Export:** UTF-8 BOM formatted tabular data for integration into legacy payroll or SIS systems.

### 7. Security, RBAC & Audit Trail
- **AES-256 Biometric Vector Encryption:** All facial feature vectors are encrypted at rest using `cryptography.fernet`.
- **Role-Based Access Control (RBAC):** Super Admin, Attendance Officer, Viewer accounts with PBKDF2-HMAC-SHA256 password security and JWT authentication.
- **Audit Logs:** Immutable audit log tracking every administrative override, login, profile deletion, and biometric purge with timestamp, actor, and client IP.

---

## 📁 Directory Structure

```
face_attendance_system/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point, CORS, static mounts
│   │   ├── config.py              # Application settings, paths, security keys
│   │   ├── database.py            # SQLAlchemy database engine and session
│   │   ├── models/                # Database models (User, Person, BiometricFace, AttendanceRecord, etc.)
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── services/              # Face Recognition, Liveness, Encryption, Attendance, Reports, Auth, Audit
│   │   └── routers/               # API endpoints (/auth, /persons, /attendance, /dashboard, /reports, /settings)
│   ├── static/                    # Modern responsive Single Page Application
│   │   ├── index.html             # Shell with Tailwind CSS & Chart.js
│   │   ├── css/styles.css         # Glassmorphism, animations, HUD scanline
│   │   └── js/                    # API client, views (Dashboard, Kiosk, Registration, People, History, Reports, Admin)
│   └── data/
│       ├── attendance.db          # SQLite database
│       └── uploads/               # Profile photo avatars & check-in snapshots
├── tests/
│   ├── test_system.py             # Unit & integration tests for all core services
│   └── test_api_endpoints.py      # HTTP endpoint verification tests
├── requirements.txt               # Dependencies
├── run.py                         # One-click launch runner with automatic database seeder
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch the Application
```bash
python run.py
```

### 3. Open in Browser
- **Live Application Dashboard:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Default Administrator Credentials:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🧪 Running Automated Tests

Run the comprehensive test suites:
```bash
python tests/test_system.py
python tests/test_api_endpoints.py
```
