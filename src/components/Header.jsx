import React from 'react';

export default function Header({ activeTab, userProfile, isMobileOpen, setIsMobileOpen, onLogout }) {
  const getTabDetails = (tab) => {
    switch (tab) {
      case 'overview':
        return {
          title: 'Portal Hub',
          breadcrumb: 'Dashboard / Choose a Portal'
        };
      case 'transactions':
        return {
          title: 'Transaction Ledger',
          breadcrumb: 'Finance / Verifiable Ledger Records (INR)'
        };
      case 'wallet':
        return {
          title: 'Digital Vault',
          breadcrumb: 'Accounts / My Verifiable Digital Instruments'
        };
      case 'profile':
        return {
          title: 'Customer Profile',
          breadcrumb: 'Identity / Customer Details & KYC'
        };
      case 'security':
        return {
          title: 'Security & Privacy',
          breadcrumb: 'Governance / AITHOS Privacy Guardrails'
        };
      default:
        return {
          title: 'SecureBank Dashboard',
          breadcrumb: 'NetBanking / Home'
        };
    }
  };

  const details = getTabDetails(activeTab);

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="clay-btn-secondary"
          style={{ padding: '6px 10px', display: 'none' }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="header-title-container">
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {details.breadcrumb}
          </div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy)', margin: 0 }}>
            {details.title}
          </h1>
        </div>
      </div>

      <div className="header-right">
        {/* Notification Bell matching reference */}
        <button type="button" className="header-icon-btn" title="Notifications" aria-label="Notifications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        {/* User Profile Capsule matching Screens 2, 3, 4, 7 */}
        <div className="header-user-capsule" onClick={onLogout} title="Click to Sign Out">
          <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '0.78rem' }}>
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
          <span className="header-user-name">
            {userProfile?.name || 'Alex Morgan'}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
