import cv2
import numpy as np
from typing import Tuple, Optional, Dict, Any

class LivenessService:
    def __init__(self):
        pass

    def evaluate_texture_liveness(self, face_bgr: np.ndarray) -> float:
        """
        Detects screen / printed paper re-projection using High-Frequency Texture & Color Analysis.
        - Analyzes YCrCb color space chromatic variance (screens suffer from dynamic range compression).
        - Computes Laplacian frequency energy.
        Returns score from 0.0 (likely spoof) to 1.0 (likely live).
        """
        if face_bgr is None or face_bgr.size == 0:
            return 0.0

        # Convert to YCrCb
        ycrcb = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2YCrCb)
        y, cr, cb = cv2.split(ycrcb)

        # Standard live skin tone in Cr-Cb space exhibits specific variance
        cr_std = np.std(cr)
        cb_std = np.std(cb)
        color_score = min(1.0, (cr_std + cb_std) / 25.0)

        # High frequency texture via Laplacian
        gray = cv2.cvtColor(face_bgr, cv2.COLOR_BGR2GRAY)
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        texture_score = min(1.0, lap_var / 300.0)

        # Detect extreme specular glare (common on phone screens)
        overexposed_ratio = np.sum(gray > 245) / float(gray.size)
        glare_penalty = max(0.0, 1.0 - (overexposed_ratio * 5.0))

        final_score = (0.45 * color_score + 0.40 * texture_score + 0.15 * glare_penalty)
        return float(np.clip(final_score, 0.0, 1.0))

    def evaluate_liveness(
        self,
        image_bgr: np.ndarray,
        bbox: Optional[Dict[str, int]] = None,
        client_liveness_score: Optional[float] = None,
        min_threshold: float = 0.55
    ) -> Tuple[bool, float, str]:
        """
        Combines client-side challenge heuristics (e.g. eye blink / motion) with server-side texture analysis.
        Returns: (passed, composite_score, explanation)
        """
        if image_bgr is None:
            return False, 0.0, "No image provided"

        # Crop face ROI
        if bbox:
            x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
            h_img, w_img = image_bgr.shape[:2]
            x, y = max(0, x), max(0, y)
            w, h = min(w, w_img - x), min(h, h_img - y)
            face_roi = image_bgr[y:y+h, x:x+w]
        else:
            face_roi = image_bgr

        if face_roi.size == 0:
            return False, 0.0, "Invalid face area"

        server_texture_score = self.evaluate_texture_liveness(face_roi)

        # Combine with client liveness signal if provided
        if client_liveness_score is not None and 0.0 <= client_liveness_score <= 1.0:
            composite_score = 0.6 * server_texture_score + 0.4 * client_liveness_score
        else:
            composite_score = server_texture_score

        composite_score = round(composite_score, 3)

        if composite_score >= min_threshold:
            return True, composite_score, "Liveness verified (Real human presence detected)"
        else:
            return False, composite_score, "Potential spoof or low texture quality detected"

liveness_service = LivenessService()
