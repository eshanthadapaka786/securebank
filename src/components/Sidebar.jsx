import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, userProfile, isMobileOpen, setIsMobileOpen }) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect width="7" height="9" x="3" y="3" rx="1.5" />
          <rect width="7" height="5" x="14" y="3" rx="1.5" />
          <rect width="7" height="9" x="14" y="12" rx="1.5" />
          <rect width="7" height="5" x="3" y="16" rx="1.5" />
        </svg>
      )
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 'wallet',
      label: 'Digital Vault',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Customer Profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 'security',
      label: 'Privacy & Security',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant (Qwen 2.0)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect width="18" height="18" x="3" y="3" rx="4" />
          <path d="m9 10 2 2 4-4" />
          <path d="M12 18h.01" />
        </svg>
      )
    }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand mark matching the reference (Clean 'S' in rounded electric blue square) */}
      <div className="brand-section">
        <div className="brand-logo-icon" aria-hidden="true">
          S
        </div>
        <div className="brand-title">
          SecureBank
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            type="button"
            className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Card at bottom of sidebar matching Screen 2 & 7 */}
      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="user-avatar" title={userProfile?.name || 'User'}>
            {userProfile?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="user-name-text">{userProfile?.name || 'Alex Morgan'}</div>
            <div className="user-role-text">{userProfile?.accountNumberMasked || '•••• 8492'}</div>
          </div>
        </div>

        <button
          type="button"
          className="header-icon-btn"
          style={{ width: '30px', height: '30px' }}
          onClick={onLogout}
          title="Sign out of session"
          aria-label="Sign out"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
