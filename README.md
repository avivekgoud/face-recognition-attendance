<div align="center">

# 👤 FaceSync — Face Recognition Attendance Management System

**An AI-Powered Biometric Attendance Management System with Anti-Spoofing & AES-256 Biometric Encryption**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![OpenCV](https://img.shields.io/badge/Computer%20Vision-OpenCV-5C3EE8.svg?logo=opencv&logoColor=white)](https://opencv.org)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

<br/>

**Developed by:** **A Vivek Goud**  
**Department:** **Computer Science & Engineering**

</div>

---

## 📌 Project Overview

**FaceSync** is an enterprise-grade, privacy-compliant facial biometric attendance management system built for educational institutions, universities, corporate workplaces, and research labs. 

The system leverages computer vision deep feature extraction and cosine similarity ensemble matching to deliver sub-second (<100ms) automatic attendance check-ins through a live camera kiosk, backed by passive anti-spoofing filters, automated shift/grace-period rules, and encrypted biometric storage.

---

## ✨ Key Features

### 1. 🎯 Multi-Angle Face Registration & Enrollment Wizard
- **4-Angle Guided Capture:** Collects 4 facial variations (Frontal, Slight Left 15°, Slight Right 15°, Natural Expression / Smile) to generate an ensemble embedding vector per individual.
- **Real-Time Quality Validation:** Live feedback evaluating blur (Laplacian variance), contrast, and face bounding dimensions.
- **Biometric Privacy Consent:** Enforces and logs explicit user consent before biometric persistence.
- **Photo Upload Alternative:** Supports direct image uploads for batch or remote registration.

### 2. 📹 Live Attendance Kiosk & Real-Time Face Recognition
- **Real-Time HUD Canvas:** Live camera stream with dynamic color-coded bounding boxes:
  - 🟢 **Green:** Recognized attendee with name, department, status, and match confidence.
  - ⚪ **Gray:** Unknown / unregistered face (*never added to database*).
  - 🔴 **Red:** Anti-spoofing warning or quality alert.
- **Anti-Spoofing & Liveness Verification:** Passive texture frequency and YCrCb chromatic distribution analysis to reject printed photo and phone-screen replay spoof attacks.
- **Duplicate Check-in Prevention:** Configurable cooldown period (default: 15 minutes) to avoid redundant duplicate check-ins.
- **Audio Feedback:** Synthesizes Web Audio API check-in chimes on successful verification.
- **Live Stream Ticker:** Displays real-time side ticker of the latest attendees.

### 3. ⏱️ Smart Attendance Rules Engine & Shift Calculation
- **Department-Specific Shifts:** Configurable shift start times, late grace periods (e.g. 15 mins), and shift end times.
- **Automatic Status Calculation:**
  - **Present (Green):** Checked in on or before `Shift Start + Grace Period` (e.g. 09:15 AM).
  - **Late (Yellow):** Checked in after grace cutoff.
  - **Absent (Red):** Unrecorded active personnel.
  - **Check-Out (Blue):** Automatic departure recording for second scans after cooldown.

### 4. 📈 Interactive Analytics Dashboard
- **KPI Metric Counters:** Total Registered, Present Today, Late Today, Absent Today, Turnout Rate %.
- **Chart.js Visualizations:**
  - 7/14/30-Day Attendance Trends (Stacked bar chart for Present, Late, Absent).
  - Department Turnout Breakdown (Doughnut chart with percentage legend).
  - Hourly Arrival Peak Distribution (Area curve).
  - Real-time live activity stream.

### 5. 🔍 Search & Individual Person Profiles
- **Global Search:** Instant fuzzy search by Name, Student/Employee ID, or Department.
- **Individual Profile Drawer:**
  - Monthly attendance heat calendar.
  - Summary KPI statistics (Total logs, on-time count, late count, attendance rate %).
  - Recent check-in / check-out timeline.
  - **Right-to-be-Forgotten Biometric Erasure:** Permanently purges encrypted face embedding vectors and enrollment photos on demand.

### 6. 📊 Multi-Format Report Generator
- **Excel (.xlsx):** Formatted spreadsheets with KPI summary headers, status badges, and auto-adjusted columns using `openpyxl`.
- **PDF Export:** Landscape PDF documents generated via `ReportLab` featuring organization branding, date range filters, summary statistics table, and detailed records table.
- **CSV Export:** UTF-8 BOM formatted tabular data for integration into legacy payroll or SIS systems.

### 7. 🔐 Security, RBAC & Audit Trail
- **AES-256 Biometric Vector Encryption:** All facial feature vectors are encrypted at rest using `cryptography.fernet`.
- **Role-Based Access Control (RBAC):** Super Admin, Attendance Officer, Viewer accounts with PBKDF2-HMAC-SHA256 password security and JWT authentication.
- **Audit Logs:** Immutable audit log tracking every administrative override, login, profile deletion, and biometric purge with timestamp, actor, and client IP.

---

## 🛠️ System Architecture

```
face_attendance_system/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point, CORS, static mounts
│   │   ├── config.py              # Application settings, paths, security keys
│   │   ├── database.py            # SQLAlchemy database engine and session
│   │   ├── models/                # User, Person, BiometricFace, AttendanceRecord, etc.
│   │   ├── schemas/               # Pydantic request/response schemas
│   │   ├── services/              # Face Recognition, Liveness, Encryption, Attendance, Reports, Auth
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
├── .github/workflows/ci.yml       # GitHub Actions CI workflow
├── requirements.txt               # Dependencies
├── Dockerfile                     # Production container image
├── docker-compose.yml             # Container orchestration
├── start_service.bat              # Windows 1-click launcher
├── push_to_github.bat             # 1-click GitHub push script
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/face-recognition-attendance.git
cd face-recognition-attendance
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Application
```bash
python run.py
```
*(On Windows, you can also double-click `start_service.bat`)*

### 4. Open in Browser
- **Live Dashboard:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### Default Administrator Credentials:
- **Username:** `admin`
- **Password:** `admin123`

---

## 🐳 Docker Deployment

Deploy with 1 command using Docker Compose:
```bash
docker compose up -d --build
```
Access the application at `http://localhost:8000`.

---

## 🧪 Running Automated Tests

```bash
python tests/test_system.py
python tests/test_api_endpoints.py
```

---

## 👨‍💻 Author & Project Details

- **Developer:** **A Vivek Goud**
- **Branch / Major:** **Computer Science & Engineering**
- **Project:** Face Recognition Attendance Management System (FaceSync)
- **Year:** 2026

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
