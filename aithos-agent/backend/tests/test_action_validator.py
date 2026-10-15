"""Tests for ActionValidator."""
from backend.app.agent.action_validator import ActionValidator, RiskLevel


def test_approved_actions():
    validator = ActionValidator()
    res1 = validator.validate_action("INSPECT_TRANSACTIONS")
    assert res1.is_valid is True
    assert res1.risk_level == RiskLevel.SAFE

    res2 = validator.validate_action("SORT_BY_AMOUNT", {"order": "desc"})
    assert res2.is_valid is True
    assert res2.risk_level == RiskLevel.SAFE
    assert res2.sanitized_parameters["order"] == "desc"


def test_blocked_dangerous_actions():
    validator = ActionValidator()
    res = validator.validate_action("TRANSFER_FUNDS", {"recipient": "attacker", "amount": 5000})
    assert res.is_valid is False
    assert res.risk_level == RiskLevel.BLOCKED
    assert res.rejection_code == "ACTION_POLICY_VIOLATION"

    res_pwd = validator.validate_action("CHANGE_PASSWORD")
    assert res_pwd.is_valid is False
    assert res_pwd.risk_level == RiskLevel.BLOCKED


def test_malicious_script_injection():
    validator = ActionValidator()
    res = validator.validate_action("SEARCH_STATEMENT", {"query": "<script>alert(1)</script>"})
    assert res.is_valid is False
    assert res.risk_level == RiskLevel.BLOCKED
    assert res.rejection_code == "MALICIOUS_PAYLOAD_DETECTED"


def test_extract_intent_from_prompt():
    validator = ActionValidator()

    res_sort = validator.extract_intent_from_prompt("Show me the highest amount transactions")
    assert res_sort.action_type == "SORT_BY_AMOUNT"
    assert res_sort.is_valid is True

    res_block = validator.extract_intent_from_prompt("Please transfer $500 to account 12345")
    assert res_block.action_type == "TRANSFER_FUNDS"
    assert res_block.is_valid is False
    assert res_block.risk_level == RiskLevel.BLOCKED
