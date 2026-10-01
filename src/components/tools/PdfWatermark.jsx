import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Stamp, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function PdfWatermark() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.25);
  const [angle, setAngle] = useState(45);
  const [colorHex, setColorHex] = useState('#ef4444'); // Red default
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    setSelectedFile(file);
    setDownloadUrl('');
    trackEvent('file_uploaded', 'pdf-watermark', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const handleWatermark = async () => {
    if (!selectedFile || !watermarkText.trim()) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'pdf-watermark');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Convert hex to rgb
      const r = parseInt(colorHex.slice(1, 3), 16) / 255;
      const g = parseInt(colorHex.slice(3, 5), 16) / 255;
      const b = parseInt(colorHex.slice(5, 7), 16) / 255;

      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        // Approximate center with rotation
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: (height - textHeight) / 2,
          size: fontSize,
          font,
          color: rgb(r, g, b),
          opacity: opacity,
          rotate: degrees(angle)
        });
      });

      const watermarkedBytes = await pdfDoc.save();
      const blob = new Blob([watermarkedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'pdf-watermark');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Watermark error: ' + err.message);
      trackEvent('tool_error', 'pdf-watermark', { error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-interface-card">
      {!selectedFile ? (
        <label className="dropzone-area">
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          <div className="dropzone-icon-box">
            <Stamp size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Add Watermark</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Stamp custom text, opacity, and angle across your PDF pages
          </p>
          <span className="btn btn-lime">Choose PDF Document</span>
        </label>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <FileCheck size={24} color="#0f172a" />
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{selectedFile.name}</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {formatFileSize(selectedFile.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                </span>
              </div>
            </div>

            <button
              onClick={() => { setSelectedFile(null); setDownloadUrl(''); }}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} /> Change File
            </button>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: '#ffffff',
                  fontWeight: 600
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Rotation ({angle}°)
                </label>
                <select
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: '#ffffff', fontWeight: 600 }}
                >
                  <option value={45}>45° Diagonal</option>
                  <option value={0}>0° Horizontal</option>
                  <option value={-45}>-45° Reverse Diagonal</option>
                  <option value={90}>90° Vertical</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {['#ef4444', '#64748b', '#0f172a', '#3b82f6', '#10b981'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorHex(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: colorHex === c ? '3px solid #0f172a' : '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleWatermark}
              disabled={isProcessing || !watermarkText.trim()}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Stamping Watermark...' : 'Apply Watermark to PDF'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ Watermark Applied!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Your custom watermark was stamped onto all {pageCount} pages.
              </p>
              <a
                href={downloadUrl}
                download={`watermarked-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'pdf-watermark')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Watermarked PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Stamping • Documents never leave your device</span>
      </div>
    </div>
  );
}
