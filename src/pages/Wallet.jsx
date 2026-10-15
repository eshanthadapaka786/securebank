import React, { useState } from 'react';
import { formatINR, INITIAL_USER_PROFILE } from '../data/mockData';

export default function Wallet({ onNavigateTab }) {
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('formatted'); // 'formatted' | 'raw' | 'signature'

  const credentialsList = [
    {
      id: 'cred_8f2a3d_c9e1',
      title: 'Privilege NetBanking Account',
      issuer: 'SecureBank Financial Services',
      type: 'Primary Savings & Checking',
      maskedNumber: '•••• •••• •••• 8492',
      issuedOn: '15 Oct 2021',
      validTill: '30 Jun 2028',
      balance: 485250.00,
      status: 'Active',
      color: '#0066ff'
    },
    {
      id: 'cred_4b1e7c_d204',
      title: 'Fixed Wealth Vault',
      issuer: 'SecureBank Treasury & Deposits',
      type: 'Fixed Term Deposit (7.25% p.a.)',
      maskedNumber: '•••• •••• •••• 9104',
      issuedOn: '01 Jan 2024',
      validTill: '01 Jan 2029',
      balance: 520000.00,
      status: 'Active',
      color: '#059669'
    },
    {
      id: 'cred_99a38f_1052',
      title: 'RuPay Platinum Virtual Debit',
      issuer: 'National Payments Corporation & SecureBank',
      type: 'Tokenized Virtual Debit Vehicle',
      maskedNumber: '•••• •••• •••• 8492',
      issuedOn: '15 Mar 2024',
      validTill: '15 Mar 2029',
      balance: 485250.00,
      status: 'Active',
      color: '#7c3aed'
    }
  ];

  return (
    <div className="content-body animate-fade-in">
      {/* Screen 7: Header & Action Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-navy)', marginBottom: '4px' }}>
            My Digital Vault & Instruments
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Cryptographically verified account credentials and tokenized vehicles.
          </p>
        </div>

        <button
          type="button"
          className="clay-btn-primary"
          style={{ padding: '9px 20px', fontSize: '0.86rem' }}
          onClick={() => alert('Encrypted backup archive of synthetic credentials exported.')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Backup Vault</span>
        </button>
      </div>

      {/* Screen 7: Stat Badges Row */}
      <div className="metrics-row" style={{ marginBottom: '28px' }}>
        <div className="stat-metric-card">
          <div className="stat-icon-square blue">3</div>
          <div className="stat-content">
            <div className="stat-number">3</div>
            <div className="stat-label">Total Instruments</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square green">✓</div>
          <div className="stat-content">
            <div className="stat-number" style={{ color: 'var(--emerald-status)' }}>3</div>
            <div className="stat-label">Active & Valid</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square amber">0</div>
          <div className="stat-content">
            <div className="stat-number">0</div>
            <div className="stat-label">Expired</div>
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-icon-square purple">0</div>
          <div className="stat-content">
            <div className="stat-number">0</div>
            <div className="stat-label">Revoked</div>
          </div>
        </div>
      </div>

      {/* Screen 7: My Credentials Grid */}
      <div className="card-title-bar">
        <h2>Active Account Credentials</h2>
        <span 
          style={{ fontSize: '0.82rem', color: 'var(--primary-blue)', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => onNavigateTab && onNavigateTab('transactions')}
        >
          View Transaction Ledger →
        </span>
      </div>

      <div className="credentials-vault-grid">
        {credentialsList.map((cred) => (
          <div key={cred.id} className="vault-card-item">
            <div>
              <div className="vault-card-header">
                <div className="vault-card-logo" style={{ color: cred.color }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <span className="badge-pill badge-credit" style={{ fontSize: '0.7rem' }}>
                  {cred.status}
                </span>
              </div>

              <div className="vault-card-title">{cred.title}</div>
              <div className="vault-card-issuer">{cred.issuer}</div>

              <div className="vault-card-details">
                <div className="vault-detail-line">
                  <span className="vault-detail-label">Identifier:</span>
                  <span className="vault-detail-val" style={{ fontFamily: 'monospace' }}>{cred.maskedNumber}</span>
                </div>
                <div className="vault-detail-line">
                  <span className="vault-detail-label">Issued On:</span>
                  <span className="vault-detail-val">{cred.issuedOn}</span>
                </div>
                <div className="vault-detail-line">
                  <span className="vault-detail-label">Valid Till:</span>
                  <span className="vault-detail-val">{cred.validTill}</span>
                </div>
                <div className="vault-detail-line">
                  <span className="vault-detail-label">Value:</span>
                  <span className="vault-detail-val" style={{ color: 'var(--primary-blue)' }}>{formatINR(cred.balance)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="clay-btn-secondary"
              style={{ width: '100%', marginTop: '12px', fontSize: '0.82rem' }}
              onClick={() => setSelectedCredential(cred)}
            >
              View Full Details →
            </button>
          </div>
        ))}
      </div>

      {/* Screen 8: Credential Details Inspector Modal with Tabs */}
      {selectedCredential && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 30, 58, 0.45)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setSelectedCredential(null)}
        >
          <div 
            className="clay-card animate-fade-in"
            style={{ maxWidth: '540px', width: '100%', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span className="tx-id-badge" style={{ fontSize: '0.78rem' }}>{selectedCredential.id}</span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '6px', color: 'var(--text-navy)' }}>{selectedCredential.title}</h3>
              </div>
              <button
                type="button"
                className="header-icon-btn"
                style={{ width: '30px', height: '30px' }}
                onClick={() => setSelectedCredential(null)}
              >
                ✕
              </button>
            </div>

            {/* Screen 8 Tabs: Formatted View / Raw JSON / Signature */}
            <div className="login-tabs-segment" style={{ marginBottom: '18px' }}>
              <button
                type="button"
                className={`login-tab-btn ${activeModalTab === 'formatted' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('formatted')}
              >
                Formatted View
              </button>
              <button
                type="button"
                className={`login-tab-btn ${activeModalTab === 'raw' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('raw')}
              >
                Raw JSON
              </button>
              <button
                type="button"
                className={`login-tab-btn ${activeModalTab === 'signature' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('signature')}
              >
                Signature
              </button>
            </div>

            {activeModalTab === 'formatted' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="clay-inset" style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Account Holder</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-navy)' }}>{INITIAL_USER_PROFILE.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--primary-blue)', marginTop: '2px' }}>{INITIAL_USER_PROFILE.email}</div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Credential ID</span>
                  <span className="detail-value mono">{selectedCredential.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Instrument Type</span>
                  <span className="detail-value">{selectedCredential.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Masked Identifier</span>
                  <span className="detail-value mono">{selectedCredential.maskedNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Settled Value</span>
                  <span className="detail-value" style={{ color: 'var(--primary-blue)' }}>{formatINR(selectedCredential.balance)}</span>
                </div>
              </div>
            )}

            {activeModalTab === 'raw' && (
              <pre 
                className="clay-inset" 
                style={{ 
                  padding: '16px', 
                  fontSize: '0.78rem', 
                  fontFamily: 'monospace', 
                  overflowX: 'auto',
                  maxHeight: '220px',
                  color: 'var(--text-navy)'
                }}
              >
                {JSON.stringify(selectedCredential, null, 2)}
              </pre>
            )}

            {activeModalTab === 'signature' && (
              <div className="clay-inset" style={{ padding: '16px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Ed25519 Cryptographic Verification Signature
                </div>
                <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary-blue)' }}>
                  ed25519_sig_9f82a17b84cc0184e9301928472910384721948201948201948291048291
                </div>
                <div style={{ marginTop: '12px' }}>
                  <span className="badge-pill badge-credit" style={{ fontSize: '0.7rem' }}>
                    ✓ Valid & Tamper-Proof
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
              <button
                type="button"
                className="clay-btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  alert('Credential verified against AITHOS local public key!');
                }}
              >
                Verify Signature
              </button>
              <button
                type="button"
                className="clay-btn-secondary"
                onClick={() => setSelectedCredential(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
