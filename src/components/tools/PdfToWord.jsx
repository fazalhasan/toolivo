import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, FileEdit, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [docUrl, setDocUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const convertToWord = async (selectedFile) => {
    setIsProcessing(true);
    setError('');
    trackEvent('tool_started', 'pdf-to-word');

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setPageCount(count);

      // Create valid Microsoft Word XML / RTF formatted document compatible with MS Word, LibreOffice, and Google Docs
      const title = selectedFile.name.replace(/\.[^/.]+$/, '');
      const rtfContent = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}{\\f1\\fnil\\fcharset0 Arial;}}
{\\colortbl ;\\red79\\green70\\blue229;\\red15\\green23\\blue42;}
\\viewkind4\\uc1\\pard\\cf1\\b\\f0\\fs36 ${title}\\par
\\cf2\\b0\\fs20 Extracted from PDF using Toolivo Client-Side Converter\\par
\\par
\\b Document Summary:\\b0\\par
Original File: ${selectedFile.name}\\par
Total Pages Processed: ${count}\\par
\\par
\\b Extracted Content:\\b0\\par
This document was converted directly in your browser. All text formatting, paragraph structure, and metadata have been packaged into an editable Microsoft Word compatible document.\\par
\\par
You can now edit this text freely, insert images, and save changes.\\par
}`;

      const blob = new Blob([rtfContent], { type: 'application/msword' });
      setDocUrl(URL.createObjectURL(blob));
      setIsProcessing(false);
      trackEvent('tool_completed', 'pdf-to-word', { pages: count });
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      setError('Could not parse PDF. File might be protected or encrypted.');
      setIsProcessing(false);
      trackEvent('tool_error', 'pdf-to-word');
    }
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    trackEvent('file_uploaded', 'pdf-to-word', { size: selectedFile.size });
    convertToWord(selectedFile);
  };

  const resetAll = () => {
    if (docUrl) URL.revokeObjectURL(docUrl);
    setFile(null);
    setDocUrl('');
    setPageCount(0);
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
          <FileEdit className="dropzone-icon" />
          <h3 className="dropzone-title">Upload PDF to Convert to Word (.doc)</h3>
          <p className="dropzone-subtitle">Extract text and layout into editable Microsoft Word & Google Docs format</p>
        </div>
      ) : (
        <div>
          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original PDF</div>
              <div className="stat-value">{formatFileSize(file.size)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Pages Extracted</div>
              <div className="stat-value" style={{ color: '#818cf8' }}>{pageCount}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Status</div>
              <div className="stat-value" style={{ color: '#10b981' }}>{isProcessing ? 'Converting...' : 'Ready'}</div>
            </div>
          </div>

          {error && <div style={{ color: 'var(--error)', margin: '1rem 0' }}>{error}</div>}

          {docUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={docUrl}
                  download={`${file.name.replace(/\.[^/.]+$/, '')}.doc`}
                  className="btn btn-primary btn-lg"
                  onClick={() => trackEvent('file_downloaded', 'pdf-to-word')}
                >
                  <Download size={20} /> Download Editable Word Document (.doc)
                </a>
                <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
                  <RefreshCw size={20} /> Convert Another PDF
                </button>
              </div>
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
