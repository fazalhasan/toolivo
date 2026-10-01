import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export default function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [tolerance, setTolerance] = useState(30);
  const [targetColor, setTargetColor] = useState('#ffffff');
  const [resultUrl, setResultUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const removeBg = (img, hexColor, tol) => {
    setIsProcessing(true);
    trackEvent('tool_started', 'background-remover');

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const target = hexToRgb(hexColor);
    const tolDist = (tol / 100) * 441.67; // max Euclidean color distance sqrt(255^2*3)

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const dist = Math.sqrt(
        Math.pow(r - target.r, 2) +
        Math.pow(g - target.g, 2) +
        Math.pow(b - target.b, 2)
      );

      if (dist < tolDist) {
        // Soft feather edge
        const alpha = dist < tolDist * 0.7 ? 0 : Math.round(((dist - tolDist * 0.7) / (tolDist * 0.3)) * 255);
        data[i + 3] = Math.min(data[i + 3], alpha);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        setResultUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
        trackEvent('tool_completed', 'background-remover');
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      }
    }, 'image/png');
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    trackEvent('file_uploaded', 'background-remover', { size: selectedFile.size });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        // Sample top-left corner color automatically
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = 1;
        sampleCanvas.height = 1;
        const sCtx = sampleCanvas.getContext('2d');
        sCtx.drawImage(img, 0, 0, 1, 1, 0, 0, 1, 1);
        const p = sCtx.getImageData(0, 0, 1, 1).data;
        const hex = '#' + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1);
        setTargetColor(hex);
        removeBg(img, hex, tolerance);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetAll = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setImgObj(null);
    setResultUrl('');
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
          <Sparkles className="dropzone-icon" />
          <h3 className="dropzone-title">Upload Image to Erase Background</h3>
          <p className="dropzone-subtitle">Isolate logos, signatures, products, and graphics with transparent PNG output</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group">
              <label className="setting-label">Color to Remove</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={targetColor}
                  onChange={(e) => {
                    setTargetColor(e.target.value);
                    if (imgObj) removeBg(imgObj, e.target.value, tolerance);
                  }}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontSize: '0.85rem' }}>{targetColor.toUpperCase()}</span>
                {['#ffffff', '#000000', '#0f172a'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setTargetColor(c);
                      if (imgObj) removeBg(imgObj, c, tolerance);
                    }}
                  >
                    {c === '#ffffff' ? 'White' : c === '#000000' ? 'Black' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-label">
                <span>Tolerance / Sensitivity</span>
                <span className="setting-value">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => {
                  const tol = parseInt(e.target.value, 10);
                  setTolerance(tol);
                  if (imgObj) removeBg(imgObj, targetColor, tol);
                }}
                className="range-slider"
              />
            </div>
          </div>

          {resultUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                TRANSPARENT PNG CUTOUT PREVIEW
              </span>
              <div
                style={{
                  display: 'inline-block',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundImage: 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#0f172a',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <img
                  src={resultUrl}
                  alt="Transparent result preview"
                  style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={resultUrl}
              download={`${file.name.replace(/\.[^/.]+$/, '')}-transparent.png`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'background-remover')}
            >
              <Download size={20} /> Download Transparent PNG
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Remove Another
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>Private & Secure:</strong> All image processing executes strictly inside your browser sandbox.</span>
      </div>
    </div>
  );
}
