import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export default function WebpConverter() {
  const [file, setFile] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [webpUrl, setWebpUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [webpSize, setWebpSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const convertToWebp = (img, q) => {
    setIsProcessing(true);
    trackEvent('tool_started', 'webp-converter');

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setWebpUrl(URL.createObjectURL(blob));
        setWebpSize(blob.size);
        setIsProcessing(false);
        trackEvent('tool_completed', 'webp-converter');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
    }, 'image/webp', q / 100);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    trackEvent('file_uploaded', 'webp-converter', { size: selectedFile.size });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        convertToWebp(img, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetAll = () => {
    if (webpUrl) URL.revokeObjectURL(webpUrl);
    setFile(null);
    setImgObj(null);
    setWebpUrl('');
    setOriginalSize(0);
    setWebpSize(0);
  };

  const savedPercent = originalSize > 0 && webpSize > 0
    ? Math.max(0, Math.round(((originalSize - webpSize) / originalSize) * 100))
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
            accept="image/*"
            style={{ display: 'none' }}
          />
          <Zap className="dropzone-icon" />
          <h3 className="dropzone-title">Upload Image to Convert to WebP</h3>
          <p className="dropzone-subtitle">Next-gen Google format for 30%+ smaller file sizes and fast PageSpeed scores</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group" style={{ gridColumn: 'span 2' }}>
              <div className="setting-label">
                <span>WebP Quality Level</span>
                <span className="setting-value">{quality}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={quality}
                onChange={(e) => {
                  const q = parseInt(e.target.value, 10);
                  setQuality(q);
                  if (imgObj) convertToWebp(imgObj, q);
                }}
                className="range-slider"
              />
            </div>
          </div>

          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original File</div>
              <div className="stat-value">{formatFileSize(originalSize)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Optimized WebP</div>
              <div className="stat-value" style={{ color: '#10b981' }}>
                {isProcessing ? 'Encoding...' : formatFileSize(webpSize)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Efficiency Saved</div>
              <div className="stat-value stat-saved">-{savedPercent}%</div>
            </div>
          </div>

          {webpUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <img
                src={webpUrl}
                alt="Converted WebP preview"
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={webpUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}.webp`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'webp-converter')}
            >
              <Download size={20} /> Download WebP File
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Convert Another Image
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% In-Browser:</strong> Your file is processed directly on your computer.</span>
      </div>
    </div>
  );
}
