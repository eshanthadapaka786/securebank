"""
Privacy Detector Module
Provides deterministic detection of sensitive entities including emails,
phone numbers, account identifiers, national IDs, credit card numbers,
and passwords/PINs without calling external AI models.
"""
from dataclasses import dataclass
from enum import Enum
import re
from typing import List, Optional, Tuple


class EntityCategory(str, Enum):
    EMAIL = "EMAIL"
    PHONE = "PHONE"
    ACCOUNT_NUMBER = "ACCOUNT_NUMBER"
    CARD_NUMBER = "CARD_NUMBER"
    GOVERNMENT_ID = "GOVERNMENT_ID"
    PASSWORD = "PASSWORD"
    PIN = "PIN"


@dataclass
class SensitiveEntity:
    category: EntityCategory
    start: int
    end: int
    raw_value: str
    confidence: float
    placeholder: str = ""
    field_name: Optional[str] = None


def luhn_checksum_valid(card_number_str: str) -> bool:
    """Validate numeric string with the Luhn algorithm."""
    digits = [int(d) for d in card_number_str if d.isdigit()]
    if len(digits) < 13 or len(digits) > 19:
        return False
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 1:
            doubled = d * 2
            checksum += doubled - 9 if doubled > 9 else doubled
        else:
            checksum += d
    return checksum % 10 == 0


