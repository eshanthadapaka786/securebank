"""
Privacy Sanitizer Module
Replaces detected sensitive entities with safe, structured placeholders (<EMAIL_1>, <ACCOUNT_NUM_1>, etc.)
Produces clean, model-safe text while maintaining an isolated, in-memory de-anonymization map
for local device execution without leaking raw sensitive strings into logs or AI prompts.
"""
from dataclasses import dataclass, field
import hashlib
from typing import Dict, List, Optional
from .detector import PrivacyDetector, SensitiveEntity, EntityCategory


@dataclass
class SanitizationResult:
    sanitized_text: str
    detection_counts: Dict[str, int]
    total_entities_masked: int
    placeholder_map: Dict[str, str] = field(default_factory=dict)  # placeholder -> raw_value (memory only)
    checksum: str = ""
    safe_metadata: List[Dict[str, str]] = field(default_factory=list)  # safe items for logging (no raw values)

    def to_safe_audit_summary(self) -> dict:
        """Produce a safe dictionary suitable for audit logging with ZERO raw values."""
        return {
            "total_entities_masked": self.total_entities_masked,
            "detection_counts": self.detection_counts,
            "checksum": self.checksum,
            "masked_placeholders": list(self.placeholder_map.keys()),
            "categories_detected": list(self.detection_counts.keys()),
        }


class PrivacySanitizer:
    """Manages sanitization and token replacement for AITHOS agent."""

    # Map category to readable placeholder prefix
    CATEGORY_PREFIXES = {
        EntityCategory.EMAIL: "EMAIL",
        EntityCategory.PHONE: "PHONE_NUMBER",
        EntityCategory.ACCOUNT_NUMBER: "ACCOUNT_NUM",
        EntityCategory.CARD_NUMBER: "PAYMENT_CARD",
        EntityCategory.GOVERNMENT_ID: "GOVERNMENT_ID",
        EntityCategory.PASSWORD: "AUTH_CREDENTIAL",
        EntityCategory.PIN: "SECURITY_PIN",
    }

    def __init__(self, detector: Optional[PrivacyDetector] = None):
        self.detector = detector or PrivacyDetector()

    def sanitize(self, text: str) -> SanitizationResult:
        """
        Scan text, detect sensitive entities, and replace them with indexed placeholders.
        Guarantees that raw values are NOT exposed in returned safe_metadata.
        """
        if not text:
            return SanitizationResult(
                sanitized_text="",
                detection_counts={},
                total_entities_masked=0,
                placeholder_map={},
                checksum=hashlib.sha256(b"").hexdigest(),
                safe_metadata=[]
            )

        entities = self.detector.detect(text)

        category_counters: Dict[str, int] = {}
        placeholder_to_raw: Dict[str, str] = {}
        raw_to_placeholder: Dict[str, str] = {}
        safe_metadata: List[Dict[str, str]] = []

        # Sort entities backwards by start index so string replacement offsets stay valid
        entities_sorted = sorted(entities, key=lambda e: e.start, reverse=True)

        sanitized_chars = list(text)

        for ent in entities_sorted:
            # Check if this raw value was already mapped to a placeholder to ensure consistency
            if ent.raw_value in raw_to_placeholder:
                placeholder = raw_to_placeholder[ent.raw_value]
            else:
                prefix = self.CATEGORY_PREFIXES.get(ent.category, "SENSITIVE_DATA")
                cat_name = ent.category.value
                category_counters[cat_name] = category_counters.get(cat_name, 0) + 1
                index = category_counters[cat_name]
                placeholder = f"<{prefix}_{index}>"
                raw_to_placeholder[ent.raw_value] = placeholder
                placeholder_to_raw[placeholder] = ent.raw_value

            ent.placeholder = placeholder

            # Replace the slice in text
            sanitized_chars[ent.start:ent.end] = list(placeholder)

            # Record safe metadata without raw value
            safe_metadata.append({
                "placeholder": placeholder,
                "category": ent.category.value,
                "confidence": f"{ent.confidence:.2f}",
                "field_name": ent.field_name or "text_match",
            })

        sanitized_text = "".join(sanitized_chars)

        # Reverse safe_metadata so it follows original text order
        safe_metadata.reverse()

        # Compute safe SHA256 checksum of the sanitized payload
        checksum = hashlib.sha256(sanitized_text.encode("utf-8")).hexdigest()

        return SanitizationResult(
            sanitized_text=sanitized_text,
            detection_counts=category_counters,
            total_entities_masked=len(entities),
            placeholder_map=placeholder_to_raw,
            checksum=checksum,
            safe_metadata=safe_metadata,
        )

    def restore_placeholders(self, text: str, placeholder_map: Dict[str, str]) -> str:
        """
        Locally de-anonymize / restore placeholders into raw values on the local device only
        (e.g., when populating a validated local browser field without transmitting to AI).
        """
        restored = text
        for placeholder, raw in placeholder_map.items():
            restored = restored.replace(placeholder, raw)
        return restored
