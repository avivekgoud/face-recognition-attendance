import os
import sys
from pathlib import Path
from datetime import datetime, date, timedelta
import numpy as np
import pandas as pd
import streamlit as st

# Setup Path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Page Config (Must be first)
st.set_page_config(
    page_title="FaceSync — Face Recognition Attendance",
    page_icon="👤",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Fast Styling
st.markdown("""
<style>
    .main-header {
        font-size: 2rem;
        font-weight: 800;
        color: #1e3a8a;
        margin-bottom: 0.1rem;
    }
    .sub-header {
        color: #64748b;
        font-size: 0.9rem;
        margin-bottom: 1.2rem;
    }
    .stMetric {
        background: #f8fafc;
        border-radius: 0.8rem;
        padding: 0.8rem;
        border: 1px solid #e2e8f0;
    }
</style>
""", unsafe_allow_html=True)

# Cached Database & Service Initializer (Runs once in memory)
@st.cache_resource
def get_db_and_services():
    from backend.app.database import Base, engine, SessionLocal
    from backend.app.models import Department, Person, BiometricFace, AttendanceRecord, SystemSetting, User
    from backend.app.models.attendance import AttendanceStatus, VerificationMode
    from backend.app.services.crypto_service import crypto_service
    from backend.app.services.face_service import face_service
    from backend.app.services.liveness_service import liveness_service
    from backend.app.services.attendance_service import attendance_service
    from backend.app.services.report_service import report_service
    from backend.app.routers.settings import seed_sample_data
    from backend.app.config import settings

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Department).count() == 0:
            seed_sample_data(db)
    finally:
        db.close()

    return {
        "SessionLocal": SessionLocal,
        "Department": Department,
        "Person": Person,
        "BiometricFace": BiometricFace,
        "AttendanceRecord": AttendanceRecord,
        "AttendanceStatus": AttendanceStatus,
        "VerificationMode": VerificationMode,
        "crypto_service": crypto_service,
        "face_service": face_service,
        "liveness_service": liveness_service,
        "attendance_service": attendance_service,
        "report_service": report_service,
        "settings": settings
    }

srv = get_db_and_services()
SessionLocal = srv["SessionLocal"]
Department = srv["Department"]
Person = srv["Person"]
BiometricFace = srv["BiometricFace"]
AttendanceRecord = srv["AttendanceRecord"]
AttendanceStatus = srv["AttendanceStatus"]
VerificationMode = srv["VerificationMode"]
crypto_service = srv["crypto_service"]
face_service = srv["face_service"]
liveness_service = srv["liveness_service"]
attendance_service = srv["attendance_service"]
report_service = srv["report_service"]
app_settings = srv["settings"]

# Sidebar Navigation
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/facial-recognition.png", width=65)
    st.title("FaceSync AI")
    st.caption("Biometric Attendance Management System")
    st.markdown("**Author:** A VIVEK GOUD  \n**Dept:** Computer Science and Engineering  \n**College:** Vardhaman College of Engineering")
    st.divider()

    menu = st.radio(
        "Navigation",
        [
            "📊 Dashboard",
            "📹 Live Camera Kiosk",
            "➕ Register Face Profile",
            "👥 People Directory",
            "📅 Attendance History",
            "📑 Export Reports",
            "⚙️ Settings & Demo Data"
        ],
        index=0
    )
    st.divider()
    st.caption("AES-256 Vector Encryption • Anti-Spoofing Active")

