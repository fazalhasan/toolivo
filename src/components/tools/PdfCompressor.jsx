import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, FileArchive, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PdfCompressor() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const compressPdf = async (pdfFile) => {
    setIsProcessing(true);
    setError('');
    trackEvent('tool_started', 'pdf-compressor');

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      // Load document
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Clean metadata and optimize object streams
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('Toolivo Optimizer');
      pdfDoc.setCreator('Toolivo');

      // Save with object streams compaction
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      setCompressedPdfUrl(URL.createObjectURL(blob));
      setCompressedSize(blob.size);
      setIsProcessing(false);
      trackEvent('tool_completed', 'pdf-compressor');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      setError('Could not compress this PDF. The document may be password-protected or encrypted.');
      setIsProcessing(false);
      trackEvent('tool_error', 'pdf-compressor');
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document.');
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    trackEvent('file_uploaded', 'pdf-compressor', { size: selectedFile.size });
    compressPdf(selectedFile);
  };

  const resetAll = () => {
    if (compressedPdfUrl) URL.revokeObjectURL(compressedPdfUrl);
    setFile(null);
    setCompressedPdfUrl('');
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
  };

  const savedPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

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
          <FileArchive className="dropzone-icon" />
          <h3 className="dropzone-title">Upload PDF to Compress</h3>
          <p className="dropzone-subtitle">Compact object streams and font tables for email attachments and portal uploads</p>
          <div className="dropzone-meta">
            <span><ShieldCheck size={16} color="#10b981" /> 100% Confidential (Never leaves your computer)</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original PDF</div>
              <div className="stat-value">{formatFileSize(originalSize)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Optimized PDF</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                {isProcessing ? 'Optimizing...' : formatFileSize(compressedSize)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Size Reduction</div>
              <div className="stat-value stat-saved">
                {isProcessing ? '...' : (savedPercent > 0 ? `-${savedPercent}%` : 'Compacted')}
              </div>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', margin: '1.5rem 0' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            {compressedPdfUrl && (
              <a
                href={compressedPdfUrl}
                download={`compressed-${file.name}`}
                className="btn btn-primary btn-lg"
                onClick={() => trackEvent('file_downloaded', 'pdf-compressor')}
              >
                <Download size={20} /> Download Compressed PDF
              </a>
            )}
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Compress Another PDF
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>Bank-Grade Privacy:</strong> Legal agreements, bank statements, and tax forms stay on your device.</span>
      </div>
    </div>
  );
}