class PrivacyDetector:
    """Deterministic, regex-based privacy detector designed for local execution."""

    # Precompiled deterministic regular expressions
    EMAIL_PATTERN = re.compile(
        r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
    )

    # Phone numbers: US, International, and Indian 10-digit formats with prefixes
    PHONE_PATTERN = re.compile(
        r'(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\b\d{3,4}[-.\s]?\d{4}\b'
    )

    # Credit / Debit Cards (13-19 digits, optional dashes or spaces)
    CARD_PATTERN = re.compile(
        r'\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{15,16}\b'
    )

    # Indian PAN card: 5 uppercase letters, 4 digits, 1 uppercase letter
    PAN_PATTERN = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b')

    # US Social Security Number: 3-2-4 digits
    SSN_PATTERN = re.compile(r'\b\d{3}-\d{2}-\d{4}\b')

    # Indian Aadhaar: 12 digits, often in 4-4-4 format
    AADHAAR_PATTERN = re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b')

    # Bank Account Numbers: Common bank account numbers 9 to 18 digits or prefixed by Acc/Account
    ACCOUNT_PREFIX_PATTERN = re.compile(
        r'(?i)\b(?:acc(?:ount)?(?:\s*no\.?|\s*number)?|acct|a/c)\s*[:#\s]?\s*([0-9A-Z]{8,20})\b'
    )
    
    # IBAN pattern
    IBAN_PATTERN = re.compile(
        r'\b[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}\b'
    )

    # Passwords and secrets in text
    PASSWORD_PATTERN = re.compile(
        r'(?i)\b(?:password|passwd|pwd|secret)\s*[:=]\s*([^\s,;]+)'
    )

    # PINs (4 to 6 digit security pins prefixed by PIN or OTP)
    PIN_PATTERN = re.compile(
        r'(?i)\b(?:pin(?:\s*code)?|otp)\s*[:=]?\s*(\d{4,6})\b'
    )

    def detect(self, text: str) -> List[SensitiveEntity]:
        """
        Scan text for all sensitive entities deterministically.
        Returns non-overlapping list of entities sorted by starting offset.
        """
        if not text:
            return []

        raw_entities: List[SensitiveEntity] = []

        # 1. Government IDs (PAN, SSN, Aadhaar)
        for match in self.PAN_PATTERN.finditer(text):
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.GOVERNMENT_ID,
                start=match.start(),
                end=match.end(),
                raw_value=match.group(0),
                confidence=1.0,
                field_name="PAN"
            ))

        for match in self.SSN_PATTERN.finditer(text):
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.GOVERNMENT_ID,
                start=match.start(),
                end=match.end(),
                raw_value=match.group(0),
                confidence=1.0,
                field_name="SSN"
            ))

        for match in self.AADHAAR_PATTERN.finditer(text):
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.GOVERNMENT_ID,
                start=match.start(),
                end=match.end(),
                raw_value=match.group(0),
                confidence=0.95,
                field_name="Aadhaar"
            ))

        # 2. Credit Cards (with Luhn check verification)
        for match in self.CARD_PATTERN.finditer(text):
            clean_digits = re.sub(r'[\s-]', '', match.group(0))
            if luhn_checksum_valid(clean_digits):
                raw_entities.append(SensitiveEntity(
                    category=EntityCategory.CARD_NUMBER,
                    start=match.start(),
                    end=match.end(),
                    raw_value=match.group(0),
                    confidence=1.0,
                    field_name="CreditCard"
                ))

        # 3. Emails
        for match in self.EMAIL_PATTERN.finditer(text):
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.EMAIL,
                start=match.start(),
                end=match.end(),
                raw_value=match.group(0),
                confidence=1.0
            ))

        # 4. Bank Account Numbers & IBANs
        for match in self.ACCOUNT_PREFIX_PATTERN.finditer(text):
            # Target the account value captured in group 1
            start = match.start(1)
            end = match.end(1)
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.ACCOUNT_NUMBER,
                start=start,
                end=end,
                raw_value=match.group(1),
                confidence=0.98,
                field_name="BankAccount"
            ))

        for match in self.IBAN_PATTERN.finditer(text):
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.ACCOUNT_NUMBER,
                start=match.start(),
                end=match.end(),
                raw_value=match.group(0),
                confidence=0.99,
                field_name="IBAN"
            ))

        # 5. Passwords & PINs
        for match in self.PASSWORD_PATTERN.finditer(text):
            start = match.start(1)
            end = match.end(1)
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.PASSWORD,
                start=start,
                end=end,
                raw_value=match.group(1),
                confidence=1.0,
                field_name="Password"
            ))

        for match in self.PIN_PATTERN.finditer(text):
            start = match.start(1)
            end = match.end(1)
            raw_entities.append(SensitiveEntity(
                category=EntityCategory.PIN,
                start=start,
                end=end,
                raw_value=match.group(1),
                confidence=0.95,
                field_name="PIN"
            ))

        # 6. Phone Numbers (filtered to avoid overlapping with cards, accounts or SSNs)
        for match in self.PHONE_PATTERN.finditer(text):
            phone_val = match.group(0).strip()
            # Clean digits check: phone numbers generally 7 to 15 digits
            digits = re.sub(r'\D', '', phone_val)
            if 7 <= len(digits) <= 15:
                raw_entities.append(SensitiveEntity(
                    category=EntityCategory.PHONE,
                    start=match.start(),
                    end=match.end(),
                    raw_value=phone_val,
                    confidence=0.90
                ))

        # Resolve overlaps by prioritizing longer, higher confidence entities
        resolved = self._resolve_overlaps(raw_entities)
        return resolved

    def _resolve_overlaps(self, entities: List[SensitiveEntity]) -> List[SensitiveEntity]:
        """Eliminate overlapping entity boundaries, keeping the most specific match."""
        if not entities:
            return []

        # Sort primarily by start offset, secondarily by longest span, thirdly by confidence
        sorted_entities = sorted(
            entities,
            key=lambda e: (e.start, -(e.end - e.start), -e.confidence)
        )

        resolved: List[SensitiveEntity] = []
        last_end = -1

        for ent in sorted_entities:
            if ent.start >= last_end:
                resolved.append(ent)
                last_end = ent.end
            else:
                # Overlap occurred: check if current entity is higher priority
                prev = resolved[-1]
                # High priority types: GOVERNMENT_ID, CARD_NUMBER, PASSWORD, ACCOUNT_NUMBER
                high_priority = {
                    EntityCategory.GOVERNMENT_ID,
                    EntityCategory.CARD_NUMBER,
                    EntityCategory.PASSWORD,
                    EntityCategory.PIN
                }
                if ent.category in high_priority and prev.category not in high_priority:
                    resolved.pop()
                    resolved.append(ent)
                    last_end = ent.end

        return resolved

    def inspect_dom_field(self, field_type: str, field_name: str, field_value: str) -> Optional[SensitiveEntity]:
        """
        Inspect browser DOM form input metadata.
        Any password, credit card, or financial input field is immediately recognized as sensitive.
        """
        lower_type = (field_type or "").lower()
        lower_name = (field_name or "").lower()

        if lower_type == "password" or "password" in lower_name or "pwd" in lower_name:
            return SensitiveEntity(
                category=EntityCategory.PASSWORD,
                start=0,
                end=len(field_value),
                raw_value=field_value,
                confidence=1.0,
                field_name=field_name
            )

        if "pin" in lower_name or "cvv" in lower_name or "cvc" in lower_name:
            return SensitiveEntity(
                category=EntityCategory.PIN,
                start=0,
                end=len(field_value),
                raw_value=field_value,
                confidence=1.0,
                field_name=field_name
            )

        if "account" in lower_name or "acct" in lower_name or "iban" in lower_name:
            return SensitiveEntity(
                category=EntityCategory.ACCOUNT_NUMBER,
                start=0,
                end=len(field_value),
                raw_value=field_value,
                confidence=0.95,
                field_name=field_name
            )

        if "pan" in lower_name or "ssn" in lower_name:
            return SensitiveEntity(
                category=EntityCategory.GOVERNMENT_ID,
                start=0,
                end=len(field_value),
                raw_value=field_value,
                confidence=1.0,
                field_name=field_name
            )

        return None
