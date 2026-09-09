import os
import cv2
import numpy as np
import base64
from pathlib import Path
from typing import List, Tuple, Optional, Dict, Any

WEIGHTS_DIR = Path(__file__).resolve().parent.parent / "weights"
YUNET_PATH = WEIGHTS_DIR / "face_detection_yunet_2023mar.onnx"
SFACE_PATH = WEIGHTS_DIR / "face_recognition_sface_2021dec.onnx"

class FaceService:
    def __init__(self):
        self.detector = None
        self.recognizer = None
        self._init_models()

    def _init_models(self):
        """Initializes OpenCV YuNet and SFace deep learning models if available."""
        try:
            if YUNET_PATH.exists() and hasattr(cv2, "FaceDetectorYN"):
                self.detector = cv2.FaceDetectorYN.create(
                    model=str(YUNET_PATH),
                    config="",
                    input_size=(320, 320),
                    score_threshold=0.6,
                    nms_threshold=0.3,
                    top_k=5000
                )
            if SFACE_PATH.exists() and hasattr(cv2, "FaceRecognizerSF"):
                self.recognizer = cv2.FaceRecognizerSF.create(
                    model=str(SFACE_PATH),
                    config=""
                )
        except Exception as e:
            print(f"[!] Warning initializing deep face models: {e}")

    def decode_image_base64(self, b64_string: str) -> Optional[np.ndarray]:
        """Decodes a base64 string or Data URL into an OpenCV BGR numpy array."""
        try:
            if "," in b64_string:
                b64_string = b64_string.split(",", 1)[1]
            img_bytes = base64.b64decode(b64_string)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            return img
        except Exception as e:
            print(f"Error decoding image base64: {e}")
            return None

    def encode_image_base64(self, img: np.ndarray, ext: str = ".jpg") -> str:
        """Encodes an OpenCV image to a base64 data URL."""
        success, buffer = cv2.imencode(ext, img)
        if not success:
            return ""
        b64_bytes = base64.b64encode(buffer)
        return f"data:image/jpeg;base64,{b64_bytes.decode('utf-8')}"

    def check_image_quality(self, img: np.ndarray, bbox: Optional[Tuple[int, int, int, int]] = None) -> Tuple[bool, str, float]:
        """
        Validates face image quality:
        - Resolution / size
        - Sharpness (Laplacian variance)
        - Illumination (Mean brightness & contrast)
        Returns: (is_good_quality, reason, quality_score 0.0-1.0)
        """
        if img is None or img.size == 0:
            return False, "Empty or invalid image data", 0.0

        if bbox is not None:
            x, y, w, h = bbox
            h_img, w_img = img.shape[:2]
            x, y = max(0, x), max(0, y)
            w, h = min(w, w_img - x), min(h, h_img - y)
            if w < 24 or h < 24:
                return False, "Face bounding area is too small", 0.2
            face_roi = img[y:y+h, x:x+w]
        else:
            face_roi = img

        gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY) if len(face_roi.shape) == 3 else face_roi
        
        # 1. Sharpness / Blur detection via Laplacian variance
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if laplacian_var < 15.0:
            return False, f"Image is blurry (sharpness score {laplacian_var:.1f}). Please hold steady.", 0.3

        # 2. Lighting / Illumination check
        mean_brightness = float(np.mean(gray))
        if mean_brightness < 25:
            return False, "Lighting is too dark. Please move to a brighter environment.", 0.4
        if mean_brightness > 240:
            return False, "Lighting is overexposed. Avoid direct glare.", 0.4

        # Calculate a normalized composite quality score (0.0 to 1.0)
        sharpness_score = min(1.0, laplacian_var / 200.0)
        brightness_score = 1.0 - abs(mean_brightness - 128.0) / 128.0
        composite_score = round(0.6 * sharpness_score + 0.4 * brightness_score, 3)

        return True, "Good quality", composite_score

    def detect_faces(self, img: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects face candidate regions in the image.
        Uses YuNet deep face detector with 5-point facial landmark output.
        Falls back to multi-spectral skin detection ONLY if YuNet is unavailable.
        """
        if img is None or img.size == 0:
            return []

        h_img, w_img = img.shape[:2]

        # 1. Authoritative Deep Learning YuNet detector
        if self.detector is not None:
            try:
                self.detector.setInputSize((w_img, h_img))
                _, faces = self.detector.detect(img)
                if faces is not None and len(faces) > 0:
                    results = []
                    for f in faces:
                        x = max(0, min(int(f[0]), w_img - 1))
                        y = max(0, min(int(f[1]), h_img - 1))
                        w = max(10, min(int(f[2]), w_img - x))
                        h = max(10, min(int(f[3]), h_img - y))
                        score = float(f[14])
                        
                        if score >= 0.5:
                            is_good, reason, quality = self.check_image_quality(img, (x, y, w, h))
                            results.append({
                                "bbox": {"x": x, "y": y, "width": w, "height": h},
                                "is_good_quality": is_good,
                                "quality_reason": reason,
                                "quality_score": quality,
                                "raw_face_row": f.tolist()
                            })
                    if results:
                        results.sort(key=lambda r: r["bbox"]["width"] * r["bbox"]["height"], reverse=True)
                        return results
                # When YuNet is active and detects no faces, authoritative result is empty
                return []
            except Exception:
                pass

        # 2. Multi-color-space skin detection fallback (active only when YuNet model is unavailable)
        ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
        # Standard Kovac model: Y >= 50, Cr in 133-173, Cb in 77-127 (eliminates pure black/gray)
        mask_ycrcb = cv2.inRange(ycrcb, np.array([50, 133, 77], dtype=np.uint8), np.array([255, 173, 127], dtype=np.uint8))

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        mask_hsv = cv2.inRange(hsv, np.array([0, 30, 60], dtype=np.uint8), np.array([25, 255, 255], dtype=np.uint8))

        combined_mask = cv2.bitwise_and(mask_ycrcb, mask_hsv)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        results = []
        min_area = (h_img * w_img) * 0.02

        for c in contours:
            area = cv2.contourArea(c)
            if area > min_area:
                x, y, w, h = cv2.boundingRect(c)
                aspect_ratio = float(h) / max(w, 1)
                if 0.70 <= aspect_ratio <= 1.8:
                    is_good, reason, quality = self.check_image_quality(img, (x, y, w, h))
                    if is_good:
                        results.append({
                            "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                            "is_good_quality": is_good,
                            "quality_reason": reason,
                            "quality_score": quality
                        })

        if results:
            results.sort(key=lambda r: r["bbox"]["width"] * r["bbox"]["height"], reverse=True)
            return results

        return []

    def extract_embedding(
        self,
        img: np.ndarray,
        bbox: Optional[Dict[str, int]] = None,
        raw_face_row: Optional[List[float]] = None
    ) -> Optional[List[float]]:
        """
        Extracts a discriminative 128-dimensional Deep Face Embedding using SFace.
        Aligns facial landmarks to eliminate rotation/tilt differences.
        Unit-normalized (L2 norm = 1.0) for high-precision cosine matching.
        """
        if img is None or img.size == 0:
            return None

        # 1. Try SFace Deep Learning Face Recognizer
        if self.recognizer is not None:
            try:
                # Case A: Explicit landmark face row available
                if raw_face_row is not None and len(raw_face_row) >= 15:
                    aligned = self.recognizer.alignCrop(img, np.array(raw_face_row, dtype=np.float32))
                    feat = self.recognizer.feature(aligned)
                    feat_norm = feat / (np.linalg.norm(feat) + 1e-7)
                    return feat_norm.flatten().tolist()

                # Case B: Run detector to obtain 5 facial landmarks
                detected = self.detect_faces(img)
                if detected and "raw_face_row" in detected[0]:
                    aligned = self.recognizer.alignCrop(img, np.array(detected[0]["raw_face_row"], dtype=np.float32))
                    feat = self.recognizer.feature(aligned)
                    feat_norm = feat / (np.linalg.norm(feat) + 1e-7)
                    return feat_norm.flatten().tolist()

                # Case C: Direct crop or fallback bounding box
                if bbox:
                    x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
                    h_img, w_img = img.shape[:2]
                    x, y = max(0, x), max(0, y)
                    w, h = min(w, w_img - x), min(h, h_img - y)
                    face_roi = img[y:y+h, x:x+w]
                elif detected:
                    b = detected[0]["bbox"]
                    face_roi = img[b["y"]:b["y"]+b["height"], b["x"]:b["x"]+b["width"]]
                else:
                    is_good, _, _ = self.check_image_quality(img)
                    if is_good:
                        face_roi = img
                    else:
                        return None

                if face_roi.size > 0:
                    aligned = cv2.resize(face_roi, (112, 112))
                    feat = self.recognizer.feature(aligned)
                    feat_norm = feat / (np.linalg.norm(feat) + 1e-7)
                    return feat_norm.flatten().tolist()
            except Exception:
                pass

        # 2. Classical Zero-Mean CLAHE DoG HOG Feature Vector Fallback
        return self._extract_classical_embedding(img, bbox)

    def _extract_classical_embedding(self, img: np.ndarray, bbox: Optional[Dict[str, int]] = None) -> Optional[List[float]]:
        """Fallback 128-D zero-mean normalized spatial descriptor."""
        if bbox:
            x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
            h_img, w_img = img.shape[:2]
            x, y = max(0, x), max(0, y)
            w, h = min(w, w_img - x), min(h, h_img - y)
            face_roi = img[y:y+h, x:x+w]
        else:
            detected = self.detect_faces(img)
            if detected:
                b = detected[0]["bbox"]
                face_roi = img[b["y"]:b["y"]+b["height"], b["x"]:b["x"]+b["width"]]
            else:
                is_good, _, _ = self.check_image_quality(img)
                if is_good:
                    face_roi = img
                else:
                    return None

        if face_roi.size == 0:
            return None

        resized = cv2.resize(face_roi, (128, 128))
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY) if len(resized.shape) == 3 else resized
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        equalized = clahe.apply(gray)

        g1 = cv2.GaussianBlur(equalized, (3, 3), 0.8)
        g2 = cv2.GaussianBlur(equalized, (9, 9), 2.5)
        dog = cv2.subtract(g1, g2).astype(np.float32)

        gx = cv2.Sobel(dog, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(dog, cv2.CV_32F, 0, 1, ksize=3)
        mag, ang = cv2.cartToPolar(gx, gy, angleInDegrees=True)

        feature_vector = []
        cell_size = 32
        num_bins = 8
        bin_width = 360.0 / num_bins

        for cy in range(0, 128, cell_size):
            for cx in range(0, 128, cell_size):
                cell_mag = mag[cy:cy+cell_size, cx:cx+cell_size]
                cell_ang = ang[cy:cy+cell_size, cx:cx+cell_size]
                hist = np.zeros(num_bins, dtype=np.float32)
                for by in range(cell_size):
                    for bx in range(cell_size):
                        bin_idx = int((cell_ang[by, bx] % 360.0) // bin_width) % num_bins
                        hist[bin_idx] += cell_mag[by, bx]
                norm = np.linalg.norm(hist) + 1e-6
                hist = hist / norm
                feature_vector.extend(hist.tolist())

        vec_np = np.array(feature_vector, dtype=np.float32)
        zero_mean = vec_np - np.mean(vec_np)
        final_norm = np.linalg.norm(zero_mean) + 1e-7
        return (zero_mean / final_norm).tolist()

    def cosine_to_confidence(self, cosine_val: float) -> float:
        """
        Maps raw SFace cosine similarity (-1.0 to 1.0) into a user-facing 0.0 - 1.0 confidence score.
        OpenCV SFace decision threshold is 0.363 (mapped to 0.50).
        Different faces typically yield 0.0 - 0.35 raw cosine (mapped to 0.0 - 0.49).
        Genuine matches yield 0.55 - 0.95+ raw cosine (mapped to 0.65 - 0.96+).
        """
        if cosine_val <= 0.0:
            return 0.0
        if cosine_val < 0.363:
            return round(float((cosine_val / 0.363) * 0.49), 4)
        else:
            norm_score = 0.50 + 0.50 * ((cosine_val - 0.363) / (1.0 - 0.363))
            return round(float(min(1.0, norm_score)), 4)

    def compute_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculates cosine similarity between two 128-D unit vectors.
        Returns a score between 0.0 and 1.0.
        Genuine matches yield 0.60 to 0.99+.
        Different people yield 0.0 to 0.45.
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        v1 = np.array(vec1, dtype=np.float32)
        v2 = np.array(vec2, dtype=np.float32)

        norm1 = float(np.linalg.norm(v1))
        norm2 = float(np.linalg.norm(v2))
        if norm1 == 0 or norm2 == 0:
            return 0.0

        dot = float(np.dot(v1, v2) / (norm1 * norm2))
        return float(max(0.0, min(1.0, dot)))

    def match_against_db(
        self,
        query_vector: List[float],
        enrolled_db_vectors: List[Dict[str, Any]],
        threshold: float = 0.65
    ) -> Tuple[Optional[int], float, Optional[str]]:
        """
        Matches query_vector against enrolled vectors using ensemble multi-angle cosine matching.
        Enforces strict confidence threshold and margin of separation to prevent false positive check-ins.
        Returns: (best_person_id, best_confidence, matching_angle)
        """
        if not query_vector or not enrolled_db_vectors:
            return None, 0.0, None

        scores_by_person: Dict[int, List[Tuple[float, str]]] = {}
        for item in enrolled_db_vectors:
            pid = item["person_id"]
            db_vec = item["vector"]
            angle = item.get("angle", "front")
            
            sim = self.compute_similarity(query_vector, db_vec)
            if pid not in scores_by_person:
                scores_by_person[pid] = []
            scores_by_person[pid].append((sim, angle))

        candidates: List[Tuple[int, float, str]] = []
        for pid, score_tuples in scores_by_person.items():
            max_sim, match_angle = max(score_tuples, key=lambda x: x[0])
            
            if len(score_tuples) > 1:
                top_scores = sorted([s[0] for s in score_tuples], reverse=True)[:2]
                avg_top2 = sum(top_scores) / float(len(top_scores))
                effective_score = 0.7 * max_sim + 0.3 * avg_top2
            else:
                effective_score = max_sim

            candidates.append((pid, effective_score, match_angle))

        if not candidates:
            return None, 0.0, None

        # Sort descending by confidence score
        candidates.sort(key=lambda c: c[1], reverse=True)
        best_person_id, best_score, best_angle = candidates[0]

        # 1. Primary threshold verification
        if best_score < threshold:
            return None, round(best_score, 4), None

        # 2. Safety Margin of Separation: If runner-up candidate is close,
        # reject as ambiguous to prevent misidentifying an unregistered person as someone else
        if len(candidates) > 1:
            runner_up_score = candidates[1][1]
            if runner_up_score >= 0.45 and (best_score - runner_up_score) < 0.04:
                return None, round(best_score, 4), None

        return best_person_id, round(best_score, 4), best_angle

face_service = FaceService()
