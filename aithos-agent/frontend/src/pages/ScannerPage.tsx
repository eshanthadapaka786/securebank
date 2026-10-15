import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Hash,
  Copy,
  Check,
  Zap,
  RefreshCw,
  EyeOff,
} from 'lucide-react';
import { scanPrivacy } from '../lib/api';
import { PrivacyScanResponse } from '../types';

export const ScannerPage: React.FC = () => {
  const presets = [
    {
      title: 'Banking Statement Context',
      text: `Customer Statement for Rajesh Sharma
Email: rajesh.sharma.99@gmail.com
Primary Phone: +91 98765 43210
Account Number: Acc No. 492019482019
PAN Card: ABCDE1234F
Debit Card: 4532-0000-0000-1007
IBAN: GB29NWBK60161331926819
Password hint in note: password=SuperSecretPass!
OTP for transaction: OTP: 849201`,
    },
    {
      title: 'Customer Support Escalation',
      text: `Urgent ticket from sarah.connor@cyberdyne.org
Phone: (555) 382-9901
SSN for identity verify: 123-45-6789
User mentioned previous bank account: acct# 994820184
Please do not share my credentials.`,
    },
    {
      title: 'Authentication Form Input',
      text: `Form submission payload:
username: michael_scott
user_email: michael.scott@dundermifflin.com
auth_token_temp: 9942-1823-9994-1110
pin_code: 4892
secret_key: pwd=DunderMifflin2026!`,
    },
  ];

  const [inputText, setInputText] = useState<string>(presets[0].text);
  const [scanResult, setScanResult] = useState<PrivacyScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (textToScan?: string) => {
    const text = textToScan || inputText;
    if (!text.trim()) return;

    setIsScanning(true);
    setError(null);
    try {
      const res = await scanPrivacy(text);
      setScanResult(res);
    } catch (err: any) {
      setError(err.message || 'Privacy scan request failed');
    } finally {
      setIsScanning(false);
    }
  };

  const copySanitizedText = () => {
    if (scanResult?.sanitized_text) {
      navigator.clipboard.writeText(scanResult.sanitized_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Deterministic Local Privacy Engine
        </div>
        <h1 className="text-2xl font-bold text-[#0B192C]">Privacy Scanner & Redaction Testbed</h1>
        <p className="text-sm text-slate-600 mt-1">
          Input untrusted raw text or DOM snippets to see how AITHOS deterministically discovers and
          masks sensitive customer data before it ever reaches an AI model.
        </p>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Synthetic Presets:
        </span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(p.text);
              handleScan(p.text);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 hover:text-sky-800 text-slate-700 text-xs font-medium border border-slate-200/80 shadow-sm transition-all"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Main Dual Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Raw Input Panel */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Raw Untrusted Text (Device Memory Only)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {inputText.length} chars
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw text with emails, phone numbers, account numbers, or credentials..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white shadow-inner transition-all leading-relaxed"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => handleScan()}
              disabled={isScanning || !inputText.trim()}
              className="clay-button-primary px-6 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Redacting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  Scan & Sanitize
                </>
              )}
            </button>

            <span className="text-xs text-slate-400 flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5" />
              Raw strings never leave local process
            </span>
          </div>
        </div>

        {/* Right: Sanitized Model-Safe Output */}
        <div className="clay-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Sanitized Payload (Safe for AI Reasoning)
              </span>

              {scanResult && (
                <button
                  onClick={copySanitizedText}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="w-full h-[288px] overflow-y-auto px-4 py-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800 shadow-inner">
              {scanResult ? (
                <pre className="whitespace-pre-wrap">{scanResult.sanitized_text}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <span>Click "Scan & Sanitize" to generate safe payload</span>
                </div>
              )}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Zero sensitive values transmitted</span>
            </div>

            {scanResult && (
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                SHA-256: {scanResult.checksum.substring(0, 16)}...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detection Metrics & Breakdown */}
      {scanResult && (
        <div className="clay-card p-6 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Redaction Inspection Report</h3>
              <p className="text-xs text-slate-500">
                Verification proof that entities were matched and securely tokenized.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                {scanResult.total_entities_masked} Total Entities Masked
              </div>
              <div className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
                {Object.keys(scanResult.detection_counts).length} Distinct Categories
              </div>
            </div>
          </div>

          {/* Category Counts Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Category Breakdown
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(scanResult.detection_counts).map(([cat, count]) => (
                <div key={cat} className="clay-inset-panel p-3 text-center">
                  <span className="text-xl font-extrabold text-[#0B192C]">{count}</span>
                  <span className="block text-[11px] font-semibold text-slate-600 mt-1 uppercase truncate">
                    {cat.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Metadata Table (Strictly NO raw values) */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Safe Token Metadata (Logged to Audit Trail)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Placeholder Assigned</th>
                    <th className="py-2.5 px-4">Entity Category</th>
                    <th className="py-2.5 px-4">Detection Method</th>
                    <th className="py-2.5 px-4">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {scanResult.safe_metadata.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-emerald-600">
                        {item.placeholder}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">{item.category}</td>
                      <td className="py-2.5 px-4 text-slate-500">{item.field_name}</td>
                      <td className="py-2.5 px-4 text-slate-800 font-bold">{item.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
