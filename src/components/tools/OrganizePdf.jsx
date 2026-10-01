import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { ArrowUpDown, ArrowUp, ArrowDown, Trash2, Copy, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function OrganizePdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pagesOrder, setPagesOrder] = useState([]); // array of original 0-indexed page numbers
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
    trackEvent('file_uploaded', 'organize-pdf', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPagesOrder(Array.from({ length: count }, (_, i) => i));
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const movePage = (index, direction) => {
    const newOrder = [...pagesOrder];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setPagesOrder(newOrder);
  };

  const deletePage = (index) => {
    if (pagesOrder.length <= 1) {
      alert('A PDF must contain at least 1 page.');
      return;
    }
    const newOrder = pagesOrder.filter((_, i) => i !== index);
    setPagesOrder(newOrder);
  };

  const duplicatePage = (index) => {
    const newOrder = [...pagesOrder];
    newOrder.splice(index + 1, 0, newOrder[index]);
    setPagesOrder(newOrder);
  };

  const handleSaveOrganized = async () => {
    if (!selectedFile || pagesOrder.length === 0) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'organize-pdf');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(srcDoc, pagesOrder);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const organizedBytes = await newDoc.save();
      const blob = new Blob([organizedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'organize-pdf');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error organizing PDF: ' + err.message);
      trackEvent('tool_error', 'organize-pdf', { error: err.message });
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
            <ArrowUpDown size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Organize & Reorder</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Rearrange pages, remove unwanted sheets, or duplicate pages in real-time
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
                  {formatFileSize(selectedFile.size)} • {pagesOrder.length} {pagesOrder.length === 1 ? 'page' : 'pages'} active
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

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Drag or use arrows to rearrange pages:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Total output: {pagesOrder.length} pages
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto', padding: '0.5rem' }}>
              {pagesOrder.map((origIndex, idx) => (
                <div
                  key={`${origIndex}-${idx}`}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ background: '#f1f5f9', borderRadius: '4px', padding: '1rem 0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      #{idx + 1}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Orig Page {origIndex + 1}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePage(idx, -1)}
                      style={{ padding: '4px', background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      title="Move backward"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pagesOrder.length - 1}
                      onClick={() => movePage(idx, 1)}
                      style={{ padding: '4px', background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: '4px', cursor: idx === pagesOrder.length - 1 ? 'not-allowed' : 'pointer' }}
                      title="Move forward"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicatePage(idx)}
                      style={{ padding: '4px', background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: '4px', cursor: 'pointer' }}
                      title="Duplicate page"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePage(idx)}
                      style={{ padding: '4px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', color: '#ef4444' }}
                      title="Remove page"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleSaveOrganized}
              disabled={isProcessing}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Generating Organized PDF...' : `Save & Reorder PDF (${pagesOrder.length} Pages)`}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ PDF Organized Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Your new PDF contains {pagesOrder.length} pages structured in your requested order.
              </p>
              <a
                href={downloadUrl}
                download={`organized-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'organize-pdf')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Organized PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Reordering • Zero files uploaded to any server</span>
      </div>
    </div>
  );
}
