# AITHOS – AI Privacy Agent

AITHOS is a privacy-focused AI agent that enables secure browser automation while protecting personally identifiable information (PII). It detects and masks sensitive data before AI processing and blocks unsafe actions.

## Architecture

**1. SecureBank Sandbox**
A React 19 + Vite banking simulator featuring INR transactions, dashboards, wallets, profiles, and security settings. It uses synthetic banking data for safe demonstrations.

**2. AITHOS Backend**
Built with Python and FastAPI, it provides:

* **PII Detection:** Identifies emails, phone numbers, PAN, bank accounts, passwords, PINs, and credit cards.
* **Data Sanitization:** Replaces sensitive values with placeholders and generates SHA-256 checksums.
* **Action Security:** Allows read-only operations while blocking money transfers, password changes, and script execution.
* **Local AI:** Uses Qwen 2.0 through Ollama for private reasoning.
* **Monitoring:** REST APIs, SSE streaming, and privacy-safe audit logs.

**3. Observability Dashboard**
A React + TypeScript dashboard for real-time monitoring, PII scanning, execution timelines, audit logs, and AI model management.

## Workflow

1. User submits a browser task.
2. AITHOS validates the requested action.
3. Relevant browser data is inspected for PII.
4. Sensitive values are replaced with placeholders.
5. Sanitized data is processed by the local Qwen model.
6. Proposed actions are validated before execution.
7. Results and security events are displayed.

## Tech Stack

* Frontend: React, TypeScript, Vite, Tailwind CSS
* Backend: Python, FastAPI
* AI: Qwen 2.0, Ollama
* Security: Regex-based detection, Luhn validation, SHA-256
* Testing: Pytest

## Key Features

* Privacy-first browser automation
* Automatic PII detection and masking
* Read-only action enforcement
* Local AI inference
* Real-time monitoring and audit trails
* Safe testing with synthetic banking data