# 1. DASHBOARD
if menu == "📊 Dashboard":
    st.markdown("<div class=\"main-header\">Attendance Intelligence Hub</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Real-time automated check-ins, department breakdown, and turnout analytics</div>", unsafe_allow_html=True)

    db = SessionLocal()
    today = date.today()
    total_reg = db.query(Person).filter(Person.is_active == True).count()
    present_cnt = db.query(AttendanceRecord).filter(AttendanceRecord.date == today, AttendanceRecord.status == AttendanceStatus.PRESENT).count()
    late_cnt = db.query(AttendanceRecord).filter(AttendanceRecord.date == today, AttendanceRecord.status == AttendanceStatus.LATE).count()
    absent_cnt = max(0, total_reg - (present_cnt + late_cnt))
    rate = round(((present_cnt + late_cnt) / total_reg * 100), 1) if total_reg > 0 else 0.0

    # Fast KPI Metrics Row
    c1, c2, c3, c4, c5 = st.columns(5)
    c1.metric("Registered Profiles", total_reg)
    c2.metric("Present Today", present_cnt, "On-Time")
    c3.metric("Late Today", late_cnt, "After Grace")
    c4.metric("Absent Today", absent_cnt, "Unrecorded")
    c5.metric("Turnout Rate", f"{rate}%")

    st.markdown("---")

    col_left, col_right = st.columns([7, 5])

    with col_left:
        st.subheader("7-Day Attendance Breakdown")
        trend_rows = []
        for i in range(6, -1, -1):
            d = today - timedelta(days=i)
            p = db.query(AttendanceRecord).filter(AttendanceRecord.date == d, AttendanceRecord.status == AttendanceStatus.PRESENT).count()
            l = db.query(AttendanceRecord).filter(AttendanceRecord.date == d, AttendanceRecord.status == AttendanceStatus.LATE).count()
            a = max(0, total_reg - (p + l))
            trend_rows.append({"Date": d.strftime("%b %d"), "Present": p, "Late": l, "Absent": a})
        
        df_trend = pd.DataFrame(trend_rows).set_index("Date")
        st.bar_chart(df_trend, color=["#10b981", "#f59e0b", "#ef4444"], height=280)

    with col_right:
        st.subheader("Department Attendance Count")
        depts = db.query(Department).all()
        dept_rows = []
        for d in depts:
            cnt = db.query(AttendanceRecord).join(Person).filter(Person.department_id == d.id, AttendanceRecord.date == today).count()
            dept_rows.append({"Department": d.code or d.name[:10], "Attendees": cnt})
        
        df_dept = pd.DataFrame(dept_rows).set_index("Department")
        st.bar_chart(df_dept, color="#3b82f6", height=280)

    st.subheader("Recent Attendance Stream")
    recent_records = db.query(AttendanceRecord).join(Person).order_by(AttendanceRecord.updated_at.desc()).limit(8).all()
    if recent_records:
        rec_data = []
        for r in recent_records:
            rec_data.append({
                "Name": r.person.full_name if r.person else "Unknown",
                "ID": r.person.identifier if r.person else "-",
                "Department": r.person.department.name if r.person and r.person.department else "-",
                "Time": r.check_in_time.strftime("%I:%M %p") if r.check_in_time else "--",
                "Status": r.status.value,
                "Confidence": f"{r.recognition_confidence * 100:.1f}%",
                "Mode": r.verification_mode.value
            })
        st.dataframe(pd.DataFrame(rec_data), use_container_width=True)
    else:
        st.info("No attendance activity recorded yet.")

    db.close()

