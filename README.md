# SecureBank | AITHOS AI Privacy-Agent Sandbox

A banking dashboard built with **React 19 + Vite** for the **AITHOS AI Privacy-Agent Hackathon**.

Featuring an **enterprise blue-and-white claymorphism fintech UI**, native **Indian Rupee (INR - ₹)** currency formatting, realistic synthetic transaction datasets, stable DOM selectors for agent automation, and strict privacy invariants ensuring zero sensitive credential leakage.

---

## 🎨 Design Philosophy: Blue & White Claymorphism

- **Palette**: Soft pale blue canvas (`#f0f4fa`) with subtle radial gradients, pure porcelain white raised cards (`#ffffff`), and rich FinTech cobalt blue (`#1852db` / `#091e42`).
- **Claymorphic 3D Elevation**: Dual soft drop-shadows combined with inner reflection highlights create tactile, elevated 3D cards without harsh borders.
- **Enterprise Authenticity**: Completely redesigned corporate NetBanking login experience with custom vector SVG icons, segmented NetBanking vs Evaluator 1-Click modes, and industry trust seals (256-bit SSL, AITHOS Privacy Guardrail).
- **Subtle Inset Inputs**: Tactile input wells and selects with dual inset shadows.
- **Typography**: Clean, geometric typography powered by Google Fonts *Plus Jakarta Sans*.

---

## 🚀 Getting Started

### 1. Installation

Ensure Node.js 18+ is installed:

```bash
npm install
```

### 2. Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Visit `http://localhost:5174` (or `http://localhost:5173`) in your browser.

### 3. Production Build

Verify or produce the optimized production bundle:

```bash
npm run build
```

### 4. Code Quality & Linting

```bash
npm run lint
```

---

## 🔑 Fictional Demo Credentials

All authentication is simulated locally in browser memory. No live credentials or banking APIs are used:

- **Primary Account Holder**:
  - **Email**: `alex.morgan@securebank.in`
  - **Password**: `SecureBank@2026`
- **Evaluator Sandbox**:
  - **Email**: `evaluator@securebank.in`
  - **Password**: `AithosSandbox#2026`

*The login screen features an **Evaluator 1-Click** tab with pre-configured persona cards for single-click entry.*

---

## ✨ Key Features

1. **Enterprise NetBanking Login**:
   - Executive corporate NetBanking authentication interface with segmented mode switcher, password visibility toggle, and instant persona selection.
2. **FinTech Overview Dashboard (INR - ₹)**:
   - Customer greeting ("Welcome back, Alex Morgan").
   - Key clay cards: Available Balance (₹4,85,250.00), Monthly Income (₹1,85,000.00), Monthly Expenses (₹78,420.00), Net Cashflow (+₹1,06,580.00).
   - Interactive category spending breakdown visualization with progress bars.
   - Recent activity list with one-click navigation to full transaction ledger.
3. **Transactions Ledger (20 Synthetic Records in INR)**:
   - 20 realistic records with stable IDs (`tx-1001` through `tx-1020`), dates, merchants (Nature's Basket, Blue Tokai, Amazon India, Cult.fit, IndiGo, Swiggy, etc.), categories, INR amounts, debit/credit badges, and payment vehicles.
   - Interactive detail inspector modal for individual transaction drill-downs.
4. **Search, Filter & Sort Controls**:
   - Functional amount sorting (Default Date, Low-to-High, High-to-Low).
   - Category filtering (All, Groceries, Dining, Technology, Shopping, Fitness, Travel, Utilities, Entertainment, Income).
   - Date range filtering (All, Last 7 Days, Last 14 Days, October 2026, September 2026).
   - Real-time merchant & ID search input.
   - Dynamic INR inflow/outflow calculation updates live as filters change.
5. **Customer Profile & Security**:
   - Masked account identifiers (`•••• •••• •••• 8492` and IFSC `SECB0008492`).
   - Customer profile details with local preference updates.
   - Security controls: simulated IPIN rotation modal without leaking secrets.
   - 2FA TOTP status and anti-exfiltration invariant documentation.
6. **Sidebar Navigation**:
   - Persistent responsive sidebar for **Overview**, **Transactions**, **Profile**, and **Security**.
   - Live AITHOS sandbox indicator with pulsing status dot.

---

## 🤖 AITHOS Agent Automation & Selectors

SecureBank includes stable semantic selectors designed for browser evaluation agents:

- `#transactions-table` — Transaction ledger table.
- `#sort-by-amount` — Amount sorting dropdown selector.
- `#date-filter` — Date range dropdown selector.
- `#category-filter` — Category dropdown selector.
- `#search-transactions` — Merchant and transaction ID search input.
- `tr[data-transaction-id]` — Each row includes `data-transaction-id="tx-XXXX"`.

### Read-Only Programmatic API:

Agents can query synthetic data directly via the browser window:

```javascript
// Read sanitized transactions without scraping
const txs = window.AITHOS_BANK_API.getTransactions({ category: 'Groceries' });

// Read account summary metrics (INR)
const metrics = window.AITHOS_BANK_API.getSummaryMetrics();
```

For full API and schema documentation, see [`INTEGRATION.md`](./INTEGRATION.md).

---

## 🛡️ Privacy & Security Invariants

- **Zero Real Credentials**: All credentials and identities are 100% fictional.
- **Strictly Masked Identifiers**: Sensitive banking numbers are permanently masked.
- **Passwords are Never Exposed**: Passwords are never surfaced in the DOM, window objects, or telemetry.
- **Read-Only Scope**: Agents are restricted to querying and filtering; monetary transfers cannot be executed.
