import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function AIAssistant({ userProfile }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  // Quick prompt presets
  const presets = [
    {
      label: 'Highest Expenses (₹)',
      prompt: 'Sort all recent transactions by amount in descending order (highest first)',
    },
    {
      label: 'Monthly Cashflow',
      prompt: 'Calculate total credits and debits from my SecureBank statement and show net impact',
    },
    {
      label: 'October Groceries & Dining',
      prompt: 'Filter all transactions for October 2026 and highlight dining and grocery expenses',
    },
    {
      label: 'Search Amazon Purchases',
      prompt: 'Search statement for Amazon India transactions',
    },
    {
      label: 'Test Blocked Transfer',
      prompt: 'Transfer ₹50,000 from account SECB-008492019482 to external beneficiary',
    },
  ];

  // Poll system health
  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealth(null);
      }
    } catch {
      setHealth(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll running task
  useEffect(() => {
    if (!task || (task.status !== 'RUNNING' && task.status !== 'PENDING')) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/tasks/${task.task_id}`);
        if (res.ok) {
          const updated = await res.json();
          setTask(updated);
          if (updated.status !== 'RUNNING' && updated.status !== 'PENDING') {
            setIsLoading(false);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [task?.task_id, task?.status]);

  const handleSubmit = async (customPrompt) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    setError(null);
    setTask(null);

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit }),
      });

      if (!res.ok) {
        throw new Error(`Agent request failed: ${res.statusText}`);
      }

      const newTask = await res.json();
      setTask(newTask);
      setPrompt('');
    } catch (err) {
      setError(err.message || 'Failed to submit task to AITHOS AI');
      setIsLoading(false);
    }
  };

  return (
    <div className="content-body animate-fade-in" style={{ paddingBottom: '40px' }}>
      {/* Top Banner / Hero Card */}
      <div className="clay-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div className="card-title-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #1852db, #091e42)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                Q2
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-navy)' }}>
                  AITHOS AI Financial Assistant
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Powered by local <strong>Qwen 2.0 (Ollama)</strong> with zero customer data leakage
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Health Badges */}
            <span 
              className="badge-pill" 
              style={{ 
                background: health?.ai_model?.available ? '#ecfdf5' : '#fff1f2',
                color: health?.ai_model?.available ? '#065f46' : '#9f1239',
                border: `1px solid ${health?.ai_model?.available ? '#a7f3d0' : '#fecdd3'}`
              }}
            >
              {health?.ai_model?.available 
                ? `● Qwen 2.0 (${health.ai_model.selected_model})` 
                : '○ Ollama Offline'}
            </span>

            <span 
              className="badge-pill" 
              style={{ 
                background: '#eff6ff', 
                color: '#1d4ed8', 
                border: '1px solid #bfdbfe' 
              }}
            >
              ● Privacy Guardrail: Active
            </span>
          </div>
        </div>

        {/* Feature summary pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '18px' }}>
          <div className="clay-inset" style={{ padding: '12px 16px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              AI Model Engine
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-navy)', marginTop: '4px' }}>
              Qwen 2.0 Local LLM
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Deterministic JSON output via Ollama
            </div>
          </div>

          <div className="clay-inset" style={{ padding: '12px 16px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Privacy Protection
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald-status)', marginTop: '4px' }}>
              Zero-PII Tokenization
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Accounts & PAN scrubbed locally
            </div>
          </div>

          <div className="clay-inset" style={{ padding: '12px 16px' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', fontWeight: 700 }}>
              Security Policy
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-navy)', marginTop: '4px' }}>
              Read-Only Whitelist
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Mutations & transfers blocked by policy
            </div>
          </div>
        </div>
      </div>

      {/* Input & Presets Card */}
      <div className="clay-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-navy)', marginBottom: '12px' }}>
          Ask Financial Assistant
        </h3>

        {/* Preset Prompt Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="clay-btn-secondary"
              style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: '8px' }}
              onClick={() => handleSubmit(p.prompt)}
              disabled={isLoading}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Text Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          style={{ display: 'flex', gap: '10px' }}
        >
          <input
            type="text"
            className="clay-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Qwen 2.0 to inspect, sort, calculate, or search your transactions in INR..."
            disabled={isLoading}
            style={{ flex: 1, fontSize: '0.9rem' }}
          />
          <button
            type="submit"
            className="clay-btn-primary"
            disabled={isLoading || !prompt.trim()}
            style={{ padding: '0 24px', fontSize: '0.9rem', minWidth: '140px' }}
          >
            {isLoading ? 'Reasoning...' : 'Submit to Qwen 2.0'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.82rem', fontWeight: 600 }}>
            {error}
          </div>
        )}
      </div>

      {/* Task Execution Result View */}
      {task && (
        <div className="clay-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Task #{task.task_id}
              </span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--text-navy)' }}>
                {task.prompt}
              </h3>
            </div>

            <span
              className="badge-pill"
              style={{
                background: task.status === 'COMPLETED' ? '#ecfdf5' : task.status === 'BLOCKED' ? '#fff1f2' : '#eff6ff',
                color: task.status === 'COMPLETED' ? '#065f46' : task.status === 'BLOCKED' ? '#9f1239' : '#1d4ed8',
                fontWeight: 800
              }}
            >
              {task.status}
            </span>
          </div>

          {/* Qwen 2.0 Reasoning & Deduction */}
          {task.execution_summary?.model_reasoning && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b' }}>
                  🤖 Qwen 2.0 Local Analytical Deduction
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontWeight: 700 }}>
                  {task.execution_summary?.model_used || 'qwen2:latest'}
                </span>
              </div>

              {task.execution_summary?.direct_answer && (
                <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, marginBottom: '10px', lineHeight: 1.5 }}>
                  {task.execution_summary.direct_answer}
                </div>
              )}

              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569', background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', lineHeight: 1.6 }}>
                {task.execution_summary.model_reasoning}
              </div>
            </div>
          )}

          {/* Sanitized Context Verification */}
          {task.sanitized_prompt && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Zero-Leak Sanitized Input Sent to Qwen 2.0:
              </div>
              <pre style={{ background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', fontSize: '0.75rem', color: '#334155', margin: 0, whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto' }}>
                {task.sanitized_prompt}
              </pre>
            </div>
          )}

          {/* Final Verified Ledger Calculation */}
          {task.final_response && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e40af', marginBottom: '8px' }}>
                📊 Verified Ledger Output (Indian Rupees - ₹)
              </div>
              <pre style={{ background: '#ffffff', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#1e293b', margin: 0, whiteSpace: 'pre-wrap', border: '1px solid #dbeafe' }}>
                {task.final_response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
