# Toolivo 🛠️

**Toolivo** is a production-ready, ultra-fast, 100% client-side online tools suite. All file conversions, PDF modifications, image optimizations, and utility processing occur directly within the user's web browser using modern Web APIs, Web Workers, and Canvas. No files are ever uploaded to a server or external cloud storage.

---

## ✨ Features & Tool Catalog (34 Tools)

### 📄 PDF Suite (20 Tools — Full iLovePDF Alternative)
* **Merge PDF** — Combine multiple PDF documents into a single organized file
* **Split PDF** — Extract specific page ranges or split into individual documents
* **Compress PDF** — Reduce PDF file size while preserving readability
* **PDF to JPG** — Convert PDF pages into crisp JPG images
* **JPG to PDF** — Convert and compile JPG/PNG images into a PDF document
* **PDF to Word** — Extract and format PDF content for DOC/DOCX editing
* **Word to PDF** — Convert Word (.docx) documents into clean PDF files
* **Rotate PDF** — Rotate specific or all PDF pages clockwise/counter-clockwise
* **Protect PDF** — Secure sensitive PDF files with custom passwords & encryption
* **Unlock PDF** — Remove password protection from authorized PDF documents
* **PDF Page Numbers** — Add customizable page numbering headers & footers
* **Watermark PDF** — Stamp custom text watermarks across PDF pages
* **Organize PDF** — Reorder, duplicate, or delete PDF pages with visual drag & drop
* **Extract PDF Pages** — Pull selected pages into a standalone PDF document
* **Remove PDF Pages** — Delete unwanted pages from any PDF
* **Sign PDF** — Draw, type, or upload digital signatures onto PDF files
* **HTML to PDF** — Convert raw HTML or styled code into PDF documents
* **PDF to Text** — Extract clean, editable plain text from PDF files
* **Crop PDF** — Trim margins and crop specific areas of PDF documents
* **Flatten PDF** — Flatten fillable form fields and annotations into static PDF layers

### 🖼️ Image Suite (8 Tools)
* **Image Compressor** — Lossy and lossless image compression with real-time preview
* **Image Resizer** — Resize dimensions (px, %) with aspect ratio lock
* **JPG to PNG** — Convert JPG images to transparent PNG format
* **PNG to JPG** — Convert PNG images to optimized JPG format
* **WebP Converter** — Modern next-gen WebP converter
* **HEIC to JPG** — Convert Apple iPhone HEIC/HEIF photos to universal JPG
* **Image Cropper** — Crop images with preset or custom aspect ratios
* **Background Remover** — Browser-based edge detection and background knockout

### ⚡ Text & Utilities (6 Tools)
* **Word Counter** — Real-time character, word, sentence, reading time, and speaking time analyzer
* **Case Converter** — UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case
* **QR Code Generator** — Generate high-resolution downloadable SVG and PNG QR codes
* **Color Picker** — HEX, RGB, HSL converter with palette generator and eye-dropper
* **Password Generator** — Cryptographically secure randomized passwords and passphrases
* **JSON Formatter** — Validate, format, minify, and inspect JSON structures

---

## 🚀 Cloudflare Pages Deployment Guide

Toolivo is 100% pre-rendered using **Astro SSG** (Static Site Generation), making it perfectly suited for **Cloudflare Pages** edge network delivery.

### Option 1: Deploy via Cloudflare Dashboard (Recommended)

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository: `fazalhasan/toolivo`.
4. Configure the build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank or default)
5. **Environment variables** (Optional, recommended):
   - Set `NODE_VERSION` to `20.18.0` (Toolivo also includes `.nvmrc` and `.node-version` which Cloudflare auto-detects).
6. Click **Save and Deploy**.

### Option 2: Deploy via Wrangler CLI

```bash
# Install Wrangler globally or use npx
npx wrangler pages project create toolivo --production-branch main

# Build the project
npm run build

# Deploy the static output
npx wrangler pages deploy dist --project-name toolivo
```

---

## 🛠️ Local Development

### Prerequisites
* **Node.js**: v18.17.1 or higher (v20+ recommended)
* **npm**: v9 or higher

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Privacy & Architecture

* **100% Zero-Cloud Processing**: All operations are executed locally inside the user's browser runtime.
* **No Server Uploads**: Files are not transmitted to any API, server, or cloud storage.
* **Modern Web Standards**: Built with Astro 5, React 19, `pdf-lib`, HTML5 Canvas API, and modern Web Workers.
* **SEO Optimized**: Complete Schema.org JSON-LD structured data, Open Graph tags, canonical URLs, and automated XML sitemaps.
