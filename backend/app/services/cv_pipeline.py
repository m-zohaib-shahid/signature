"""
Computer Vision Document Preprocessing Pipeline
Provides OpenCV-based auto-deskewing (minAreaRect and Hough transform fallback),
adaptive binarization, and morphological contour noise filtering for document and signature crops.
"""
from typing import Tuple, Dict, Any
import cv2
import numpy as np


class DocumentCVPipeline:
    """Production-grade CV preprocessing pipeline for legal/financial documents."""

    def __init__(self, max_skew_angle: float = 45.0, min_contour_area: float = 20.0):
        self.max_skew_angle = max_skew_angle
        self.min_contour_area = min_contour_area

    def compute_skew_min_area_rect(self, gray: np.ndarray) -> float:
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (25, 3))
        dilated = cv2.dilate(thresh, kernel, iterations=2)

        coords = np.column_stack(np.where(dilated > 0))
        if len(coords) < 100:
            return 0.0

        rect = cv2.minAreaRect(coords)
        angle = rect[-1]

        if angle < -45.0:
            angle = -(90.0 + angle)
        else:
            angle = -angle

        if abs(angle) > self.max_skew_angle:
            return 0.0

        return float(angle)

    def compute_skew_hough_lines(self, gray: np.ndarray) -> float:
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi / 180,
            threshold=100,
            minLineLength=100,
            maxLineGap=20
        )

        if lines is None or len(lines) == 0:
            return 0.0

        angles = []
        for line in lines:
            x1, y1, x2, y2 = line[0]
            if x2 - x1 == 0:
                continue
            deg = np.degrees(np.arctan2(y2 - y1, x2 - x1))
            if -self.max_skew_angle <= deg <= self.max_skew_angle:
                angles.append(deg)

        if not angles:
            return 0.0

        return float(np.median(angles))

    def deskew_image(self, image: np.ndarray) -> Tuple[np.ndarray, float]:
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()

        angle = self.compute_skew_min_area_rect(gray)
        if abs(angle) < 0.2:
            hough_angle = self.compute_skew_hough_lines(gray)
            if abs(hough_angle) >= 0.2:
                angle = hough_angle

        if abs(angle) < 0.15:
            return image, 0.0

        h, w = image.shape[:2]
        center = (w // 2, h // 2)

        rot_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
        cos = np.abs(rot_matrix[0, 0])
        sin = np.abs(rot_matrix[0, 1])
        new_w = int((h * sin) + (w * cos))
        new_h = int((h * cos) + (w * sin))

        rot_matrix[0, 2] += (new_w / 2) - center[0]
        rot_matrix[1, 2] += (new_h / 2) - center[1]

        deskewed = cv2.warpAffine(
            image,
            rot_matrix,
            (new_w, new_h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )

        return deskewed, round(angle, 3)

    def filter_contour_noise(self, signature_crop: np.ndarray) -> np.ndarray:
        if len(signature_crop.shape) == 3:
            gray = cv2.cvtColor(signature_crop, cv2.COLOR_BGR2GRAY)
        else:
            gray = signature_crop.copy()

        binary = cv2.adaptiveThreshold(
            gray,
            255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            blockSize=15,
            C=8
        )

        contours, _ = cv2.findContours(
            binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        cleaned_mask = np.zeros_like(binary)

        for cnt in contours:
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, True)
            if area >= self.min_contour_area or perimeter > 25:
                cv2.drawContours(cleaned_mask, [cnt], -1, 255, -1)

        cleaned_crop = np.full_like(gray, 255)
        cleaned_crop[cleaned_mask == 255] = gray[cleaned_mask == 255]

        if len(signature_crop.shape) == 3:
            return cv2.cvtColor(cleaned_crop, cv2.COLOR_GRAY2BGR)
        return cleaned_crop

    def preprocess_document(self, image: np.ndarray) -> Dict[str, Any]:
        deskewed, detected_angle = self.deskew_image(image)
        return {
            "processed_image": deskewed,
            "skew_angle_deg": detected_angle,
            "original_shape": image.shape[:2],
            "deskewed_shape": deskewed.shape[:2]
        }