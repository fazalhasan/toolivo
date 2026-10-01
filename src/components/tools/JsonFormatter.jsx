import React, { useState } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import { Code2, Copy, Check, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState('{"platform":"Toolivo","version":"1.0.0","features":["100% Client-Side","Free Forever","Bank-Grade Privacy"]}');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces) => {
    setError('');
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, spaces));
      trackEvent('tool_completed', 'json-formatter');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const minifyJson = () => {
    setError('');
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      trackEvent('tool_completed', 'json-formatter');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const byteLength = new Blob([inputJson]).size;

  return (
    <div className="tool-workbench">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={() => formatJson(2)} className="btn btn-secondary btn-sm">
            Prettify (2 Spaces)
          </button>
          <button type="button" onClick={() => formatJson(4)} className="btn btn-secondary btn-sm">
            Prettify (4 Spaces)
          </button>
          <button type="button" onClick={minifyJson} className="btn btn-secondary btn-sm">
            Minify (1-Line)
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Size: {formatFileSize(byteLength)}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            setError('');
          }}
          placeholder="Paste JSON payload here..."
          rows={12}
          className="custom-input"
          style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', resize: 'vertical' }}
        />
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '1rem', background: 'var(--error-bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={copyToClipboard} className="btn btn-primary btn-sm">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Formatted JSON'}
        </button>
        <button type="button" onClick={() => setInputJson('')} className="btn btn-outline btn-sm">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% In-Browser:</strong> Safely inspect private JSON payloads and tokens on your machine.</span>
      </div>
    </div>
  );
}
