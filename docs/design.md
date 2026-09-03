# FreeTooly — Visual Design System & UI Architecture

## Visual Direction
FreeTooly is a utility platform providing 100+ browser-based tools. The design aesthetic is focused on **utility, speed, clarity, and precision**.

- **Theme**: Light mode only.
- **Tone**: Clean, professional, developer-grade online workbench.
- **Style**: High contrast, crisp borders (`#E2E8F0`), micro-shadows, subtle hover interactions, functional hierarchy.

---

## Color Tokens

```css
:root {
  /* Surface & Backgrounds */
  --bg-page: #F8FAFC;         /* Warm slate off-white */
  --bg-surface: #FFFFFF;      /* Clean solid white card background */
  --bg-subtle: #F1F5F9;       /* Muted input & section background */
  --bg-hover: #E2E8F0;        /* Subtle hover surface */

  /* Text & Typography */
  --text-main: #0F172A;       /* Slate 900 primary text */
  --text-muted: #475569;      /* Slate 600 secondary text */
  --text-subtle: #64748B;     /* Slate 500 caption text */

  /* Primary Brand & Accents */
  --brand-primary: #2563EB;   /* Royal Slate Blue */
  --brand-hover: #1D4ED8;     /* Darker active blue */
  --brand-light: #EFF6FF;     /* Blue tint background */
  
  /* Borders & Dividers */
  --border-main: #E2E8F0;      /* Slate 200 light border */
  --border-focus: #2563EB;     /* Blue focus ring */
  
  /* Status Indicators */
  --success-bg: #ECFDF5;
  --success-text: #047857;
  --warning-bg: #FFFBEB;
  --warning-text: #B45309;
  --error-bg: #FEF2F2;
  --error-text: #B91C1C;
}
```

---

## Typography System
- **Display / Headings**: Inter / Plus Jakarta Sans (`font-weight: 800`, letter-spacing: `-0.02em`)
- **Body / Interface**: Inter / System Sans-serif (`font-size: 14px / 16px`, `line-height: 1.5`)
- **Monospace / Code**: JetBrains Mono / ui-monospace (`font-size: 13px`)

---

## Layout & Components Architecture

### 1. Header & Navigation
- Logo: Bold brand mark `FreeTooly` with tool icon tag.
- Search Bar: Quick keyboard shortcut trigger `Ctrl + K` / `Cmd + K` Command Palette.
- Categories Nav: Category dropdown / filter pills.
- Quick Actions: Favorites bar trigger.

### 2. Homepage Hero Section
- Practical Headline: *"Free online tools for everyday tasks."*
- Subheading: *"Convert, calculate, generate, format and analyze — 100% in your browser."*
- Universal Live Filter Search Box.
- Category Filter Chips (PDF, Word, Image, Text, Web, Cryptography, 5G, Video).
- Tool Card Grid: Clean 3-column desktop / 1-column mobile grid.

### 3. Tool Workbench Page
- Navigation Breadcrumb: `← Back to all tools`
- Tool Header: Icon badge, Category tag, Title, Description, Favorite star toggle.
- Tool Workspace Card: Standardized input panel, action buttons, output result view, and copy/download controls.
- FAQ & Guide Section: 3-step usage accordion.
- Related Tools: 2-column recommendations grid.

---

## ASCII Wireframes

### Homepage Wireframe
```
+-----------------------------------------------------------------------+
|  [Logo] FreeTooly      [Search Tools (Ctrl+K)]     [Favorites (0)]    |
+-----------------------------------------------------------------------+
|                                                                       |
|         Free online tools for everyday tasks.                         |
|         Convert, calculate, generate, format and analyze.             |
|                                                                       |
|     [ 🔍 Search 100+ tools...                                ]        |
|                                                                       |
|   [All]  [📄 PDF]  [📝 Text]  [🌐 Web]  [🔐 Crypto]  [📊 5G]        |
|                                                                       |
|   +-------------------+  +-------------------+  +-------------------+ |
|   | 📝 Word Counter   |  | 📄 Word to PDF    |  | 📱 QR Code Gen    | |
|   | Count words & chars|  | Convert docx to pdf|  | Custom QR codes   | |
|   | [Text Analysis]   |  | [PDF Tools]       |  | [Web Tools]       | |
|   +-------------------+  +-------------------+  +-------------------+ |
|                                                                       |
+-----------------------------------------------------------------------+
```

### Tool Page Wireframe
```
+-----------------------------------------------------------------------+
|  ← Back to all tools                                                  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | [📝] Text Analysis           ⭐ Favorite                         |  |
|  |  Word Counter                                                   |  |
|  |  Count words, characters, sentences, and paragraphs in real time|  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  | Input Text / Code / File                                        |  |
|  | +-------------------------------------------------------------+ |  |
|  | | Type or paste content here...                               | |  |
|  | +-------------------------------------------------------------+ |  |
|  |                                                                 |  |
|  | [ Run Action / Calculate ]                                      |  |
|  |                                                                 |  |
|  | Result Output                                [ Copy ] [Download] |  |
|  | +-------------------------------------------------------------+ |  |
|  | | Result output displayed here...                             | |  |
|  | +-------------------------------------------------------------+ |  |
|  +-----------------------------------------------------------------+  |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Responsive & Motion Rules
- **Breakpoints**: Mobile (`<640px`), Tablet (`640px - 1024px`), Desktop (`>1024px`).
- **Touch Targets**: Minimum `44px x 44px` on mobile screens.
- **Motion**: `transition-all duration-200 ease-out`. Respect `prefers-reduced-motion`.
