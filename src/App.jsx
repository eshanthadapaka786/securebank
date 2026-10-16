import React, { useState } from 'react';
import './App.css';
import './services/aithosInterface'; // Mount window.AITHOS_BANK_API
import { INITIAL_USER_PROFILE } from './data/mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Security from './pages/Security';
import AIAssistant from './pages/AIAssistant';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('securebank_auth_session') === 'active';
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('securebank_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserProfile(user);
    localStorage.setItem('securebank_auth_session', 'active');
    localStorage.setItem('securebank_user_profile', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('securebank_auth_session');
    setActiveTab('overview');
  };

  const handleUpdateProfile = (updatedFields) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('securebank_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const handleNavigateWithCategory = (category) => {
    setCategoryFilter(category);
    setActiveTab('transactions');
  };

  // If user is not authenticated, display the landing / login screen
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar navigation matching reference */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userProfile={userProfile}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="main-wrapper">
        {/* Dynamic header with user capsule and breadcrumbs */}
        <Header
          activeTab={activeTab}
          userProfile={userProfile}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={handleLogout}
        />

        {/* Tab Content */}
        <main>
          {activeTab === 'overview' && (
            <Dashboard
              userProfile={userProfile}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectCategoryFilter={handleNavigateWithCategory}
            />
          )}

          {activeTab === 'transactions' && (
            <Transactions initialCategoryFilter={categoryFilter} />
          )}

          {activeTab === 'wallet' && (
            <Wallet onNavigateTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'profile' && (
            <Profile
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'security' && (
            <Security userProfile={userProfile} />
          )}

          {activeTab === 'ai-assistant' && (
            <AIAssistant userProfile={userProfile} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
