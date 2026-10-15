import React from 'react';
import {
  Shield,
  Activity,
  Cpu,
  Layers,
  FileText,
  Sliders,
  Terminal,
  Server,
  Globe,
  Radio,
} from 'lucide-react';
import { TabType, HealthStatus } from '../types';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  health: HealthStatus | null;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  health,
  backendOnline,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'workspace', label: 'Agent Workspace', icon: <Terminal className="w-4 h-4" /> },
    { id: 'timeline', label: 'Live Activity', icon: <Activity className="w-4 h-4" /> },
    { id: 'scanner', label: 'Privacy Scanner', icon: <Shield className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1E3E62] via-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-[#0B192C]">
                  AITHOS
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 tracking-wide uppercase">
                  Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI should know what it needs — not everything about you.
              </p>
            </div>
          </div>

          {/* System Connection Indicators */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Backend */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Backend:</span>
              <StatusBadge
                status={backendOnline ? 'CONNECTED' : 'OFFLINE'}
                label={backendOnline ? 'Online' : 'Offline'}
                size="sm"
              />
            </div>

            {/* Privacy Engine */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Privacy:</span>
              <StatusBadge
                status={health?.privacy_engine?.status === 'ACTIVE' ? 'ACTIVE' : 'OFFLINE'}
                label={health?.privacy_engine?.status === 'ACTIVE' ? 'Active' : 'Standby'}
                size="sm"
              />
            </div>

            {/* AI Model */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">Model:</span>
              <StatusBadge
                status={health?.ai_model?.available ? 'ONLINE' : 'UNAVAILABLE'}
                label={health?.ai_model?.available ? 'Ollama Online' : 'Unavailable'}
                size="sm"
              />
            </div>

            {/* FakeBank */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 font-medium">FakeBank:</span>
              <StatusBadge
                status={
                  health?.fakebank?.connected
                    ? 'CONNECTED'
                    : 'AWAITING_INTEGRATION'
                }
                label={health?.fakebank?.connected ? 'Connected' : 'Awaiting'}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 pb-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1E3E62] to-[#0284C7] text-white shadow-md shadow-sky-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'timeline' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
