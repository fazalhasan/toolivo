import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { trackEvent } from '../../utils/analytics';
import confetti from 'canvas-confetti';
import { Globe, Download, ShieldCheck, Code } from 'lucide-react';

export default function HtmlToPdf() {
  const [htmlInput, setHtmlInput] = useState(`<h1>Invoice #2026-089</h1>
<p>Thank you for using Toolivo Client-Side Suite!</p>
<h2>Order Summary:</h2>
<p>- Plan: Professional Yearly License</p>
<p>- Total: $0.00 (100% Free Forever)</p>
<p>Terms: Processed locally in client memory with zero server uploads.</p>`);
  const [docTitle, setDocTitle] = useState('HTML-Document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleConvert = async () => {
    if (!htmlInput.trim()) return;
    setIsProcessing(true);
    trackEvent('tool_started', 'html-to-pdf');

    try {
      const pdfDoc = await PDFDocument.create();
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      // Simple HTML tags parser
      // Convert <br>, <p>, <h1>, <h2> into clean blocks
      const cleanBlocks = htmlInput
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/h1>/gi, '\n')
        .replace(/<\/h2>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .split('\n');

      for (const rawLine of cleanBlocks) {
        const isH1 = /<h1>/i.test(rawLine);
        const isH2 = /<h2>/i.test(rawLine);
        const text = rawLine.replace(/<[^>]+>/g, '').trim();

        if (!text) {
          currentY -= 12;
          continue;
        }

        const font = (isH1 || isH2) ? boldFont : regularFont;
        const size = isH1 ? 18 : isH2 ? 14 : 11;
        const color = isH1 ? rgb(0.06, 0.09, 0.16) : isH2 ? rgb(0.12, 0.16, 0.24) : rgb(0.25, 0.3, 0.38);

        if (currentY <= margin + 30) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }

        currentPage.drawText(text, {
          x: margin,
          y: currentY,
          size,
          font,
          color
        });

        currentY -= size * 1.5 + (isH1 ? 10 : isH2 ? 6 : 2);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

      trackEvent('tool_completed', 'html-to-pdf');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err) {
      alert('HTML to PDF error: ' + err.message);
      trackEvent('tool_error', 'html-to-pdf', { error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-interface-card">
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            HTML / Rich Text Input
          </label>
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Document filename..."
            style={{
              padding: '0.35rem 0.75rem',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              outline: 'none'
            }}
          />
        </div>
        <textarea
          value={htmlInput}
          onChange={(e) => { setHtmlInput(e.target.value); setDownloadUrl(''); }}
          rows={10}
          style={{
            width: '100%',
            padding: '1rem',
            border: '1.5px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            outline: 'none',
            background: '#ffffff',
            resize: 'vertical'
          }}
        />
        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
          Supports standard HTML markup (h1, h2, p, br, lists)
        </span>
      </div>

      {!downloadUrl ? (
        <button
          onClick={handleConvert}
          disabled={isProcessing || !htmlInput.trim()}
          className="btn btn-lime btn-lg"
          style={{ width: '100%' }}
        >
          {isProcessing ? 'Generating PDF...' : 'Convert HTML to PDF'}
        </button>
      ) : (
        <div style={{ textAlign: 'center', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <div style={{ color: '#065f46', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
            ✓ HTML Rendered to PDF!
          </div>
          <p style={{ color: '#047857', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Formatted PDF generated directly from your HTML snippet.
          </p>
          <a
            href={downloadUrl}
            download={`${docTitle || 'document'}.pdf`}
            onClick={() => trackEvent('file_downloaded', 'html-to-pdf')}
            className="btn btn-lime btn-lg"
            style={{ display: 'inline-flex', padding: '0.85rem 2.5rem' }}
          >
            <Download size={18} /> Download Generated PDF
          </a>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
        <ShieldCheck size={16} color="#10b981" />
        <span>100% Client-Side Generation • HTML code is executed strictly in local sandbox</span>
      </div>
    </div>
  );
}
