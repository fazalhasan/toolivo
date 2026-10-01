import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { FileMinus, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function RemovePdfPages() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [removeInput, setRemoveInput] = useState('2');
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
    trackEvent('file_uploaded', 'remove-pdf-pages', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setRemoveInput(count > 1 ? `${count}` : '');
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const parsePagesToRemove = (input, max) => {
    const toRemove = new Set();
    const parts = input.split(',').map((p) => p.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          const minP = Math.max(1, Math.min(start, end));
          const maxP = Math.min(max, Math.max(start, end));
          for (let i = minP; i <= maxP; i++) {
            toRemove.add(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          toRemove.add(num);
        }
      }
    }
    return toRemove;
  };

  const handleRemove = async () => {
    if (!selectedFile) return;
    const pagesToDelete = parsePagesToRemove(removeInput, pageCount);
    if (pagesToDelete.size === 0) {
      alert('Please enter page numbers to delete (e.g. 2, 4)');
      return;
    }
    if (pagesToDelete.size >= pageCount) {
      alert('Cannot delete all pages in the PDF.');
      return;
    }

    setIsProcessing(true);
    trackEvent('tool_started', 'remove-pdf-pages');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const remainingIndices = [];
      for (let i = 1; i <= pageCount; i++) {
        if (!pagesToDelete.has(i)) {
          remainingIndices.push(i - 1);
        }
      }

      const keptPages = await newDoc.copyPages(srcDoc, remainingIndices);
      keptPages.forEach((p) => newDoc.addPage(p));

      const cleanBytes = await newDoc.save();
      const blob = new Blob([cleanBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'remove-pdf-pages');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error removing pages: ' + err.message);
      trackEvent('tool_error', 'remove-pdf-pages', { error: err.message });
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
            <FileMinus size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Remove Pages</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Delete blank, duplicate, or unwanted pages from your PDF file
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
              Page Numbers to Delete (1 to {pageCount})
            </label>
            <input
              type="text"
              value={removeInput}
              onChange={(e) => setRemoveInput(e.target.value)}
              placeholder="e.g. 2, 4-6"
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
              Separate multiple page numbers with commas (e.g. <code>2, 5</code>) or ranges (e.g. <code>3-4</code>).
            </span>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleRemove}
              disabled={isProcessing || !removeInput.trim()}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Removing Pages...' : 'Delete Selected Pages'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ Pages Removed Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Cleaned PDF document generated without the deleted pages.
              </p>
              <a
                href={downloadUrl}
                download={`cleaned-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'remove-pdf-pages')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Cleaned PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Processing • Your documents remain confidential</span>
      </div>
    </div>
  );
}
