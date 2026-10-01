import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data/tools';
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Global hotkey listener for "/" and "Ctrl/Cmd + K"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? TOOLS.filter((t) => {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.supportedFormats.some((fmt) => fmt.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        window.location.href = `/${target.slug}/`;
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const quickPills = [
    { label: 'Compress Image', slug: 'image-compressor' },
    { label: 'Merge PDF', slug: 'pdf-merger' },
    { label: 'JPG to PNG', slug: 'jpg-to-png' },
    { label: 'QR Code', slug: 'qr-code-generator' },
    { label: 'Word Counter', slug: 'word-counter' }
  ];

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-input-group">
        <Search className="search-icon" size={18} />
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          placeholder="Search 20+ offline tools (e.g. compress, merge pdf, webp)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Search all tools"
          autoComplete="off"
        />
        <div className="search-kbd">
          <span>⌘K</span>
        </div>
      </div>

      {/* Suggested Quick Action Chips */}
      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginTop: '0.85rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginRight: '0.25rem', display: 'flex', alignItems: 'center' }}>
          Suggested:
        </span>
        {quickPills.map((pill) => (
          <a
            key={pill.slug}
            href={`/${pill.slug}/`}
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '2px 8px',
              borderRadius: '9999px',
              textDecoration: 'none'
            }}
          >
            {pill.label}
          </a>
        ))}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="search-results-dropdown" role="listbox">
          {filtered.map((item, idx) => (
            <a
              key={item.slug}
              href={`/${item.slug}/`}
              className={`search-item ${idx === selectedIndex ? 'highlighted' : ''}`}
              role="option"
              aria-selected={idx === selectedIndex}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="search-item-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h4>{item.name}</h4>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {item.supportedFormats.slice(0, 3).map((fmt) => (
                      <span key={fmt} className="format-chip">{fmt}</span>
                    ))}
                  </div>
                </div>
                <p>{item.description}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.75rem' }}>Open</span>
                <CornerDownLeft size={14} />
              </div>
            </a>
          ))}
        </div>
      )}

      {isOpen && query.trim() && filtered.length === 0 && (
        <div className="search-results-dropdown" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No tool matched "{query}". Try "compress", "pdf", "jpg", or "resize".
        </div>
      )}
    </div>
  );
}
