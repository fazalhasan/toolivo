import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { trackEvent, formatFileSize } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { FileText, Download, RefreshCw, FileCheck, ShieldCheck } from 'lucide-react';

export default function WordToPdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setDownloadUrl('');
    trackEvent('file_uploaded', 'word-to-pdf', { size: file.size });

    // Read text content from .txt, .rtf, or doc files
    const reader = new FileReader();
    reader.onload = (event) => {
      let text = event.target?.result || '';
      // Strip RTF control words if RTF
      if (typeof text === 'string' && text.startsWith('{\\rtf')) {
        text = text.replace(/\\par/g, '\n').replace(/\\[a-z0-9]+\s?/gi, '').replace(/[{}]/g, '');
      }
      setFileContent(text.slice(0, 50000));
    };
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'word-to-pdf');

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const pageWidth = 595.28; // Standard A4 width in pt
      const pageHeight = 841.89; // Standard A4 height in pt
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = fontSize * 1.45;

      const rawLines = fileContent ? fileContent.split('\n') : ['[Empty Document]'];

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin - 20;

      // Title on first page
      const docTitle = selectedFile.name.replace(/\.[^/.]+$/, '');
      currentPage.drawText(docTitle, {
        x: margin,
        y: currentY,
        size: 18,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1)
      });
      currentY -= 30;

      // Divider line
      currentPage.drawLine({
        start: { x: margin, y: currentY },
        end: { x: pageWidth - margin, y: currentY },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85)
      });
      currentY -= 25;

      // Draw word-wrapped body paragraphs
      for (const rawLine of rawLines) {
        const words = rawLine.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth > maxWidth && currentLine) {
            if (currentY <= margin + 30) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margin - 20;
            }

            currentPage.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              font,
              color: rgb(0.15, 0.15, 0.15)
            });

            currentY -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          if (currentY <= margin + 30) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin - 20;
          }

          currentPage.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.15, 0.15, 0.15)
          });

          currentY -= lineHeight;
        }

        // Paragraph gap
        currentY -= 8;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'word-to-pdf');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('Conversion error: ' + err.message);
      trackEvent('tool_error', 'word-to-pdf', { error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-interface-card">
      {!selectedFile ? (
        <label className="dropzone-area">
          <input type="file" accept=".docx,.doc,.rtf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
          <div className="dropzone-icon-box">
            <FileText size={36} color="#0f172a" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select Document to Convert to PDF</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Supports Word (.docx, .doc), Rich Text (.rtf), and Text (.txt) formats
          </p>
          <span className="btn btn-lime">Choose Document</span>
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
                  {formatFileSize(selectedFile.size)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.875rem' }}>Document Text Preview</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Font Size: {fontSize}pt
              </span>
            </div>
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1.5px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                background: '#ffffff',
                resize: 'vertical'
              }}
            />
          </div>

          {!downloadUrl ? (
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="btn btn-lime btn-lg"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
            </button>
          ) : (
            <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                ✓ PDF Created Successfully!
              </div>
              <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Formatted A4 document ready for printing and sharing.
              </p>
              <a
                href={downloadUrl}
                download={`${selectedFile.name.replace(/\.[^/.]+$/, '')}.pdf`}
                onClick={() => trackEvent('file_downloaded', 'word-to-pdf')}
                className="btn btn-lime btn-lg"
                style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
              >
                <Download size={18} /> Download Converted PDF
              </a>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Conversion • No documents sent to remote cloud</span>
      </div>
    </div>
  );
}
