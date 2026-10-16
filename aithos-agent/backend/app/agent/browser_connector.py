"""
Browser Connector Module
Prepares the integration interface for the teammate's FakeBank application.
Maintains honest connection states: starts in 'awaiting integration' until
the teammate's local URL is provided, configured, and tested.
Uses fast TCP pre-probing to prevent latency bottlenecks.
"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
import socket
import time
from typing import Any, Dict, List, Optional
import urllib.parse
import httpx


@dataclass
class BrowserConnectionStatus:
    connected: bool
    status_code: str  # "AWAITING_INTEGRATION", "CONNECTED", "UNREACHABLE", "CONFIGURED", "NOT_CONFIGURED"
    target_url: str
    message: str
    last_checked: str
    latency_ms: Optional[float] = None
    details: Dict[str, Any] = field(default_factory=dict)


def _is_port_open(url: str, timeout: float = 0.15) -> bool:
    """Fast non-blocking TCP socket probe to avoid HTTP client connect timeouts."""
    try:
        parsed = urllib.parse.urlparse(url)
        host = parsed.hostname or "127.0.0.1"
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        if host == "localhost":
            host = "127.0.0.1"
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False


class BrowserConnector:
    """Manages connection and DOM inspection for the external FakeBank target."""

    CANDIDATE_PORTS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]

    def __init__(self, target_url: str = "http://localhost:5173"):
        self.target_url = target_url
        self._cached_status: Optional[BrowserConnectionStatus] = None
        self._cache_time: float = 0.0

    def set_target_url(self, new_url: str):
        """Update target URL configuration and invalidate cache."""
        self.target_url = new_url.strip()
        self._cached_status = None

    async def check_connection(self, force_refresh: bool = False) -> BrowserConnectionStatus:
        """
        Check if the target application (SecureBank / FakeBank) is reachable.
        Honest probe: does not fabricate a connected state.
        Uses fast TCP pre-probing to respond in < 25ms.
        Auto-discovers running port among candidate ports if primary is down.
        """
        now = time.time()
        if not force_refresh and self._cached_status and (now - self._cache_time < 2.5):
            return self._cached_status

        t0 = time.time()
        now_iso = datetime.now(timezone.utc).isoformat()

        if not self.target_url:
            status = BrowserConnectionStatus(
                connected=False,
                status_code="NOT_CONFIGURED",
                target_url="",
                message="No target URL configured. Enter FakeBank local URL in Settings.",
                last_checked=now_iso,
                latency_ms=0.0
            )
            self._cached_status = status
            self._cache_time = now
            return status

        # Step 1: Rapid socket probe on current target URL
        if not _is_port_open(self.target_url, timeout=0.15):
            # Check candidate fallback ports if primary was default
            discovered_url = None
            for candidate in self.CANDIDATE_PORTS:
                if candidate != self.target_url and _is_port_open(candidate, timeout=0.10):
                    discovered_url = candidate
                    break

            if discovered_url:
                self.target_url = discovered_url
            else:
                status = BrowserConnectionStatus(
                    connected=False,
                    status_code="AWAITING_INTEGRATION",
                    target_url=self.target_url,
                    message=f"Awaiting SecureBank integration: service not reachable at {self.target_url}",
                    last_checked=now_iso,
                    latency_ms=(time.time() - t0) * 1000,
                    details={"hint": "Start SecureBank dev server (`npm run dev`) or update URL in Settings"}
                )
                self._cached_status = status
                self._cache_time = now
                return status

        # Step 2: HTTP probe if port is active
        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                resp = await client.get(self.target_url)
                latency = (time.time() - t0) * 1000
                if resp.status_code == 200:
                    status = BrowserConnectionStatus(
                        connected=True,
                        status_code="CONNECTED",
                        target_url=self.target_url,
                        message=f"Connected to FakeBank service at {self.target_url} (HTTP 200)",
                        last_checked=now_iso,
                        latency_ms=latency,
                        details={"content_type": resp.headers.get("content-type", "")}
                    )
                else:
                    status = BrowserConnectionStatus(
                        connected=False,
                        status_code="HTTP_ERROR",
                        target_url=self.target_url,
                        message=f"Target responded with unexpected HTTP {resp.status_code}",
                        last_checked=now_iso,
                        latency_ms=latency
                    )
        except Exception as e:
            status = BrowserConnectionStatus(
                connected=False,
                status_code="UNREACHABLE",
                target_url=self.target_url,
                message=f"Connection probe failed: {str(e)}",
                last_checked=now_iso,
                latency_ms=(time.time() - t0) * 1000
            )

        self._cached_status = status
        self._cache_time = now
        return status

    def get_status(self) -> BrowserConnectionStatus:
        if self._cached_status:
            return self._cached_status
        return BrowserConnectionStatus(
            connected=False,
            status_code="AWAITING_INTEGRATION",
            target_url=self.target_url,
            message="Awaiting teammate's FakeBank URL & DOM integration details",
            last_checked=datetime.now(timezone.utc).isoformat(),
            details={"configured": False}
        )

    async def fetch_page_content(self) -> Dict[str, Any]:
        """
        Attempt to fetch DOM text from the target.
        If target is not running, returns honest diagnostic indicating FakeBank is not yet connected.
        """
        status = await self.check_connection()
        if not status.connected:
            return {
                "success": False,
                "error": "Target web application (FakeBank) is not connected.",
                "details": status.message,
                "source": "EXTERNAL_DOM_PROBE"
            }

        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                resp = await client.get(self.target_url)
                return {
                    "success": True,
                    "html_content": resp.text[:50000],
                    "status_code": resp.status_code,
                    "source": "LIVE_TARGET"
                }
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed reading DOM from target: {str(e)}",
                "source": "EXTERNAL_DOM_PROBE"
            }

    def parse_dom_statement(self, html_content: str) -> List[Dict[str, Any]]:
        """
        Extract structured transaction rows from HTML conforming to SecureBank / FakeBank DOM specification.
        Uses resilient regex/string parsing over table cells and handles both 7-column SecureBank
        and standard 3/4-column statement layouts.
        """
        import re
        transactions: List[Dict[str, Any]] = []
        if not html_content:
            return transactions

        # Find <tr> rows inside tables
        row_matches = re.findall(r'<tr\b[^>]*>(.*?)<\/tr>', html_content, flags=re.DOTALL | re.IGNORECASE)
        for row in row_matches:
            # Extract <td> cell text
            cells = re.findall(r'<td\b[^>]*>(.*?)<\/td>', row, flags=re.DOTALL | re.IGNORECASE)
            if len(cells) >= 3:
                # Strip HTML tags inside cells
                clean_cells = [re.sub(r'<[^>]+>', '', c).strip() for c in cells]
                
                if len(clean_cells) >= 6:
                    # SecureBank layout: [ID, Date, Merchant, Category, Vehicle, Type, Amount]
                    tx_id = clean_cells[0]
                    date_val = clean_cells[1]
                    merchant_val = clean_cells[2]
                    category_val = clean_cells[3]
                    tx_type = clean_cells[5] if len(clean_cells) > 5 else "Debit"
                    raw_amt = clean_cells[-1]
                else:
                    # Standard 3/4 column layout: [Date, Merchant, Amount, (Type)]
                    tx_id = f"tx-{len(transactions) + 1001}"
                    date_val = clean_cells[0]
                    merchant_val = clean_cells[1] if len(clean_cells) > 1 else "Unknown"
                    raw_amt = clean_cells[2] if len(clean_cells) > 2 else "0"
                    category_val = "General"
                    tx_type = clean_cells[3] if len(clean_cells) > 3 else ("Debit" if "debit" in raw_amt.lower() or "-" in raw_amt else "Credit")

                # Extract numeric amount (supports INR ₹ and USD $)
                clean_amt_str = re.sub(r'[^\d.]', '', raw_amt.replace(',', ''))
                try:
                    amount = float(clean_amt_str) if clean_amt_str else 0.0
                except ValueError:
                    amount = 0.0

                transactions.append({
                    "id": tx_id,
                    "date": date_val,
                    "merchant": merchant_val,
                    "category": category_val,
                    "amount": amount,
                    "type": tx_type
                })
        return transactions

    async def execute_browser_action(
        self,
        action_type: str,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute an approved read-only action against the live target page.
        Never fabricates execution when target is disconnected or awaiting integration.
        Rejects mutating actions explicitly.
        """
        params = params or {}
        # Security Boundary: refuse state mutations
        if action_type in ["TRANSFER_FUNDS", "SEND_MONEY", "CHANGE_PASSWORD", "MODIFY_BENEFICIARY"]:
            return {
                "executed": False,
                "connected": False,
                "blocked": True,
                "rejection_code": "MUTATION_BLOCKED",
                "explanation": f"Browser connector strictly prohibits executing mutating action '{action_type}' against target."
            }

        # Check real connectivity
        status = await self.check_connection()
        if not status.connected:
            return {
                "executed": False,
                "connected": False,
                "status_code": status.status_code,
                "target_url": self.target_url,
                "explanation": (
                    f"Browser action '{action_type}' could not be executed on live target: "
                    f"FakeBank is currently unreachable at {self.target_url} ({status.message}). "
                    "Execution was NOT fabricated."
                ),
                "details": {
                    "action": action_type,
                    "target_url": self.target_url,
                    "connected": False
                }
            }

        # Live execution when target is connected
        page_res = await self.fetch_page_content()
        if not page_res.get("success"):
            return {
                "executed": False,
                "connected": True,
                "explanation": f"Connected to {self.target_url} but failed fetching DOM: {page_res.get('error')}",
                "details": page_res
            }

        parsed_txs = self.parse_dom_statement(page_res.get("html_content", ""))
        return {
            "executed": True,
            "connected": True,
            "target_url": self.target_url,
            "dom_transactions_found": len(parsed_txs),
            "explanation": f"Successfully read live DOM from {self.target_url}. Parsed {len(parsed_txs)} transactions.",
            "details": {
                "target_url": self.target_url,
                "records_read": len(parsed_txs),
                "action": action_type
            }
        }


# Global singleton instance
browser_connector = BrowserConnector()
