import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, Scissors, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [splitPdfUrl, setSplitPdfUrl] = useState('');
  const [splitSize, setSplitSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    setError('');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = doc.getPageCount();

      setPdfDoc(doc);
      setFile(selectedFile);
      setPageCount(count);
      setPageRange(`1-${Math.min(count, 3)}`);
      trackEvent('file_uploaded', 'pdf-splitter', { pageCount: count });
    } catch (err) {
      console.error(err);
      setError('Could not open PDF. File might be encrypted or corrupted.');
    }
  };

  const parseRanges = (input, max) => {
    const pages = new Set();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n, 10));
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, end));
          const e = Math.min(max, Math.max(start, end));
          for (let i = s; i <= e; i++) pages.add(i - 1); // 0-indexed
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num - 1);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const extractPages = async () => {
    if (!pdfDoc || !pageRange.trim()) {
      setError('Please specify valid pages or page ranges.');
      return;
    }

    setIsProcessing(true);
    setError('');
    trackEvent('tool_started', 'pdf-splitter');

    try {
      const indices = parseRanges(pageRange, pageCount);
      if (indices.length === 0) {
        setError(`Please enter valid page numbers between 1 and ${pageCount}.`);
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes], { type: 'application/pdf' });
      setSplitPdfUrl(URL.createObjectURL(blob));
      setSplitSize(blob.size);
      setIsProcessing(false);
      trackEvent('tool_completed', 'pdf-splitter', { extractedCount: indices.length });
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      setError('Failed to extract pages from document.');
      setIsProcessing(false);
      trackEvent('tool_error', 'pdf-splitter');
    }
  };

  const resetAll = () => {
    if (splitPdfUrl) URL.revokeObjectURL(splitPdfUrl);
    setFile(null);
    setPdfDoc(null);
    setPageCount(0);
    setPageRange('');
    setSplitPdfUrl('');
    setSplitSize(0);
    setError('');
  };

  return (
    <div className="tool-workbench">
      {!file ? (
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])}
            accept="application/pdf"
            style={{ display: 'none' }}
          />
          <Scissors className="dropzone-icon" />
          <h3 className="dropzone-title">Upload PDF to Split & Extract Pages</h3>
          <p className="dropzone-subtitle">Extract individual pages, chapters, or custom ranges (e.g. 1-4, 7, 10-12)</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group" style={{ gridColumn: 'span 2' }}>
              <div className="setting-label">
                <span>Page Range to Extract (Total Pages: {pageCount})</span>
                <span className="setting-value">{file.name}</span>
              </div>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder={`e.g. 1-${Math.min(pageCount, 5)}, ${pageCount}`}
                className="custom-input"
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Examples: "1-3" (pages 1 to 3), "1, 4, 7" (individual pages), "1-5, 8" (combination)
              </span>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', margin: '1rem 0' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {splitPdfUrl ? (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="stat-box" style={{ maxWidth: '320px', margin: '0 auto 1.5rem' }}>
                <div className="stat-label">Extracted PDF Size</div>
                <div className="stat-value" style={{ color: '#10b981' }}>{formatFileSize(splitSize)}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={splitPdfUrl}
                  download={`extracted-${file.name}`}
                  className="btn btn-primary btn-lg"
                  onClick={() => trackEvent('file_downloaded', 'pdf-splitter')}
                >
                  <Download size={20} /> Download Extracted PDF
                </a>
                <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
                  <RefreshCw size={20} /> Split Another Document
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={extractPages}
                disabled={isProcessing || !pageRange.trim()}
              >
                <Scissors size={20} /> {isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Client-Side Processing:</strong> No files leave your computer.</span>
      </div>
    </div>
  );
}
