import React from 'react';
import { INITIAL_ACCOUNT_METRICS, INITIAL_TRANSACTIONS, formatINR } from '../data/mockData';
import SpendingChart from '../components/SpendingChart';

export default function Dashboard({ userProfile, onNavigateTab, onSelectCategoryFilter }) {
  const recentTransactions = INITIAL_TRANSACTIONS.slice(0, 5);

  const handleCategoryClick = (category) => {
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(category);
    }
    if (onNavigateTab) {
      onNavigateTab('transactions');
    }
  };

  return (
    <div className="content-body animate-fade-in">
      {/* Screen 2: Welcome Portal Banner */}
      <div className="welcome-portal-banner">
        <h1 className="welcome-portal-title">
          Welcome back, {userProfile?.greetingName || userProfile?.name || 'Alex'}
        </h1>
        <p className="welcome-portal-subtitle">
          Choose your portal to continue managing and auditing your verifiable financial instruments.
        </p>
      </div>

      {/* Screen 2: 3 Large Claymorphic Portal Cards */}
      <div className="portals-grid">
        {/* Portal 1: Personal Accounts / Vault */}
        <div 
          className="portal-card"
          onClick={() => onNavigateTab('wallet')}
          title="Click to access Digital Vault"
        >
          <div>
            <div className="portal-icon-wrap portal-icon-blue">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h3 className="portal-card-title">Personal Vault & Accounts</h3>
            <p className="portal-card-desc">
              Manage verified digital accounts, deposits, and tokenized virtual debit instruments.
            </p>

            <div className="portal-checklist">
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Privilege Savings (••8492)</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Fixed Wealth Vault (7.25% p.a.)</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Tokenized RuPay Debit Card</span>
              </div>
            </div>
          </div>

          <div className="portal-footer-action">
            <span>Manage Vault</span>
            <span>→</span>
          </div>
        </div>

        {/* Portal 2: Transaction Ledger & Analytics */}
        <div 
          className="portal-card"
          onClick={() => onNavigateTab('transactions')}
          title="Click to access Transaction Ledger"
        >
          <div>
            <div className="portal-icon-wrap portal-icon-cyan">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="portal-card-title">Transaction Ledger</h3>
            <p className="portal-card-desc">
              Query, sort, filter, and inspect 20 synthetic records with stable automation selectors.
            </p>

            <div className="portal-checklist">
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Real-time merchant & ID search</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Category & date range filters</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Amount sorting (asc / desc)</span>
              </div>
            </div>
          </div>

          <div className="portal-footer-action">
            <span>Explore Ledger</span>
            <span>→</span>
          </div>
        </div>

        {/* Portal 3: Verifier / App Gateway (AITHOS Privacy Guardrail) */}
        <div 
          className="portal-card"
          onClick={() => onNavigateTab('security')}
          title="Click to access AITHOS Privacy Gateway"
        >
          <div>
            <div className="portal-icon-wrap portal-icon-emerald">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="portal-card-title">Verifier / Privacy Gateway</h3>
            <p className="portal-card-desc">
              Evaluate AI agent privacy compliance with strict read-only window interfaces.
            </p>

            <div className="portal-checklist">
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Selective claim disclosure</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>Zero raw credential leakage</span>
              </div>
              <div className="portal-check-item">
                <span className="check-dot">✓</span>
                <span>window.AITHOS_BANK_API Active</span>
              </div>
            </div>
          </div>

          <div className="portal-footer-action">
            <span>Inspect Guardrails</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/* Screen 3: 4 Metric Cards Across Top */}
      <div className="metrics-row">
        <div className="stat-metric-card">
          <div className="stat-icon-square blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{formatINR(INITIAL_ACCOUNT_METRICS.availableBalance)}</div>
            <div className="stat-label">Available Balance</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number" style={{ color: 'var(--emerald-status)' }}>
              +{formatINR(INITIAL_ACCOUNT_METRICS.monthlyIncome)}
            </div>
            <div className="stat-label">Monthly Inflow (Income)</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              -{formatINR(INITIAL_ACCOUNT_METRICS.monthlyExpenses)}
            </div>
            <div className="stat-label">Monthly Outflow</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number" style={{ color: 'var(--primary-blue)' }}>
              57.6%
            </div>
            <div className="stat-label">Net Savings Rate</div>
          </div>
        </div>
      </div>

      {/* Screen 3: Middle Split - Category Breakdown & Recent Activity */}
      <div className="dashboard-split">
        {/* Spending Breakdown Visualization */}
        <div className="clay-card" style={{ padding: '24px 28px' }}>
          <div className="card-title-bar">
            <h2>Category Outflow Breakdown</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Interactive Spending
            </span>
          </div>
          <SpendingChart onSelectCategory={handleCategoryClick} />
        </div>

        {/* Recent Ledger Activity Table (Screen 3 style) */}
        <div className="clay-card table-card">
          <div className="table-header-bar">
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recent Ledger Records</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Showing latest 5 settled entries
              </span>
            </div>

            <button
              type="button"
              className="clay-btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => onNavigateTab('transactions')}
            >
              View All 20 →
            </button>
          </div>

          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fbff', borderBottom: '1px solid rgba(220, 233, 248, 0.9)' }}>
                  <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Merchant</th>
                  <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(240, 246, 253, 0.9)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-navy)', fontSize: '0.88rem' }}>{tx.merchant}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{tx.date} • {tx.category}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span className="badge-pill badge-credit" style={{ fontSize: '0.7rem' }}>
                        Active
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span style={{ color: tx.type === 'credit' ? 'var(--emerald-status)' : 'var(--text-navy)' }}>
                        {tx.type === 'credit' ? '+' : '-'}{formatINR(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
