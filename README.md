![Khoj Cover](public/khoj-cover.png)

### Khoj — AI‑Powered Bengali Fact‑Checking Platform

An open-source, AI-assisted platform for verifying claims in Bengali. Built with Next.js 14, TypeScript, and modern AI/search APIs. Crafted for speed, clarity, and credible sourcing — perfect for hackathons and beyond.

---

### Highlights

- **AI fact‑checking in Bengali**: Generates structured reports in Bengali with clear verdicts.
- **Domain‑first search strategy**: Prioritizes trusted Bangladeshi news/fact‑check sites; falls back intelligently.
- **Mixed‑language sourcing**: Pulls from Bengali and English when local coverage is thin, but reports in Bengali.
- **Image authenticity check**: Detects AI‑generated images via Sightengine.
- **Reverse image search**: Google Lens via SerpAPI for visual matches and provenance hints.
- **AI/Plagiarism text analysis**: Winston AI endpoints for AI‑detection and plagiarism signals.
- **Beautiful, responsive UI**: Clean, mobile‑first experience with Tailwind.
- **Fact‑check library**: Browse latest checks, filters, and detail pages with citations.

---

### Tech Stack

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS, `tailwind-merge`, `clsx`
- **AI Models**: Google Gemini (Pro/Flash), DeepSeek via OpenRouter, GROQ (GPT‑OSS‑20B) fallback
- **Search**: Tavily API (priority sites + general), custom domain‑first crawler
- **Media**: Sightengine (AI image detection), SerpAPI (Google Lens)
- **Icons**: `lucide-react`

---

### How It Works

1. User submits a claim (in Bengali).
2. Server searches trusted Bangladeshi sources first; augments with English sources if needed.
3. Top sources are compiled and analyzed by AI (DeepSeek → Gemini → GROQ fallback chain).
4. A structured Bengali report is returned with verdict and reasoning. Related articles from our library are suggested.

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

All endpoints return JSON. See source files in `app/api/*/route.ts` for request/response shapes.

---

### App Pages (Selected)

- `/` Home with hero search and latest fact‑checks
- `/factchecks` Listing with filters; `/factchecks/[slug]` detail pages
- `/image-check` Image authenticity checker
- `/text-check` Text AI‑detection and plagiarism analysis
- `/source-search` Reverse image source search
- `/domain-first-factcheck` Experimental domain‑first flow
- `/about` Project overview

---

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys.

```env
TAVILY_API_KEY=your_tavily_api_key_here
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
│  │  └─ text-check/route.ts             # Winston AI + fallback
│  ├─ about/page.tsx
│  ├─ ai-detector/page.tsx
│  ├─ domain-first-factcheck/page.tsx
│  ├─ factcheck-detail/page.tsx
│  ├─ factchecks/[slug]/page.tsx
│  ├─ factchecks/page.tsx
│  ├─ image-check/page.tsx
│  ├─ source-search/page.tsx
│  ├─ text-check/page.tsx
│  ├─ results/page.tsx
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ page.tsx                           # Home
├─ components/
│  ├─ DomainFirstFactChecker.tsx
│  ├─ Footer.tsx
│  ├─ Navbar.tsx
│  └─ SearchBar.tsx
├─ lib/
│  ├─ data.ts                            # Fact‑check articles, helpers
│  ├─ markdown.ts
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

