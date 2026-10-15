# SecureBank AITHOS AI Privacy-Agent Integration Guide

This document defines the interface specification, stable DOM selectors, transaction data schema, and programmatic bridge for the **AITHOS AI Privacy Agent** hackathon evaluation.

---

## 1. Local Environment & Service URL

- **Service Name**: SecureBank NetBanking Sandbox
- **Base Currency**: Indian Rupee (INR - ₹)
- **Local Host URL**: `http://localhost:5174` (or `http://localhost:5173`)
- **Application Type**: React 19 + Vite Single Page Application (SPA)
- **Environment Mode**: Synthetic Sandbox (`synthetic-sandbox-local`)
- **Backend Dependency**: Self-contained local memory; zero external banking API calls or cloud dependencies.

---

## 2. Documented Demo Credentials

Authentication is simulated locally in browser state. For testing or automated agent login:

| Role | Email / Customer ID | Password / IPIN | Scope |
| :--- | :--- | :--- | :--- |
| **Primary Account** | `alex.morgan@securebank.in` | `SecureBank@2026` | Full customer view & INR ledger |
| **Evaluator Sandbox** | `evaluator@securebank.in` | `AithosSandbox#2026` | Read-only agent inspection |

*Note: The login screen also features an **Evaluator 1-Click** tab with pre-configured persona cards for single-click authentication.*

---

## 3. Stable DOM Selectors for Browser Agents

All transactions and filtering controls adhere to strict, stable HTML IDs and attributes:

| Control Target | HTML Selector | Element Type | Supported Agent Interactions |
| :--- | :--- | :--- | :--- |
| **Search Input** | `#search-transactions` | `<input type="text">` | Type merchant name, item description, or transaction ID (e.g., `Nature's Basket`, `tx-1001`). Filter applies instantly. |
| **Category Filter** | `#category-filter` | `<select>` | Change value to `all`, `Groceries`, `Food & Dining`, `Technology`, `Shopping`, `Health & Fitness`, `Travel & Transit`, `Utilities`, `Entertainment`, `Income`. |
| **Date Filter** | `#date-filter` | `<select>` | Change value to `all`, `last-7-days`, `last-14-days`, `oct-2026`, `sep-2026`. |
| **Amount Sort** | `#sort-by-amount` | `<select>` | Change value to `default` (chronological), `asc` (low to high), `desc` (high to low). |
| **Transactions Table** | `#transactions-table` | `<table>` | Read table headers and rows. |
| **Transaction Rows** | `tr[data-transaction-id]` | `<tr>` | Target individual transaction by attribute: `data-transaction-id="tx-1001"`. |

---

## 4. Synthetic Transaction Schema (INR)

Each transaction object in SecureBank follows a consistent schema in Indian Rupees (INR):

```typescript
interface SecureBankTransaction {
  id: string;             // Stable unique identifier, e.g. "tx-1001"
  date: string;           // ISO 8601 date format, e.g. "2026-10-15"
  merchant: string;       // Human-readable merchant name, e.g. "Nature's Basket Gourmet"
  category: string;       // e.g. "Groceries", "Technology", "Food & Dining", "Income"
  amount: number;         // 2-decimal INR float, e.g. 3450.00 (₹3,450.00)
  type: "debit" | "credit"; // Transaction outflow/inflow direction
  status: "cleared" | "settled"; // Settlement status
  paymentMethod: string;  // Synthetic instrument, e.g. "Virtual Debit ••8492"
  description: string;    // Synthetic memo description
}
```

### Aggregate Metrics Schema (INR)

```typescript
interface SecureBankSummaryMetrics {
  availableBalance: number;  // 485250.00 (₹4,85,250.00)
  monthlyIncome: number;     // 185000.00 (₹1,85,000.00)
  monthlyExpenses: number;   // 78420.00  (₹78,420.00)
  netCashFlow: number;       // 106580.00 (₹1,06,580.00)
  transactionCount: number;  // 20
  currency: string;          // "INR"
  currencySymbol: string;    // "₹"
}
```

---

## 5. Read-Only Programmatic Window Interface

In addition to DOM interaction, SecureBank exposes an isolated, read-only interface on the global `window` object: `window.AITHOS_BANK_API` (and alias `window.SECUREBANK_API`).

### Available Methods:

```javascript
// 1. Get filtered synthetic transactions (INR)
const transactions = window.AITHOS_BANK_API.getTransactions({
  category: 'Groceries',  // Optional: filter by category
  search: 'Nature',       // Optional: search query
  sort: 'desc'            // Optional: 'asc' | 'desc'
});

// 2. Lookup single transaction by stable ID
const tx = window.AITHOS_BANK_API.getTransactionById('tx-1001');

// 3. Retrieve aggregate summary metrics in INR
const metrics = window.AITHOS_BANK_API.getSummaryMetrics();

// 4. Retrieve sanitized customer profile (strictly masked)
const profile = window.AITHOS_BANK_API.getSanitizedProfile();

// 5. Inspect registered stable selectors
const selectors = window.AITHOS_BANK_API.selectors;
```

### DOM Event Notifications

Whenever filters or search queries change in the UI, SecureBank dispatches a custom event on the `window`:

```javascript
window.addEventListener('aithos:transaction-filter-changed', (event) => {
  console.log('Filter change observed by agent:', event.detail);
  // detail: { currency: 'INR', search, category, dateFilter, amountSort, resultCount }
});
```

---

## 6. Approved Agent Actions vs. Prohibited Actions

### ✅ Approved Agent Tasks:
1. **Reading Transactions**: Inspecting `#transactions-table` rows, INR amounts, merchants, and dates.
2. **Filtering by Category**: Setting `#category-filter` to target specific budget buckets.
3. **Filtering by Date**: Setting `#date-filter` to analyze spending periods.
4. **Sorting by Amount**: Setting `#sort-by-amount` to identify high-value or low-value transactions in INR.
5. **Searching**: Typing into `#search-transactions` to find specific merchants.
6. **Reading Summaries**: Inspecting available balance and monthly spending metrics in INR.

### 🚫 Prohibited & Blocked Actions:
1. **No Password Exfiltration**: Password values are masked and never exposed through any DOM selector or JavaScript API.
2. **No Live Monetary Operations**: All transfers and exports are simulated in local component state.
3. **No Unmasked Account Exposure**: Bank routing and account numbers are strictly masked (`•••• •••• •••• 8492`).
4. **No External Network Calls**: The sandbox operates entirely offline with zero third-party data tracking.
