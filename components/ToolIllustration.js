"use client";

export default function ToolIllustration({ slug, name, category }) {
  // Return tailored SVG illustration based on tool slug or category
  switch (slug) {
    case "morse-code-converter":
      return (
        <img
          src="/Mors_Code.png"
          alt="Morse Code Converter"
          className="h-full w-full object-contain"
        />
      );

    case "base64-encode-decode":
      return (
        <img
          src="/Base64_encode_and_decoder.png"
          alt="Base64 Encode and Decode"
          className="h-full w-full object-contain"
        />
      );

    case "case-converter":
      return (
        <img
          src="/Case_convertor.png"
          alt="Case Converter"
          className="h-full w-full object-contain"
        />
      );

    case "pdf-to-word":
      return (
        <img
          src="/PDF_To_Word.png"
          alt="PDF To Word"
          className="h-full w-full object-contain"
        />
      );

    case "word-counter":
      return (
        <img
          src="/Word_Counter.png"
          alt="Word Counter"
          className="h-full w-full object-contain"
        />
      );

    case "weight-converter":
    case "kg-to-lbs":
      return (
        <img
          src="/KG_to_Lbs.png"
          alt="kg to lbs Converter"
          className="h-full w-full object-contain"
        />
      );

    case "png-to-webp":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FFF7ED" />
          <circle cx="100" cy="80" r="55" fill="#FFEDD5" />
          {/* Left card: PNG */}
          <rect x="30" y="45" width="55" height="70" rx="8" fill="#FFFFFF" stroke="#F97316" strokeWidth="2" />
          <rect x="38" y="55" width="39" height="30" rx="4" fill="#FDBA74" />
          <circle cx="48" cy="65" r="3" fill="#EA580C" />
          <path d="M40 80L50 68L60 80L75 62L77 80H40Z" fill="#C2410C" />
          <rect x="38" y="93" width="39" height="14" rx="3" fill="#EA580C" />
          <text x="57" y="103" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">PNG</text>

          {/* Center Conversion Arrow */}
          <path d="M92 76L102 76M102 76L97 71M102 76L97 81" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Right card: WEBP */}
          <rect x="115" y="40" width="60" height="78" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="123" y="50" width="44" height="34" rx="4" fill="#BAE6FD" />
          <circle cx="135" cy="61" r="3.5" fill="#0284C7" />
          <path d="M125 78L136 66L147 78L163 59L167 78H125Z" fill="#0369A1" />
          <rect x="123" y="92" width="44" height="16" rx="3" fill="#0284C7" />
          <text x="145" y="103.5" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">WEBP</text>

          {/* Sparkle badge */}
          <circle cx="170" cy="40" r="11" fill="#10B981" />
          <text x="170" y="43" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">-80%</text>
        </svg>
      );

    case "merge-word":
      return (
        <img
          src="/Merge_Word_file.png"
          alt="Merge Word Files"
          className="h-full w-full object-contain"
        />
      );

    case "protect-pdf":
      return (
        <img
          src="/Protect_pdf.png"
          alt="Protect PDF"
          className="h-full w-full object-contain"
        />
      );

    case "remove-punctuation":
      return (
        <img
          src="/Remove_punctuation.png"
          alt="Remove Punctuation"
          className="h-full w-full object-contain"
        />
      );

    case "word-to-pdf":
      return (
        <img
          src="/Word_to_pdf_converter.png"
          alt="Word to PDF Converter"
          className="h-full w-full object-contain"
        />
      );

    case "image-to-pdf":
      return (
        <img
          src="/Image_to_pdf.png"
          alt="Image to PDF"
          className="h-full w-full object-contain"
        />
      );

    case "text-reverser":
    case "reverse-text":
      return (
        <img
          src="/Reverse_text.png"
          alt="Reverse Text"
          className="h-full w-full object-contain"
        />
      );

    case "base64-encode-decode-old":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#0C4A6E" />
          <circle cx="100" cy="80" r="65" fill="#0284C7" opacity="0.25" />

          {/* Inner card container */}
          <rect x="30" y="16" width="140" height="128" rx="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />

          {/* Circular arrows loop */}
          <path d="M72 50C78 44 88 42 100 42C116 42 128 50 128 64" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M123 59L128 64L133 59" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="100" y="37" fill="#7DD3FC" fontSize="7.5" fontWeight="bold" textAnchor="middle">ENCODE</text>

          <path d="M128 78C122 84 112 86 100 86C84 86 72 78 72 64" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M77 69L72 64L67 69" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="100" y="94" fill="#7DD3FC" fontSize="7.5" fontWeight="bold" textAnchor="middle">DECODE</text>

          {/* Middle badges */}
          <g transform="translate(43, 54)">
            {/* Input Badge */}
            <rect x="0" y="0" width="46" height="20" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <text x="23" y="13" fill="#E2E8F0" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">010101</text>

            {/* Swap Arrow Icon */}
            <path d="M50 10H64M61 7L64 10L61 13M53 7L50 10L53 13" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Output Badge */}
            <rect x="68" y="0" width="46" height="20" rx="5" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="91" y="13" fill="#38BDF8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SGVsbG8=</text>
          </g>

          {/* Title Text */}
          <text x="100" y="122" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="1">BASE64</text>
          <text x="100" y="133" fill="#94A3B8" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">ENCODE / DECODE</text>
        </svg>
      );

    case "text-to-handwriting":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FEF9C3" />
          <circle cx="100" cy="80" r="55" fill="#FEF08A" />
          {/* Paper */}
          <rect x="65" y="45" width="70" height="80" rx="6" fill="#FFFFFF" stroke="#EAB308" strokeWidth="2" />
          <line x1="75" y1="65" x2="120" y2="65" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="80" x2="125" y2="80" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="75" y1="95" x2="110" y2="95" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" />
          {/* Hand holding pen */}
          <path d="M125 45L145 25C148 22 153 22 156 25L157 26C160 29 160 34 157 37L137 57L125 45Z" fill="#F59E0B" />
          <path d="M125 45L118 64L137 57L125 45Z" fill="#D97706" />
          <circle cx="118" cy="64" r="2" fill="#000000" />
        </svg>
      );

    case "compress-pdf":
      return (
        <img
          src="/Compress_PDF.png"
          alt="Compress PDF"
          className="h-full w-full object-contain"
        />
      );

    case "merge-pdf":
    case "edit-pdf-text":
    case "resize-pdf-images":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#EFF6FF" />
          <circle cx="100" cy="80" r="55" fill="#DBEAFE" />
          {/* Blue Word Doc */}
          <rect x="50" y="45" width="50" height="65" rx="6" fill="#2563EB" />
          <text x="60" y="80" fill="#FFFFFF" fontSize="16" fontWeight="bold">W</text>
          {/* Arrow */}
          <path d="M102 75L114 75M114 75L108 69M114 75L108 81" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Red PDF Doc */}
          <rect x="118" y="45" width="50" height="65" rx="6" fill="#DC2626" />
          <text x="125" y="80" fill="#FFFFFF" fontSize="14" fontWeight="bold">PDF</text>
        </svg>
      );

    case "resize-image":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#ECFDF5" />
          <circle cx="100" cy="80" r="55" fill="#D1FAE5" />
          {/* Photo frame */}
          <rect x="55" y="40" width="90" height="75" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
          {/* Sun & Mountains */}
          <circle cx="75" cy="58" r="7" fill="#F59E0B" />
          <path d="M60 100L85 68L105 88L120 75L140 100H60Z" fill="#10B981" opacity="0.8" />
          {/* Crop handles */}
          <path d="M48 40H60M48 40V52" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <path d="M152 115H140M152 115V103" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "crop-jpg":
      return (
        <img
          src="/Crop_JPG_Image.png"
          alt="Crop JPG Image"
          className="h-full w-full object-contain"
        />
      );

    case "sql-beautifier":
    case "sql-formatter":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FFF1F2" />
          <circle cx="100" cy="80" r="55" fill="#FFE4E6" />
          {/* SQL Database cylinders */}
          <rect x="65" y="45" width="70" height="70" rx="12" fill="#E11D48" />
          <ellipse cx="100" cy="60" rx="25" ry="8" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="100" cy="80" rx="25" ry="8" fill="#FFFFFF" opacity="0.7" />
          <ellipse cx="100" cy="100" rx="25" ry="8" fill="#FFFFFF" opacity="0.9" />
          <text x="82" y="74" fill="#E11D48" fontSize="12" fontWeight="bold">SQL</text>
        </svg>
      );

    case "html-beautifier":
    case "css-beautifier":
    case "js-beautifier":
    case "code-formatter":
    case "json-formatter":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#F0F9FF" />
          <circle cx="100" cy="80" r="55" fill="#E0F2FE" />
          {/* Monitor */}
          <rect x="50" y="40" width="100" height="65" rx="6" fill="#0284C7" />
          <rect x="56" y="46" width="88" height="53" rx="4" fill="#0F172A" />
          {/* Code symbol < /> */}
          <text x="76" y="80" fill="#38BDF8" fontSize="20" fontWeight="bold">&lt;/&gt;</text>
          {/* Monitor Stand */}
          <path d="M90 105L85 120H115L110 105H90Z" fill="#0284C7" />
        </svg>
      );

    case "qr-code-generator":
      return (
        <img
          src="/QR_CodeGenerator.png"
          alt="QR Code Generator"
          className="h-full w-full object-contain"
        />
      );

    case "free-logo-maker":
      return (
        <img
          src="/Free_Logo_Maker.png"
          alt="Free Logo Maker"
          className="h-full w-full object-contain"
        />
      );

    case "latex-compiler":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#0C4A6E" />
          <circle cx="100" cy="80" r="55" fill="#0369A1" opacity="0.4" />
          {/* Card board */}
          <rect x="35" y="32" width="130" height="96" rx="12" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          {/* LaTeX equation text */}
          <text x="100" y="65" fill="#7DD3FC" fontSize="13" fontFamily="serif" fontStyle="italic" fontWeight="bold" textAnchor="middle">
            ∫ e^(-x²) dx = √π
          </text>
          <line x1="50" y1="80" x2="150" y2="80" stroke="#1E293B" strokeWidth="1.5" />
          {/* Badge */}
          <rect x="68" y="90" width="64" height="22" rx="6" fill="#0284C7" />
          <text x="100" y="105" fill="#FFFFFF" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle" letterSpacing="1">
            LaTeX
          </text>
        </svg>
      );

    case "text-cleaner":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FDF4FF" />
          <circle cx="100" cy="80" r="55" fill="#FAE8FF" />
          {/* Document clip */}
          <rect x="65" y="45" width="70" height="75" rx="8" fill="#FFFFFF" stroke="#C084FC" strokeWidth="2.5" />
          <rect x="80" y="38" width="40" height="12" rx="4" fill="#A855F7" />
          <line x1="78" y1="65" x2="122" y2="65" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="80" x2="115" y2="80" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="95" x2="105" y2="95" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          {/* Sparkle Clean Badge */}
          <path d="M135 45L138 35L141 45L151 48L141 51L138 61L135 51L125 48Z" fill="#F59E0B" />
        </svg>
      );

    case "text-compare":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FDF4FF" />
          <circle cx="100" cy="80" r="55" fill="#FAE8FF" />
          {/* Document clip */}
          <rect x="65" y="45" width="70" height="75" rx="8" fill="#FFFFFF" stroke="#C084FC" strokeWidth="2.5" />
          <rect x="80" y="38" width="40" height="12" rx="4" fill="#A855F7" />
          <line x1="78" y1="65" x2="122" y2="65" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="80" x2="115" y2="80" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="95" x2="105" y2="95" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "word-frequency-counter":
      return (
        <img
          src="/Word_Frequency_Counter.png"
          alt="Word Frequency Counter"
          className="h-full w-full object-contain"
        />
      );

    case "mute-video":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#F8FAFC" />
          <circle cx="100" cy="80" r="55" fill="#E2E8F0" />
          {/* Video Frame */}
          <rect x="52" y="42" width="96" height="76" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          {/* Speaker Icon Muted */}
          <path d="M80 72H88L98 62V98L88 88H80V72Z" fill="#94A3B8" />
          <line x1="108" y1="72" x2="124" y2="88" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="124" y1="72" x2="108" y2="88" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "free-invoice-generator":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#F0F6FF" />
          <circle cx="100" cy="80" r="55" fill="#DBEAFE" />
          {/* Invoice Document with Executive Blue styling */}
          <rect x="62" y="36" width="76" height="92" rx="6" fill="#FFFFFF" stroke="#0F2744" strokeWidth="2.5" />
          <rect x="74" y="48" width="30" height="6" rx="2" fill="#2563EB" />
          <line x1="74" y1="65" x2="126" y2="65" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="76" x2="110" y2="76" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="118" y1="76" x2="126" y2="76" stroke="#0F2744" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="87" x2="105" y2="87" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <line x1="118" y1="87" x2="126" y2="87" stroke="#0F2744" strokeWidth="2" strokeLinecap="round" />
          <line x1="74" y1="98" x2="126" y2="98" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="120" cy="112" r="6" fill="#059669" />
          <path d="M118 112L120 114L123 110" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "5g-arfcn-to-frequency":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#ECFEFF" />
          <circle cx="100" cy="80" r="55" fill="#CFFAFE" />
          {/* Signal tower + Radio waves */}
          <path d="M100 45V115M85 115L100 55L115 115M80 85H120M88 70H112" stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M75 55C65 65 65 95 75 105" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M125 55C135 65 135 95 125 105" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="100" cy="45" r="4" fill="#0E7490" />
        </svg>
      );

    case "5g-nr-throughput":
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#F0FDFA" />
          <circle cx="100" cy="80" r="55" fill="#CCFBF1" />
          {/* Speedometer gauge */}
          <path d="M60 105A50 50 0 1 1 140 105" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="8" fill="#0F766E" />
          <line x1="100" y1="100" x2="128" y2="72" stroke="#14B8A6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case "remove-whitespace":
      return (
        <img
          src="/Remove_WhitSpace.png"
          alt="Remove Whitespace"
          className="h-full w-full object-contain"
        />
      );

    default:
      // Category fallback illustration
      if (category === "pdf-tools" || category === "word-tools") {
        return (
          <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
            <rect width="200" height="160" rx="16" fill="#EFF6FF" />
            <circle cx="100" cy="80" r="55" fill="#DBEAFE" />
            <rect x="65" y="45" width="70" height="75" rx="8" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
            <path d="M78 65H122M78 80H115M78 95H105" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      }
      if (category === "image-tools") {
        return (
          <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
            <rect width="200" height="160" rx="16" fill="#ECFDF5" />
            <circle cx="100" cy="80" r="55" fill="#D1FAE5" />
            <rect x="55" y="42" width="90" height="70" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2.5" />
            <circle cx="75" cy="60" r="6" fill="#F59E0B" />
            <path d="M60 98L85 70L105 88L120 78L140 98H60Z" fill="#10B981" />
          </svg>
        );
      }
      if (category === "programming" || category === "converter") {
        return (
          <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
            <rect width="200" height="160" rx="16" fill="#F0F9FF" />
            <circle cx="100" cy="80" r="55" fill="#E0F2FE" />
            <rect x="55" y="45" width="90" height="60" rx="6" fill="#0F172A" />
            <text x="80" y="82" fill="#38BDF8" fontSize="18" fontWeight="bold">&lt;/&gt;</text>
          </svg>
        );
      }
      // General fallback
      return (
        <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
          <rect width="200" height="160" rx="16" fill="#FEF3C7" />
          <circle cx="100" cy="80" r="55" fill="#FDE68A" />
          <rect x="65" y="45" width="70" height="75" rx="8" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
          <line x1="78" y1="65" x2="122" y2="65" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="78" y1="80" x2="115" y2="80" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}
