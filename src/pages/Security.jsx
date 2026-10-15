import React, { useState } from 'react';

export default function Security({ userProfile }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [notification, setNotification] = useState(null);

  // Screen 11 & 12 Selective Disclosure Consent Demo State
  const [consentGranted, setConsentGranted] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (newPwd.length < 8) {
      setNotification({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }

    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setShowPasswordModal(false);
    setNotification({ type: 'success', message: 'NetBanking IPIN successfully updated in synthetic session.' });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="content-body animate-fade-in">
      {notification && (
        <div 
          style={{
            padding: '12px 20px',
            backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            color: notification.type === 'success' ? '#065f46' : '#991b1b',
            fontWeight: 600,
            boxShadow: 'var(--clay-shadow-pill)'
          }}
        >
          {notification.type === 'success' ? '✓ ' : '✕ '} {notification.message}
        </div>
      )}

      {/* Screen 11 & 12: Selective Disclosure & Verification Gateway Card */}
      <div className="clay-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div className="card-title-bar">
          <div>
            <h2>Selective Disclosure & Verification Gateway</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              AITHOS AI Agent Evaluation: Verify solvency and account standing without disclosing raw PII or credentials.
            </p>
          </div>
          <span className="badge-pill badge-blue">Zero-Knowledge Proof</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', marginTop: '16px' }}>
          {/* Screen 12: User Consent Request */}
          <div className="clay-inset" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#edf4ff', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                AI
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-navy)' }}>
                  AITHOS Privacy Agent Evaluation
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Requests proof of positive net cashflow & active tier
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                <span style={{ color: 'var(--emerald-status)', fontWeight: 800 }}>✓</span>
                <span style={{ color: 'var(--text-navy)', fontWeight: 600 }}>Verify positive cashflow balance (&gt; ₹1,00,000)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem' }}>
                <span style={{ color: 'var(--emerald-status)', fontWeight: 800 }}>✓</span>
                <span style={{ color: 'var(--text-navy)', fontWeight: 600 }}>Verify Platinum NetBanking tier status</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', opacity: 0.6 }}>
                <span style={{ color: 'var(--rose-status)', fontWeight: 800 }}>✕</span>
                <span style={{ textDecoration: 'line-through' }}>Unmasked account & routing numbers (Redacted)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.84rem', opacity: 0.6 }}>
                <span style={{ color: 'var(--rose-status)', fontWeight: 800 }}>✕</span>
                <span style={{ textDecoration: 'line-through' }}>Master password & security credentials (Never exposed)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="clay-btn-primary"
                style={{ flex: 1, padding: '9px 16px', fontSize: '0.85rem' }}
                onClick={() => setConsentGranted(true)}
              >
                Approve & Share Proof
              </button>
              <button
                type="button"
                className="clay-btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.85rem' }}
                onClick={() => setConsentGranted(false)}
              >
                Revoke
              </button>
            </div>
          </div>

          {/* Access Granted Status (Screen 12 right side) */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: 'var(--radius-md)', 
              padding: '20px', 
              boxShadow: 'var(--clay-shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {consentGranted ? (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-navy)', marginBottom: '4px' }}>
                  Verification Access Granted!
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  AITHOS agent verified solvency without accessing your private credentials.
                </p>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary-blue)', background: 'var(--primary-blue-subtle)', padding: '6px 12px', borderRadius: '6px' }}>
                  Proof Token: zkp_solvency_verified_77b4a2
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '10px' }}>
                  🛡️
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-navy)', marginBottom: '4px' }}>
                  Awaiting Agent Verification
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Click "Approve & Share Proof" to simulate selective disclosure verification.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="security-grid">
        {/* Account Authentication & Credentials */}
        <div className="clay-card info-card">
          <div className="info-card-header">
            <div style={{ color: 'var(--primary-blue)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2>Authentication & Security</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="detail-row">
              <span className="detail-label">Protected Identity</span>
              <span className="detail-value">{userProfile?.name || 'Alex Morgan'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Masked Identifier</span>
              <span className="detail-value mono">{userProfile?.accountNumberMasked || '•••• •••• •••• 8492'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">NetBanking IPIN</span>
              <span className="detail-value mono" style={{ letterSpacing: '0.2em' }}>
                ••••••••••••
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Credential Rotation</span>
              <span className="detail-value">Rotated 45 days ago</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Two-Factor Authentication</span>
              <span className="badge-pill badge-credit" style={{ fontSize: '0.72rem' }}>
                ✓ Enabled (TOTP)
              </span>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="clay-btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setShowPasswordModal(true)}
              >
                <span>Simulate IPIN Rotation</span>
              </button>
            </div>
          </div>
        </div>

        {/* AITHOS AI Privacy Agent Guardrails */}
        <div className="clay-card info-card">
          <div className="info-card-header">
            <div style={{ color: 'var(--primary-blue)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2>AITHOS Agent Guardrails</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="clay-inset" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-navy)' }}>Agent Access Scope</span>
                <span className="badge-pill badge-credit" style={{ fontSize: '0.7rem' }}>READ-ONLY</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Evaluation agents are restricted to analytical queries. Monetary execution and destructive mutation are disabled.
              </p>
            </div>

            <div className="clay-inset" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-navy)' }}>Window API Bridge</span>
                <span className="badge-pill badge-blue" style={{ fontSize: '0.7rem' }}>ACTIVE</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <code>window.AITHOS_BANK_API</code> is mounted for automated verification without scraping raw HTML.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Simulation Modal */}
      {showPasswordModal && (
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
          onClick={() => setShowPasswordModal(false)}
        >
          <div 
            className="clay-card animate-fade-in"
            style={{ maxWidth: '440px', width: '100%', padding: '32px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-navy)' }}>Simulate IPIN Rotation</h3>
              <button
                type="button"
                className="header-icon-btn"
                style={{ width: '30px', height: '30px' }}
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current IPIN / Password</label>
                <input
                  type="password"
                  className="clay-input"
                  placeholder="Enter current password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New IPIN / Password</label>
                <input
                  type="password"
                  className="clay-input"
                  placeholder="Minimum 8 characters"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New IPIN</label>
                <input
                  type="password"
                  className="clay-input"
                  placeholder="Confirm new password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="clay-btn-primary" style={{ flex: 1 }}>
                  Confirm Rotation
                </button>
                <button
                  type="button"
                  className="clay-btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
