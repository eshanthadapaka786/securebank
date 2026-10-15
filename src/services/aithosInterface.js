/**
 * SecureBank AITHOS Financial Interface Bridge (Read-Only)
 * 
 * Provides an isolated, privacy-compliant programmatic bridge for AITHOS AI agents
 * evaluating financial task completion during the hackathon.
 * 
 * Strict Privacy & Security Invariants:
 * 1. Read-Only: Agents cannot perform state-mutating monetary transfers or credential alteration.
 * 2. Zero-Secret Exposure: Passwords, raw routing keys, and live external APIs are never exposed.
 * 3. Synthetic Sandbox: All accounts and ledgers are 100% fictional in Indian Rupees (INR - ₹).
 */

import { INITIAL_TRANSACTIONS, INITIAL_ACCOUNT_METRICS, INITIAL_USER_PROFILE } from '../data/mockData';

export const SELECTORS = {
  table: '#transactions-table',
  sortByAmount: '#sort-by-amount',
  dateFilter: '#date-filter',
  categoryFilter: '#category-filter',
  searchTransactions: '#search-transactions',
  rowAttribute: 'data-transaction-id'
};

export const AITHOS_INTERFACE_SCHEMA = {
  currency: 'INR (₹)',
  transaction: {
    id: 'string (stable identifier e.g. tx-1001)',
    date: 'string (ISO YYYY-MM-DD)',
    merchant: 'string (human readable merchant name)',
    category: 'string (spending or income category)',
    amount: 'number (2-decimal float in INR)',
    type: 'string ("debit" | "credit")',
    status: 'string ("cleared" | "settled")',
    paymentMethod: 'string (synthetic payment vehicle e.g. Virtual Debit ••8492)'
  },
  metrics: {
    availableBalance: 'number',
    monthlyIncome: 'number',
    monthlyExpenses: 'number',
    netCashFlow: 'number',
    transactionCount: 'number',
    currency: 'INR'
  }
};

class SecureBankAithosInterface {
  constructor() {
    this.bankName = 'SecureBank';
    this.readOnly = true;
    this.currency = 'INR';
    this.currencySymbol = '₹';
    this.environment = 'synthetic-sandbox-local';
    this.version = '2.0.0-aithos-securebank';
    this.selectors = Object.freeze({ ...SELECTORS });
    this.schema = Object.freeze({ ...AITHOS_INTERFACE_SCHEMA });
    this.securityNotice = 'AITHOS Privacy Guardrail Active: Fictional dataset only. No raw credentials or sensitive PII accessible.';
  }

  /**
   * Return a sanitized, cloned list of synthetic transactions.
   * Supports optional filtering criteria.
   */
  getTransactions(filterOptions = {}) {
    let result = INITIAL_TRANSACTIONS.map(tx => ({ ...tx }));

    if (filterOptions.category && filterOptions.category !== 'All Categories') {
      result = result.filter(tx => tx.category.toLowerCase() === filterOptions.category.toLowerCase());
    }

    if (filterOptions.type) {
      result = result.filter(tx => tx.type === filterOptions.type);
    }

    if (filterOptions.search) {
      const q = filterOptions.search.toLowerCase().trim();
      result = result.filter(tx => 
        tx.merchant.toLowerCase().includes(q) || 
        tx.id.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q)
      );
    }

    if (filterOptions.sort === 'asc') {
      result.sort((a, b) => a.amount - b.amount);
    } else if (filterOptions.sort === 'desc') {
      result.sort((a, b) => b.amount - a.amount);
    }

    return Object.freeze(result);
  }

  /**
   * Look up a single transaction by its stable ID.
   */
  getTransactionById(id) {
    const found = INITIAL_TRANSACTIONS.find(tx => tx.id === id);
    return found ? Object.freeze({ ...found }) : null;
  }

  /**
   * Read high-level aggregate metrics for agent balance analysis.
   */
  getSummaryMetrics() {
    return Object.freeze({
      availableBalance: INITIAL_ACCOUNT_METRICS.availableBalance,
      monthlyIncome: INITIAL_ACCOUNT_METRICS.monthlyIncome,
      monthlyExpenses: INITIAL_ACCOUNT_METRICS.monthlyExpenses,
      netCashFlow: INITIAL_ACCOUNT_METRICS.netCashFlow,
      transactionCount: INITIAL_TRANSACTIONS.length,
      currency: 'INR',
      currencySymbol: '₹'
    });
  }

  /**
   * Read synthetic identity details. Strictly excludes passwords, authentication tokens,
   * or full financial routing secrets.
   */
  getSanitizedProfile() {
    return Object.freeze({
      name: INITIAL_USER_PROFILE.name,
      accountNumberMasked: INITIAL_USER_PROFILE.accountNumberMasked,
      accountNumberLast4: INITIAL_USER_PROFILE.accountNumberLast4,
      accountType: INITIAL_USER_PROFILE.accountType,
      memberSince: INITIAL_USER_PROFILE.memberSince,
      kycStatus: INITIAL_USER_PROFILE.kycStatus,
      currency: 'INR'
    });
  }

  /**
   * List approved agent actions for browser automation tests.
   */
  getApprovedAgentActions() {
    return Object.freeze([
      'READ_TRANSACTIONS_TABLE',
      'APPLY_SEARCH_QUERY',
      'APPLY_CATEGORY_FILTER',
      'APPLY_DATE_FILTER',
      'APPLY_AMOUNT_SORT',
      'READ_SPENDING_METRICS',
      'VERIFY_MASKED_ACCOUNT'
    ]);
  }
}

// Singleton instantiation and browser window exposure
export const aithosInterface = new SecureBankAithosInterface();

if (typeof window !== 'undefined') {
  window.AITHOS_BANK_API = aithosInterface;
  window.SECUREBANK_API = aithosInterface;
  window.__AITHOS_FINANCIAL_INTERFACE__ = aithosInterface;
}
