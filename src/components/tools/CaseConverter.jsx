import React, { useState } from 'react';
import { trackEvent } from '../../utils/analytics';
import { Type, Copy, Check, Trash2, ShieldCheck } from 'lucide-react';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const toTitleCase = (str) => {
    const smallWords = /^(a|an|and|as|at|but|by|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
    return str.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, (match, index, title) => {
      if (index > 0 && index + match.length !== title.length &&
        match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
        (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }
      return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
    });
  };

  const toSentenceCase = (str) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '');
  };

  const toKebabCase = (str) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const applyFormat = (fn) => {
    if (!text) return;
    setText(fn(text));
    trackEvent('tool_completed', 'case-converter');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-workbench">
      <div style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert case..."
          rows={7}
          className="custom-input"
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button type="button" onClick={() => applyFormat(toTitleCase)} className="btn btn-secondary btn-sm">
          Title Case
        </button>
        <button type="button" onClick={() => applyFormat(toSentenceCase)} className="btn btn-secondary btn-sm">
          Sentence case
        </button>
        <button type="button" onClick={() => applyFormat((s) => s.toUpperCase())} className="btn btn-secondary btn-sm">
          UPPERCASE
        </button>
        <button type="button" onClick={() => applyFormat((s) => s.toLowerCase())} className="btn btn-secondary btn-sm">
          lowercase
        </button>
        <button type="button" onClick={() => applyFormat(toCamelCase)} className="btn btn-secondary btn-sm">
          camelCase
        </button>
        <button type="button" onClick={() => applyFormat(toSnakeCase)} className="btn btn-secondary btn-sm">
          snake_case
        </button>
        <button type="button" onClick={() => applyFormat(toKebabCase)} className="btn btn-secondary btn-sm">
          kebab-case
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={handleCopy} className="btn btn-primary btn-sm">
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button type="button" onClick={() => setText('')} className="btn btn-outline btn-sm">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% In-Browser:</strong> Your text never leaves your device.</span>
      </div>
    </div>
  );
}
