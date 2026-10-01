import React, { useState } from 'react';
import { trackEvent } from '../../utils/analytics';
import { Palette, Copy, Check, Pipette, ShieldCheck } from 'lucide-react';

export default function ColorPicker() {
  const [color, setColor] = useState('#4f46e5');
  const [copiedKey, setCopiedKey] = useState('');

  // Conversion math
  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgb = hexToRgb(color);

  const rgbToHsl = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hsl = rgbToHsl(rgb);

  const rgbToCmyk = ({ r, g, b }) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c, m, y, k };
  };

  const cmyk = rgbToCmyk(rgb);

  // Generate Harmonious Palettes
  const getComplementary = () => `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`;
  const getAnalogous1 = () => `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`;
  const getAnalogous2 = () => `hsl(${(hsl.h + 330) % 360}, ${hsl.s}%, ${hsl.l}%)`;
  const getTriad1 = () => `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`;
  const getTriad2 = () => `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`;

  const copyVal = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    trackEvent('tool_completed', 'color-picker');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const pickEyedropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setColor(result.sRGBHex);
      } catch (e) {
        // Cancelled
      }
    }
  };

  return (
    <div className="tool-workbench">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '100%',
              height: '180px',
              borderRadius: 'var(--radius-lg)',
              background: color,
              boxShadow: 'var(--shadow-xl)',
              marginBottom: '1rem',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '56px', height: '44px', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'transparent' }}
            />
            {'EyeDropper' in (typeof window !== 'undefined' ? window : {}) && (
              <button type="button" onClick={pickEyedropper} className="btn btn-secondary btn-sm">
                <Pipette size={16} /> Pick from Screen
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'HEX', val: color.toUpperCase() },
            { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: 'HSL', val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            { label: 'CMYK', val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` }
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{item.label}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.95rem' }}>{item.val}</span>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => copyVal(item.label, item.val)}
              >
                {copiedKey === item.label ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copiedKey === item.label ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Harmonious Color Palettes</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Complementary', bg: getComplementary() },
            { label: 'Analogous A', bg: getAnalogous1() },
            { label: 'Analogous B', bg: getAnalogous2() },
            { label: 'Triadic A', bg: getTriad1() },
            { label: 'Triadic B', bg: getTriad2() }
          ].map((p) => (
            <div
              key={p.label}
              style={{
                background: p.bg,
                height: '70px',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'flex-end',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0, 0, 0, 0.65)', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% In-Browser:</strong> Client-side color math execution.</span>
      </div>
    </div>
  );
}
