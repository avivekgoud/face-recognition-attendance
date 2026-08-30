# FaceSync: Facial Recognition Attendance Management System

An automated biometric attendance management system engineered for educational institutions, corporate workplaces, and examination halls, utilizing computer vision deep feature extraction, passive anti-spoofing verification, and AES-256 encrypted biometric storage.

---

## Academic Project Credentials

- **Author / Developer:** A Vivek Goud
- **Department:** Department of Computer Science and Engineering
- **Institution:** Vardhaman College of Engineering
- **Academic Year:** 2026

---

## Project Overview

Traditional attendance logging methods, including manual roll calls, paper sign-in sheets, and RFID badge swiping, are susceptible to human error, proxy attendance, and administrative overhead. FaceSync solves these challenges by providing an automated, vision-based attendance pipeline that identifies registered individuals and records their check-in in under 100 milliseconds.

The system is designed with a privacy-first architecture, ensuring that raw facial embeddings are never stored in plaintext. Instead, all 128-dimensional facial feature vectors are encrypted using AES-256 Fernet symmetric encryption at rest and decrypted only in volatile memory during similarity evaluation.

---

## Key System Capabilities

### 1. Multi-Angle Guided Enrollment
- Captures four distinct facial angles during registration: Frontal, Left 15 degrees, Right 15 degrees, and natural expression.
- Calculates an ensemble biometric representation per individual to maintain high accuracy under varying ambient lighting and head orientations.
- Performs real-time image quality assessment, evaluating Laplacian variance for motion blur, brightness thresholds, and facial bounding box dimensions before storing data.
- Enforces and logs explicit biometric consent timestamps in compliance with data protection standards.

### 2. Live Camera Recognition Kiosk
- High-throughput webcam feed with dynamic canvas overlays indicating recognition status.
- Color-coded feedback: Green for recognized attendees, Gray for unregistered faces, and Red for anti-spoofing warnings.
- Sub-second recognition latency (~60 to 120 ms end-to-end), capable of processing 40 to 60 attendees per minute.
- Intelligent scan pause: Pauses frame capture for 3.5 seconds upon verified check-in to provide confirmation before resuming.
- Integrated Web Audio feedback chime.
- Real-time side ticker listing recent check-in events.

### 3. Passive Anti-Spoofing and Liveness Detection
- Texture frequency analysis using Laplacian spatial gradients to detect printed photographs and paper cutouts.
- Chromatic distribution analysis in YCrCb color space to identify specular glare and display pixel grids from smartphone or tablet replay attacks.
- Rejects spoof attempts without requiring unnatural user actions like forced blinking.

### 4. Smart Attendance Rules Engine
- Dynamic department-level shift scheduling: Configurable standard start time, late grace period (e.g., 15 minutes), and standard shift end time.
- Automated status classification:
  - **Present:** Check-in completed within shift start plus grace period.
  - **Late:** Check-in completed after grace period cutoff.
  - **Absent:** Active registered personnel with no check-in recorded for the day.
  - **Check-Out:** Automatically logs departure timestamps for secondary scans later in the day.
- Duplicate suppression cooldown: Configurable time window (default 15 minutes) preventing multiple logs when standing near the camera.

### 5. Analytics Dashboard and Reporting
- Key performance indicators: Total registered personnel, present today, late today, absent count, and turnout rate.
- Multi-day attendance trend visualization with stacked status breakdowns.
- Department-wise attendance distribution charts.
- Hourly check-in arrival curve.
- Multi-format report export:
  - Microsoft Excel (.xlsx) workbooks with KPI summaries and formatted status badges.
  - Formatted PDF documents with organizational headers and detailed records tables.
  - Standard UTF-8 CSV exports for integration with external ERP systems.

### 6. Individual Profiles and Right-to-be-Forgotten
- Global instant search across personnel by name, ID number, or department.
- Comprehensive profile drawer displaying personal details, monthly attendance calendar, attendance statistics, and recent activity logs.
- One-click biometric erasure: Permanently purges encrypted face vectors and enrollment thumbnails while preserving historical attendance logs.

