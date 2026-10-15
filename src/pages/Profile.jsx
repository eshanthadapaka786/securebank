import React, { useState } from 'react';
import { formatINR } from '../data/mockData';

export default function Profile({ userProfile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || 'Alex Morgan',
    email: userProfile?.email || 'alex.morgan@securebank.in',
    phone: userProfile?.phone || '+91 98201 48293',
    address: userProfile?.address || 'Tower B, 14th Floor, Horizon Residences, BKC, Mumbai 400051'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="content-body animate-fade-in">
      {savedSuccess && (
        <div 
          style={{
            padding: '12px 20px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            color: '#065f46',
            fontWeight: 600,
            boxShadow: 'var(--clay-pill-shadow)'
          }}
        >
          ✓ Profile preferences updated successfully in local memory.
        </div>
      )}

      <div className="profile-grid">
        {/* Synthetic Personal Identity Card */}
        <div className="clay-card info-card">
          <div className="info-card-header">
            <div style={{ color: 'var(--blue-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
            <h2>Synthetic Customer Profile</h2>
          </div>

          {!isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div 
                  className="user-avatar" 
                  style={{ width: '64px', height: '64px', fontSize: '1.6rem', boxShadow: '4px 6px 16px rgba(24, 82, 219, 0.3)' }}
                >
                  {formData.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--blue-dark)' }}>{formData.name}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <span className="badge-pill badge-credit" style={{ fontSize: '0.72rem' }}>
                      e-KYC Verified
                    </span>
                    <span className="badge-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                      {userProfile?.tier || 'Platinum Privilege'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label">Full Legal Name</span>
                <span className="detail-value">{formData.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registered Email</span>
                <span className="detail-value">{formData.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registered Phone</span>
                <span className="detail-value">{formData.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Residential Address</span>
                <span className="detail-value" style={{ textAlign: 'right', maxWidth: '240px' }}>
                  {formData.address}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Customer ID</span>
                <span className="detail-value mono">{userProfile?.id || 'usr_sec_8492'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Relationship Since</span>
                <span className="detail-value">{userProfile?.memberSince || 'September 2021'}</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  className="clay-btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => setIsEditing(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>Edit Profile Details</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
                <input
                  type="text"
                  className="clay-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="clay-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="clay-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="clay-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="clay-btn-primary" style={{ flex: 1 }}>
                  Save Changes
                </button>
                <button 
                  type="button" 
                  className="clay-btn-secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="privacy-notice-box">
            <strong>AITHOS Privacy Shield:</strong> All identity attributes shown here are purely synthetic test fixtures. Zero live PII, PAN, or external credit records are queried.
          </div>
        </div>

        {/* Masked Banking Credentials Card */}
        <div className="clay-card info-card">
          <div className="info-card-header">
            <div style={{ color: 'var(--blue-primary)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <h2>Masked Banking Instruments (INR)</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="clay-inset" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)' }}>
                  PRIVILEGE SAVINGS ACCOUNT
                </span>
                <span className="badge-pill badge-blue" style={{ fontSize: '0.72rem' }}>
                  ACTIVE
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.06em', color: 'var(--blue-dark)' }}>
                {userProfile?.accountNumberMasked || '•••• •••• •••• 8492'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                IFSC Branch Code: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{userProfile?.ifscCode || 'SECB0008492'}</span>
              </div>
            </div>

            <div className="clay-inset" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-body)' }}>
                  FIXED DEPOSIT & WEALTH VAULT
                </span>
                <span className="badge-pill badge-credit" style={{ fontSize: '0.72rem' }}>
                  7.25% p.a.
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.06em', color: 'var(--blue-dark)' }}>
                •••• •••• •••• 9104
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Current Vault Value: <strong style={{ color: 'var(--status-credit)' }}>{formatINR(520000)}</strong>
              </div>
            </div>

            <div className="clay-inset" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-body)' }}>
                  TOKENIZED VIRTUAL DEBIT
                </span>
                <span className="badge-pill badge-debit" style={{ fontSize: '0.72rem' }}>
                  RUPAY PLATINUM
                </span>
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.06em', color: 'var(--blue-dark)' }}>
                •••• •••• •••• 8492
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Status: Tokenized • Single-Merchant Sandbox Protection
              </div>
            </div>
          </div>

          <div className="privacy-notice-box" style={{ marginTop: '24px' }}>
            <strong>Masking Invariant:</strong> Raw unmasked account and routing numbers are strictly prohibited from being rendered into the DOM or exposed via JavaScript windows.
          </div>
        </div>
      </div>
    </div>
  );
}
