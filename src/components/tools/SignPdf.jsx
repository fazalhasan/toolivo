import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { PenTool, Download, RefreshCw, FileCheck, ShieldCheck, Eraser } from 'lucide-react';

export default function SignPdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [signMode, setSignMode] = useState('draw'); // 'draw' or 'type'
  const [typedName, setTypedName] = useState('');
  const [inkColor, setInkColor] = useState('#0f172a');
  const [placement, setPlacement] = useState('bottom_right'); // 'bottom_right', 'bottom_left', 'bottom_center'
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (signMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = inkColor;
    }
  }, [signMode, inkColor]);

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = inkColor;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }
    setSelectedFile(file);
    setDownloadUrl('');
    trackEvent('file_uploaded', 'sign-pdf', { size: file.size });

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setTargetPage(count); // Default to last page for signature
    } catch (err) {
      alert('Could not inspect PDF: ' + err.message);
    }
  };

  const handleSign = async () => {
    if (!selectedFile) return;

    // Create signature image blob
    let sigCanvas;
    if (signMode === 'draw') {
      sigCanvas = canvasRef.current;
    } else {
      if (!typedName.trim()) {
        alert('Please type your name for the signature.');
        return;
      }
      sigCanvas = document.createElement('canvas');
      sigCanvas.width = 400;
      sigCanvas.height = 150;
      const ctx = sigCanvas.getContext('2d');
      ctx.font = 'italic bold 36px Georgia, serif';
      ctx.fillStyle = inkColor;
      ctx.fillText(typedName, 20, 80);
    }

    if (!sigCanvas) return;

    setIsProcessing(true);
    trackEvent('tool_started', 'sign-pdf');

    try {
      const sigDataUrl = sigCanvas.toDataURL('image/png');
      const sigBytes = await fetch(sigDataUrl).then((res) => res.arrayBuffer());

      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const sigImage = await pdfDoc.embedPng(sigBytes);

      const pageIndex = Math.max(0, Math.min(pageCount - 1, targetPage - 1));
      const page = pdfDoc.getPage(pageIndex);
      const { width, height } = page.getSize();

      const sigWidth = 160;
      const sigHeight = (sigWidth / sigImage.width) * sigImage.height;

      let x = width - sigWidth - 40;
      let y = 40;

      if (placement === 'bottom_left') {
        x = 40;
      } else if (placement === 'bottom_center') {
        x = (width - sigWidth) / 2;
      }

      page.drawImage(sigImage, {
        x,
        y,
        width: sigWidth,
        height: sigHeight
      });

      const signedBytes = await pdfDoc.save();
      const blob = new Blob([signedBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'sign-pdf');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Error signing PDF: ' + err.message);
      trackEvent('tool_error', 'sign-pdf', { error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-interface-card">
      {!selectedFile ? (
        <label className="dropzone-area">
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
          <div className="dropzone-icon-box">
            <PenTool size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select PDF to Sign</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Draw, type, or stamp your signature legally in your browser
          </p>
          <span className="btn btn-lime">Choose PDF Document</span>
        </label>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <FileCheck size={24} color="#0f172a" />
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{selectedFile.name}</strong>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  {formatFileSize(selectedFile.size)} • {pageCount} {pageCount === 1 ? 'page' : 'pages'} total
                </span>
              </div>
            </div>

            <button
              onClick={() => { setSelectedFile(null); setDownloadUrl(''); }}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} /> Change File
            </button>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setSignMode('draw')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-default)',
                    background: signMode === 'draw' ? '#0f172a' : '#ffffff',
                    color: signMode === 'draw' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                >
                  Draw Signature
                </button>
                <button
                  type="button"
                  onClick={() => setSignMode('type')}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-default)',
                    background: signMode === 'type' ? '#0f172a' : '#ffffff',
                    color: signMode === 'type' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    cursor: 'pointer'
                  }}
                >
                  Type Name
                </button>
              </div>

              {signMode === 'draw' && (
                <button
                  type="button"
                  onClick={clearCanvas}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  <Eraser size={14} /> Clear Canvas
                </button>
              )}
            </div>

            {signMode === 'draw' ? (
              <div style={{ background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: 'var(--radius-md)', padding: '4px', textAlign: 'center' }}>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={140}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  style={{ cursor: 'crosshair', display: 'block', margin: '0 auto', touchAction: 'none' }}
                />
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px 0' }}>
                  Sign with mouse, trackpad, or finger
                </span>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Type your full legal name..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1.5px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.25rem',
                    fontStyle: 'italic',
                    fontFamily: 'Georgia, serif',
                    background: '#ffffff'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  Target Page
                </label>
                <select
                  value={targetPage}
                  onChange={(e) => setTargetPage(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: '#ffffff', fontWeight: 600 }}
                >
                  {Array.from({ length: pageCount }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Page {i + 1} {i + 1 === pageCount ? '(Last Page)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  Placement
                </label>
                <select
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: '#ffffff', fontWeight: 600 }}
                >
                  <option value="bottom_right">Bottom Right (Standard)</option>
                  <option value="bottom_left">Bottom Left</option>
                  <option value="bottom_center">Bottom Center</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  Ink Color
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '36px' }}>
                  {['#0f172a', '#1e3a8a', '#15803d'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setInkColor(c)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: inkColor === c ? '2.5px solid var(--accent-lime)' : '1px solid rgba(0,0,0,0.1)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleSign}
              disabled={isProcessing}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Applying Signature...' : 'Stamp Signature & Sign PDF'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ Document Signed Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Signature stamped on Page {targetPage}.
              </p>
              <a
                href={downloadUrl}
                download={`signed-${selectedFile.name}`}
                onClick={() => trackEvent('file_downloaded', 'sign-pdf')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Signed PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Signing • Your signatures and files are never stored or seen by anyone</span>
      </div>
    </div>
  );
}
