import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import { Upload, Download, RefreshCw, Lock, Unlock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [outputFormat, setOutputFormat] = useState('image/jpeg');
  const [resizedUrl, setResizedUrl] = useState('');
  const [resizedSize, setResizedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        setFile(selectedFile);
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setTargetWidth(img.naturalWidth);
        setTargetHeight(img.naturalHeight);
        generateResize(img, img.naturalWidth, img.naturalHeight, outputFormat);
        trackEvent('file_uploaded', 'image-resizer', { size: selectedFile.size });
      };
      img.onerror = () => setError('Failed to load image file.');
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const generateResize = (img, w, h, format) => {
    if (!img || w <= 0 || h <= 0) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'image-resizer');

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w);
    canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setResizedUrl(URL.createObjectURL(blob));
        setResizedSize(blob.size);
        setIsProcessing(false);
        trackEvent('tool_completed', 'image-resizer');
      }
    }, format, 0.9);
  };

  const handleWidthChange = (val) => {
    const w = parseInt(val, 10) || 0;
    setTargetWidth(w);
    if (aspectRatioLocked && originalWidth > 0) {
      const h = Math.round(w * (originalHeight / originalWidth));
      setTargetHeight(h);
      if (imgObj && w > 0 && h > 0) generateResize(imgObj, w, h, outputFormat);
    } else {
      if (imgObj && w > 0 && targetHeight > 0) generateResize(imgObj, w, targetHeight, outputFormat);
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val, 10) || 0;
    setTargetHeight(h);
    if (aspectRatioLocked && originalHeight > 0) {
      const w = Math.round(h * (originalWidth / originalHeight));
      setTargetWidth(w);
      if (imgObj && w > 0 && h > 0) generateResize(imgObj, w, h, outputFormat);
    } else {
      if (imgObj && targetWidth > 0 && h > 0) generateResize(imgObj, targetWidth, h, outputFormat);
    }
  };

  const applyPercentage = (pct) => {
    if (!originalWidth || !originalHeight) return;
    const w = Math.round(originalWidth * (pct / 100));
    const h = Math.round(originalHeight * (pct / 100));
    setTargetWidth(w);
    setTargetHeight(h);
    if (imgObj) generateResize(imgObj, w, h, outputFormat);
  };

  const resetAll = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setImgObj(null);
    setResizedUrl('');
    setOriginalWidth(0);
    setOriginalHeight(0);
    setTargetWidth(0);
    setTargetHeight(0);
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
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Upload className="dropzone-icon" />
          <h3 className="dropzone-title">Upload image to resize</h3>
          <p className="dropzone-subtitle">JPG, PNG, WebP with custom pixel & percentage scaling</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group">
              <label className="setting-label">Width (px)</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="custom-input"
              />
            </div>

            <div className="setting-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setAspectRatioLocked(!aspectRatioLocked)}
                className="btn btn-secondary btn-sm"
                title="Toggle Aspect Ratio Lock"
                style={{ marginTop: '1.25rem' }}
              >
                {aspectRatioLocked ? <Lock size={16} color="#818cf8" /> : <Unlock size={16} />}
                {aspectRatioLocked ? 'Ratio Locked' : 'Ratio Free'}
              </button>
            </div>

            <div className="setting-group">
              <label className="setting-label">Height (px)</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="custom-input"
              />
            </div>

            <div className="setting-group">
              <label className="setting-label">Format</label>
              <select
                value={outputFormat}
                onChange={(e) => {
                  setOutputFormat(e.target.value);
                  if (imgObj) generateResize(imgObj, targetWidth, targetHeight, e.target.value);
                }}
                className="custom-select"
              >
                <option value="image/jpeg">JPG / JPEG</option>
                <option value="image/png">PNG Lossless</option>
                <option value="image/webp">WebP (Recommended)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => applyPercentage(pct)}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original Dimensions</div>
              <div className="stat-value">{originalWidth} × {originalHeight} px</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Target Dimensions</div>
              <div className="stat-value" style={{ color: '#818cf8' }}>{targetWidth} × {targetHeight} px</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Estimated Size</div>
              <div className="stat-value">{formatFileSize(resizedSize)}</div>
            </div>
          </div>

          {resizedUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <img
                src={resizedUrl}
                alt="Resized output preview"
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: '#0b0f19' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={resizedUrl}
              download={`resized-${targetWidth}x${targetHeight}.${outputFormat.split('/')[1]}`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'image-resizer')}
            >
              <Download size={20} /> Download Resized Image
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Resize Another
            </button>
          </div>
        </div>
      )}

      {error && <div style={{ color: 'var(--error)', marginTop: '1rem' }}>{error}</div>}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Client-Side Processing:</strong> Your image stays in your browser memory.</span>
      </div>
    </div>
  );
}
