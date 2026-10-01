import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { FilePlus, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function ExtractPdfPages() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState('1'); // e.g. "1, 3, 5-7"
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
    trackEvent('file_uploaded', 'extract-pdf-pages', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setRangeInput(count > 1 ? `1-${Math.min(count, 3)}` : '1');
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const parseRanges = (input, max) => {
    const indices = new Set();
    const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          const minP = Math.max(1, Math.min(start, end));
          const maxP = Math.min(max, Math.max(start, end));
          for (let i = minP; i <= maxP; i++) {
            indices.add(i - 1);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          indices.add(num - 1);
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    const indicesToExtract = parseRanges(rangeInput, pageCount);
    if (indicesToExtract.length === 0) {
      alert('Please enter valid page numbers within 1 to ' + pageCount);
      return;
    }

    setIsProcessing(true);
    trackEvent('tool_started', 'extract-pdf-pages');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const extracted = await newDoc.copyPages(srcDoc, indicesToExtract);
      extracted.forEach((p) => newDoc.addPage(p));

      const extractedBytes = await newDoc.save();
      const blob = new Blob([extractedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'extract-pdf-pages');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Extraction error: ' + err.message);
      trackEvent('tool_error', 'extract-pdf-pages', { error: err.message });
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
            <FilePlus size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Extract Pages</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Extract specific pages or page ranges into a separate document
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
                  {formatFileSize(selectedFile.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'} total
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>
              Pages to Extract (from 1 to {pageCount})
            </label>
            <input
              type="text"
              value={rangeInput}
              onChange={(e) => setRangeInput(e.target.value)}
              placeholder="e.g. 1, 3, 5-8"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1.5px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#ffffff',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Tip: Separate with commas (e.g. <code>1, 4, 7</code>) or specify ranges (e.g. <code>2-5</code>).
            </span>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleExtract}
              disabled={isProcessing || !rangeInput.trim()}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ Pages Extracted Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Extracted pages have been packaged into a new standalone PDF.
              </p>
              <a
                href={downloadUrl}
                download={`extracted-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'extract-pdf-pages')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Extracted PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Extraction • Zero data transferred over network</span>
      </div>
    </div>
  );
}
