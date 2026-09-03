# FreeTooly — Skill & Functionality Contract Documentation

This technical reference documents every existing tool, route, and function in **FreeTooly**, establishing an explicit contract for visual redesign without breaking 100% of underlying functionality.

---

# GLOBAL FUNCTIONALITY CONTRACT

The following system rules and functionality contracts MUST NOT be changed, renamed, removed, or bypassed during any UI/UX redesign.

### 1. Routes & URLs
- Homepage: `/`
- Dynamic Tool Page: `/tools/[slug]` (All tool slugs registered in [tools-registry.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/lib/tools-registry.js))
- Legal pages: `/legal`, `/privacy-policy`, `/terms`
- Sitemap & Robots: `/sitemap.xml`, `/robots.txt`

### 2. State & Storage Management
- `localStorage` Key `freetooly_recent_tools`: Stores JSON array of recently accessed tool slugs.
- `localStorage` Key `freetooly_favorites`: Stores JSON array of favorited tool slugs.
- `localStorage` Key `freetooly_theme`: Stores `'light'` or `'dark'` theme preference.

### 3. File Handling & Export Utilities ([file-utils.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/lib/file-utils.js))
- `downloadFile(content, fileName, mimeType)`: Triggers browser blob download for text/data.
- `createBasicPdf(text, fileName)`: Generates PDF document using `pdf-lib` and triggers browser download.

### 4. Rate Limiter ([rate-limiter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/lib/rate-limiter.js))
- `checkRateLimit(key, maxRequests, windowMs)`: In-memory sliding window rate-limiting for tool executions.

---

# COMPLETE TOOL & FUNCTIONALITY REGISTRY

