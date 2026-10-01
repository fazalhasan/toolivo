import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { trackEvent } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { QrCode, Download, Copy, Check, ShieldCheck } from 'lucide-react';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://toolivo.com');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState('M');
  const [size, setSize] = useState(300);
  const [pngDataUrl, setPngDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const generateCode = async () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: ecLevel
      });

      const url = canvasRef.current.toDataURL('image/png');
      setPngDataUrl(url);
      trackEvent('tool_completed', 'qr-code-generator');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateCode();
  }, [text, fgColor, bgColor, ecLevel, size]);

  const copyToClipboard = async () => {
    if (!pngDataUrl) return;
    try {
      const res = await fetch(pngDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-workbench">
      <div className="workbench-settings">
        <div className="setting-group" style={{ gridColumn: 'span 2' }}>
          <label className="setting-label">Content / URL to Encode</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://yourwebsite.com or any text"
            className="custom-input"
          />
        </div>

        <div className="setting-group">
          <label className="setting-label">Foreground Color</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' }}
            />
            <span style={{ fontSize: '0.85rem' }}>{fgColor.toUpperCase()}</span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Background Color</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' }}
            />
            <span style={{ fontSize: '0.85rem' }}>{bgColor.toUpperCase()}</span>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Error Correction Level</label>
          <select
            value={ecLevel}
            onChange={(e) => setEcLevel(e.target.value)}
            className="custom-select"
          >
            <option value="L">Low (7% recovery)</option>
            <option value="M">Medium (15% recovery)</option>
            <option value="Q">Quartile (25% recovery)</option>
            <option value="H">High (30% recovery - Best for Print)</option>
          </select>
        </div>

        <div className="setting-group">
          <label className="setting-label">Resolution Size ({size}px)</label>
          <input
            type="range"
            min="200"
            max="600"
            step="50"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value, 10))}
            className="range-slider"
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '1.25rem',
            background: bgColor,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-default)'
          }}
        >
          <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href={pngDataUrl}
          download="qrcode.png"
          className="btn btn-primary btn-lg"
          onClick={() => {
            trackEvent('file_downloaded', 'qr-code-generator');
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
          }}
        >
          <Download size={20} /> Download High-DPI PNG
        </a>
        <button type="button" onClick={copyToClipboard} className="btn btn-secondary btn-lg">
          {copied ? <Check size={20} color="#10b981" /> : <Copy size={20} />}
          {copied ? 'Copied Image!' : 'Copy to Clipboard'}
        </button>
      </div>

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>Permanent & Direct:</strong> These QR codes never expire and contain zero third-party tracking redirects.</span>
      </div>
    </div>
  );
}
