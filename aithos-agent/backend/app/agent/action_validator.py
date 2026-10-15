"""
Action Validator Module
Enforces strict policy-based validation on all proposed agent actions.
Only permits approved, read-only banking operations. Rejects state mutations,
funds transfers, arbitrary scripts, and unknown commands.
"""
from dataclasses import dataclass, field
from enum import Enum
import re
from typing import Any, Dict, List, Optional


class RiskLevel(str, Enum):
    SAFE = "SAFE"
    BLOCKED = "BLOCKED"
    SUSPICIOUS = "SUSPICIOUS"


@dataclass
class ValidationResult:
    is_valid: bool
    action_type: str
    risk_level: RiskLevel
    reason: str
    sanitized_parameters: Dict[str, Any] = field(default_factory=dict)
    rejection_code: Optional[str] = None


class ActionValidator:
    """Security boundary validator for agent actions."""

    # Explicit whitelist of approved read-only operations
    APPROVED_ACTIONS = {
        "INSPECT_TRANSACTIONS": "Read recent transactions from statement",
        "FILTER_BY_DATE": "Filter transactions within specific start and end dates",
        "SORT_BY_AMOUNT": "Sort transactions in ascending or descending order of value",
        "CALCULATE_SUMMARY": "Aggregate spending, income, or category totals",
        "SEARCH_STATEMENT": "Search for specific merchant names or references in statement",
        "EXPORT_READONLY_REPORT": "Export read-only summary for user inspection",
    }

    # Explicit blacklist of prohibited operations
    DISALLOWED_ACTIONS = {
        "TRANSFER_FUNDS": "Fund transfers are prohibited under read-only policy",
        "SEND_MONEY": "Outbound payments are strictly blocked",
        "CHANGE_PASSWORD": "Authentication credentials cannot be altered by agent",
        "MODIFY_BENEFICIARY": "Adding or editing payees is disallowed",
        "DELETE_ACCOUNT": "Account deletion or modification is prohibited",
        "EXECUTE_SCRIPT": "Arbitrary code or DOM script execution is disallowed",
        "EVAL_EXPRESSION": "Code evaluation is strictly blocked",
    }

    # Dangerous patterns in inputs or parameters
    MALICIOUS_PATTERNS = [
        re.compile(r'(?i)<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>'),
        re.compile(r'(?i)javascript:'),
        re.compile(r'(?i)\b(?:drop\s+table|delete\s+from|insert\s+into|union\s+select)\b'),
        re.compile(r'(?i)\b(?:exec|system|popen|eval|subprocess)\b'),
    ]

    def validate_action(self, action_type: str, parameters: Optional[Dict[str, Any]] = None) -> ValidationResult:
        """
        Validate whether a requested action is permitted under the AITHOS safety policy.
        """
        action_upper = (action_type or "").upper().strip()
        params = parameters or {}

        # 1. Check prohibited actions first
        if action_upper in self.DISALLOWED_ACTIONS:
            return ValidationResult(
                is_valid=False,
                action_type=action_upper,
                risk_level=RiskLevel.BLOCKED,
                reason=f"Action '{action_upper}' is strictly blocked: {self.DISALLOWED_ACTIONS[action_upper]}",
                rejection_code="ACTION_POLICY_VIOLATION",
                sanitized_parameters={}
            )

        # 2. Check if the action is in approved whitelist
        if action_upper not in self.APPROVED_ACTIONS:
            return ValidationResult(
                is_valid=False,
                action_type=action_upper,
                risk_level=RiskLevel.BLOCKED,
                reason=f"Unknown or unsupported action '{action_upper}'. AITHOS only permits verified read-only operations.",
                rejection_code="UNKNOWN_ACTION",
                sanitized_parameters={}
            )

        # 3. Inspect parameter strings for malicious patterns / arbitrary code
        for key, value in params.items():
            if isinstance(value, str):
                for pattern in self.MALICIOUS_PATTERNS:
                    if pattern.search(value):
                        return ValidationResult(
                            is_valid=False,
                            action_type=action_upper,
                            risk_level=RiskLevel.BLOCKED,
                            reason=f"Dangerous payload detected in parameter '{key}'. Execution aborted.",
                            rejection_code="MALICIOUS_PAYLOAD_DETECTED",
                            sanitized_parameters={}
                        )

        # 4. Parameter sanity validation
        sanitized = dict(params)
        if action_upper == "SORT_BY_AMOUNT":
            order = str(params.get("order", "desc")).lower()
            if order not in ["asc", "desc"]:
                order = "desc"
            sanitized["order"] = order

        return ValidationResult(
            is_valid=True,
            action_type=action_upper,
            risk_level=RiskLevel.SAFE,
            reason=f"Action '{action_upper}' verified as safe read-only operation ({self.APPROVED_ACTIONS[action_upper]}).",
            sanitized_parameters=sanitized
        )

    def extract_intent_from_prompt(self, user_prompt: str) -> Tuple_Validation:
        """
        Analyze user's task prompt to determine the intended action and check safety early.
        """
        prompt_lower = (user_prompt or "").lower()

        # Check for transfer / mutation intents
        if any(term in prompt_lower for term in ["transfer", "send money", "pay $", "wire", "remit"]):
            return self.validate_action("TRANSFER_FUNDS", {"user_prompt": user_prompt})

        if any(term in prompt_lower for term in ["change password", "reset password", "change pin"]):
            return self.validate_action("CHANGE_PASSWORD", {"user_prompt": user_prompt})

        if any(term in prompt_lower for term in ["sort", "highest", "lowest", "expensive", "cheapest"]):
            order = "desc" if any(w in prompt_lower for w in ["highest", "largest", "expensive", "desc"]) else "asc"
            return self.validate_action("SORT_BY_AMOUNT", {"order": order})

        if any(term in prompt_lower for term in ["filter", "date", "between", "since", "from", "september", "august"]):
            return self.validate_action("FILTER_BY_DATE", {"user_prompt": user_prompt})

        if any(term in prompt_lower for term in ["summary", "total", "spent", "spending", "calculate"]):
            return self.validate_action("CALCULATE_SUMMARY", {"user_prompt": user_prompt})

        if any(term in prompt_lower for term in ["search", "find", "merchant", "vendor", "uber", "amazon"]):
            return self.validate_action("SEARCH_STATEMENT", {"query": user_prompt})

        # Default safe read-only inspection
        return self.validate_action("INSPECT_TRANSACTIONS", {"user_prompt": user_prompt})


Tuple_Validation = ValidationResult
action_validator = ActionValidator()
