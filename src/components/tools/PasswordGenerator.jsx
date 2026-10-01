import React, { useState, useEffect } from 'react';
import { trackEvent } from '../../utils/analytics';
import { KeyRound, Copy, Check, RefreshCw, ShieldCheck } from 'lucide-react';

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }

    setPassword(result);
    trackEvent('tool_completed', 'password-generator');
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Entropy Calculation: E = L * log2(R)
  let poolSize = 0;
  if (useUpper) poolSize += 26;
  if (useLower) poolSize += 26;
  if (useNumbers) poolSize += 10;
  if (useSymbols) poolSize += 28;
  const entropy = Math.round(length * Math.log2(Math.max(2, poolSize)));

  const getStrengthLabel = () => {
    if (entropy < 40) return { label: 'Weak', color: '#ef4444' };
    if (entropy < 65) return { label: 'Moderate', color: '#f59e0b' };
    if (entropy < 85) return { label: 'Strong', color: '#10b981' };
    return { label: 'Military-Grade Unbreakable', color: '#818cf8' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="tool-workbench">
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <input
          type="text"
          readOnly
          value={password}
          className="custom-input"
          style={{
            fontSize: '1.35rem',
            padding: '1.25rem 4rem 1.25rem 1.25rem',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
            letterSpacing: '0.05em',
            background: 'var(--bg-tertiary)',
            color: '#f8fafc'
          }}
        />
        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={copyToClipboard}
            className="btn btn-primary btn-sm"
            title="Copy password"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            onClick={generate}
            className="btn btn-secondary btn-sm"
            title="Generate new password"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="file-stats-grid">
        <div className="stat-box">
          <div className="stat-label">Entropy Score</div>
          <div className="stat-value">{entropy} Bits</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Strength Rating</div>
          <div className="stat-value" style={{ color: strength.color }}>{strength.label}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Crack Time Estimate</div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {entropy > 80 ? 'Centuries+' : entropy > 60 ? 'Years' : 'Minutes'}
          </div>
        </div>
      </div>

      <div className="workbench-settings">
        <div className="setting-group" style={{ gridColumn: 'span 2' }}>
          <div className="setting-label">
            <span>Password Length</span>
            <span className="setting-value">{length} Characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="range-slider"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', gridColumn: 'span 2' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
            <span>Uppercase Letters (A-Z)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />
            <span>Lowercase Letters (a-z)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
            <span>Numbers (0-9)</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
            <span>Special Symbols (!@#$%^&*)</span>
          </label>
        </div>
      </div>

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>Cryptographically Secure:</strong> Powered by your browser native crypto.getRandomValues(). Never transmitted across the internet.</span>
      </div>
    </div>
  );
}
