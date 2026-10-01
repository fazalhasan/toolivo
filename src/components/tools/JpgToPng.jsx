import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function JpgToPng() {
  const [file, setFile] = useState(null);
  const [pngUrl, setPngUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [pngSize, setPngSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const convertToPng = (imgFile) => {
    setIsProcessing(true);
    trackEvent('tool_started', 'jpg-to-png');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            setPngUrl(URL.createObjectURL(blob));
            setPngSize(blob.size);
            setIsProcessing(false);
            trackEvent('tool_completed', 'jpg-to-png');
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
          }
        }, 'image/png');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imgFile);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    trackEvent('file_uploaded', 'jpg-to-png', { size: selectedFile.size });
    convertToPng(selectedFile);
  };

  const resetAll = () => {
    if (pngUrl) URL.revokeObjectURL(pngUrl);
    setFile(null);
    setPngUrl('');
    setOriginalSize(0);
    setPngSize(0);
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
            accept="image/jpeg,image/jpg"
            style={{ display: 'none' }}
          />
          <Upload className="dropzone-icon" />
          <h3 className="dropzone-title">Upload JPG to Convert to PNG</h3>
          <p className="dropzone-subtitle">Lossless conversion with full 24-bit color fidelity</p>
        </div>
      ) : (
        <div>
          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original JPG</div>
              <div className="stat-value">{formatFileSize(originalSize)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Lossless PNG</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                {isProcessing ? 'Converting...' : formatFileSize(pngSize)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Status</div>
              <div className="stat-value" style={{ color: '#38bdf8' }}>Ready to Save</div>
            </div>
          </div>

          {pngUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <img
                src={pngUrl}
                alt="Converted PNG preview"
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={pngUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}.png`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'jpg-to-png')}
            >
              <Download size={20} /> Download PNG File
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Convert Another JPG
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>Client-Side Transcoding:</strong> Never uploaded to any external server.</span>
      </div>
    </div>
  );
}
