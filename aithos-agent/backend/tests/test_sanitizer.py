"""Tests for PrivacySanitizer."""
from backend.app.privacy.sanitizer import PrivacySanitizer


def test_sanitizer_masks_entities():
    sanitizer = PrivacySanitizer()
    raw = "User email is test.user@gmail.com and PAN is ABCDE1234F."
    res = sanitizer.sanitize(raw)

    assert "test.user@gmail.com" not in res.sanitized_text
    assert "ABCDE1234F" not in res.sanitized_text
    assert "<EMAIL_1>" in res.sanitized_text
    assert "<GOVERNMENT_ID_1>" in res.sanitized_text
    assert res.total_entities_masked == 2


def test_sanitizer_preserves_privacy_in_audit_summary():
    sanitizer = PrivacySanitizer()
    raw = "Contact Alice at alice@finance.com and phone +1 (555) 019-2831."
    res = sanitizer.sanitize(raw)
    summary = res.to_safe_audit_summary()

    summary_str = str(summary)
    assert "alice@finance.com" not in summary_str
    assert "555" not in summary_str
    assert summary["total_entities_masked"] >= 1
    assert "checksum" in summary


def test_repeated_values_share_placeholder():
    sanitizer = PrivacySanitizer()
    raw = "Send to bob@work.com. I repeat, write to bob@work.com."
    res = sanitizer.sanitize(raw)

    assert res.sanitized_text.count("<EMAIL_1>") == 2
    assert "<EMAIL_2>" not in res.sanitized_text


def test_local_restoration():
    sanitizer = PrivacySanitizer()
    raw = "Alert user at contact@bank.com."
    res = sanitizer.sanitize(raw)

    # In local memory only:
    restored = sanitizer.restore_placeholders(res.sanitized_text, res.placeholder_map)
    assert restored == raw
