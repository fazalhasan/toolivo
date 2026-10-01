import React, { useState } from 'react';
import { trackEvent } from '../../utils/analytics';
import { AlignLeft, Copy, Trash2, Check, Clock, Mic, ShieldCheck } from 'lucide-react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Metrics
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = trimmed ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  // Reading time (225 wpm) & Speaking time (130 wpm)
  const readingTimeMin = Math.ceil(words / 225);
  const speakingTimeMin = Math.ceil(words / 130);

  // Keyword density
  const getKeywords = () => {
    if (!trimmed) return [];
    const stopWords = new Set(['the','and','a','to','of','in','i','is','that','it','on','you','this','for','but','with','are','have','be','at','or','as','was','so','if','out','not']);
    const wordList = trimmed.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const counts = {};
    wordList.forEach((w) => {
      if (!stopWords.has(w)) counts[w] = (counts[w] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        pct: Math.round((count / wordList.length) * 100)
      }));
  };

  const keywords = getKeywords();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-workbench">
      <div className="file-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-box">
          <div className="stat-label">Words</div>
          <div className="stat-value" style={{ color: '#818cf8' }}>{words}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Characters</div>
          <div className="stat-value">{charsWithSpaces}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Sentences</div>
          <div className="stat-value">{sentences}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Paragraphs</div>
          <div className="stat-value">{paragraphs}</div>
        </div>
      </div>

      <div style={{ margin: '1.5rem 0' }}>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (e.target.value.length === 10) trackEvent('tool_started', 'word-counter');
          }}
          placeholder="Type or paste your text here..."
          rows={10}
          className="custom-input"
          style={{ width: '100%', resize: 'vertical', fontSize: '1.05rem', lineHeight: '1.6' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={16} color="#38bdf8" /> ~{readingTimeMin} min read
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Mic size={16} color="#a855f7" /> ~{speakingTimeMin} min speech
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" onClick={handleCopy} className="btn btn-primary btn-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
          <button type="button" onClick={() => setText('')} className="btn btn-outline btn-sm">
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      {keywords.length > 0 && (
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Top Keyword Frequency</h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {keywords.map((k) => (
              <span key={k.word} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                <strong>{k.word}</strong>: {k.count} ({k.pct}%)
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Confidential:</strong> Your text is never stored or sent to remote servers.</span>
      </div>
    </div>
  );
}
