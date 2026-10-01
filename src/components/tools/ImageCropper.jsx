import React, { useState, useRef } from 'react';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import { Upload, Download, RefreshCw, Crop, ShieldCheck } from 'lucide-react';

export default function ImageCropper() {
  const [file, setFile] = useState(null);
  const [imgObj, setImgObj] = useState(null);
  const [aspectPreset, setAspectPreset] = useState('free');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [croppedUrl, setCroppedUrl] = useState('');
  const [croppedSize, setCroppedSize] = useState(0);
  const fileInputRef = useRef(null);

  const applyCrop = (img, x, y, w, h) => {
    if (!img || w <= 0 || h <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(w);
    canvas.height = Math.round(h);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setCroppedUrl(URL.createObjectURL(blob));
        setCroppedSize(blob.size);
      }
    }, 'image/png');
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    trackEvent('file_uploaded', 'image-cropper', { size: selectedFile.size });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImgObj(img);
        // Default crop: central 80%
        const w = Math.round(img.naturalWidth * 0.8);
        const h = Math.round(img.naturalHeight * 0.8);
        const x = Math.round((img.naturalWidth - w) / 2);
        const y = Math.round((img.naturalHeight - h) / 2);
        setCropX(x);
        setCropY(y);
        setCropWidth(w);
        setCropHeight(h);
        applyCrop(img, x, y, w, h);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  const setPreset = (preset) => {
    setAspectPreset(preset);
    if (!imgObj) return;

    let targetW = imgObj.naturalWidth * 0.8;
    let targetH = imgObj.naturalHeight * 0.8;

    if (preset === '1:1') {
      const size = Math.min(imgObj.naturalWidth, imgObj.naturalHeight) * 0.8;
      targetW = size;
      targetH = size;
    } else if (preset === '16:9') {
      targetW = imgObj.naturalWidth * 0.8;
      targetH = targetW * (9 / 16);
      if (targetH > imgObj.naturalHeight) {
        targetH = imgObj.naturalHeight * 0.8;
        targetW = targetH * (16 / 9);
      }
    } else if (preset === '4:3') {
      targetW = imgObj.naturalWidth * 0.8;
      targetH = targetW * (3 / 4);
    } else if (preset === '9:16') {
      targetH = imgObj.naturalHeight * 0.8;
      targetW = targetH * (9 / 16);
    }

    const x = Math.round((imgObj.naturalWidth - targetW) / 2);
    const y = Math.round((imgObj.naturalHeight - targetH) / 2);
    setCropX(x);
    setCropY(y);
    setCropWidth(Math.round(targetW));
    setCropHeight(Math.round(targetH));
    applyCrop(imgObj, x, y, Math.round(targetW), Math.round(targetH));
  };

  const resetAll = () => {
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setFile(null);
    setImgObj(null);
    setCroppedUrl('');
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
          <Crop className="dropzone-icon" />
          <h3 className="dropzone-title">Upload Image to Crop</h3>
          <p className="dropzone-subtitle">Preset ratios: 1:1 Square, 16:9 Landscape, 4:3, 9:16 Mobile Stories</p>
        </div>
      ) : (
        <div>
          <div className="workbench-settings">
            <div className="setting-group" style={{ gridColumn: 'span 2' }}>
              <label className="setting-label">Aspect Ratio Presets</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'free', label: 'Freeform' },
                  { id: '1:1', label: '1:1 Square (Avatar)' },
                  { id: '16:9', label: '16:9 (YouTube)' },
                  { id: '4:3', label: '4:3 (Classic)' },
                  { id: '9:16', label: '9:16 (Stories/Shorts)' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`btn btn-sm ${aspectPreset === p.id ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPreset(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Crop Width (px)</label>
              <input
                type="number"
                value={cropWidth}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setCropWidth(val);
                  if (imgObj) applyCrop(imgObj, cropX, cropY, val, cropHeight);
                }}
                className="custom-input"
              />
            </div>

            <div className="setting-group">
              <label className="setting-label">Crop Height (px)</label>
              <input
                type="number"
                value={cropHeight}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 0;
                  setCropHeight(val);
                  if (imgObj) applyCrop(imgObj, cropX, cropY, cropWidth, val);
                }}
                className="custom-input"
              />
            </div>
          </div>

          {croppedUrl && (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <span style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                CROPPED OUTPUT ({cropWidth} × {cropHeight} px)
              </span>
              <img
                src={croppedUrl}
                alt="Cropped output preview"
                style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: 'var(--radius-md)', background: '#0b0f19' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={croppedUrl}
              download={`cropped-${cropWidth}x${cropHeight}.png`}
              className="btn btn-primary btn-lg"
              onClick={() => trackEvent('file_downloaded', 'image-cropper')}
            >
              <Download size={20} /> Download Cropped Image
            </a>
            <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
              <RefreshCw size={20} /> Crop Another Image
            </button>
          </div>
        </div>
      )}

      <div className="privacy-banner">
        <ShieldCheck size={18} />
        <span><strong>100% In-Browser:</strong> Your image stays on your device.</span>
      </div>
    </div>
  );
}
