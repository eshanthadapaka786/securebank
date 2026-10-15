# AITHOS Agent — Privacy-Preserving Agentic AI

> “AI should know what it needs — not everything about you.”

AITHOS is a genuinely functional, privacy-preserving AI agent built from scratch. It inspects web pages and form data locally on the user's device, detects sensitive personal and financial identifiers, masks them with structured placeholders before AI reasoning, and enforces a strict read-only security boundary against untrusted web inputs.

---

## 🏛 Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │          Local Device Memory         │
                      └──────────────────────────────────────┘
                                          │
       [1. User Ask]                      ▼                      [2. Local Inspection]
Natural Language Instruction ──▶ [ DOM / Context Reader ] ──▶ [ Raw Untrusted Text ]
                                                                          │
                                                                          ▼
                                                              [ Deterministic Detector ]
                                                              (Emails, Phones, Cards,
                                                               PAN, SSN, Accounts, Pwd)
                                                                          │
                                                                          ▼
                                                                [ Privacy Sanitizer ]
                                                                (Token Map in Memory)
                                                                          │
                                                                          ▼
                                                                < Masked Context Only >
                                                              (e.g., <ACCOUNT_NUM_1>)
                                                                          │
                                          ┌───────────────────────────────┴───────────────────────────────┐
                                          │                                                               │
                                          ▼                                                               ▼
                             [ AI Inference Engine ]                                         [ Action Security Validator ]
                             (Local Ollama / Fallback)                                       (Read-Only Policy Whitelist)
                                          │                                                               │
                                          │                                                               ▼
                                          │                                                 Blocked: Unauthorized actions
                                          │                                                 (Transfer funds, script eval)
                                          ▼                                                               │
                                  [ Safe Reasoning ] ─────────────────────────────────────────────────────┘
                                          │
                                          ▼
                               [ Verified Final Result ]
```

### Key Principles

1. **See Locally**: The agent reads the page and form fields inside local memory — no raw data leaves first.
2. **Protect Locally**: Deterministic detection captures emails, phone numbers, bank accounts, cards, PAN, SSN, and passwords without remote LLM leakage.
3. **Reason Safely**: The AI model (via local Ollama or rule-based fallback) reasons only over masked placeholders.
4. **Act Safely**: The Action Validator strictly allows read-only operations (sorting, filtering, searching) and blocks funds transfers or arbitrary code execution.
5. **Honest Connection States**: Real status checks — never displays false success indicators.

---

## 📁 Modular Directory Structure

```
Aithos agent/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI entry point & CORS configuration
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py               # REST & SSE streaming endpoints
│   │   ├── privacy/
│   │   │   ├── __init__.py
│   │   │   ├── detector.py             # Deterministic regex & DOM field detection
│   │   │   └── sanitizer.py            # Token placeholder replacement & SHA-256
│   │   ├── agent/
│   │   │   ├── __init__.py
│   │   │   ├── task_manager.py         # Task lifecycle & SSE event broadcasting
│   │   │   ├── action_validator.py     # Policy whitelist/blacklist enforcement
│   │   │   └── browser_connector.py    # FakeBank interface & honest status probe
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   └── ollama_client.py        # Genuine Ollama availability check & query
│   │   └── audit/
│   │       ├── __init__.py
│   │       └── logger.py               # Persistent, zero-leak audit log store
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_detector.py            # Unit tests for entity detection & Luhn
│   │   ├── test_sanitizer.py           # Unit tests for token masking & restoration
│   │   ├── test_action_validator.py    # Unit tests for whitelist/blacklist rules
│   │   ├── test_task_manager.py        # Unit tests for task lifecycle & event bus
│   │   └── test_api.py                 # FastAPI endpoint integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Navigation & live honest connection monitors
│   │   │   └── StatusBadge.tsx         # Tactile claymorphic status pill
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx        # System readiness, metrics & pillars
│   │   │   ├── WorkspacePage.tsx       # Natural-language task input & execution
│   │   │   ├── TimelinePage.tsx        # Real-time SSE telemetry stream
│   │   │   ├── ScannerPage.tsx         # Interactive synthetic privacy testbed
│   │   │   ├── AuditPage.tsx           # Compliance logs & JSON export
│   │   │   └── SettingsPage.tsx        # FakeBank URL & Ollama configuration
│   │   ├── lib/
│   │   │   └── api.ts                  # Typed client for backend REST & SSE
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── App.tsx                     # Main application layout
│   │   ├── index.css                   # Claymorphism shadows & design system
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

