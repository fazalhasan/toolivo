import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, Layers, ArrowUp, ArrowDown, Trash2, ShieldCheck, Plus } from 'lucide-react';

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState('');
  const [mergedSize, setMergedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFiles = (incoming) => {
    if (!incoming || incoming.length === 0) return;
    setError('');

    const validFiles = Array.from(incoming).filter((f) =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (validFiles.length === 0) {
      setError('Please select valid PDF documents.');
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    trackEvent('file_uploaded', 'pdf-merger', { count: validFiles.length });
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError('');
    trackEvent('tool_started', 'pdf-merger');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setMergedPdfUrl(URL.createObjectURL(blob));
      setMergedSize(blob.size);
      setIsProcessing(false);
      trackEvent('tool_completed', 'pdf-merger', { totalFiles: files.length });
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      setError('Failed to merge documents. One or more files might be corrupted or password protected.');
      setIsProcessing(false);
      trackEvent('tool_error', 'pdf-merger');
    }
  };

  const resetAll = () => {
    if (mergedPdfUrl) URL.revokeObjectURL(mergedPdfUrl);
    setFiles([]);
    setMergedPdfUrl('');
    setMergedSize(0);
    setError('');
  };

  return (
    <div className="tool-workbench">
      {files.length === 0 ? (
        <div
          className="dropzone"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            accept="application/pdf"
            multiple
            style={{ display: 'none' }}
          />
          <Layers className="dropzone-icon" />
          <h3 className="dropzone-title">Upload Multiple PDF Files to Combine</h3>
          <p className="dropzone-subtitle">Select 2 or more files. You can arrange their order before merging.</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Documents to Merge ({files.length})</h4>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={16} /> Add More Files
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              accept="application/pdf"
              multiple
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {files.map((f, idx) => (
              <div
                key={idx}
                className="file-preview-card"
              >
                <div className="file-preview-info">
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--accent-light)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', display: 'block' }}>{f.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatFileSize(f.size)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, -1)}
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    disabled={idx === files.length - 1}
                    onClick={() => moveFile(idx, 1)}
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => removeFile(idx)}
                    title="Remove"
                    style={{ color: 'var(--error)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem' }}>{error}</div>}

          {mergedPdfUrl ? (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="stat-box" style={{ maxWidth: '320px', margin: '0 auto 1.5rem' }}>
                <div className="stat-label">Merged PDF Size</div>
                <div className="stat-value" style={{ color: '#10b981' }}>{formatFileSize(mergedSize)}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={mergedPdfUrl}
                  download="merged-document.pdf"
                  className="btn btn-primary btn-lg"
                  onClick={() => trackEvent('file_downloaded', 'pdf-merger')}
                >
                  <Download size={20} /> Download Combined PDF
                </a>
                <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
                  <RefreshCw size={20} /> Merge Another Set
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={mergePdfs}
                disabled={isProcessing || files.length < 2}
              >
                <Layers size={20} /> {isProcessing ? 'Merging Documents...' : `Merge ${files.length} PDF Files`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Client-Side Processing:</strong> No documents leave your computer.</span>
      </div>
    </div>
  );
}
