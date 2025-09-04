![Khoj Cover](public/khoj-cover.png)

### Khoj — AI‑Powered Bengali Fact‑Checking Platform

An open-source, AI-assisted platform for verifying claims in Bengali. Built with Next.js 14, TypeScript, and modern AI/search APIs. Crafted for speed, clarity, and credible sourcing.

---

### Highlights

- **AI fact‑checking in Bengali**: Generates structured reports in Bengali with clear verdicts and up to 10 sources.
- **Domain‑first search strategy**: Prioritizes trusted Bangladeshi news/fact‑check sites; falls back intelligently.
- **Mixed‑language sourcing**: Pulls from Bengali and English when local coverage is thin, but reports in Bengali.
- **Image authenticity check**: Detects AI‑generated images via Sightengine.
- **Reverse image search**: Google Lens via SerpAPI for visual matches and provenance hints.
- **AI/Plagiarism text analysis**: Winston AI endpoints for AI‑detection and plagiarism signals.
- **Beautiful, responsive UI**: Clean, mobile‑first experience with Tailwind and glowing effects.
- **Fact‑check library**: Browse latest checks, filters, and detail pages with citations.
- **AI Fact-Check History**: Store and manage user-generated AI fact-check reports locally.
- **Mukti Corner & Mythbusting**: Specialized AI chat features for liberation war topics and myth debunking.
- **Recommendation System**: Smart article recommendations on individual fact-check pages.
- **Enhanced Markdown Rendering**: Proper formatting for AI-generated content with headings, bold text, and links.

---

### Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS, `tailwind-merge`, `clsx`
- **AI Models**: Google Gemini (Pro/Flash), DeepSeek via OpenRouter, GROQ (GPT‑OSS‑20B) fallback
- **Search**: Tavily API (priority sites + general), custom domain‑first crawler
- **Media**: Sightengine (AI image detection), SerpAPI (Google Lens)
- **Icons**: `lucide-react`
- **Local Storage**: Browser-based storage for user-generated content
- **Markdown Parsing**: Custom markdown parser with HTML sanitization

---

### How It Works

1. User submits a claim (in Bengali).
2. Server searches trusted Bangladeshi sources first; augments with English sources if needed.
3. Top sources are compiled and analyzed by AI (DeepSeek → Gemini → GROQ fallback chain).
4. A structured Bengali report is returned with verdict and reasoning. Related articles from our library are suggested.
5. User-generated reports are stored locally for future access and management.

---

### API Endpoints

- **POST** `/api/factcheck`
  - Bengali report from prioritized Bangladeshi sources; augments with English if needed.
- **POST** `/api/factcheck-domain-first`
  - Deep domain‑first gatherer using `ALLOWED_SITES`; auto‑fallback to Tavily; rich stats.
- **POST** `/api/search`
  - Smart search across Bangladeshi and priority sites; de‑duplicated results.
- **POST** `/api/image-check`
  - AI image authenticity check using Sightengine (`true/false/misleading` with confidence).
- **POST** `/api/source-search`
  - Reverse image search (Google Lens via SerpAPI). Returns visual matches and analysis.
- **POST** `/api/text-check`
  - `type: "ai-detection" | "plagiarism"` — Winston AI powered, with AI fallback.
- **POST** `/api/mukti-corner`
  - AI chat for liberation war topics and historical fact-checking.
- **POST** `/api/mythbusting`
  - AI-powered myth debunking and rumor analysis.
- **GET** `/api/tavily-status`
  - Monitor the status of all Tavily API keys and their monthly usage.

All endpoints return JSON. See source files in `app/api/*/route.ts` for request/response shapes.

---

### App Pages

- `/` Home with hero search, latest fact‑checks, and AI fact-check widget
- `/factchecks` Listing with filters; `/factchecks/[slug]` detail pages with recommendations
- `/factcheck-detail` AI-powered fact-checking with search bar
- `/factcheck-view` View all user-generated AI fact-check reports
- `/factcheck-view/[id]` View individual AI fact-check report
- `/image-check` Image authenticity checker
- `/text-check` Text AI‑detection and plagiarism analysis
- `/source-search` Reverse image source search
- `/mythbusting` AI-powered myth debunking chat
- `/mukti-corner` Liberation war topics and historical fact-checking
- `/domain-first-factcheck` Experimental domain‑first flow
- `/about` Project overview

