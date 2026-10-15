import React, { useState } from 'react';
import { DEMO_CREDENTIALS, INITIAL_USER_PROFILE } from '../data/mockData';

export default function Login({ onLoginSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (key) => {
    const creds = DEMO_CREDENTIALS[key];
    if (creds) {
      setIsLoading(true);
      setTimeout(() => {
        onLoginSuccess({
          ...INITIAL_USER_PROFILE,
          name: creds.customerName,
          email: creds.email,
          role: creds.role
        });
        setIsLoading(false);
      }, 300);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const isPrimary = email === DEMO_CREDENTIALS.primary.email && password === DEMO_CREDENTIALS.primary.password;
      const isSecondary = email === DEMO_CREDENTIALS.secondary.email && password === DEMO_CREDENTIALS.secondary.password;

      if (isPrimary || isSecondary) {
        onLoginSuccess({
          ...INITIAL_USER_PROFILE,
          name: isPrimary ? DEMO_CREDENTIALS.primary.customerName : DEMO_CREDENTIALS.secondary.customerName,
          email: email,
          role: isPrimary ? DEMO_CREDENTIALS.primary.role : DEMO_CREDENTIALS.secondary.role
        });
      } else {
        setErrorMessage('Invalid credentials. Select 1-Click Sandbox below to proceed.');
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)', backgroundImage: 'var(--bg-gradient)' }}>
      {/* Screen 1: Top Landing Navbar */}
      <nav className="landing-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="brand-logo-icon" style={{ width: '38px', height: '38px', fontSize: '1.25rem' }}>
            S
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-navy)' }}>
            SecureBank
          </span>
        </div>

        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Overview</a>
          <a href="#security" className="landing-nav-link">AITHOS Security</a>
          <a href="#portals" className="landing-nav-link">Portals</a>
          <a href="#how" className="landing-nav-link">How it works</a>
        </div>

        <button
          type="button"
          className="clay-btn-primary"
          style={{ padding: '8px 22px', fontSize: '0.88rem' }}
          onClick={() => setShowAuthModal(true)}
        >
          Sign In
        </button>
      </nav>

      {/* Screen 1: Hero Section */}
      <section className="landing-hero-section animate-fade-in">
        <div>
          <h1 className="hero-main-title">
            Your finances.
            <span className="hero-highlight-text">Your control.</span>
          </h1>
          <p className="hero-subtext">
            Securely manage, prove, and audit your financial records — without sharing more data than you need with AI agents.
          </p>

          <div className="hero-buttons-wrap">
            <button
              type="button"
              className="clay-btn-primary"
              style={{ padding: '12px 30px', fontSize: '0.96rem' }}
              onClick={() => setShowAuthModal(true)}
            >
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>

            <button
              type="button"
              className="clay-btn-secondary"
              style={{ padding: '12px 26px', fontSize: '0.96rem' }}
              onClick={() => handleQuickLogin('primary')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>1-Click Demo Access</span>
            </button>
          </div>
        </div>

        {/* 3D Floating Clay Graphics from Screen 1 */}
        <div className="hero-3d-clay-graphic">
          <div className="clay-center-block">
            <span className="clay-center-logo-letter">S</span>
          </div>

          {/* Floating Satellites (Shield, Pillars, Wallet, Fingerprint) */}
          <div className="floating-clay-satellite sat-top-left" title="Institutional Vault">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>

          <div className="floating-clay-satellite sat-top-right" title="Verified Security">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <div className="floating-clay-satellite sat-bottom-left" title="Personal Identity">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <div className="floating-clay-satellite sat-bottom-right" title="Selective Disclosure">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Screen 1: 4 Feature Chips in a Row */}
      <div className="landing-feature-chips-row">
        <div className="feature-chip-card">
          <div className="chip-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="chip-text-wrap">
            <span className="chip-title">User-owned data</span>
            <span className="chip-sub">You control your financial telemetry</span>
          </div>
        </div>

        <div className="feature-chip-card">
          <div className="chip-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="chip-text-wrap">
            <span className="chip-title">Selective disclosure</span>
            <span className="chip-sub">Share only what's needed with agents</span>
          </div>
        </div>

        <div className="feature-chip-card">
          <div className="chip-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="chip-text-wrap">
            <span className="chip-title">Decentralized & secure</span>
            <span className="chip-sub">Zero-leakage AITHOS sandbox</span>
          </div>
        </div>

        <div className="feature-chip-card">
          <div className="chip-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="chip-text-wrap">
            <span className="chip-title">Works across platforms</span>
            <span className="chip-sub">Standardized deterministic API</span>
          </div>
        </div>
      </div>

      {/* NetBanking Sign In Modal */}
      {showAuthModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(13, 30, 58, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="clay-card animate-fade-in"
            style={{ maxWidth: '440px', width: '100%', padding: '36px', background: '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="brand-logo-icon" style={{ width: '32px', height: '32px', fontSize: '1rem' }}>S</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-navy)', margin: 0 }}>
                  NetBanking Sign In
                </h3>
              </div>
              <button
                type="button"
                className="header-icon-btn"
                style={{ width: '30px', height: '30px' }}
                onClick={() => setShowAuthModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Quick 1-Click Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div 
                className="clay-inset" 
                style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => handleQuickLogin('primary')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-navy)' }}>Alex Morgan</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{DEMO_CREDENTIALS.primary.email}</div>
                </div>
                <span className="badge-pill badge-blue" style={{ fontSize: '0.7rem' }}>1-Click Login</span>
              </div>

              <div 
                className="clay-inset" 
                style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => handleQuickLogin('secondary')}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-navy)' }}>AITHOS Evaluator</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{DEMO_CREDENTIALS.secondary.email}</div>
                </div>
                <span className="badge-pill badge-credit" style={{ fontSize: '0.7rem' }}>Agent Sandbox</span>
              </div>
            </div>

            {errorMessage && (
              <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email or Customer ID</label>
                <input
                  type="email"
                  className="clay-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@securebank.in"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="clay-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter demo password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="clay-btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