### 7. Security and Access Control
- AES-256 encrypted biometric vectors.
- Role-Based Access Control (Super Admin, Attendance Officer, Viewer).
- PBKDF2-HMAC-SHA256 password hashing with random salt.
- JWT (JSON Web Token) authentication.
- Comprehensive audit trail recording all administrative actions, overrides, and biometric deletions with actor ID, timestamp, and client IP.

---

## System Architecture

```
face_attendance_system/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI application entry point and middleware
│   │   ├── config.py              # Configuration settings and security parameters
│   │   ├── database.py            # Database engine and session management
│   │   ├── models/                # SQLAlchemy models (User, Person, Biometric, Attendance)
│   │   ├── schemas/               # Pydantic request and response schemas
│   │   ├── services/              # Core business logic (Face matching, Liveness, Crypto, Reports)
│   │   └── routers/               # API endpoints (Auth, Persons, Attendance, Dashboard, Reports, Settings)
│   ├── static/                    # Responsive Single-Page Application (SPA)
│   │   ├── index.html             # Main HTML5 shell
│   │   ├── css/styles.css         # Styling, glassmorphism, and camera HUD
│   │   └── js/                    # Client router, views, and API communication
│   └── data/
│       ├── attendance.db          # SQLite database storage
│       └── uploads/               # Profile photo avatars and verification snapshots
├── tests/
│   ├── test_system.py             # Integration test suite for core services
│   └── test_api_endpoints.py      # HTTP endpoint verification tests
├── .github/workflows/ci.yml       # GitHub Actions automated continuous integration workflow
├── requirements.txt               # Python package dependencies
├── Dockerfile                     # Container deployment specification
├── docker-compose.yml             # Container orchestration
├── render.yaml                    # Cloud deployment blueprint
├── start_service.bat              # Windows launcher script
├── push_to_github.bat             # Git repository management utility
└── README.md
```

---

## Technology Stack

- **Backend Framework:** FastAPI (Python 3.11+)
- **Server Gateway:** Uvicorn ASGI
- **Database & ORM:** SQLite / SQLAlchemy
- **Computer Vision:** OpenCV (opencv-python-headless)
- **Mathematical Processing:** NumPy
- **Data Analysis & Formatting:** Pandas, OpenPyXL, ReportLab
- **Frontend:** Modern HTML5, JavaScript (ES6+), Tailwind CSS, Chart.js
- **Cryptography:** Cryptography (Fernet AES-256), Hashlib (PBKDF2-SHA256)
- **Containerization:** Docker & Docker Compose
- **Continuous Integration:** GitHub Actions

---

## Installation and Setup

### Prerequisites
- Python 3.11 or higher
- Git
- Modern web browser (Chrome, Edge, Firefox) with camera access

### 1. Clone the Repository
```bash
git clone https://github.com/avivekgoud/face-recognition-attendance.git
cd face-recognition-attendance
```

### 2. Create and Activate a Virtual Environment (Optional)
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 3. Install Required Packages
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python run.py
```
*(On Windows systems, you can also double-click `start_service.bat`)*

### 5. Access the System
- Web Application Dashboard: `http://127.0.0.1:8000`
- Interactive OpenAPI Documentation: `http://127.0.0.1:8000/docs`

Default Administrator Credentials:
- **Username:** `admin`
- **Password:** `admin123`

---

## Automated Verification and Tests

To run the automated integration test suites:

```bash
# Core biometric, encryption, and attendance engine tests
python tests/test_system.py

# API route and endpoint integration tests
python tests/test_api_endpoints.py
```

---

## Deployment Options

### Docker Deployment
```bash
docker compose up -d --build
```

### Cloud Deployment (Render.com / Linux VPS)
The repository includes `render.yaml` for one-click deployment:
1. Connect the repository to Render.com.
2. Set Build Command to `pip install -r requirements.txt`.
3. Set Start Command to `python run.py`.

---

## Author and Institution Details

- **Student Name:** A Vivek Goud
- **Degree / Major:** Bachelor of Technology in Computer Science and Engineering
- **College:** Vardhaman College of Engineering, Hyderabad
- **Project Title:** FaceSync - Face Recognition Attendance Management System
- **Year:** 2026

---

## License

This software is distributed under the terms of the MIT License. Refer to the [LICENSE](LICENSE) file for complete details.