# 2. LIVE CAMERA KIOSK
elif menu == "📹 Live Camera Kiosk":
    st.markdown("<div class=\"main-header\">Live Facial Recognition Kiosk</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Take a snapshot with your device camera for instant verification</div>", unsafe_allow_html=True)

    col_cam, col_info = st.columns([7, 5])

    with col_cam:
        st.markdown("#### 📷 Viewfinder")
        camera_photo = st.camera_input("Align your face and take photo:")

        if camera_photo is not None:
            import cv2
            bytes_data = camera_photo.getvalue()
            nparr = np.frombuffer(bytes_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            with st.spinner("Analyzing face biometrics..."):
                db = SessionLocal()
                is_live, liveness_score, live_msg = liveness_service.evaluate_liveness(img)
                query_vec = face_service.extract_embedding(img)
                
                enrolled_rows = db.query(BiometricFace).join(Person).filter(Person.is_active == True).all()
                enrolled_items = []
                for row in enrolled_rows:
                    try:
                        decrypted_vec = crypto_service.decrypt_vector(row.encrypted_embedding)
                        enrolled_items.append({
                            "person_id": row.person_id,
                            "vector": decrypted_vec,
                            "angle": row.angle_label
                        })
                    except Exception:
                        continue

                sim_th = float(app_settings.FACE_SIMILARITY_THRESHOLD)
                best_pid, best_score, best_angle = face_service.match_against_db(query_vec, enrolled_items, threshold=sim_th)

                if best_pid and is_live:
                    person = db.query(Person).filter(Person.id == best_pid).first()
                    rec, action_code, msg = attendance_service.process_face_attendance(
                        db, person=person, confidence=best_score, liveness_score=liveness_score
                    )
                    st.success(f"✅ **Recognized:** {person.full_name} ({person.identifier}) — **{rec.status.value}** ({best_score * 100:.1f}% match)")
                    st.toast(f"Attendance marked for {person.full_name}!", icon="🎉")
                elif not is_live:
                    st.error(f"⚠️ Anti-spoofing warning: {live_msg}")
                else:
                    st.warning(f"⚪ Unknown / Unregistered Face (Match: {best_score * 100:.1f}% < {sim_th * 100:.1f}%). Not added to database.")

                db.close()

    with col_info:
        st.markdown("#### ℹ️ Shift Rules")
        st.info("""
        - **Present:** Check-in within shift start + grace cutoff (09:15 AM).
        - **Late:** Check-in after grace cutoff.
        - **Duplicate Suppression:** Scans within 15 mins of last check-in are safely ignored.
        """)
        
        st.markdown("#### ⚡ Live Attendees Today")
        db = SessionLocal()
        today_recs = db.query(AttendanceRecord).filter(AttendanceRecord.date == date.today()).order_by(AttendanceRecord.updated_at.desc()).limit(6).all()
        for r in today_recs:
            p_name = r.person.full_name if r.person else "Unknown"
            time_str = r.check_in_time.strftime("%I:%M %p") if r.check_in_time else "Now"
            st.markdown(f"👤 **{p_name}** — `{r.status.value}` at `{time_str}` ({r.recognition_confidence*100:.0f}%)")
        db.close()

# 3. REGISTER FACE PROFILE
elif menu == "➕ Register Face Profile":
    st.markdown("<div class=\"main-header\">Register Face Biometric Profile</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Enroll an individual with personal details, consent, and face photo</div>", unsafe_allow_html=True)

    db = SessionLocal()
    depts = db.query(Department).all()
    dept_map = {d.name: d.id for d in depts}
    db.close()

    with st.form("reg_form", clear_on_submit=True):
        c1, c2 = st.columns(2)
        with c1:
            full_name = st.text_input("Full Legal Name *", placeholder="e.g. Rahul Kumar")
            identifier = st.text_input("Employee / Student ID *", placeholder="e.g. EMP-1010 / STU-404")
            dept_name = st.selectbox("Assigned Department / Class *", list(dept_map.keys()) if dept_map else ["General"])
        with c2:
            designation = st.text_input("Designation / Role", value="Member", placeholder="e.g. Senior Software Fellow")
            email = st.text_input("Email Address", placeholder="rahul@apex.edu")
            phone = st.text_input("Phone Number", placeholder="+1 555-0199")

        uploaded_photos = st.file_uploader("Upload 1 to 4 face photos:", type=["jpg", "jpeg", "png"], accept_multiple_files=True)
        consent = st.checkbox("I explicitly authorize the encrypted storage (AES-256) of my facial biometric features for attendance verification.", value=True)
        submit = st.form_submit_button("Complete Face Registration", type="primary")

        if submit:
            if not full_name or not identifier or not dept_name:
                st.error("Please fill in all required fields.")
            elif not consent:
                st.warning("Biometric consent is mandatory.")
            elif not uploaded_photos:
                st.warning("Please upload at least 1 face photo for enrollment.")
            else:
                db = SessionLocal()
                import cv2
                if db.query(Person).filter(Person.identifier == identifier).first():
                    st.error(f"Identifier '{identifier}' is already registered.")
                else:
                    new_person = Person(
                        identifier=identifier,
                        full_name=full_name,
                        department_id=dept_map.get(dept_name, 1),
                        designation=designation,
                        email=email,
                        phone=phone,
                        consent_given=True,
                        consent_timestamp=datetime.utcnow(),
                        is_active=True
                    )
                    db.add(new_person)
                    db.commit()
                    db.refresh(new_person)

                    enrolled_count = 0
                    for photo in uploaded_photos:
                        photo_bytes = photo.read()
                        nparr = np.frombuffer(photo_bytes, np.uint8)
                        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                        if img is not None:
                            emb = face_service.extract_embedding(img)
                            if emb:
                                enc_str = crypto_service.encrypt_vector(emb)
                                bio = BiometricFace(
                                    person_id=new_person.id,
                                    encrypted_embedding=enc_str,
                                    angle_label="angle",
                                    quality_score=1.0
                                )
                                db.add(bio)
                                enrolled_count += 1
                    db.commit()
                    st.success(f"🎉 Successfully enrolled **{full_name}** with **{enrolled_count}** biometric face representations!")
                db.close()

# 4. PEOPLE DIRECTORY
elif menu == "👥 People Directory":
    st.markdown("<div class=\"main-header\">People Directory</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Search and manage enrolled personnel and biometrics</div>", unsafe_allow_html=True)

    db = SessionLocal()
    search_q = st.text_input("🔍 Search people by name or ID:", "")
    
    query = db.query(Person)
    if search_q:
        query = query.filter(Person.full_name.ilike(f"%{search_q}%") | Person.identifier.ilike(f"%{search_q}%"))
    
    people = query.all()

    if people:
        p_list = []
        for p in people:
            bio_cnt = db.query(BiometricFace).filter(BiometricFace.person_id == p.id).count()
            p_list.append({
                "ID": p.identifier,
                "Full Name": p.full_name,
                "Department": p.department.name if p.department else "N/A",
                "Designation": p.designation,
                "Email": p.email or "-",
                "Face Vectors": f"{bio_cnt} enrolled"
            })
        st.dataframe(pd.DataFrame(p_list), use_container_width=True)
    else:
        st.info("No people found matching your query.")

    db.close()

# 5. ATTENDANCE HISTORY
elif menu == "📅 Attendance History":
    st.markdown("<div class=\"main-header\">Attendance History Logs</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Query historical biometric check-in records</div>", unsafe_allow_html=True)

    db = SessionLocal()
    c1, c2, c3 = st.columns(3)
    with c1:
        hist_date = st.date_input("Filter by Date", value=None)
    with c2:
        status_filter = st.selectbox("Status", ["All", "PRESENT", "LATE", "ABSENT", "EXCUSED"])
    with c3:
        search_kw = st.text_input("Search Name/ID", "")

    q = db.query(AttendanceRecord).join(Person)
    if hist_date:
        q = q.filter(AttendanceRecord.date == hist_date)
    if status_filter != "All":
        q = q.filter(AttendanceRecord.status == AttendanceStatus(status_filter))
    if search_kw:
        q = q.filter(Person.full_name.ilike(f"%{search_kw}%") | Person.identifier.ilike(f"%{search_kw}%"))

    records = q.order_by(AttendanceRecord.date.desc(), AttendanceRecord.created_at.desc()).all()

    if records:
        h_data = []
        for r in records:
            h_data.append({
                "Attendee": r.person.full_name if r.person else "-",
                "ID": r.person.identifier if r.person else "-",
                "Department": r.person.department.name if r.person and r.person.department else "-",
                "Date": r.date.strftime("%Y-%m-%d"),
                "Check-In": r.check_in_time.strftime("%I:%M %p") if r.check_in_time else "--",
                "Check-Out": r.check_out_time.strftime("%I:%M %p") if r.check_out_time else "--",
                "Status": r.status.value,
                "Confidence": f"{r.recognition_confidence * 100:.0f}%",
                "Mode": r.verification_mode.value
            })
        st.dataframe(pd.DataFrame(h_data), use_container_width=True)
    else:
        st.info("No records found matching filters.")

    db.close()

# 6. EXPORT REPORTS
elif menu == "📑 Export Reports":
    st.markdown("<div class=\"main-header\">Export Attendance Reports</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Generate CSV and styled Excel reports</div>", unsafe_allow_html=True)

    db = SessionLocal()
    records = db.query(AttendanceRecord).all()

    c1, c2 = st.columns(2)
    with c1:
        csv_bytes = report_service.generate_csv(records)
        st.download_button(
            label="📥 Download Full Attendance CSV",
            data=csv_bytes,
            file_name=f"attendance_report_{date.today()}.csv",
            mime="text/csv",
            type="primary"
        )
    with c2:
        excel_bytes = report_service.generate_excel(records)
        st.download_button(
            label="📊 Download Styled Excel (.xlsx)",
            data=excel_bytes,
            file_name=f"attendance_report_{date.today()}.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    db.close()

# 7. SETTINGS
elif menu == "⚙️ Settings & Demo Data":
    st.markdown("<div class=\"main-header\">Settings & Demo Data</div>", unsafe_allow_html=True)
    st.markdown("<div class=\"sub-header\">Manage demo data and policies</div>", unsafe_allow_html=True)

    if st.button("🔄 Re-Seed Demonstration Data (Departments, Attendees & 14-Day History)"):
        db = SessionLocal()
        from backend.app.routers.settings import seed_sample_data
        seed_sample_data(db)
        db.close()
        st.success("Sample data seeded successfully!")
        st.rerun()
