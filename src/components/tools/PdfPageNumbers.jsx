import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Hash, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function PdfPageNumbers() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [format, setFormat] = useState('page_of_total'); // 'page_of_total', 'single_num', 'page_num'
  const [position, setPosition] = useState('bottom_center'); // 'bottom_center', 'bottom_right', 'bottom_left', 'top_right'
  const [fontSize, setFontSize] = useState(11);
  const [margin, setMargin] = useState(30);
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
    trackEvent('file_uploaded', 'pdf-page-numbers', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const handleAddPageNumbers = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'pdf-page-numbers');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      const pages = pdfDoc.getPages();
      pages.forEach((page, idx) => {
        const pageNum = idx + 1;
        let text = `${pageNum}`;
        if (format === 'page_of_total') {
          text = `Page ${pageNum} of ${totalPages}`;
        } else if (format === 'page_num') {
          text = `Page ${pageNum}`;
        }

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const { width, height } = page.getSize();

        let x = (width - textWidth) / 2;
        let y = margin;

        if (position === 'bottom_right') {
          x = width - textWidth - margin;
          y = margin;
        } else if (position === 'bottom_left') {
          x = margin;
          y = margin;
        } else if (position === 'top_right') {
          x = width - textWidth - margin;
          y = height - margin;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2)
        });
      });

      const numberedBytes = await pdfDoc.save();
      const blob = new Blob([numberedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'pdf-page-numbers');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error stamping page numbers: ' + err.message);
      trackEvent('tool_error', 'pdf-page-numbers', { error: err.message });
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
            <Hash size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Add Page Numbers</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Customize numbering format, placement, and typography effortlessly
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-default)', background: '#ffffff', fontWeight: 600 }}
                >
                  <option value="bottom_center">Bottom Center (Standard)</option>
                  <option value="bottom_right">Bottom Right</option>
                  <option value="bottom_left">Bottom Left</option>
                  <option value="top_right">Top Right (Header)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Numbering Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-default)', background: '#ffffff', fontWeight: 600 }}
                >
                  <option value="page_of_total">Page 1 of {pageCount || 'N'}</option>
                  <option value="page_num">Page 1</option>
                  <option value="single_num">1 (Number Only)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min="9"
                  max="16"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0f172a' }}
                />
              </div>
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleAddPageNumbers}
              disabled={isProcessing}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Numbering Document...' : 'Add Page Numbers to PDF'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ Page Numbers Added!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                All {pageCount} pages stamped accurately.
              </p>
              <a
                href={downloadUrl}
                download={`numbered-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'pdf-page-numbers')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Numbered PDF
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
