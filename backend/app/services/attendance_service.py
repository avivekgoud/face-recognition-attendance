from datetime import datetime, date, time, timedelta
from typing import Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import AttendanceRecord, Person, Department
from ..models.attendance import AttendanceStatus, VerificationMode
from ..config import settings

class AttendanceService:
    def __init__(self):
        pass

    def parse_time_str(self, time_str: str) -> time:
        """Parses 'HH:MM' string into datetime.time object."""
        try:
            parts = time_str.split(":")
            return time(int(parts[0]), int(parts[1]))
        except Exception:
            return time(9, 0)

    def determine_status(self, check_in_dt: datetime, department: Optional[Department]) -> AttendanceStatus:
        """
        Determines whether check-in is PRESENT or LATE based on department shift configuration.
        """
        if not department:
            start_str = settings.STANDARD_WORK_START
            late_grace = settings.LATE_GRACE_MINUTES
        else:
            start_str = department.shift_start_time or settings.STANDARD_WORK_START
            late_grace = department.shift_late_threshold_mins or settings.LATE_GRACE_MINUTES

        shift_start = self.parse_time_str(start_str)
        # Construct reference datetime for today's shift start + grace
        check_in_time_val = check_in_dt.time()
        
        # Shift cutoff time in minutes from midnight
        shift_start_mins = shift_start.hour * 60 + shift_start.minute
        late_cutoff_mins = shift_start_mins + late_grace
        
        check_in_mins = check_in_time_val.hour * 60 + check_in_time_val.minute

        if check_in_mins <= late_cutoff_mins:
            return AttendanceStatus.PRESENT
        else:
            return AttendanceStatus.LATE

    def process_face_attendance(
        self,
        db: Session,
        person: Person,
        confidence: float,
        liveness_score: float,
        snapshot_url: Optional[str] = None,
        cooldown_minutes: Optional[int] = None
    ) -> Tuple[AttendanceRecord, str, str]:
        """
        Handles automated face recognition attendance:
        - Prevents duplicate check-in within cooldown window.
        - Calculates PRESENT vs LATE status based on shift timings.
        - Handles Check-Out if scanned later in the day.
        
        Returns: (record, action_code, message)
        action_code in ["NEW_CHECK_IN", "CHECK_OUT_UPDATED", "COOLDOWN_SUPPRESSED"]
        """
        now = datetime.now()
        today = now.date()
        cooldown = cooldown_minutes if cooldown_minutes is not None else settings.DUPLICATE_COOLDOWN_MINUTES

        # Check for existing record for this person today
        existing_record = db.query(AttendanceRecord).filter(
            AttendanceRecord.person_id == person.id,
            AttendanceRecord.date == today
        ).first()

        if not existing_record:
            # First check-in of the day
            status = self.determine_status(now, person.department)
            new_record = AttendanceRecord(
                person_id=person.id,
                date=today,
                check_in_time=now,
                check_out_time=None,
                status=status,
                recognition_confidence=confidence,
                liveness_score=liveness_score,
                verification_mode=VerificationMode.FACE_AUTO,
                snapshot_url=snapshot_url,
                created_at=now,
                updated_at=now
            )
            db.add(new_record)
            db.commit()
            db.refresh(new_record)
            
            time_str = now.strftime("%I:%M %p")
            status_text = "Present" if status == AttendanceStatus.PRESENT else "Late"
            return new_record, "NEW_CHECK_IN", f"Check-in recorded: {person.full_name} — {status_text} at {time_str}"

        # If already checked in today, check cooldown
        last_action_time = existing_record.check_out_time or existing_record.check_in_time
        if last_action_time:
            time_diff_mins = (now - last_action_time).total_seconds() / 60.0
            if time_diff_mins < cooldown:
                # Within cooldown period: suppress duplicate
                mins_left = int(cooldown - time_diff_mins) + 1
                return existing_record, "COOLDOWN_SUPPRESSED", f"Already marked today ({existing_record.status.value}). Cooldown active ({mins_left}m remaining)."

        # After cooldown period: record or update check-out
        existing_record.check_out_time = now
        existing_record.updated_at = now
        db.commit()
        db.refresh(existing_record)
        
        time_str = now.strftime("%I:%M %p")
        return existing_record, "CHECK_OUT_UPDATED", f"Check-out updated for {person.full_name} at {time_str}"

attendance_service = AttendanceService()
