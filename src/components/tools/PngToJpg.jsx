import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import { Upload, Download, RefreshCw, ShieldCheck } from 'lucide-react';

export default function PngToJpg() {
  const [file, setFile] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [jpgUrl, setJpgUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [jpgSize, setJpgSize] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const convertToJpg = (img, background, q) => {
    setIsProcessing(true);
    trackEvent('tool_started', 'png-to-jpg');

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');

    // Fill background color
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image over background
    ctx.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setJpgUrl(URL.createObjectURL(blob));
        setJpgSize(blob.size);
        setIsProcessing(false);
        trackEvent('tool_completed', 'png-to-jpg');
      }
    }, 'image/jpeg', q / 100);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    trackEvent('file_uploaded', 'png-to-jpg', { size: selectedFile.size });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        convertToJpg(img, bgColor, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetAll = () => {
    if (jpgUrl) URL.revokeObjectURL(jpgUrl);
    setFile(null);
    setImgObj(null);
    setJpgUrl('');
    setOriginalSize(0);
    setJpgSize(0);
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
            accept="image/png"
            style={{ display: 'none' }}
          />
          <Upload className="dropzone-icon" />
          <h3 className="dropzone-title">Upload PNG to Convert to JPG</h3>
          <p className="dropzone-subtitle">Choose background fill color and JPEG compression quality</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group">
              <label className="setting-label">Background Fill for Transparency</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => {
                    setBgColor(e.target.value);
                    if (imgObj) convertToJpg(imgObj, e.target.value, quality);
                  }}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{bgColor.toUpperCase()}</span>
                {['#ffffff', '#000000', '#f1f5f9'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setBgColor(c);
                      if (imgObj) convertToJpg(imgObj, c, quality);
                    }}
                  >
                    {c === '#ffffff' ? 'White' : c === '#000000' ? 'Black' : 'Slate'}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-label">
                <span>JPEG Quality</span>
                <span className="setting-value">{quality}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={quality}
                onChange={(e) => {
                  const q = parseInt(e.target.value, 10);
                  setQuality(q);
                  if (imgObj) convertToJpg(imgObj, bgColor, q);
                }}
                className="range-slider"
              />
            </div>
          </div>

          <div className="file-stats-grid">
            <div className="stat-box">
              <div className="stat-label">Original PNG</div>
              <div className="stat-value">{formatFileSize(originalSize)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Converted JPG</div>
              <div className="stat-value" style={{ color: '#818cf8' }}>
                {isProcessing ? 'Converting...' : formatFileSize(jpgSize)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Size Saved</div>
              <div className="stat-value stat-saved">
                {originalSize > jpgSize ? `-${Math.round(((originalSize - jpgSize) / originalSize) * 100)}%` : 'Ready'}
              </div>
            </div>
          </div>

          {jpgUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <img
                src={jpgUrl}
                alt="Converted JPG preview"
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={jpgUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}.jpg`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'png-to-jpg')}
            >
              <Download size={20} /> Download JPG Image
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Convert Another PNG
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% Client-Side Processing:</strong> No files leave your computer.</span>
      </div>
    </div>
  );
}