| Tool Name | Route / Slug | Category | Component / Logic Location | Primary Action | Key Inputs & Defaults | Key Output & Actions |
|---|---|---|---|---|---|---|
| Word Counter | `/tools/word-counter` | text-analysis | [WordCounter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/WordCounter.js) | Real-time analysis | Text input | Word count, character count, sentence count, paragraph count, reading time |
| Word Frequency Counter | `/tools/word-frequency-counter` | text-analysis | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Run Word Frequency Counter | Text input | Word frequency density list |
| Case Converter | `/tools/case-converter` | editing | [CaseConverter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/CaseConverter.js) | Convert Case | Text input, Case select options | UPPER, lower, Title, Sentence, camelCase, snake_case |
| Reverse Text | `/tools/text-reverser` | editing | [TextReverser.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/TextReverser.js) | Reverse Text | Text input | Reversed text, copy to clipboard |
| Remove Extra Spaces | `/tools/remove-extra-spaces` | editing | [RemoveExtraSpaces.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RemoveExtraSpaces.js) | Clean Text | Text input | Text with collapsed single spaces |
| Remove Duplicate Lines | `/tools/remove-duplicate-lines` | editing | [RemoveDuplicateLines.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RemoveDuplicateLines.js) | Deduplicate | Text input | Text with unique lines preserved |
| Remove Punctuation | `/tools/remove-punctuation` | editing | [RemovePunctuation.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RemovePunctuation.js) | Strip Punctuation | Text input | Plain text without symbols |
| Add Line Numbers | `/tools/add-line-numbers` | editing | [AddLineNumbers.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/AddLineNumbers.js) | Add Line Numbers | Text input | Sequentially numbered text lines |
| Remove Empty Lines | `/tools/remove-empty-lines` | editing | [RemoveEmptyLines.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RemoveEmptyLines.js) | Clean Lines | Text input | Text without blank lines |
| Remove Whitespace | `/tools/remove-whitespace` | editing | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Remove Whitespace | Text input | Whitespace-stripped string |
| Letter Randomizer | `/tools/letter-randomizer` | editing | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Randomize | Text input | Character-shuffled text |
| Remove Lines Containing | `/tools/remove-lines-containing` | editing | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Filter Lines | Text input, Substring param | Text filtering lines matching param |
| Find and Replace Text | `/tools/find-replace` | editing | [FindReplace.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/FindReplace.js) | Replace | Input text, Find term, Replace term | Modified text output |
| Replace Newlines With Semicolons | `/tools/replace-newlines-semicolons` | editing | [ReplaceNewlines.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/ReplaceNewlines.js) | Convert | Multi-line text input | Semicolon separated text |
| Replace Newlines With Commas | `/tools/replace-newlines-commas` | editing | [ReplaceNewlines.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/ReplaceNewlines.js) | Convert | Multi-line text input | Comma separated text |
| Snake Case to Camel Case | `/tools/snake-case-to-camel` | editing | [SnakeCamelConverter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/SnakeCamelConverter.js) | Convert Case | `snake_case` input | `camelCase` output |
| Sort Text Lines | `/tools/sort-text-lines` | general | [SortTextLines.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/SortTextLines.js) | Sort Lines | Text input, Sort direction (asc/desc/random) | Alphabetically or randomly sorted lines |
| Random Password Generator | `/tools/password-generator` | general | [PasswordGenerator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/PasswordGenerator.js) | Generate Password | Length slider, Checkboxes (A-Z, a-z, 0-9, symbols) | Secure password string, copy button |
| Margin Calculator | `/tools/margin-calculator` | general | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Calculate | Cost input, Sale price / Margin % | Gross profit & margin percentage |
| Number Sorter | `/tools/number-sorter` | general | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Sort Numbers | List of numbers input | Sorted numbers |
| Free Logo Maker | `/tools/free-logo-maker` | general | [LogoMaker.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/LogoMaker.js) | Render Canvas | Text, font, color, icon, layout settings | Canvas preview, PNG/JPG/SVG download |
| Free Invoice Generator | `/tools/free-invoice-generator` | general | [InvoiceGenerator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/InvoiceGenerator.js) | Generate Invoice | Business info, items, tax, discount inputs | Invoice printable document & PDF download |
| JSON Formatter & Beautifier | `/tools/json-formatter` | programming | [JsonFormatter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/JsonFormatter.js) | Format JSON | Raw JSON string | Formatted/Beautified JSON output |
| CSS Beautifier | `/tools/css-beautifier` | programming | [CssBeautifier.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/CssBeautifier.js) | Beautify CSS | Minified CSS | Indented clean CSS output |
| Text / Binary / Hex Converter | `/tools/text-binary-hex` | programming | [TextBinaryHex.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/TextBinaryHex.js) | Convert | Plain text / binary / hex | Converted binary or hex representations |
| Source Code Highlighter | `/tools/source-code-highlighter` | programming | [SourceCodeHighlighter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/SourceCodeHighlighter.js) | Highlight Code | Raw code snippet, language select | HTML formatted syntax-highlighted block |
| Compare Code Online | `/tools/compare-code` | programming | [GenericToolRenderer.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/GenericToolRenderer.js) | Compare | Code Block 1, Code Block 2 | Side-by-side green/red syntax diff view |
| MD5 Hash Generator | `/tools/md5-hash` | cryptography | [Md5Hash.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/Md5Hash.js) | Generate Hash | Text string | 32-character hex MD5 hash |
| SHA-256 Hash Generator | `/tools/sha256-hash` | cryptography | [Sha256Hash.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/Sha256Hash.js) | Generate Hash | Text string | 64-character SHA-256 hash |
| Custom QR Code Generator | `/tools/qr-code-generator` | web | [QrCodeGenerator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/QrCodeGenerator.js) | Generate QR Code | Content string, type (URL, WiFi, vCard, SMS), color controls | SVG / PNG QR Code image download |
| UUID Generator | `/tools/uuid-generator` | web | [UuidGenerator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/UuidGenerator.js) | Generate UUIDs | Count input | Unique v4 UUID list |
| Base64 Encode & Decode | `/tools/base64-encode-decode` | web | [Base64EncodeDecode.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/Base64EncodeDecode.js) | Encode / Decode | Text input | Base64 string or decoded plain text |
| URL Encode & Decode | `/tools/url-encode-decode` | web | [UrlEncodeDecode.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/UrlEncodeDecode.js) | Encode / Decode | URL string | Encoded/decoded URL string |
| Image to Base64 | `/tools/image-to-base64` | web | [ImageToBase64.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/ImageToBase64.js) | Process Image | Image file upload | Data URL Base64 string output |
| String to Binary Converter | `/tools/text-binary-converter` | converter | [StringToBinary.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/StringToBinary.js) | Convert to Binary | Text input | 8-bit binary string |
| Morse Code Converter | `/tools/morse-code-converter` | converter | [MorseCodeConverter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/MorseCodeConverter.js) | Convert | Text or dot/dash Morse | Morse code or translated text |
| Binary to String Converter | `/tools/binary-to-string` | converter | [BinaryToString.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/BinaryToString.js) | Convert | Space-separated binary string | Plain text string |
| Hex to String Converter | `/tools/hex-to-string` | converter | [HexToString.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/HexToString.js) | Convert | Hexadecimal string | ASCII text string |
| HEX to RGB Color Converter | `/tools/hex-to-rgb` | css | [HexToRgb.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/HexToRgb.js) | Convert Color | `#HEX` input | `rgb(r,g,b)` representation & preview |
| Length Converter | `/tools/length-converter` | unit-conversion | [LengthConverter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/LengthConverter.js) | Convert | Value, source unit, target unit | Converted length value |
| kg to lbs Converter | `/tools/weight-converter` | unit-conversion | [WeightConverter.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/WeightConverter.js) | Convert | Kilograms or Pounds value | Equivalent weight output |
| Random Team Generator | `/tools/random-team-generator` | random-generator | [RandomTeamGenerator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RandomTeamGenerator.js) | Generate Teams | Name list input, Team count | Balanced randomized teams |
| Random Emoji / Animal / Food / etc. | `/tools/random-*` | random-generator | [RandomGenerators.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/RandomGenerators.js) | Generate Random | Click action button | Random item selection from preset dictionary |
| 5G NR ARFCN Calculator | `/tools/5g-arfcn-to-frequency` | 5g | [FiveGArfcnCalculator.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/FiveGArfcnCalculator.js) | Calculate Frequency | ARFCN or Frequency (MHz) input | 5G Band details, Frequency (MHz) / ARFCN |
| 5G NR Throughput Calculator | `/tools/5g-nr-throughput` | 5g | [FiveGNRThroughput.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/FiveGNRThroughput.js) | Calculate Throughput | Bandwidth, MIMO layers, Modulation order | Calculated Peak Data Rate (Mbps / Gbps) |
| Word to PDF Converter | `/tools/word-to-pdf` | pdf-tools | [WordToPdf.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/WordToPdf.js) | Convert to PDF | `.doc` / `.docx` file | Generated PDF file download |
| Merge PDF Files | `/tools/merge-pdf` | pdf-tools | [MergePdf.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/MergePdf.js) | Merge PDFs | Multiple PDF files upload | Combined PDF file download |
| Protect PDF | `/tools/protect-pdf` | pdf-tools | [ProtectPdf.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/ProtectPdf.js) | Protect PDF | PDF file, Password | Encrypted PDF file download |
| PNG to WEBP Converter | `/tools/png-to-webp` | image-tools | [PngToWebp.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/PngToWebp.js) | Convert Image | PNG / JPG / GIF / WebP file, Quality slider | WEBP image file download |
| Crop JPG Image | `/tools/crop-jpg` | image-tools | [CropJpg.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/CropJpg.js) | Crop Image | JPG image, Aspect ratio select | Interactive canvas crop, cropped download |
| Video Tools & Player | `/tools/video-tools` | video-tools | [VideoTools.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/VideoTools.js) | Process Video | Video file upload | Frame capture, speed control, video metadata |
| Mute Video | `/tools/mute-video` | video-tools | [MuteVideo.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/MuteVideo.js) | Mute Video | MP4 / WebM video file | Muted video file download |
| LaTeX Compiler | `/tools/latex-compiler` | writing | [LatexCompiler.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/LatexCompiler.js) | Compile LaTeX | LaTeX code string | Rendered math output & image/PNG download |
| Text Cleaner | `/tools/text-cleaner` | writing | [TextCleaner.js](file:///e:/FreeTooly.com-main/FreeTooly.com-main/components/tools/TextCleaner.js) | Clean Text | Text string, multi-toggle cleaning options | Cleaned text string output |

---
*This contract is verified against existing codebase implementations in `/lib/tools-registry.js` and `/components/tools/*`.*
