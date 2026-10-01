import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle, Sliders } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [compressedUrl, setCompressedUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processCompression = (imgFile, targetQuality) => {
    setIsProcessing(true);
    setError('');
    trackEvent('tool_started', 'image-compressor');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Determine output mime
        const mimeType = imgFile.type === 'image/png' ? 'image/webp' : imgFile.type || 'image/jpeg';
        const q = targetQuality / 100;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError('Failed to compress image. Please try a different file.');
              setIsProcessing(false);
              trackEvent('tool_error', 'image-compressor');
              return;
            }

            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedSize(blob.size);
            setIsProcessing(false);
            trackEvent('tool_completed', 'image-compressor', {
              originalSize: imgFile.size,
              compressedSize: blob.size
            });

            // Gentle celebration
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#6366f1', '#38bdf8', '#10b981']
            });
          },
          mimeType,
          q
        );
      };
      img.onerror = () => {
        setError('Corrupted or unreadable image file.');
        setIsProcessing(false);
        trackEvent('tool_error', 'image-compressor');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imgFile);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Unsupported file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File exceeds maximum 50MB size limit.');
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    trackEvent('file_uploaded', 'image-compressor', { size: selectedFile.size });
    processCompression(selectedFile, quality);
  };

  const handleQualityChange = (e) => {
    const newQuality = parseInt(e.target.value, 10);
    setQuality(newQuality);
    if (file) {
      processCompression(file, newQuality);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const resetAll = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
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
          className={`dropzone ${isDragging ? 'active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])}
            accept="image/jpeg,image/png,image/webp,image/avif"
            style={{ display: 'none' }}
          />
          <Upload className="dropzone-icon" />
          <h3 className="dropzone-title">Drop your image here, or browse files</h3>
          <p className="dropzone-subtitle">Supports JPG, PNG, and WebP up to 50 MB</p>
          <div className="dropzone-meta">
            <span><ShieldCheck size={16} color="#10b981" /> 100% Private (Processed in browser)</span>
            <span>⚡ Instant & Lossless Tuning</span>
          </div>
        </div>
      ) : (
        <div className="workbench-active">
          {/* Controls Bar */}
          <div className="workbench-settings">
            <div className="setting-group" style={{ gridColumn: 'span 2' }}>
              <div className="setting-label">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sliders size={16} /> Compression Quality
                </span>
                <span className="setting-value">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={handleQualityChange}
                className="range-slider"
                aria-label="Compression quality"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Recommended: 75% - 85% for optimal web performance without visible quality loss.
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original Size</div>
              <div className="stat-value">{formatFileSize(originalSize)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Compressed Size</div>
              <div className="stat-value" style={{ color: '#818cf8' }}>
                {isProcessing ? 'Optimizing...' : formatFileSize(compressedSize)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Reduction Saved</div>
              <div className="stat-value stat-saved">
                {isProcessing ? '...' : `-${savedPercent}%`}
              </div>
            </div>
          </div>

          {/* Previews */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                ORIGINAL
              </span>
              <img
                src={originalUrl}
                alt="Original file preview"
                style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
            <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', display: 'block', marginBottom: '0.5rem' }}>
                COMPRESSED ({savedPercent}% SMALLER)
              </span>
              <img
                src={compressedUrl || originalUrl}
                alt="Compressed file preview"
                style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href={compressedUrl}
              download={`compressed-${file.name.replace(/\.[^/.]+$/, '')}.${file.type === 'image/png' ? 'webp' : 'jpg'}`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'image-compressor')}
            >
              <Download size={20} /> Download Compressed File
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Compress Another Image
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginTop: '1rem', fontSize: '0.9rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Client-Side Processing:</strong> Your image stays on your device and is never uploaded to any cloud server.</span>
      </div>
    </div>
  );
}
