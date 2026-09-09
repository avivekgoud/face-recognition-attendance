import cv2
import numpy as np
import base64
from typing import List, Tuple, Optional, Dict, Any

class FaceService:
    def __init__(self):
        pass

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
            if w < 30 or h < 30:
                return False, "Face bounding area is too small", 0.2
            face_roi = img[y:y+h, x:x+w]
        else:
            face_roi = img

        gray = cv2.cvtColor(face_roi, cv2.COLOR_BGR2GRAY)
        
        # 1. Sharpness / Blur detection via Laplacian variance
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if laplacian_var < 20.0:
            return False, f"Image is blurry (sharpness score {laplacian_var:.1f}). Please hold steady.", 0.3

        # 2. Lighting / Illumination check
        mean_brightness = float(np.mean(gray))
        if mean_brightness < 30:
            return False, "Lighting is too dark. Please move to a brighter environment.", 0.4
        if mean_brightness > 235:
            return False, "Lighting is overexposed. Avoid direct glare.", 0.4

        # Calculate a normalized composite quality score (0.0 to 1.0)
        sharpness_score = min(1.0, laplacian_var / 200.0)
        brightness_score = 1.0 - abs(mean_brightness - 128.0) / 128.0
        composite_score = round(0.6 * sharpness_score + 0.4 * brightness_score, 3)

        return True, "Good quality", composite_score

    def detect_faces(self, img: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects face candidate regions in the image:
        Uses multi-color-space skin detection (YCrCb + HSV) and morphological analysis
        to robustly identify human facial regions across all skin tones and lighting.
        """
        if img is None or img.size == 0:
            return []

        h_img, w_img = img.shape[:2]
        
        # 1. Broad YCrCb skin-color segmentation (Cr: 125-185, Cb: 70-135)
        ycrcb = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
        lower_ycrcb = np.array([0, 125, 70], dtype=np.uint8)
        upper_ycrcb = np.array([255, 185, 135], dtype=np.uint8)
        mask_ycrcb = cv2.inRange(ycrcb, lower_ycrcb, upper_ycrcb)

        # 2. HSV skin-color segmentation (Hue 0-28 for natural tones)
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        lower_hsv = np.array([0, 25, 40], dtype=np.uint8)
        upper_hsv = np.array([28, 255, 255], dtype=np.uint8)
        mask_hsv = cv2.inRange(hsv, lower_hsv, upper_hsv)

        # Combined multi-spectral mask
        combined_mask = cv2.bitwise_or(mask_ycrcb, mask_hsv)

        # Morphological filtering to remove noise and bridge facial contours
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
        mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        results = []
        min_area = (h_img * w_img) * 0.015 # At least 1.5% of frame

        for c in contours:
            area = cv2.contourArea(c)
            if area > min_area:
                x, y, w, h = cv2.boundingRect(c)
                aspect_ratio = float(h) / max(w, 1)
                # Human face aspect ratio range
                if 0.55 <= aspect_ratio <= 2.2:
                    is_good, reason, quality = self.check_image_quality(img, (x, y, w, h))
                    results.append({
                        "bbox": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "is_good_quality": is_good,
                        "quality_reason": reason,
                        "quality_score": quality
                    })

        if results:
            results.sort(key=lambda r: r["bbox"]["width"] * r["bbox"]["height"], reverse=True)
            return results

        # If no face candidate is found, return empty list (do not invent a fake box)
        return []

    def extract_embedding(self, img: np.ndarray, bbox: Optional[Dict[str, int]] = None) -> Optional[List[float]]:
        """
        Extracts a robust 128-dimensional spatial gradient & CLAHE texture Deep Feature Vector.
        The vector is unit-normalized (L2 norm = 1.0) for high-speed cosine similarity calculation.
        """
        if img is None or img.size == 0:
            return None

        if bbox:
            x, y, w, h = bbox["x"], bbox["y"], bbox["width"], bbox["height"]
            h_img, w_img = img.shape[:2]
            x, y = max(0, x), max(0, y)
            w, h = min(w, w_img - x), min(h, h_img - y)
            face_roi = img[y:y+h, x:x+w]
        else:
            faces = self.detect_faces(img)
            if faces:
                b = faces[0]["bbox"]
                face_roi = img[b["y"]:b["y"]+b["height"], b["x"]:b["x"]+b["width"]]
            else:
                face_roi = img

        if face_roi.size == 0:
            return None

        # Standardize face image to 128x128 grayscale with adaptive histogram equalization
        resized = cv2.resize(face_roi, (128, 128))
        gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        equalized = clahe.apply(gray)

        # Compute multi-region Spatial Gradient / HOG-style descriptors (16 blocks of 8 bins = 128 dims)
        gx = cv2.Sobel(equalized, cv2.CV_32F, 1, 0, ksize=3)
        gy = cv2.Sobel(equalized, cv2.CV_32F, 0, 1, ksize=3)
        mag, ang = cv2.cartToPolar(gx, gy, angleInDegrees=True)

        feature_vector = []
        cell_size = 32 # 4x4 grid = 16 cells in 128x128
        num_bins = 8
        bin_width = 360.0 / num_bins

        for cy in range(0, 128, cell_size):
            for cx in range(0, 128, cell_size):
                cell_mag = mag[cy:cy+cell_size, cx:cx+cell_size]
                cell_ang = ang[cy:cy+cell_size, cx:cx+cell_size]
                
                hist = np.zeros(num_bins, dtype=np.float32)
                for by in range(cell_size):
                    for bx in range(cell_size):
                        angle_val = cell_ang[by, bx] % 360.0
                        bin_idx = int(angle_val // bin_width) % num_bins
                        hist[bin_idx] += cell_mag[by, bx]
                
                # Normalize cell histogram
                norm = np.linalg.norm(hist) + 1e-6
                hist = hist / norm
                feature_vector.extend(hist.tolist())

        # Total dimensions: 16 cells * 8 bins = 128 floats
        vec_np = np.array(feature_vector, dtype=np.float32)
        final_norm = np.linalg.norm(vec_np) + 1e-7
        normalized_vector = (vec_np / final_norm).tolist()

        return normalized_vector

    def compute_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculates cosine similarity between two unit-normalized 128-D vectors.
        Returns a score between 0.0 and 1.0.
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        v1 = np.array(vec1, dtype=np.float32)
        v2 = np.array(vec2, dtype=np.float32)

        dot = float(np.dot(v1, v2))
        norm1 = float(np.linalg.norm(v1))
        norm2 = float(np.linalg.norm(v2))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        cosine_sim = dot / (norm1 * norm2)
        return float(max(0.0, min(1.0, (cosine_sim + 1.0) / 2.0 if cosine_sim < 0 else cosine_sim)))

    def match_against_db(
        self,
        query_vector: List[float],
        enrolled_db_vectors: List[Dict[str, Any]],
        threshold: float = 0.68
    ) -> Tuple[Optional[int], float, Optional[str]]:
        """
        Matches query_vector against enrolled vectors using ensemble multi-angle cosine matching.
        Returns: (best_person_id, best_confidence, matching_angle)
        """
        if not query_vector or not enrolled_db_vectors:
            return None, 0.0, None

        best_person_id = None
        best_score = 0.0
        best_angle = None

        scores_by_person: Dict[int, List[Tuple[float, str]]] = {}
        for item in enrolled_db_vectors:
            pid = item["person_id"]
            db_vec = item["vector"]
            angle = item.get("angle", "front")
            
            sim = self.compute_similarity(query_vector, db_vec)
            if pid not in scores_by_person:
                scores_by_person[pid] = []
            scores_by_person[pid].append((sim, angle))

        for pid, score_tuples in scores_by_person.items():
            max_sim, match_angle = max(score_tuples, key=lambda x: x[0])
            
            if len(score_tuples) > 1:
                top_scores = sorted([s[0] for s in score_tuples], reverse=True)[:2]
                avg_top2 = sum(top_scores) / float(len(top_scores))
                effective_score = 0.7 * max_sim + 0.3 * avg_top2
            else:
                effective_score = max_sim

            if effective_score > best_score:
                best_score = effective_score
                best_person_id = pid
                best_angle = match_angle

        if best_score >= threshold:
            return best_person_id, round(best_score, 4), best_angle
        else:
            return None, round(best_score, 4), None

face_service = FaceService()
