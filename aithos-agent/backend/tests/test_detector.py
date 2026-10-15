"""Tests for PrivacyDetector."""
from backend.app.privacy.detector import PrivacyDetector, EntityCategory, luhn_checksum_valid


def test_luhn_algorithm():
    # Valid 16-digit test card number
    assert luhn_checksum_valid("4532000000001007") is True
    # Invalid card number
    assert luhn_checksum_valid("4532759812345678") is False
    # Length < 13
    assert luhn_checksum_valid("1234") is False
    assert luhn_checksum_valid("abcdefgh") is False


def test_detect_emails():
    detector = PrivacyDetector()
    text = "Please reach out to support@aithos.ai or security.lead@corp-test.org for details."
    entities = detector.detect(text)
    emails = [e for e in entities if e.category == EntityCategory.EMAIL]
    assert len(emails) == 2
    assert "support@aithos.ai" in [e.raw_value for e in emails]
    assert "security.lead@corp-test.org" in [e.raw_value for e in emails]


def test_detect_phone_numbers():
    detector = PrivacyDetector()
    text = "Call us at +1 (555) 234-5678 or 9876543210 immediately."
    entities = detector.detect(text)
    phones = [e for e in entities if e.category == EntityCategory.PHONE]
    assert len(phones) >= 1


def test_detect_government_ids():
    detector = PrivacyDetector()
    text = "Client PAN: ABCDE1234F and SSN: 123-45-6789."
    entities = detector.detect(text)
    pan_ent = [e for e in entities if e.field_name == "PAN"]
    ssn_ent = [e for e in entities if e.field_name == "SSN"]
    assert len(pan_ent) == 1
    assert pan_ent[0].raw_value == "ABCDE1234F"
    assert len(ssn_ent) == 1
    assert ssn_ent[0].raw_value == "123-45-6789"


def test_detect_account_numbers():
    detector = PrivacyDetector()
    text = "Transfer to Acc No: 981248901235 and verify."
    entities = detector.detect(text)
    accs = [e for e in entities if e.category == EntityCategory.ACCOUNT_NUMBER]
    assert len(accs) == 1
    assert accs[0].raw_value == "981248901235"


def test_detect_passwords_and_pins():
    detector = PrivacyDetector()
    text = "Your password: SecretKey99! and OTP: 849201."
    entities = detector.detect(text)
    pwds = [e for e in entities if e.category == EntityCategory.PASSWORD]
    pins = [e for e in entities if e.category == EntityCategory.PIN]
    assert len(pwds) == 1
    assert pwds[0].raw_value == "SecretKey99!"
    assert len(pins) == 1
    assert pins[0].raw_value == "849201"


def test_inspect_dom_field():
    detector = PrivacyDetector()
    entity = detector.inspect_dom_field("password", "user_password", "MyP@ssw0rd")
    assert entity is not None
    assert entity.category == EntityCategory.PASSWORD

    pin_entity = detector.inspect_dom_field("text", "account_pin", "4491")
    assert pin_entity is not None
    assert pin_entity.category == EntityCategory.PIN
