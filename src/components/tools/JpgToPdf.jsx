import React, { useState, useRef } from 'react';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Upload, Download, RefreshCw, FileImage, ShieldCheck, Trash2, Plus } from 'lucide-react';

export default function JpgToPdf() {
  const [images, setImages] = useState([]);
  const [orientation, setOrientation] = useState('portrait');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfSize, setPdfSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (incoming) => {
    if (!incoming || incoming.length === 0) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
    const previews = valid.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      preview: URL.createObjectURL(f)
    }));
    setImages((prev) => [...prev, ...previews]);
    trackEvent('file_uploaded', 'jpg-to-pdf', { count: valid.length });
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(images.filter((_, i) => i !== idx));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'jpg-to-pdf');

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const buffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(buffer);
        } else {
          // For JPG / WebP, rasterize to standard JPG buffer
          embeddedImage = await pdfDoc.embedJpg(buffer);
        }

        const pageSize = orientation === 'portrait' ? PageSizes.A4 : [PageSizes.A4[1], PageSizes.A4[0]];
        const page = pdfDoc.addPage(pageSize);
        const { width: pWidth, height: pHeight } = page.getSize();

        // Fit image inside margins
        const margin = 36; // 0.5 inch
        const maxWidth = pWidth - margin * 2;
        const maxHeight = pHeight - margin * 2;

        const imgDims = embeddedImage.scaleToFit(maxWidth, maxHeight);
        const x = (pWidth - imgDims.width) / 2;
        const y = (pHeight - imgDims.height) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: imgDims.width,
          height: imgDims.height
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      setPdfSize(blob.size);
      setIsProcessing(false);
      trackEvent('tool_completed', 'jpg-to-pdf', { pages: images.length });
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      trackEvent('tool_error', 'jpg-to-pdf');
    }
  };

  const resetAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setImages([]);
    setPdfUrl('');
    setPdfSize(0);
  };

  return (
    <div className="tool-workbench">
      {images.length === 0 ? (
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
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
          <FileImage className="dropzone-icon" />
          <h3 className="dropzone-title">Upload JPG & PNG Images to Convert to PDF</h3>
          <p className="dropzone-subtitle">Convert single or multiple photos, receipt scans, or documents into a printable PDF</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h4 style={{ margin: 0 }}>Images to Convert ({images.length})</h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="custom-select"
                style={{ width: 'auto' }}
              >
                <option value="portrait">Portrait (A4)</option>
                <option value="landscape">Landscape (A4)</option>
              </select>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={16} /> Add Images
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  position: 'relative',
                  textAlign: 'center',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    color: '#ef4444',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.name}
                </span>
              </div>
            ))}
          </div>

          {pdfUrl ? (
            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
              <div className="stat-box" style={{ maxWidth: '320px', margin: '0 auto 1.5rem' }}>
                <div className="stat-label">PDF Generated Size</div>
                <div className="stat-value" style={{ color: '#10b981' }}>{formatFileSize(pdfSize)}</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={pdfUrl}
                  download="photos-document.pdf"
                  className="btn btn-primary btn-lg"
                  onClick={() => trackEvent('file_downloaded', 'jpg-to-pdf')}
                >
                  <Download size={20} /> Download PDF Document
                </a>
                <button type="button" onClick={resetAll} className="btn btn-secondary btn-lg">
                  <RefreshCw size={20} /> Convert More Images
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={generatePdf}
                disabled={isProcessing}
              >
                <FileImage size={20} /> {isProcessing ? 'Generating PDF...' : `Compile ${images.length} Images into PDF`}
              </button>
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