---

### Key Features

#### **AI Fact-Check Widget**
- Desktop: Left-side widget showing user's AI fact-check history
- Mobile: Collapsible sidebar with toggle functionality
- Features: View, download, and delete individual reports
- Storage: Browser-based local storage for persistence

#### **Enhanced Homepage**
- **Glowing Text Effects**: Animated glow on main title and subtitle
- **Double-Column Grid**: 10 most recent articles in responsive 2-column layout
- **Article Cards**: Thumbnails, verdict badges, tags, previews, and dates
- **Quick Access Buttons**: ছবি যাচাই, লেখা যাচাই, উৎস সন্ধান, মিথবাস্টিং

#### **Recommendation System**
- **Individual Article Pages**: Shows 5 recent articles (excluding current)
- **Smart Filtering**: Excludes current article from recommendations
- **Rich Metadata**: Thumbnails, titles, verdicts, and dates

#### **Mukti Corner & Mythbusting**
- **AI Chat Interface**: Specialized for liberation war topics and myth debunking
- **Concise Summaries**: 2-3 sentence summaries instead of detailed ones
- **Markdown Rendering**: Proper formatting for AI responses

#### **Enhanced Content**
- **New Articles**: 3 new fact-check articles (IDs 23, 24, 25) with detailed content
- **Proper Formatting**: Hyperlinked references and structured content
- **Rich Metadata**: Tags, thumbnails, and comprehensive analysis

---

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys.

```env
# Tavily API Keys (multiple keys for automatic fallback when monthly limits are reached)
TAVILY_API_KEY=your_primary_tavily_api_key_here
TAVILY_API_KEY_2=your_second_tavily_api_key_here
TAVILY_API_KEY_3=your_third_tavily_api_key_here
TAVILY_API_KEY_4=your_fourth_tavily_api_key_here
TAVILY_API_KEY_5=your_fifth_tavily_api_key_here
TAVILY_API_KEY_6=your_sixth_tavily_api_key_here
TAVILY_API_KEY_7=your_seventh_tavily_api_key_here
TAVILY_API_KEY_8=your_eighth_tavily_api_key_here
TAVILY_API_KEY_9=your_ninth_tavily_api_key_here
TAVILY_API_KEY_10=your_tenth_tavily_api_key_here
TAVILY_API_KEY_11=your_eleventh_tavily_api_key_here
TAVILY_API_KEY_12=your_twelfth_tavily_api_key_here
TAVILY_API_KEY_13=your_thirteenth_tavily_api_key_here
TAVILY_API_KEY_14=your_fourteenth_tavily_api_key_here
TAVILY_API_KEY_15=your_fifteenth_tavily_api_key_here
TAVILY_API_KEY_16=your_sixteenth_tavily_api_key_here
# Total: 16 API keys for maximum capacity

OPENROUTER_API_KEY=your_openrouter_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
SIGHTENGINE_API_USER=your_sightengine_api_user_here
SIGHTENGINE_API_SECRET=your_sightengine_api_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Additional (used by routes)
SERPAPI_KEY=your_serpapi_key_here          # For /api/source-search (Google Lens)
WINSTON_TOKEN=your_winston_token_here      # For /api/text-check (AI/Plagiarism)
```

**Note:** The system automatically uses multiple Tavily API keys as fallbacks. When one key hits its monthly limit (100 searches), it automatically switches to the next available key. With 16 API keys, you get up to 1,600 searches per month.

---

### Getting Started

1) Clone and install

```bash
git clone https://github.com/Mahatir-Ahmed-Tusher/khoj-fact-checker.git
cd khoj-fact-checker
npm install
```

2) Configure environment

```bash
cp env.example .env.local
# then edit .env.local and add your API keys
```

3) Run

```bash
npm run dev
# open http://localhost:3000
```

