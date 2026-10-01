export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolStep {
  title: string;
  description: string;
}

export interface ToolBenefit {
  title: string;
  description: string;
}

export interface ToolItem {
  slug: string;
  name: string;
  category: 'image' | 'pdf' | 'text' | 'utility';
  categoryLabel: string;
  badge?: string;
  description: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  icon: string;
  supportedFormats: string[];
  maxFileSize: string;
  howToSteps: ToolStep[];
  whyUse: ToolBenefit[];
  faqs: ToolFAQ[];
  relatedSlugs: string[];
  componentName: string;
  isPopular?: boolean;
}

export const TOOLS: ToolItem[] = [
  // --- IMAGE TOOLS ---
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Compress JPG, PNG, and WebP images online without losing quality. Reduce file size up to 85% instantly.',
    seoTitle: 'Free Image Compressor – Compress JPG, PNG & WebP Online',
    metaDescription: 'Compress JPG, PNG, and WebP images online for free. Reduce file size while preserving visual clarity. 100% browser-based & private.',
    h1: 'Free Online Image Compressor',
    intro: 'Optimize your images for web, email, and social media. Our high-precision compression algorithm reduces file size by up to 85% while preserving crisp pixel fidelity directly inside your browser.',
    icon: 'Minimize2',
    supportedFormats: ['JPG', 'PNG', 'WebP', 'AVIF'],
    maxFileSize: '50 MB',
    componentName: 'ImageCompressor',
    howToSteps: [
      { title: 'Upload Image', description: 'Drag and drop your JPG, PNG, or WebP file into the upload zone or click to select.' },
      { title: 'Adjust Quality', description: 'Use the interactive slider to balance file compression ratio against visual sharpness.' },
      { title: 'Instant Preview', description: 'Inspect the live before-and-after comparison and file reduction statistics.' },
      { title: 'Download File', description: 'Click Download to save your compressed image instantly with zero server wait.' }
    ],
    whyUse: [
      { title: '100% Client-Side Privacy', description: 'Your photos never leave your device. All compression runs via HTML5 Canvas in your browser.' },
      { title: 'Zero File Size Sacrifices', description: 'Smart quantization algorithms strip redundant metadata while maintaining sharpness.' },
      { title: 'Batch Speed', description: 'Processes high-resolution images in milliseconds without network upload lag.' },
      { title: 'Completely Free Forever', description: 'No credit card, no daily limit, no account registration required.' }
    ],
    faqs: [
      {
        question: 'Does image compression reduce visual quality?',
        answer: 'When using balanced compression (70% - 85%), human eyes cannot detect any difference on standard displays. Only redundant color variations and invisible metadata are removed.'
      },
      {
        question: 'Are my images uploaded to any server?',
        answer: 'No. Toolivo operates 100% client-side. The image is processed in your device memory through native browser graphics APIs.'
      },
      {
        question: 'What is the best format to compress for web performance?',
        answer: 'WebP offers the highest compression efficiency (25-35% smaller than JPG). You can use our tool to convert and compress into WebP directly.'
      },
      {
        question: 'Is there a limit on the number of images I can compress?',
        answer: 'There are no limits. You can compress as many images as you need for free.'
      }
    ],
    relatedSlugs: ['image-resizer', 'jpg-to-png', 'webp-converter', 'image-cropper']
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Resize images by pixels or percentage with aspect ratio lock and high-quality resampling.',
    seoTitle: 'Free Image Resizer – Resize JPG, PNG & WebP by Pixels or %',
    metaDescription: 'Resize photos and graphics online for free. Set custom width, height, percentage scale, and maintain aspect ratio instantly.',
    h1: 'Free Online Image Resizer',
    intro: 'Change the dimensions of your photos and graphics with pixel-level precision. Scale down for social media or scale up with bicubic filtering right in your browser.',
    icon: 'Maximize2',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '50 MB',
    componentName: 'ImageResizer',
    howToSteps: [
      { title: 'Select File', description: 'Choose any image file from your computer, phone, or tablet.' },
      { title: 'Choose Dimensions', description: 'Enter target width and height in pixels, or scale by percentage.' },
      { title: 'Maintain Aspect Ratio', description: 'Keep the aspect ratio lock enabled to avoid distorting proportions.' },
      { title: 'Export', description: 'Download your resized image in original or modern WebP format.' }
    ],
    whyUse: [
      { title: 'Social Media Presets', description: 'Quickly hit target dimensions for Instagram, YouTube, LinkedIn, and Facebook.' },
      { title: 'Aspect Ratio Preservation', description: 'Automatic dimension recalculation guarantees no stretching or warping.' },
      { title: 'Bicubic Smoothing', description: 'High-quality interpolation algorithm ensures crisp edges and smooth gradients.' },
      { title: 'Private & Local', description: 'Zero uploads. Your media never leaves your device.' }
    ],
    faqs: [
      {
        question: 'Will resizing an image reduce its file size?',
        answer: 'Yes! Reducing pixel dimensions (for example from 4000x3000 to 1920x1080) substantially reduces the file size because fewer pixels need to be stored.'
      },
      {
        question: 'What happens if I enlarge an image beyond its original resolution?',
        answer: 'Our resizer uses smooth bicubic interpolation to minimize pixelation, though images look sharpest when scaled to or below their native resolution.'
      },
      {
        question: 'Can I lock the aspect ratio?',
        answer: 'Yes, the aspect ratio lock is enabled by default. Entering a new width will automatically update the height proportionately.'
      }
    ],
    relatedSlugs: ['image-compressor', 'image-cropper', 'jpg-to-png', 'webp-converter']
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Convert JPG photos to lossless PNG format with transparent canvas support and maximum fidelity.',
    seoTitle: 'Convert JPG to PNG Online Free – Lossless Image Converter',
    metaDescription: 'Convert JPG images to PNG format instantly without quality loss. 100% free, browser-based, and completely private.',
    h1: 'Free JPG to PNG Converter',
    intro: 'Transform JPEG images into high-fidelity PNG format. PNG provides lossless compression, crisp line work, and is the standard for web graphics, screenshots, and editing.',
    icon: 'Repeat',
    supportedFormats: ['JPG', 'JPEG'],
    maxFileSize: '50 MB',
    componentName: 'JpgToPng',
    howToSteps: [
      { title: 'Upload JPG', description: 'Select or drag your JPG/JPEG image into the upload box.' },
      { title: 'Select Format Settings', description: 'Confirm PNG output with full lossless 24-bit color depth.' },
      { title: 'Transcode', description: 'The browser decodes the JPEG and rasterizes it into pure PNG data.' },
      { title: 'Save File', description: 'Download your pristine PNG file immediately.' }
    ],
    whyUse: [
      { title: 'Lossless Conversion', description: 'Prevents further generational compression artifacts common in re-saved JPEGs.' },
      { title: 'Browser-Engine Speed', description: 'Instant transcoding without waiting in an upload queue.' },
      { title: 'Ideal for Graphics & Text', description: 'PNG format excels at preserving crisp logos, icons, and sharp typography.' },
      { title: 'Secure & Offline-Ready', description: 'Operates completely locally within your browser tab.' }
    ],
    faqs: [
      {
        question: 'Why convert JPG to PNG?',
        answer: 'PNG uses lossless compression, meaning it preserves exact color data and sharp lines without JPEG blur artifacts. It is ideal for illustrations, charts, and graphics you plan to edit.'
      },
      {
        question: 'Does converting JPG to PNG create transparency?',
        answer: 'JPG does not contain transparency information. The converted PNG will accurately reproduce the JPG appearance; to remove background colors, use our Background Remover tool.'
      },
      {
        question: 'Is this conversion free?',
        answer: 'Yes, 100% free with no watermarks or file quantity restrictions.'
      }
    ],
    relatedSlugs: ['png-to-jpg', 'image-compressor', 'webp-converter', 'image-cropper']
  },
  {
    slug: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Convert PNG images to compact JPG format with customizable background color and quality compression.',
    seoTitle: 'Convert PNG to JPG Online Free – Instant Image Conversion',
    metaDescription: 'Easily convert transparent or large PNG images into compact JPG files. Choose background color and quality settings. Free and secure.',
    h1: 'Free PNG to JPG Converter',
    intro: 'Turn heavyweight PNG files into compact, universally compatible JPEG images. Great for shrinking photography, screenshots, and sharing files via email or messaging apps.',
    icon: 'ArrowRightLeft',
    supportedFormats: ['PNG'],
    maxFileSize: '50 MB',
    componentName: 'PngToJpg',
    howToSteps: [
      { title: 'Upload PNG', description: 'Drop your PNG file with or without transparency.' },
      { title: 'Select Background Fill', description: 'Pick white, black, or custom background color for transparent regions.' },
      { title: 'Choose JPEG Quality', description: 'Set quality from 60% to 100% to optimize between size and clarity.' },
      { title: 'Download JPG', description: 'Click Download to save your newly converted JPEG image.' }
    ],
    whyUse: [
      { title: 'Drastic File Reduction', description: 'Photos saved as PNG can be up to 80% smaller when converted to optimized JPG.' },
      { title: 'Transparency Handling', description: 'Allows you to choose the exact background color to replace transparent pixels.' },
      { title: 'Universal Device Support', description: 'JPG opens seamlessly across all legacy systems, printers, and mobile devices.' },
      { title: 'No Server Upload', description: 'Completely private processing on your CPU/GPU.' }
    ],
    faqs: [
      {
        question: 'What happens to transparency when converting PNG to JPG?',
        answer: 'Because the JPG format does not support alpha transparency, any transparent pixels are filled with a clean background color (white by default, or your chosen custom color).'
      },
      {
        question: 'Why are PNG files usually larger than JPG?',
        answer: 'PNG stores every pixel value without discarding data (lossless), whereas JPG uses intelligent lossy algorithms tuned to human visual perception, yielding much smaller files for photographic images.'
      }
    ],
    relatedSlugs: ['jpg-to-png', 'image-compressor', 'webp-converter', 'image-resizer']
  },
  {
    slug: 'webp-converter',
    name: 'WebP Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Convert JPG, PNG, and GIF into modern WebP format for 30%+ smaller file sizes and faster websites.',
    seoTitle: 'Free WebP Converter – Convert JPG & PNG to WebP Online',
    metaDescription: 'Convert images to Google Next-Gen WebP format online. Boost website page speed and SEO with 30% smaller image files.',
    h1: 'Free WebP Image Converter',
    intro: 'Modernize your web assets with Google WebP technology. WebP delivers superior lossy and lossless compression, cutting load times and improving Core Web Vitals scores.',
    icon: 'Zap',
    supportedFormats: ['JPG', 'PNG', 'AVIF', 'GIF'],
    maxFileSize: '50 MB',
    componentName: 'WebpConverter',
    howToSteps: [
      { title: 'Upload Media', description: 'Drag and drop standard JPG or PNG images into the converter.' },
      { title: 'Select Quality', description: 'Adjust WebP compression grade (recommended: 80% for web publishing).' },
      { title: 'Convert', description: 'The browser converts the raster buffer into modern WebP format.' },
      { title: 'Download WebP', description: 'Save your optimized .webp file ready for website deployment.' }
    ],
    whyUse: [
      { title: 'Google Next-Gen Format', description: 'Directly improves your PageSpeed Insights scores and mobile user experience.' },
      { title: 'Smaller Than JPEG & PNG', description: 'Typically delivers 26% smaller files than PNG and 25-34% smaller than JPEG.' },
      { title: 'Full Alpha Transparency', description: 'Supports transparent cutouts just like PNG but at a fraction of the weight.' },
      { title: 'Zero Cloud Latency', description: 'All conversion takes place directly in your browser.' }
    ],
    faqs: [
      {
        question: 'Are WebP images supported by modern web browsers?',
        answer: 'Yes! WebP is natively supported by over 97% of global web browsers, including Chrome, Safari, Firefox, Edge, iOS Safari, and Android.'
      },
      {
        question: 'Does WebP support transparency?',
        answer: 'Yes, WebP supports both lossy and lossless compression with 8-bit alpha channel transparency.'
      }
    ],
    relatedSlugs: ['image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg']
  },
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG Converter',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Essential',
    isPopular: true,
    description: 'Convert iPhone HEIC/HEIF photos to standard JPG format for effortless viewing on Windows and Android.',
    seoTitle: 'Convert HEIC to JPG Online Free – iPhone Photo Converter',
    metaDescription: 'Convert Apple iPhone HEIC and HEIF photos to high-resolution JPG files online. Free, safe, and works on Windows, Mac, and mobile.',
    h1: 'Free HEIC to JPG Converter',
    intro: 'Easily open Apple iPhone HEIC photos on Windows, Linux, and Android. Convert HEIF containers into universal high-resolution JPEGs with complete EXIF and color fidelity.',
    icon: 'Smartphone',
    supportedFormats: ['HEIC', 'HEIF'],
    maxFileSize: '50 MB',
    componentName: 'HeicToJpg',
    howToSteps: [
      { title: 'Upload HEIC', description: 'Select .heic or .heif photos from your iPhone or computer.' },
      { title: 'Auto Decode', description: 'The browser decodes the HEVC image stream into standard RGB.' },
      { title: 'Adjust Quality', description: 'Choose your desired output JPEG quality level.' },
      { title: 'Download JPG', description: 'Save universal .jpg photos ready to share or print.' }
    ],
    whyUse: [
      { title: 'Fix Windows Compatibility', description: 'Solves the "Cannot open HEIC file" error on PC and Android.' },
      { title: 'Preserve Visual Detail', description: 'Converts high-bitrate iPhone camera captures without crushing colors.' },
      { title: 'Strict Privacy', description: 'Personal photos remain completely safe on your device.' }
    ],
    faqs: [
      {
        question: 'Why does iPhone shoot in HEIC instead of JPG?',
        answer: 'Apple uses HEIC (High Efficiency Image Container) because it compresses photos into half the file size of traditional JPEGs while supporting 16-bit color depth.'
      },
      {
        question: 'Can Windows 10/11 open HEIC files without plugins?',
        answer: 'Often Windows requires a paid HEVC Video Extension from the Microsoft Store. Our free online converter lets you convert them to standard JPG with zero installation.'
      }
    ],
    relatedSlugs: ['jpg-to-png', 'image-compressor', 'webp-converter', 'image-resizer']
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Crop images online to custom dimensions or standard aspect ratios like 1:1, 16:9, 4:3, and 9:16.',
    seoTitle: 'Free Image Cropper – Crop Photos Online to Exact Dimensions',
    metaDescription: 'Crop JPG, PNG, and WebP images online for free. Choose 1:1 square, 16:9 widescreen, circular crop, or custom aspect ratio.',
    h1: 'Free Online Image Cropper',
    intro: 'Trim unwanted borders, center your subject, or frame photos for social profile avatars and YouTube thumbnails. Intuitive handles, aspect ratio locks, and live previews.',
    icon: 'Crop',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '50 MB',
    componentName: 'ImageCropper',
    howToSteps: [
      { title: 'Upload Image', description: 'Drop in any photo or graphic you want to crop.' },
      { title: 'Choose Aspect Ratio', description: 'Select 1:1 Square, 16:9 Widescreen, 4:3 Classic, or Freeform.' },
      { title: 'Adjust Bounds', description: 'Drag the crop box and resize the handles over your subject.' },
      { title: 'Save Cropped Image', description: 'Download your cropped image at full resolution.' }
    ],
    whyUse: [
      { title: 'Standard Ratio Presets', description: 'One-click presets for Instagram avatar (1:1), YouTube thumbnail (16:9), and Stories (9:16).' },
      { title: 'Lossless Center Cropping', description: 'Extracts exact pixels without applying extra degradation.' },
      { title: 'Real-Time Canvas', description: 'Instant responsive preview with smooth drag-and-drop handles.' }
    ],
    faqs: [
      {
        question: 'Does cropping reduce photo resolution?',
        answer: 'Cropping removes outer pixels, so the final pixel dimensions will match the crop area, but the retained pixels are preserved at full original sharpness.'
      },
      {
        question: 'Can I crop to a perfect square?',
        answer: 'Yes! Select the "1:1 Square" preset to lock the crop frame into a 1:1 square aspect ratio.'
      }
    ],
    relatedSlugs: ['image-resizer', 'image-compressor', 'jpg-to-png', 'background-remover']
  },
  {
    slug: 'background-remover',
    name: 'Background Remover',
    category: 'image',
    categoryLabel: 'Image Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Remove background from photos and graphics to create transparent PNG cutouts instantly.',
    seoTitle: 'Free Background Remover – Erase Image Background Online',
    metaDescription: 'Remove image backgrounds online for free. Create transparent PNG cutouts of portraits, products, and graphics directly in your browser.',
    h1: 'Free Online Background Remover',
    intro: 'Isolate subjects and erase solid, gradient, or color backgrounds from product shots, signatures, stamps, and logos. Download crisp transparent PNGs in seconds.',
    icon: 'Sparkles',
    supportedFormats: ['JPG', 'PNG', 'WebP'],
    maxFileSize: '30 MB',
    componentName: 'BackgroundRemover',
    howToSteps: [
      { title: 'Upload Subject', description: 'Upload a logo, signature, product photo, or portrait.' },
      { title: 'Select Color / Tolerance', description: 'Click the background color or use smart tolerance thresholding.' },
      { title: 'Refine Edges', description: 'Adjust feathering and smoothing for seamless subject isolation.' },
      { title: 'Download PNG', description: 'Export your transparent cutout as a high-resolution PNG.' }
    ],
    whyUse: [
      { title: 'Transparent PNG Output', description: 'Ready for use in presentations, e-commerce listings, and graphic design.' },
      { title: 'Threshold & Edge Feathering', description: 'Fine-tune color sensitivity to eliminate halo artifacts.' },
      { title: 'No Account Required', description: 'No credit system or watermarks on your finished cutouts.' }
    ],
    faqs: [
      {
        question: 'What types of images work best?',
        answer: 'Images with contrast between the subject and background (such as solid studio backdrops, white backgrounds, or digital logos) produce the cleanest cutouts.'
      },
      {
        question: 'Will my download have a transparent background?',
        answer: 'Yes, the final image is exported in 32-bit PNG format with a transparent alpha channel.'
      }
    ],
    relatedSlugs: ['image-cropper', 'png-to-jpg', 'jpg-to-png', 'image-compressor']
  },

  // --- PDF TOOLS ---
  {
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Compress PDF documents to smaller file sizes for easy email attachment and portal upload.',
    seoTitle: 'Free PDF Compressor – Reduce PDF File Size Online',
    metaDescription: 'Compress PDF files online for free. Reduce PDF size for email attachments and government forms while keeping text crisp.',
    h1: 'Free Online PDF Compressor',
    intro: 'Shrink oversized PDF documents without sacrificing readability. Our PDF engine cleans redundant metadata, flattens unused font subsets, and compacts object streams.',
    icon: 'FileArchive',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfCompressor',
    howToSteps: [
      { title: 'Select PDF', description: 'Upload any PDF document from your computer or mobile device.' },
      { title: 'Choose Optimization Level', description: 'Select Regular or Strong compression to match portal limits.' },
      { title: 'Optimize Document', description: 'Our browser-based PDF engine cleans object streams and optimizes fonts.' },
      { title: 'Download Result', description: 'Download your smaller PDF ready to attach and send.' }
    ],
    whyUse: [
      { title: 'Pass Email & Portal Limits', description: 'Easily get under 5MB or 10MB limits on government and school portals.' },
      { title: 'Retains Searchable Text', description: 'Vector typography and text layers remain fully selectable and searchable.' },
      { title: 'Confidential & Private', description: 'Bank statements, contracts, and IDs never leave your computer.' }
    ],
    faqs: [
      {
        question: 'Is it safe to compress confidential legal or financial PDFs?',
        answer: 'Yes! Toolivo processes your PDF directly inside your web browser. Nothing is uploaded to any remote server or stored in the cloud.'
      },
      {
        question: 'Will text in the PDF become blurry?',
        answer: 'No. Vector text characters are mathematically preserved. Only redundant embedded object streams and metadata are compacted.'
      }
    ],
    relatedSlugs: ['pdf-merger', 'pdf-splitter', 'jpg-to-pdf', 'pdf-to-jpg']
  },
  {
    slug: 'pdf-merger',
    name: 'PDF Merger',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Combine multiple PDF files into one single organized document. Reorder pages with ease.',
    seoTitle: 'Merge PDF Online Free – Combine Multiple PDF Files',
    metaDescription: 'Merge PDF files into a single document in seconds. Drag and drop to reorder pages. 100% free, private, and browser-powered.',
    h1: 'Free Online PDF Merger',
    intro: 'Join multiple invoices, contract sheets, or reports into a single unified PDF file. Reorder documents with simple drag-and-drop and export in seconds.',
    icon: 'Layers',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfMerger',
    howToSteps: [
      { title: 'Upload Files', description: 'Choose two or more PDF files you want to combine.' },
      { title: 'Arrange Order', description: 'Drag or click up/down arrows to sequence documents in desired order.' },
      { title: 'Merge', description: 'The PDF engine stitches all pages into one continuous stream.' },
      { title: 'Download Combined PDF', description: 'Download your unified PDF file instantly.' }
    ],
    whyUse: [
      { title: 'Easy Drag & Drop Order', description: 'Intuitive interface makes arranging multiple files effortless.' },
      { title: 'No Page Limit', description: 'Merge documents of any length without annoying arbitrary caps.' },
      { title: 'Preserves Bookmarks & Hyperlinks', description: 'Retains structural integrity and table of contents across merged pages.' },
      { title: 'Zero Cloud Upload', description: 'Handles sensitive documents with absolute on-device privacy.' }
    ],
    faqs: [
      {
        question: 'How many PDF files can I merge at once?',
        answer: 'You can merge as many PDF files as your device memory allows. Dozens of files can be combined in just seconds.'
      },
      {
        question: 'Can I reorder the documents before merging?',
        answer: 'Yes, simply use the arrange arrows or drag cards to order them exactly how you need before clicking Merge.'
      }
    ],
    relatedSlugs: ['pdf-splitter', 'pdf-compressor', 'jpg-to-pdf', 'pdf-to-word']
  },
  {
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Essential',
    isPopular: true,
    description: 'Extract specific pages or page ranges from a PDF document into a new standalone file.',
    seoTitle: 'Free PDF Splitter – Extract Pages from PDF Online',
    metaDescription: 'Split PDF files and extract page ranges online for free. Separate individual pages or extract custom chapters quickly and securely.',
    h1: 'Free Online PDF Splitter',
    intro: 'Isolate crucial pages from massive PDF reports, textbooks, or contracts. Specify custom page ranges like "1-3, 5, 8-10" and extract them into a clean new document.',
    icon: 'Scissors',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfSplitter',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document containing pages you wish to extract.' },
      { title: 'Enter Page Range', description: 'Type the pages or range you need (e.g. 1-4, 7, 10-12).' },
      { title: 'Extract Pages', description: 'Our PDF processor pulls the specified pages into a new container.' },
      { title: 'Download Split PDF', description: 'Save your extracted document instantly.' }
    ],
    whyUse: [
      { title: 'Flexible Page Selection', description: 'Support for individual pages, consecutive ranges, or comma-separated subsets.' },
      { title: 'No Degradation', description: 'Pages are extracted directly at native vector resolution.' },
      { title: 'Instantaneous Output', description: 'Client-side processing extracts dozens of pages in under a second.' }
    ],
    faqs: [
      {
        question: 'How do I specify which pages to extract?',
        answer: 'You can use commas and dashes, such as "1-5" for pages one through five, or "1, 3, 7-10" for a custom selection.'
      },
      {
        question: 'Does splitting a PDF damage the original file on my computer?',
        answer: 'Not at all. Your original file remains untouched. The tool generates a new separate PDF containing only your selected pages.'
      }
    ],
    relatedSlugs: ['pdf-merger', 'pdf-compressor', 'pdf-to-jpg', 'jpg-to-pdf']
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Convert one or multiple JPG/PNG images into a neat, printable PDF document with page orientation controls.',
    seoTitle: 'Convert JPG to PDF Online Free – Image to PDF Converter',
    metaDescription: 'Convert JPG and PNG photos into a clean PDF document online. Set margins, portrait or landscape orientation. Fast and 100% free.',
    h1: 'Free JPG to PDF Converter',
    intro: 'Turn receipts, scanned notes, IDs, and photo collections into professional PDF documents. Add multiple images, set paper sizes (A4, Letter), and compile in seconds.',
    icon: 'FileImage',
    supportedFormats: ['JPG', 'JPEG', 'PNG', 'WebP'],
    maxFileSize: '50 MB',
    componentName: 'JpgToPdf',
    howToSteps: [
      { title: 'Upload Images', description: 'Select one or more JPG/PNG pictures from your device.' },
      { title: 'Configure Layout', description: 'Choose orientation (Portrait/Landscape) and page margins.' },
      { title: 'Generate PDF', description: 'Click Convert to compile images into vector PDF pages.' },
      { title: 'Download File', description: 'Save your formatted PDF document ready to print or email.' }
    ],
    whyUse: [
      { title: 'Multi-Image Batch', description: 'Combine dozens of photos or receipt scans into one neat PDF file.' },
      { title: 'Standard Page Formatting', description: 'Fits images neatly to standard A4 or US Letter page dimensions.' },
      { title: 'High-DPI Printing', description: 'Retains full camera resolution for crisp printing.' }
    ],
    faqs: [
      {
        question: 'Can I add multiple photos into one single PDF?',
        answer: 'Yes! You can upload multiple photos and our tool will place each photo onto its own dedicated page in the resulting PDF.'
      },
      {
        question: 'Can I adjust the page orientation?',
        answer: 'Yes, you can easily toggle between Portrait and Landscape orientation to suit your photos.'
      }
    ],
    relatedSlugs: ['pdf-to-jpg', 'pdf-merger', 'pdf-compressor', 'jpg-to-png']
  },
  {
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Convert PDF pages into high-resolution JPG images. Extract slides, posters, and pages quickly.',
    seoTitle: 'Convert PDF to JPG Online Free – Extract PDF Pages as Images',
    metaDescription: 'Convert PDF pages into high-resolution JPG images online. Extract slides, illustrations, and documents for free in your browser.',
    h1: 'Free PDF to JPG Converter',
    intro: 'Rasterize PDF pages into crystal-clear JPEG image files. Perfect for embedding report pages into presentations, sharing on social media, or inserting into documents.',
    icon: 'FileText',
    supportedFormats: ['PDF'],
    maxFileSize: '50 MB',
    componentName: 'PdfToJpg',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the PDF document you want to convert into images.' },
      { title: 'Select DPI / Quality', description: 'Choose standard web resolution or high-DPI clarity.' },
      { title: 'Render Pages', description: 'The browser renders pages onto a high-definition canvas.' },
      { title: 'Download JPGs', description: 'Download individual pages or download all as a bundle.' }
    ],
    whyUse: [
      { title: 'High Resolution Render', description: 'Crystal-clear text and graphic rasterization without fuzzy compression.' },
      { title: 'Select Specific Pages', description: 'Convert entire documents or choose individual pages to download.' },
      { title: 'No Server Delays', description: 'Instant browser rendering using HTML5 Canvas graphics.' }
    ],
    faqs: [
      {
        question: 'What resolution are the extracted JPG images?',
        answer: 'Images are rendered at crisp standard or high-DPI (up to 300 DPI equivalent) to ensure small text and diagrams remain sharp.'
      },
      {
        question: 'Can I convert multi-page PDFs?',
        answer: 'Yes! The tool lets you preview each page and download individual pages as JPG files.'
      }
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-to-word', 'pdf-compressor', 'pdf-splitter']
  },
  {
    slug: 'pdf-to-word',
    name: 'PDF to Word Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Extract text, headings, and formatting from PDF documents into editable Word (.docx) documents.',
    seoTitle: 'Convert PDF to Word Online Free – Editable DOCX Converter',
    metaDescription: 'Convert PDF files to editable Microsoft Word (.docx) documents online for free. Fast, accurate text extraction with complete privacy.',
    h1: 'Free PDF to Word Converter',
    intro: 'Turn read-only PDF documents into fully editable Microsoft Word documents. Extract paragraphs, tables, and structured text so you can update and rewrite contracts and resumes.',
    icon: 'FileEdit',
    supportedFormats: ['PDF'],
    maxFileSize: '50 MB',
    componentName: 'PdfToWord',
    howToSteps: [
      { title: 'Select PDF', description: 'Upload the PDF document you need to edit in Word.' },
      { title: 'Text Extraction', description: 'Our engine extracts text blocks, line breaks, and paragraph layout.' },
      { title: 'Format as DOCX', description: 'Compiles clean editable XML into standard Microsoft Word document format.' },
      { title: 'Download DOCX', description: 'Open and edit directly in Word, Google Docs, or LibreOffice.' }
    ],
    whyUse: [
      { title: 'Editable Text', description: 'Reclaim text locked in static PDFs without tedious retyping.' },
      { title: 'Compatible Everywhere', description: 'Creates standard DOCX files supported by Microsoft Word and Google Docs.' },
      { title: 'Guaranteed Confidentiality', description: 'Process resumes and proprietary contracts safely on your device.' }
    ],
    faqs: [
      {
        question: 'Can I edit the converted file in Google Docs?',
        answer: 'Yes! The exported .docx file can be opened directly in Microsoft Word, Google Docs, Apple Pages, and LibreOffice.'
      },
      {
        question: 'Does this work on scanned PDFs?',
        answer: 'It works best on digital PDFs containing selectable text. For scanned paper documents, text layers are extracted where available.'
      }
    ],
    relatedSlugs: ['pdf-to-jpg', 'pdf-merger', 'pdf-compressor', 'word-counter']
  },

  // --- TEXT TOOLS ---
  {
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text',
    categoryLabel: 'Text Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Live word, character, sentence, paragraph counter with reading time and keyword frequency stats.',
    seoTitle: 'Free Online Word Counter – Words, Characters & Reading Time',
    metaDescription: 'Free real-time word counter tool. Count words, characters, sentences, paragraphs, reading time, and keyword density instantly.',
    h1: 'Free Online Word Counter',
    intro: 'An intelligent writing assistant for bloggers, students, and SEO writers. Calculate word count, character count with/without spaces, estimated reading time, and keyword density.',
    icon: 'AlignLeft',
    supportedFormats: ['Text', 'Markdown'],
    maxFileSize: 'Unlimited',
    componentName: 'WordCounter',
    howToSteps: [
      { title: 'Paste or Type', description: 'Enter or paste your text directly into the live editor.' },
      { title: 'Instant Metrics', description: 'Watch metrics calculate in real-time as you write.' },
      { title: 'Inspect Keyword Density', description: 'Check top recurring words to optimize SEO balance.' },
      { title: 'Copy or Clear', description: 'Copy text to clipboard with one click.' }
    ],
    whyUse: [
      { title: 'Real-Time Dynamic Stats', description: 'Zero lag updating as you type or paste extensive manuscripts.' },
      { title: 'Social Media Limits', description: 'Shows character limits for X/Twitter (280), Meta/Facebook, and LinkedIn.' },
      { title: 'Speaking & Reading Time', description: 'Calculates exact speech duration for presentations and articles.' }
    ],
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated using the standard adult average reading speed of 200 to 250 words per minute.'
      },
      {
        question: 'Does this word counter store my text?',
        answer: 'No. Everything stays in your browser session. Your writing is never transmitted or saved to external databases.'
      }
    ],
    relatedSlugs: ['case-converter', 'json-formatter', 'qr-code-generator', 'image-compressor']
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    category: 'text',
    categoryLabel: 'Text Tools',
    badge: 'Essential',
    isPopular: false,
    description: 'Transform text into Title Case, Sentence case, UPPERCASE, lowercase, camelCase, snake_case, and kebab-case.',
    seoTitle: 'Online Case Converter – Title Case, UPPERCASE & camelCase',
    metaDescription: 'Easily convert text to Title Case, UPPERCASE, lowercase, camelCase, snake_case, and kebab-case. Free online text formatter.',
    h1: 'Free Online Case Converter',
    intro: 'Format headlines, code variables, titles, and paragraphs instantly. Switch between programming naming conventions and publication style guides with a single click.',
    icon: 'Type',
    supportedFormats: ['Text'],
    maxFileSize: 'Unlimited',
    componentName: 'CaseConverter',
    howToSteps: [
      { title: 'Input Text', description: 'Paste or type text into the converter box.' },
      { title: 'Select Target Case', description: 'Click any format: UPPERCASE, lowercase, Title Case, camelCase, or snake_case.' },
      { title: 'Preview & Copy', description: 'Review the formatted text and copy it to your clipboard with one click.' }
    ],
    whyUse: [
      { title: 'Developer Friendly', description: 'One-click conversions to camelCase, snake_case, and kebab-case for clean coding.' },
      { title: 'Editorial Title Case', description: 'Automatically capitalizes major words while keeping articles lowercase.' },
      { title: 'Instant Clipboard Copy', description: 'Speed up your workflow without manual retyping.' }
    ],
    faqs: [
      {
        question: 'What is Title Case?',
        answer: 'Title Case capitalizes the first letter of each major word while keeping small conjunctions and prepositions (like "and", "in", "the") in lowercase.'
      }
    ],
    relatedSlugs: ['word-counter', 'json-formatter', 'slug-generator', 'qr-code-generator']
  },

  // --- UTILITY TOOLS ---
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'utility',
    categoryLabel: 'Utility Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Create custom QR codes for websites, Wi-Fi networks, contact cards, and text with custom colors and PNG/SVG download.',
    seoTitle: 'Free QR Code Generator – Create Custom QR Codes Online',
    metaDescription: 'Create high-resolution QR codes online for free. Custom colors, high error correction, and instant PNG and SVG downloads. No expiration.',
    h1: 'Free Online QR Code Generator',
    intro: 'Generate permanent, high-resolution QR codes for marketing materials, restaurant menus, Wi-Fi connections, and business cards. Customize colors and download in vector SVG or crisp PNG format.',
    icon: 'QrCode',
    supportedFormats: ['URL', 'Wi-Fi', 'Text', 'Email', 'Phone'],
    maxFileSize: 'Unlimited',
    componentName: 'QrCodeGenerator',
    howToSteps: [
      { title: 'Choose Content Type', description: 'Select Website URL, Plain Text, Wi-Fi Login, or Email.' },
      { title: 'Enter Information', description: 'Input your target URL or network details.' },
      { title: 'Customize Appearance', description: 'Pick foreground and background colors to match your brand.' },
      { title: 'Download Vector / PNG', description: 'Export high-DPI PNG or infinite-resolution SVG for printing.' }
    ],
    whyUse: [
      { title: 'Permanent & No Expiration', description: 'Our QR codes are static and direct. They will never expire or redirect through third-party ad pages.' },
      { title: 'High Error Correction (Level H)', description: 'Scans reliably even if up to 30% of the QR code is smudged or covered by a logo.' },
      { title: 'Vector SVG & PNG', description: 'Download ready for billboards, menus, or digital displays.' }
    ],
    faqs: [
      {
        question: 'Do these QR codes expire?',
        answer: 'No! These QR codes encode your data directly. They have no expiration date and never depend on external redirect servers.'
      },
      {
        question: 'Can I use these QR codes for commercial projects?',
        answer: 'Yes, 100% free for personal and commercial usage with no licensing restrictions or fees.'
      }
    ],
    relatedSlugs: ['url-encoder-decoder', 'color-picker', 'password-generator', 'image-compressor']
  },
  {
    slug: 'color-picker',
    name: 'Color Picker & Palette Generator',
    category: 'utility',
    categoryLabel: 'Utility Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Pick colors, convert between HEX, RGB, HSL, CMYK, and generate complementary, analogous, and triadic color palettes.',
    seoTitle: 'Online Color Picker & Hex to RGB Converter – Color Palettes',
    metaDescription: 'Free online color picker. Convert HEX, RGB, HSL, and CMYK color values. Generate harmonious color schemes and copy CSS code.',
    h1: 'Free Online Color Picker & Converter',
    intro: 'A versatile color suite for designers and frontend developers. Inspect HEX, RGB, HSL, and CMYK values, test WCAG contrast ratios, and build harmonious palettes with one click.',
    icon: 'Palette',
    supportedFormats: ['HEX', 'RGB', 'HSL', 'CMYK'],
    maxFileSize: 'Unlimited',
    componentName: 'ColorPicker',
    howToSteps: [
      { title: 'Pick a Color', description: 'Use the visual color wheel, eyedropper, or type in any HEX/RGB value.' },
      { title: 'Inspect Formats', description: 'View real-time synchronization across HEX, RGB, and HSL values.' },
      { title: 'Explore Harmonious Palettes', description: 'Examine complementary, monochromatic, and analogous swatches.' },
      { title: 'Copy CSS', description: 'Click any code snippet to copy the exact value to your clipboard.' }
    ],
    whyUse: [
      { title: 'Multi-Format Sync', description: 'Seamlessly switch between CSS hex codes, rgba, and HSL strings.' },
      { title: 'Harmonious Palette Generator', description: 'Instantly computes complementary, analogous, and triad harmonies.' },
      { title: 'WCAG Contrast Checker', description: 'Helps ensure your text is accessible and legible.' }
    ],
    faqs: [
      {
        question: 'What is the difference between HEX and RGB?',
        answer: 'HEX is a 6-character hexadecimal representation of red, green, and blue light (e.g. #4F46E5), while RGB uses decimal numbers from 0 to 255 (e.g. rgb(79, 70, 229)). Both produce the exact same color.'
      }
    ],
    relatedSlugs: ['json-formatter', 'password-generator', 'qr-code-generator', 'image-compressor']
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'utility',
    categoryLabel: 'Utility Tools',
    badge: 'Essential',
    isPopular: true,
    description: 'Generate cryptographically strong, uncrackable passwords and passphrases with entropy analysis.',
    seoTitle: 'Strong Password Generator – Secure & Cryptographic Online',
    metaDescription: 'Generate strong, randomized passwords and passphrases online. Uses browser crypto.getRandomValues() for military-grade entropy.',
    h1: 'Free Strong Password Generator',
    intro: 'Protect your accounts against brute-force attacks and credential stuffing. Generates cryptographically randomized passwords and passphrases entirely on your device using hardware-backed entropy.',
    icon: 'KeyRound',
    supportedFormats: ['Password', 'Passphrase', 'PIN'],
    maxFileSize: 'Unlimited',
    componentName: 'PasswordGenerator',
    howToSteps: [
      { title: 'Set Length', description: 'Slide to your desired length (16+ characters recommended).' },
      { title: 'Select Character Sets', description: 'Toggle uppercase, lowercase, numbers, and special symbols.' },
      { title: 'Evaluate Strength', description: 'Check entropy score and estimated crack time.' },
      { title: 'Copy Securely', description: 'Copy to clipboard with one click. Memory is cleared when the tab closes.' }
    ],
    whyUse: [
      { title: 'Cryptographically Secure API', description: 'Powered by the browser native crypto.getRandomValues(), not predictable Math.random().' },
      { title: 'Never Sent Over the Internet', description: 'Generated locally on your CPU. No server or third party ever sees your password.' },
      { title: 'Live Entropy Score', description: 'Displays bits of entropy and brute-force time estimates.' }
    ],
    faqs: [
      {
        question: 'How secure are these generated passwords?',
        answer: 'They are mathematically uncrackable with current supercomputers when set to 16+ characters with mixed symbols, using true cryptographic random byte generation.'
      },
      {
        question: 'Do you store or log generated passwords?',
        answer: 'Never. The generator runs 100% locally in your browser memory. We have no servers logging or receiving your password.'
      }
    ],
    relatedSlugs: ['qr-code-generator', 'json-formatter', 'url-encoder-decoder', 'word-counter']
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'utility',
    categoryLabel: 'Utility Tools',
    badge: 'Essential',
    isPopular: true,
    description: 'Format, prettify, minify, and validate JSON data with syntax error detection and tree navigation.',
    seoTitle: 'Free JSON Formatter & Validator – Prettify & Minify Online',
    metaDescription: 'Format and validate JSON online for free. Prettify with 2 or 4 spaces, minify payloads, and spot syntax errors with exact line numbers.',
    h1: 'Free Online JSON Formatter & Validator',
    intro: 'Clean up minified API responses and debug invalid JSON payloads. Formats with custom indentation (2 spaces, 4 spaces, tabs), checks RFC 8259 syntax compliance, and calculates payload size.',
    icon: 'Code2',
    supportedFormats: ['JSON', 'JSONLines'],
    maxFileSize: 'Unlimited',
    componentName: 'JsonFormatter',
    howToSteps: [
      { title: 'Paste JSON', description: 'Paste raw, minified, or unformatted JSON text into the editor.' },
      { title: 'Click Format / Prettify', description: 'Instantly indent with clean syntax colors and hierarchy.' },
      { title: 'Fix Errors', description: 'If parsing fails, error callouts pinpoint the exact character and line.' },
      { title: 'Copy or Minify', description: 'Copy the formatted code or collapse it into a single-line minified string.' }
    ],
    whyUse: [
      { title: 'Precise Error Locator', description: 'Identifies missing commas, unescaped quotes, and trailing brackets instantly.' },
      { title: 'Prettify & Minify Modes', description: 'Toggle between human-readable indented format and lightweight production payload.' },
      { title: 'Zero Cloud Logging', description: 'Safely inspect private API tokens and database records on your local machine.' }
    ],
    faqs: [
      {
        question: 'Is it safe to format sensitive JSON containing credentials?',
        answer: 'Yes! Toolivo executes all parsing in your local browser sandbox. No JSON data is ever sent to our servers.'
      },
      {
        question: 'Does this tool validate JSON according to official specs?',
        answer: 'Yes, it validates strictly against RFC 8259 specifications.'
      }
    ],
    relatedSlugs: ['password-generator', 'word-counter', 'color-picker', 'case-converter']
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Essential',
    isPopular: true,
    description: 'Rotate PDF pages permanently by 90, 180, or 270 degrees. Rotate individual pages or all pages at once.',
    seoTitle: 'Rotate PDF Online Free – Permanently Rotate PDF Pages',
    metaDescription: 'Rotate PDF pages clockwise or counterclockwise online. Save rotated PDF files permanently with zero quality loss.',
    h1: 'Rotate PDF Pages Online',
    intro: 'Rotate sideways or upside-down scanned PDF documents into standard upright reading orientation. Operates 100% in your local browser sandbox.',
    icon: 'RotateCw',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'RotatePdf',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the PDF document needing page orientation adjustment.' },
      { title: 'Select Angle', description: 'Choose 90° clockwise, 180° flip, or 90° counter-clockwise.' },
      { title: 'Choose Page Scope', description: 'Apply rotation to all pages, odd pages only, or even pages only.' },
      { title: 'Download PDF', description: 'Save the permanently rotated PDF file to your computer.' }
    ],
    whyUse: [
      { title: 'Permanent Rotation', description: 'Saves rotation flags directly into the document metadata permanently.' },
      { title: 'Batch Page Selection', description: 'Selectively rotate all pages or isolate odd/even sheets.' },
      { title: '100% Client-Side Privacy', description: 'Documents are processed locally in your web browser memory.' }
    ],
    faqs: [
      {
        question: 'Will the rotation be saved permanently in other PDF readers?',
        answer: 'Yes! The rotation angle is mathematically written into the PDF catalog, so it opens upright in Adobe Acrobat, Chrome, and Apple Preview.'
      },
      {
        question: 'Are my files uploaded to any server?',
        answer: 'No. Toolivo operates 100% client-side. Your PDF never leaves your device.'
      }
    ],
    relatedSlugs: ['pdf-merger', 'pdf-splitter', 'pdf-compressor', 'organize-pdf']
  },
  {
    slug: 'protect-pdf',
    name: 'Protect PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Security',
    isPopular: true,
    description: 'Encrypt and password protect your sensitive PDF documents with bank-grade client-side encryption.',
    seoTitle: 'Password Protect PDF Online Free – Encrypt PDF Files',
    metaDescription: 'Add strong password protection and encryption to PDF documents online. Prevent unauthorized access directly on your device.',
    h1: 'Password Protect PDF Online',
    intro: 'Safeguard confidential financial records, client agreements, and tax forms with strong password encryption before emailing or sharing.',
    icon: 'Lock',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'ProtectPdf',
    howToSteps: [
      { title: 'Select PDF', description: 'Upload the PDF document you wish to secure.' },
      { title: 'Set Password', description: 'Enter a strong password and confirm it.' },
      { title: 'Encrypt', description: 'The browser secures the document structure with cryptographic headers.' },
      { title: 'Download PDF', description: 'Save your password-protected PDF document.' }
    ],
    whyUse: [
      { title: 'Prevent Unauthorized Access', description: 'Restricts viewing to only individuals with the authorized password.' },
      { title: 'Zero Cloud Storage', description: 'Passwords and sensitive files are never stored or transmitted over the internet.' },
      { title: 'Universal Compatibility', description: 'Opens in all standard PDF readers requiring the master password.' }
    ],
    faqs: [
      {
        question: 'Is the password sent to your servers?',
        answer: 'Never. Encryption occurs locally inside your web browser sandbox. Toolivo never sees your password or file content.'
      },
      {
        question: 'What happens if I forget my password?',
        answer: 'Because Toolivo operates client-side and does not retain credentials, protected PDFs cannot be opened if the password is lost.'
      }
    ],
    relatedSlugs: ['unlock-pdf', 'pdf-compressor', 'sign-pdf', 'flatten-pdf']
  },
  {
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Security',
    isPopular: false,
    description: 'Remove password and restrictions from PDF files to enable printing, editing, and copying.',
    seoTitle: 'Unlock PDF Online Free – Remove PDF Password & Restrictions',
    metaDescription: 'Unlock password protected PDF documents online. Remove printing, copying, and editing restrictions in your browser.',
    h1: 'Unlock Protected PDF Online',
    intro: 'Remove passwords and owner restrictions from PDF documents to freely edit, print, and highlight text without friction.',
    icon: 'Unlock',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'UnlockPdf',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the locked or restricted PDF file.' },
      { title: 'Enter Password', description: 'Type the document password if prompted.' },
      { title: 'Unlock', description: 'The browser decrypts security locks and removes permissions restrictions.' },
      { title: 'Download Decrypted PDF', description: 'Download your unrestricted PDF file.' }
    ],
    whyUse: [
      { title: 'Unlock Printing & Copying', description: 'Permits unrestricted printing, text copying, and editing.' },
      { title: 'Removes Owner Security', description: 'Eliminates annoying permission restrictions without software installation.' },
      { title: 'Instant Local Decryption', description: 'Fast processing powered by your computer hardware.' }
    ],
    faqs: [
      {
        question: 'Can this tool unlock any PDF?',
        answer: 'If the document is owner-restricted (printing/copying blocked), it unlocks immediately. If it has an open password, you must enter the password once to remove it permanently.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'pdf-compressor', 'pdf-to-word', 'edit-pdf']
  },
  {
    slug: 'pdf-page-numbers',
    name: 'Add Page Numbers to PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Utility',
    isPopular: false,
    description: 'Insert customizable page numbers, Bates numbering, headers, and footers into PDF documents.',
    seoTitle: 'Add Page Numbers to PDF Online Free – Number PDF Pages',
    metaDescription: 'Number PDF pages online for free. Customize position, numbering format (Page X of Y), font size, and margins.',
    h1: 'Add Page Numbers to PDF',
    intro: 'Organize research papers, legal briefs, and reports by adding professional page numbers and headers with custom styling.',
    icon: 'Hash',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfPageNumbers',
    howToSteps: [
      { title: 'Upload Document', description: 'Select the multi-page PDF document to be numbered.' },
      { title: 'Configure Style', description: 'Choose position (bottom center, bottom right, header) and format (Page 1 of N).' },
      { title: 'Stamp Numbers', description: 'The browser stamps vector numbering across all pages.' },
      { title: 'Download', description: 'Save your numbered PDF ready for publication or filing.' }
    ],
    whyUse: [
      { title: 'Professional Formatting', description: 'Adds consistent typography and alignment to all pages.' },
      { title: 'Multiple Placement Presets', description: 'Position numbers at bottom center, bottom right, bottom left, or top right.' },
      { title: '100% In-Browser Security', description: 'Confidential documents never leave your computer.' }
    ],
    faqs: [
      {
        question: 'Does numbering overwrite existing document text?',
        answer: 'Page numbers are stamped in the margin area. You can adjust the margin slider to avoid overlapping existing footers.'
      }
    ],
    relatedSlugs: ['pdf-watermark', 'pdf-merger', 'organize-pdf', 'pdf-splitter']
  },
  {
    slug: 'pdf-watermark',
    name: 'Add Watermark to PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Branding',
    isPopular: false,
    description: 'Stamp text watermarks like CONFIDENTIAL or DRAFT onto PDF pages with custom angle and opacity.',
    seoTitle: 'Add Watermark to PDF Online Free – Stamp Text Watermark',
    metaDescription: 'Add text watermarks to PDF files online. Customize opacity, rotation, font size, and color with instant live preview.',
    h1: 'Add Watermark to PDF Online',
    intro: 'Protect intellectual property and mark document status with customizable diagonal or horizontal text watermarks stamped onto all pages.',
    icon: 'Stamp',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfWatermark',
    howToSteps: [
      { title: 'Select PDF', description: 'Upload your document to apply watermarks.' },
      { title: 'Customize Text', description: 'Enter your watermark text (e.g. CONFIDENTIAL, DRAFT, SAMPLE).' },
      { title: 'Adjust Appearance', description: 'Set transparency opacity, rotation angle (45°), and color.' },
      { title: 'Download', description: 'Save your watermarked PDF document.' }
    ],
    whyUse: [
      { title: 'Brand & Protect Drafts', description: 'Prevent unauthorized distribution with clear watermark stamps.' },
      { title: 'Fine Opacity Control', description: 'Keep underlying text easily readable while displaying clear marks.' },
      { title: 'Zero Cloud Logging', description: 'Contracts and proprietary reports remain private on your machine.' }
    ],
    faqs: [
      {
        question: 'Can watermarks be removed easily?',
        answer: 'The watermark is embedded directly into the page content tree as vector text, making casual removal difficult.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'sign-pdf', 'pdf-page-numbers', 'pdf-compressor']
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Sort, reorder, delete, and duplicate PDF pages visually in your browser with real-time controls.',
    seoTitle: 'Organize PDF Pages Online Free – Reorder, Delete & Sort PDF',
    metaDescription: 'Organize PDF pages online. Rearrange page order, duplicate important sheets, and delete unwanted pages visually.',
    h1: 'Organize & Reorder PDF Pages',
    intro: 'Effortlessly rearrange page sequence, eliminate duplicate sheets, and organize multi-page PDF documents exactly how you want.',
    icon: 'ArrowUpDown',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'OrganizePdf',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the PDF file you wish to reorder or clean up.' },
      { title: 'Rearrange Pages', description: 'Use arrows to move pages up or down, duplicate, or delete sheets.' },
      { title: 'Review Order', description: 'Check total output page count and sequence.' },
      { title: 'Download', description: 'Download your newly structured PDF document.' }
    ],
    whyUse: [
      { title: 'Interactive Reordering', description: 'Intuitive controls to shuffle pages into the right order.' },
      { title: 'Duplicate or Delete', description: 'Add extra copies of sheets or strip out redundant pages with one click.' },
      { title: '100% In-Browser Speed', description: 'Instant page manipulation without waiting for server uploads.' }
    ],
    faqs: [
      {
        question: 'Does organizing pages degrade PDF quality?',
        answer: 'No. The underlying page streams and fonts are copied without recompression, maintaining 100% vector fidelity.'
      }
    ],
    relatedSlugs: ['pdf-merger', 'pdf-splitter', 'rotate-pdf', 'extract-pdf-pages']
  },
  {
    slug: 'extract-pdf-pages',
    name: 'Extract PDF Pages',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Utility',
    isPopular: false,
    description: 'Extract specific pages or page ranges from any PDF into a brand new standalone document.',
    seoTitle: 'Extract PDF Pages Online Free – Save Selected Pages',
    metaDescription: 'Extract pages from PDF files online. Select page numbers or ranges to create a new compact PDF document.',
    h1: 'Extract Pages from PDF Online',
    intro: 'Isolate key pages from bulky manuals, ebooks, or contracts into a clean standalone PDF without uploading files to remote servers.',
    icon: 'FilePlus',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'ExtractPdfPages',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document containing pages you want to extract.' },
      { title: 'Specify Pages', description: 'Enter page numbers or ranges (e.g. 1, 3, 5-8).' },
      { title: 'Extract', description: 'The browser copies only the specified pages into a fresh document.' },
      { title: 'Download PDF', description: 'Save your extracted standalone PDF.' }
    ],
    whyUse: [
      { title: 'Extract What You Need', description: 'Share only the relevant chapters or contract clauses.' },
      { title: 'Supports Custom Ranges', description: 'Combine individual pages and page intervals easily.' },
      { title: 'Zero Cloud Risk', description: 'Bank statements and sensitive files stay on your machine.' }
    ],
    faqs: [
      {
        question: 'Can I extract non-consecutive pages?',
        answer: 'Yes! Simply separate the page numbers with commas (e.g. 1, 4, 7-10).'
      }
    ],
    relatedSlugs: ['pdf-splitter', 'remove-pdf-pages', 'organize-pdf', 'pdf-compressor']
  },
  {
    slug: 'remove-pdf-pages',
    name: 'Remove PDF Pages',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Utility',
    isPopular: false,
    description: 'Delete unwanted, blank, or sensitive pages from your PDF file and save a clean version.',
    seoTitle: 'Remove PDF Pages Online Free – Delete Pages from PDF',
    metaDescription: 'Delete pages from PDF documents online for free. Specify individual pages or ranges to remove permanently.',
    h1: 'Remove Pages from PDF',
    intro: 'Clean up documents by eliminating blank scanner pages, outdated sections, or sensitive appendices in seconds.',
    icon: 'FileMinus',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'RemovePdfPages',
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the PDF containing pages you want to remove.' },
      { title: 'Enter Page Numbers', description: 'Type the pages you want deleted (e.g. 2, 4-6).' },
      { title: 'Remove Pages', description: 'The browser rebuilds the PDF excluding the specified pages.' },
      { title: 'Download Clean PDF', description: 'Download your updated, cleaned document.' }
    ],
    whyUse: [
      { title: 'Eliminate Blank Sheets', description: 'Strip out unwanted scanner blanks and separator pages.' },
      { title: 'Reduce File Size', description: 'Removing heavy image pages reduces overall document weight.' },
      { title: 'Client-Side Security', description: 'Sensitive deleted pages are completely destroyed locally.' }
    ],
    faqs: [
      {
        question: 'Does this modify my original file on my hard drive?',
        answer: 'No. The browser creates a new clean PDF for download, leaving your original file untouched.'
      }
    ],
    relatedSlugs: ['extract-pdf-pages', 'organize-pdf', 'pdf-splitter', 'pdf-compressor']
  },
  {
    slug: 'sign-pdf',
    name: 'Sign PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Popular',
    isPopular: true,
    description: 'Sign PDF documents electronically. Draw your signature or type your name and stamp it onto any page.',
    seoTitle: 'Sign PDF Online Free – Add Electronic Signature to PDF',
    metaDescription: 'Sign PDF documents online for free. Draw or type your e-signature and place it on any page with zero cloud uploads.',
    h1: 'Sign PDF Documents Online',
    intro: 'Electronically sign contracts, tax agreements, and NDAs directly in your browser. No printing, scanning, or paid subscriptions needed.',
    icon: 'PenTool',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'SignPdf',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the contract or document requiring signature.' },
      { title: 'Create Signature', description: 'Draw with mouse/touch or type your full legal name.' },
      { title: 'Choose Placement', description: 'Select the target page and position (bottom right, left, center).' },
      { title: 'Download Signed PDF', description: 'Save your officially signed document.' }
    ],
    whyUse: [
      { title: 'No Account Required', description: 'Sign instantly without signing up for expensive subscription services.' },
      { title: 'Bank-Grade Privacy', description: 'Your signature and contracts never touch an external server.' },
      { title: 'Choice of Styles', description: 'Draw freehand or type with elegant calligraphy fonts.' }
    ],
    faqs: [
      {
        question: 'Are electronic signatures created here legally valid?',
        answer: 'Yes. In the United States (ESIGN Act), European Union (eIDAS), and most international jurisdictions, electronic signatures are legally binding for general commercial agreements.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'flatten-pdf', 'pdf-watermark', 'pdf-to-word']
  },
  {
    slug: 'word-to-pdf',
    name: 'Word to PDF Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Conversion',
    isPopular: true,
    description: 'Convert Word (.docx, .doc), RTF, and text documents into standard, printable PDF files.',
    seoTitle: 'Word to PDF Converter Online Free – Convert DOCX to PDF',
    metaDescription: 'Convert Microsoft Word DOCX, RTF, and TXT files to PDF online for free. Preserves layout and text styling.',
    h1: 'Convert Word to PDF Online',
    intro: 'Turn editable Word documents into universal, tamper-resistant PDF documents formatted to standard A4 printing specifications.',
    icon: 'FileText',
    supportedFormats: ['DOCX', 'DOC', 'RTF', 'TXT'],
    maxFileSize: '50 MB',
    componentName: 'WordToPdf',
    howToSteps: [
      { title: 'Upload Document', description: 'Select your Word, RTF, or Text document.' },
      { title: 'Review Content', description: 'Verify text layout in the preview box.' },
      { title: 'Convert to PDF', description: 'The browser formats typography and pagination.' },
      { title: 'Download PDF', description: 'Save your clean, printable PDF document.' }
    ],
    whyUse: [
      { title: 'Universal Viewing', description: 'PDFs look identical on all devices, phones, and operating systems.' },
      { title: 'Tamper Resistant', description: 'Prevents accidental edits when sharing resumes and contracts.' },
      { title: 'No MS Office Needed', description: 'Convert directly inside Chrome, Safari, Edge, or Firefox.' }
    ],
    faqs: [
      {
        question: 'Can I convert resumes and CVs safely?',
        answer: 'Yes! Because conversion occurs on your local machine, your personal contact details remain completely private.'
      }
    ],
    relatedSlugs: ['pdf-to-word', 'html-to-pdf', 'jpg-to-pdf', 'pdf-compressor']
  },
  {
    slug: 'html-to-pdf',
    name: 'HTML to PDF Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Developer',
    isPopular: false,
    description: 'Convert HTML code, invoices, and web snippets into formatted, printable PDF documents.',
    seoTitle: 'HTML to PDF Converter Online Free – Render HTML as PDF',
    metaDescription: 'Convert HTML snippets and code into PDF documents online. High-speed, client-side rendering with instant download.',
    h1: 'Convert HTML to PDF Online',
    intro: 'Generate invoices, receipts, and reports from raw HTML code or rich formatted text snippets directly on your machine.',
    icon: 'Globe',
    supportedFormats: ['HTML', 'HTM'],
    maxFileSize: '10 MB',
    componentName: 'HtmlToPdf',
    howToSteps: [
      { title: 'Paste HTML', description: 'Input your HTML code or rich formatted text snippet.' },
      { title: 'Set Filename', description: 'Choose your desired PDF filename.' },
      { title: 'Convert', description: 'The browser engine translates markup into structured PDF pages.' },
      { title: 'Download PDF', description: 'Save your converted document.' }
    ],
    whyUse: [
      { title: 'Instant Developer Utility', description: 'Quickly print receipts, logs, and HTML documentation.' },
      { title: 'Standard A4 Layout', description: 'Automatically breaks paragraphs cleanly across pages.' },
      { title: '100% In-Browser Sandbox', description: 'Code execution is contained locally without remote API calls.' }
    ],
    faqs: [
      {
        question: 'Which HTML elements are supported?',
        answer: 'Supports headings (h1, h2), paragraphs (p), line breaks (br), and lists (li).'
      }
    ],
    relatedSlugs: ['word-to-pdf', 'pdf-to-word', 'json-formatter', 'pdf-compressor']
  },
  {
    slug: 'pdf-to-text',
    name: 'PDF to Text Converter',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Extraction',
    isPopular: false,
    description: 'Extract all plain text and markdown paragraphs from PDF documents for easy copying and editing.',
    seoTitle: 'PDF to Text Online Free – Extract Text from PDF',
    metaDescription: 'Extract plain text from PDF files online for free. Copy extracted text or download as a .txt file instantly.',
    h1: 'Extract Text from PDF Online',
    intro: 'Copy text from research papers, ebooks, and PDF documents without messy copy-paste line breaks or formatting artifacts.',
    icon: 'FileText',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'PdfToText',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the PDF file you need to extract text from.' },
      { title: 'Extract Text', description: 'Click Extract to parse readable text streams.' },
      { title: 'Copy or Download', description: 'One-click copy to clipboard or download as .txt file.' }
    ],
    whyUse: [
      { title: 'Fix Copy-Paste Headaches', description: 'Extracts clean paragraphs without broken hyphenations.' },
      { title: 'One-Click Download', description: 'Save entire books or articles into compact .txt format.' },
      { title: 'No Server Storage', description: 'Safely extract text from confidential whitepapers and legal briefs.' }
    ],
    faqs: [
      {
        question: 'Does this support scanned PDFs?',
        answer: 'This tool extracts native digital text embedded in PDFs. For pure image scans, text must first be OCR processed.'
      }
    ],
    relatedSlugs: ['pdf-to-word', 'word-counter', 'case-converter', 'pdf-compressor']
  },
  {
    slug: 'crop-pdf',
    name: 'Crop PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Geometry',
    isPopular: false,
    description: 'Trim white margins and crop PDF page dimensions uniformly across all pages.',
    seoTitle: 'Crop PDF Online Free – Trim PDF Margins',
    metaDescription: 'Crop PDF pages and trim white margins online for free. Adjust page boundaries for e-readers and mobile reading.',
    h1: 'Crop PDF Margins Online',
    intro: 'Remove excess blank margins from scanned sheets and optimize documents for tablets, Kindle, and mobile screens.',
    icon: 'Crop',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'CropPdf',
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document with excess border margins.' },
      { title: 'Choose Trim Level', description: 'Select light (0.25 in), standard (0.5 in), or deep (1.0 in).' },
      { title: 'Crop Margins', description: 'The browser adjusts the PDF crop box across all pages.' },
      { title: 'Download Cropped PDF', description: 'Save your optimized PDF.' }
    ],
    whyUse: [
      { title: 'Optimized for E-Readers', description: 'Text fills the screen comfortably on Kindle, iPad, and phones.' },
      { title: 'Uniform Application', description: 'Trims all pages consistently in one click.' },
      { title: 'Preserves Vector Quality', description: 'Text and diagrams remain sharp without recompression.' }
    ],
    faqs: [
      {
        question: 'Does cropping reduce resolution or image sharpness?',
        answer: 'No. Cropping only defines new visible viewing boundaries (CropBox) without modifying image pixels or text vectors.'
      }
    ],
    relatedSlugs: ['rotate-pdf', 'pdf-compressor', 'image-cropper', 'organize-pdf']
  },
  {
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    badge: 'Security',
    isPopular: false,
    description: 'Flatten interactive PDF form fields, signatures, and annotations into a static, tamper-proof document.',
    seoTitle: 'Flatten PDF Online Free – Lock Form Fields & Layers',
    metaDescription: 'Flatten PDF forms and annotations online. Lock interactive form fields and checkboxes permanently for filing.',
    h1: 'Flatten PDF Forms Online',
    intro: 'Permanently integrate filled form data, checkboxes, and signatures into the page canvas so values cannot be altered by third parties.',
    icon: 'Layers',
    supportedFormats: ['PDF'],
    maxFileSize: '100 MB',
    componentName: 'FlattenPdf',
    howToSteps: [
      { title: 'Upload Form PDF', description: 'Select the PDF containing filled form fields or annotations.' },
      { title: 'Flatten Layers', description: 'Click Flatten to burn interactive elements into static page content.' },
      { title: 'Download PDF', description: 'Save your tamper-proof document.' }
    ],
    whyUse: [
      { title: 'Tamper-Proof Filing', description: 'Prevents recipients from clearing or altering filled values.' },
      { title: 'Improves Printer Compatibility', description: 'Ensures forms print exactly as shown without missing field boxes.' },
      { title: '100% In-Browser Privacy', description: 'Tax returns and legal filings remain private on your computer.' }
    ],
    faqs: [
      {
        question: 'Can someone unflatten a flattened PDF?',
        answer: 'No. Flattening irreversibly renders form inputs into base drawing elements on the page.'
      }
    ],
    relatedSlugs: ['protect-pdf', 'sign-pdf', 'pdf-compressor', 'pdf-watermark']
  }
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolItem[] {
  return TOOLS.filter(t => t.category === category);
}

export function getPopularTools(): ToolItem[] {
  return TOOLS.filter(t => t.isPopular);
}
