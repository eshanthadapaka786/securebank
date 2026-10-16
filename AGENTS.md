# SecureBank & AITHOS Agent Knowledge Base (AGENTS.md)

This document provides localized architectural guidance, service lifecycle instructions, and integration invariants for agents operating in this repository.

---

## 🏛 System Architecture Overview

The repository consists of two integrated components:
1. **SecureBank (`/`)**: A React 19 + Vite NetBanking financial sandbox operating with authentic Indian Rupee (INR - ₹) datasets, claymorphic UI, and stable DOM selectors.
2. **AITHOS AI Privacy Agent (`/aithos-agent`)**:
   - **Backend (`/aithos-agent/backend`)**: FastAPI Python server running local deterministic PII sanitization, policy-based action validation, and local Qwen 2.0 inference via Ollama.
   - **Frontend (`/aithos-agent/frontend`)**: React + TypeScript audit & observability cockpit with real-time SSE telemetry.

---

## 🤖 Ollama & Qwen 2.0 Local LLM

- **Ollama Host**: `http://127.0.0.1:11434`
- **Active Model**: `qwen2:latest` (Alibaba Cloud Qwen 2.0 family)
- **Supported Models**: `qwen2:latest`, `qwen2:1.5b`, `qwen2:0.5b`, `qwen2:7b`, `qwen2.5:latest`
- **Installed Models in Sandbox**:
  - `qwen2:latest` (352 MB)
  - `qwen2:1.5b` (934 MB)
  - `qwen2:0.5b` (352 MB)
- **Deterministic JSON Enforcement**: Native Ollama `"format": "json"` with low temperature (`0.1`) ensures strictly valid structured decision schemas:
  ```json
  {
    "reasoning": "Step-by-step reasoning over sanitized tokens",
    "direct_answer": "Direct natural-language answer to user",
    "proposed_action": "SORT_BY_AMOUNT",
    "parameters": { "order": "desc" }
  }
  ```
- **Privacy Guarantee**: All raw personal identifiers (PAN, accounts, cards, emails, phone numbers) are scrubbed in memory before transmission to Qwen 2.0. The LLM only ever reasons over tokens like `<ACCOUNT_NUM_1>`.

---

## 🚀 Running the Services

### 1. Start Ollama Daemon
```powershell
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" serve
```

### 2. Start AITHOS Backend (Port 8000)
```powershell
& ".\aithos-agent\backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --app-dir aithos-agent/backend --host 127.0.0.1 --port 8000 --reload
```

### 3. Start SecureBank Sandbox (Port 5173 / 5174)
```powershell
npm.cmd run dev
```

### 4. Start AITHOS Agent Frontend (Port 5174 / 5175)
```powershell
cd aithos-agent\frontend
npm.cmd run dev
```

---

## 🧪 Testing & Verification

- **Backend Pytest**:
  ```powershell
  & ".\aithos-agent\backend\.venv\Scripts\python.exe" -m pytest aithos-agent\backend\tests
  ```
  *All 27 tests validate Luhn checksums, PII masking, action policy allowlists, and Qwen 2.0 local decision handling.*

- **SecureBank Production Build**:
  ```powershell
  npm.cmd run build
  ```

- **AITHOS Frontend Production Build**:
  ```powershell
  cd aithos-agent\frontend
  npm.cmd run build
  ```

---

## 🛡️ Security Invariants
- State mutations (money transfers, credential changes, code evaluation) are unconditionally blocked by `ActionValidator`.
- Raw PII is never logged, persisted in audit logs, or exposed to the LLM.
- Connection states are always honest: if a service is down, it displays offline rather than fabricating success.