4) Production build

```bash
npm run build
npm run start
```

---

### File Structure

```text
FACT CHECKER/
├─ app/
│  ├─ api/
│  │  ├─ factcheck/route.ts              # Mixed‑source Bengali fact‑check
│  │  ├─ factcheck-domain-first/route.ts # Domain‑first gather + fallback
│  │  ├─ image-check/route.ts            # Sightengine AI image detection
│  │  ├─ search/route.ts                 # Priority + general search
│  │  ├─ source-search/route.ts          # Google Lens via SerpAPI
│  │  ├─ text-check/route.ts             # Winston AI + fallback
│  │  ├─ mukti-corner/route.ts           # Liberation war AI chat
│  │  └─ mythbusting/route.ts            # Myth debunking AI chat
│  ├─ about/page.tsx
│  ├─ ai-detector/page.tsx
│  ├─ domain-first-factcheck/page.tsx
│  ├─ factcheck-detail/page.tsx
│  ├─ factcheck-view/page.tsx            # All AI fact-check reports
│  ├─ factcheck-view/[id]/page.tsx      # Individual AI fact-check report
│  ├─ factchecks/[slug]/page.tsx
│  ├─ factchecks/page.tsx
│  ├─ image-check/page.tsx
│  ├─ mukti-corner/page.tsx             # Liberation war chat interface
│  ├─ mythbusting/page.tsx              # Myth debunking chat interface
│  ├─ source-search/page.tsx
│  ├─ text-check/page.tsx
│  ├─ results/page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ page.tsx                           # Home
├─ components/
│  ├─ AIFactCheckWidget.tsx             # User AI fact-check history widget
│  ├─ DomainFirstFactChecker.tsx
│  ├─ FeatureWidget.tsx                 # Feature promotion widget
│  ├─ Footer.tsx
│  ├─ MuktiSidebar.tsx                  # Mukti Corner sidebar
│  ├─ MythbustingSidebar.tsx            # Mythbusting sidebar
│  ├─ Navbar.tsx
│  ├─ PromotionalWidget.tsx             # Promotional features widget
│  ├─ RecommendationWidget.tsx          # Article recommendations
│  └─ SearchBar.tsx
├─ lib/
│  ├─ ai-factcheck-utils.ts             # AI fact-check storage utilities
│  ├─ data.ts                            # Fact‑check articles, helpers
│  ├─ markdown.ts                        # Markdown parsing and HTML sanitization
│  └─ utils.ts                           # PRIORITY_SITES, ALLOWED_SITES, helpers
├─ public/
│  ├─ khoj-cover.png                     # README cover
│  ├─ khoj.png                           # Hero image
│  └─ thumbnails/...                     # Listing thumbnails
├─ tailwind.config.js
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

### NPM Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Lint
```

---

### For Hackathon Judges

- Minimal setup: add keys in `.env.local`, run `npm run dev`, open the home page.
- Try a claim in Bengali on the homepage; view sources and the generated report.
- Test media tools:
  - Image authenticity: `/image-check`
  - Reverse image search: `/source-search`
  - Text analysis: `/text-check` (`ai-detection` or `plagiarism`)
- Test new features:
  - AI fact-check history: Check the left widget on desktop or mobile sidebar
  - Mukti Corner: `/mukti-corner` for liberation war topics
  - Mythbusting: `/mythbusting` for myth debunking
  - Article recommendations: Click on any individual fact-check article
- Domain‑first experimental flow: `/domain-first-factcheck`

---

### Contributors

- **Mahatir Ahmed Tusher** — Founder & Author
- **Sagar Chandra Dey** — UI Designer & Author
- **Tania Chaity** — Data Collector & Researcher

GitHub: `https://github.com/Mahatir-Ahmed-Tusher`

---

### Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

### License

MIT — see `LICENSE` (or include one in the repo).

---

### Acknowledgments

- Next.js, Tailwind CSS, TypeScript
- Tavily, Google Gemini, OpenRouter DeepSeek, GROQ
- Sightengine, SerpAPI (Google Lens), Winston AI

