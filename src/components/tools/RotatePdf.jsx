import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { RotateCw, RotateCcw, Upload, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function RotatePdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(90); // 90, 180, 270
  const [pageScope, setPageScope] = useState('all'); // 'all', 'odd', 'even'
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }

    setSelectedFile(file);
    setDownloadUrl('');
    trackEvent('file_uploaded', 'rotate-pdf', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const handleRotate = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'rotate-pdf');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      pages.forEach((page, idx) => {
        const pageNum = idx + 1;
        const shouldRotate =
          pageScope === 'all' ||
          (pageScope === 'odd' && pageNum % 2 !== 0) ||
          (pageScope === 'even' && pageNum % 2 === 0);

        if (shouldRotate) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + rotationAngle) % 360));
        }
      });

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      setResultSize(blob.size);
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'rotate-pdf');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Rotation error: ' + err.message);
      trackEvent('tool_error', 'rotate-pdf', { error: err.message });
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
            <RotateCw size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Rotate</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Rotate individual pages or entire documents permanently
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              Select Rotation Angle
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { angle: 90, label: '90° Clockwise', icon: RotateCw },
                { angle: 180, label: '180° Flip', icon: RefreshCw },
                { angle: 270, label: '90° Counter-Clockwise', icon: RotateCcw }
              ].map((opt) => (
                <button
                  key={opt.angle}
                  type="button"
                  onClick={() => setRotationAngle(opt.angle)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: rotationAngle === opt.angle ? '2px solid #0f172a' : '1px solid var(--border-default)',
                    background: rotationAngle === opt.angle ? 'var(--accent-lime)' : '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <opt.icon size={18} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Pages to Apply Rotation
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'all', label: 'All Pages' },
                { id: 'odd', label: 'Odd Pages Only' },
                { id: 'even', label: 'Even Pages Only' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPageScope(s.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-default)',
                    background: pageScope === s.id ? '#0f172a' : '#ffffff',
                    color: pageScope === s.id ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleRotate}
              disabled={isProcessing}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Rotating PDF Pages...' : `Rotate PDF by ${rotationAngle}°`}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ PDF Rotated Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                All {pageScope} pages rotated by {rotationAngle}°. Ready to download.
              </p>
              <a
                href={downloadUrl}
                download={`rotated-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'rotate-pdf')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Rotated PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Processing • Document never leaves your computer</span>
      </div>
    </div>
  );
}
