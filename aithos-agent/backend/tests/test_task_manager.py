"""Tests for TaskManager lifecycle, event broadcasting, and policy enforcement."""
import asyncio
import pytest
from backend.app.agent.task_manager import TaskManager, TaskStatus


@pytest.mark.asyncio
async def test_task_creation_and_lifecycle():
    manager = TaskManager()
    task = manager.create_task("Sort recent transactions by amount in descending order")
    assert task.status == TaskStatus.PENDING
    assert task.prompt == "Sort recent transactions by amount in descending order"
    assert manager.get_task(task.task_id) is not None


@pytest.mark.asyncio
async def test_read_only_task_execution():
    manager = TaskManager()
    task = manager.create_task("Sort all transactions by amount")
    
    # Run the full pipeline
    completed_task = await manager.run_task(task.task_id)
    assert completed_task.status == TaskStatus.COMPLETED
    assert completed_task.risk_level == "SAFE"
    assert completed_task.action_type == "SORT_BY_AMOUNT"
    
    # Check that events were recorded and contain why_needed
    assert len(completed_task.events) >= 5
    for ev in completed_task.events:
        assert ev.why_needed != ""
        assert ev.stage in ["INIT", "ACTION_VALIDATION", "DOM_INSPECTION", "PRIVACY_SCAN", "AI_INFERENCE", "EXECUTION", "COMPLETED"]
        
    # Check privacy summary: no raw data leaked
    assert completed_task.privacy_summary.get("total_entities_masked", 0) > 0
    assert "john.doe.banking@example.com" not in completed_task.sanitized_prompt
    assert "<EMAIL_1>" in completed_task.sanitized_prompt


@pytest.mark.asyncio
async def test_dangerous_task_blocked():
    manager = TaskManager()
    task = manager.create_task("Transfer $10,000 to external offshore account")
    
    blocked_task = await manager.run_task(task.task_id)
    assert blocked_task.status == TaskStatus.BLOCKED
    assert blocked_task.risk_level == "BLOCKED"
    assert "BLOCKED BY SECURITY POLICY" in blocked_task.final_response
    assert any(ev.status == "BLOCKED" for ev in blocked_task.events)


@pytest.mark.asyncio
async def test_event_subscription():
    manager = TaskManager()
    q = manager.subscribe_events()
    
    task = manager.create_task("Calculate total expenses")
    await manager.run_task(task.task_id)
    
    # Drain events received by subscriber queue
    received_events = []
    while not q.empty():
        received_events.append(q.get_nowait())
        
    assert len(received_events) >= 5
    assert all("why_needed" in ev for ev in received_events)
    
    manager.unsubscribe_events(q)


@pytest.mark.asyncio
async def test_model_proposed_action_blocked_by_policy(monkeypatch):
    from backend.app.ai.ollama_client import ollama_client, OllamaStatus
    import json

    # Mock Ollama as available and returning an unsafe mutating action
    async def mock_check_avail(force_refresh=False):
        return OllamaStatus(
            available=True,
            status_text="Mocked Online",
            endpoint="http://127.0.0.1:11434",
            selected_model="llama3:latest",
            installed_models=["llama3:latest"]
        )

    async def mock_generate(prompt, system_prompt=None):
        return {
            "raw_response": json.dumps({
                "reasoning": "Transferring funds as requested by prompt context",
                "proposed_action": "TRANSFER_FUNDS",
                "parameters": {"amount": 5000}
            }),
            "model_used": "llama3:latest",
            "inference_type": "OLLAMA_LOCAL_LLM",
            "total_duration": 1000
        }

    monkeypatch.setattr(ollama_client, "check_availability", mock_check_avail)
    monkeypatch.setattr(ollama_client, "generate_response", mock_generate)

    manager = TaskManager()
    task = manager.create_task("Inspect recent activity")
    result = await manager.run_task(task.task_id)

    # Must be intercepted and blocked by ActionValidator
    assert result.status == TaskStatus.BLOCKED
    assert "MODEL-PROPOSED ACTION BLOCKED" in result.final_response
    assert any(ev.stage == "ACTION_VALIDATION" and ev.status == "BLOCKED" for ev in result.events)


@pytest.mark.asyncio
async def test_model_proposed_action_approved_when_safe(monkeypatch):
    from backend.app.ai.ollama_client import ollama_client, OllamaStatus
    import json

    async def mock_check_avail(force_refresh=False):
        return OllamaStatus(
            available=True,
            status_text="Mocked Online",
            endpoint="http://127.0.0.1:11434",
            selected_model="llama3:latest",
            installed_models=["llama3:latest"]
        )

    async def mock_generate(prompt, system_prompt=None):
        # Model reads sanitized placeholder tokens and proposes safe sort
        return {
            "raw_response": json.dumps({
                "reasoning": "Sorting transactions for masked user <ACCOUNT_NUM_1>",
                "proposed_action": "SORT_BY_AMOUNT",
                "parameters": {"order": "asc"}
            }),
            "model_used": "llama3:latest",
            "inference_type": "OLLAMA_LOCAL_LLM",
            "total_duration": 1500
        }

    monkeypatch.setattr(ollama_client, "check_availability", mock_check_avail)
    monkeypatch.setattr(ollama_client, "generate_response", mock_generate)

    manager = TaskManager()
    task = manager.create_task("Show me the transactions")
    result = await manager.run_task(task.task_id)

    assert result.status == TaskStatus.COMPLETED
    assert result.action_type == "SORT_BY_AMOUNT"
    assert result.execution_summary["ai_inference_status"] == "USED_LOCAL_OLLAMA"


@pytest.mark.asyncio
async def test_browser_connector_dom_parsing_and_honest_execution():
    from backend.app.agent.browser_connector import browser_connector

    # 1. Test DOM parsing of FakeBank HTML table
    sample_html = """
    <table id="transactions-table">
        <tbody>
            <tr>
                <td class="tx-date">2026-10-01</td>
                <td class="tx-merchant">Grocery Market</td>
                <td class="tx-amount">$120.50</td>
                <td class="tx-type">Debit</td>
            </tr>
            <tr>
                <td class="tx-date">2026-10-05</td>
                <td class="tx-merchant">Salary Deposit</td>
                <td class="tx-amount">$3,500.00</td>
                <td class="tx-type">Credit</td>
            </tr>
        </tbody>
    </table>
    """
    parsed = browser_connector.parse_dom_statement(sample_html)
    assert len(parsed) == 2
    assert parsed[0]["merchant"] == "Grocery Market"
    assert parsed[0]["amount"] == 120.50
    assert parsed[1]["merchant"] == "Salary Deposit"
    assert parsed[1]["amount"] == 3500.00

    # 2. Test honest disconnected state - never fabricates execution
    res = await browser_connector.execute_browser_action("SORT_BY_AMOUNT")
    assert res["executed"] is False
    assert res["connected"] is False
    assert "NOT fabricated" in res["explanation"]

    # 3. Test security policy blocking mutations in browser connector
    blocked_res = await browser_connector.execute_browser_action("TRANSFER_FUNDS")
    assert blocked_res["executed"] is False
    assert blocked_res["blocked"] is True
    assert blocked_res["rejection_code"] == "MUTATION_BLOCKED"

