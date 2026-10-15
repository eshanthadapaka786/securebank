import React, { useState, useEffect } from 'react';
import { TabType, HealthStatus } from './types';
import { getHealth } from './lib/api';
import { Navbar } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { TimelinePage } from './pages/TimelinePage';
import { ScannerPage } from './pages/ScannerPage';
import { AuditPage } from './pages/AuditPage';
import { SettingsPage } from './pages/SettingsPage';
import { Shield, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isLoadingHealth, setIsLoadingHealth] = useState<boolean>(true);

  const checkHealth = async () => {
    try {
      const data = await getHealth();
      setHealth(data);
      setBackendOnline(true);
    } catch (err) {
      setBackendOnline(false);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll health periodically to maintain honest system states
    const interval = setInterval(checkHealth, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans text-[#0B192C]">
      {/* Navbar with brand header & honest connection monitors */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        health={health}
        backendOnline={backendOnline}
      />

      {/* Offline Alert Banner if backend is not yet started */}
      {!backendOnline && !isLoadingHealth && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>
            <strong>Backend Disconnected:</strong> AITHOS FastAPI server is not responding on{' '}
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">http://127.0.0.1:8000</code>.
            Start the backend in PowerShell with:{' '}
            <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">
              .\backend_venv\Scripts\uvicorn.exe backend.app.main:app --port 8000 --reload
            </code>
          </span>
          <button
            onClick={checkHealth}
            className="ml-2 font-bold underline hover:text-amber-950 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewPage
            health={health}
            backendOnline={backendOnline}
            onRefreshHealth={checkHealth}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'workspace' && <WorkspacePage />}

        {activeTab === 'timeline' && <TimelinePage />}

        {activeTab === 'scanner' && <ScannerPage />}

        {activeTab === 'audit' && <AuditPage />}

        {activeTab === 'settings' && <SettingsPage onRefreshHealth={checkHealth} />}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-sky-600" />
            <span>AITHOS Agent — Privacy-Preserving Agentic AI</span>
            <span className="text-slate-300">•</span>
            <span>Local Redaction & Zero-Leak Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Reference Branding: <a href="https://aithos-protect.mohansaikrishnab1801.workers.dev/" target="_blank" rel="noreferrer" className="text-sky-600 hover:underline">AITHOS Protect</a></span>
            <span>Demonstration only. Every test account is synthetic.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