---

## 🚀 Setup & Startup Instructions (Windows PowerShell)

### Prerequisites

- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ (tested on v24)
- **PowerShell**: Windows PowerShell 5.1 or PowerShell 7

---

### Step 1: Backend Setup & Testing

Open a PowerShell terminal in the `Aithos agent` folder:

```powershell
# 1. Create Python virtual environment
python -m venv backend_venv

# 2. Activate virtual environment
.\backend_venv\Scripts\Activate.ps1

# 3. Install backend dependencies
pip install -r backend\requirements.txt

# 4. Run automated test suite
$env:PYTHONPATH="."
pytest -v backend\tests
```

**Expected output:**
```
======================== 27 passed, 1 warning in 0.91s ========================
```

---

### Step 2: Run Backend Server

```powershell
# Start FastAPI backend on port 8000
$env:PYTHONPATH="."
.\backend_venv\Scripts\uvicorn.exe backend.app.main:app --port 8000 --host 127.0.0.1 --reload
```

- API Base: `http://127.0.0.1:8000`
- Swagger Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

---

### Step 3: Frontend Setup & Startup

Open a second PowerShell terminal in the `Aithos agent` folder:

```powershell
# Navigate into the frontend folder
cd frontend

# Install dependencies (React, Vite, Tailwind CSS, Lucide)
npm install

# Build for validation
npm run build

# Start the Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser to:
**`http://127.0.0.1:5173`**

---

## 🔍 Features & Verification Guide

### 1. Honest System Status
- **Backend API**: Verified via `/api/health`.
- **Privacy Engine**: Active locally with 7 deterministic patterns.
- **AI Model (Ollama)**: Genuinely checks port `11434`. Shows *Offline/Unavailable* until an Ollama daemon is running, seamlessly falling back to deterministic reasoning without pretending an LLM was invoked.
- **FakeBank**: Shows *Awaiting Integration* until the teammate provides the live URL and DOM structure.

### 2. Privacy Scanner & Redaction Testbed
- Go to the **Privacy Scanner** tab.
- Choose a preset (e.g. *Banking Statement Context* containing customer email, phone, PAN, and card numbers).
- Click **Scan & Sanitize**:
  - Original raw text remains confined to local device memory.
  - Model payload replaces sensitive data with structural tokens: `<EMAIL_1>`, `<ACCOUNT_NUM_1>`, `<GOVERNMENT_ID_1>`, `<PAYMENT_CARD_1>`.
  - Zero raw sensitive strings are stored in audit logs or transmitted to external AI endpoints.

### 3. Agent Workspace & Safety Policy Enforcement
- **Approved Read-Only Task**: Click the template **"Inspect & Sort"** (`Sort all recent transactions by amount in descending order`). Watch the live execution pipeline:
  1. Task Accepted
  2. Action Approved (Read-only policy whitelist)
  3. Context Inspection
  4. Privacy Scan (Entities tokenized)
  5. AI Reasoning (or honest deterministic fallback)
  6. Verified final sorted statement response.
- **Blocked Dangerous Task**: Click the template **"Test Blocked Action (Transfer)"** (`Transfer $5,000 from account 492019482019 to external account 981248901235`).
  - The Action Validator immediately flags the mutation attempt as `POLICY BLOCKED`.
  - Zero unauthorized actions are performed.

### 4. Live Activity Timeline
- Connects directly to the backend Server-Sent Events stream (`/api/events`).
- Filters events by stage: `PRIVACY`, `SECURITY`, `AI`, `EXECUTION`.

### 5. Audit Logs
- Every validation, sanitization checksum, and operation is recorded with tamper-evident metadata.
- Export all logs anytime using the **Export JSON** button.

### 6. FakeBank Team Integration
- In the **Settings** tab, update the target URL (default: `http://localhost:3000`).
- When your teammate starts their FakeBank demo site, click **Save & Test Connection**. AITHOS will probe and transition to `CONNECTED`.
