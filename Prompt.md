Project Title: Khoj – AI-Powered Bengali Fact Checking Platform

Framework & Tech Stack:

Frontend: Next.js (with App Router) + Tailwind CSS + TypeScript

Backend: Next.js API routes (Node.js environment)

Font: Hind Siliguri (for proper Bengali rendering)

Fact-Checking AI: Gemini AI (text generation + translation)

Search & Crawl: Tavily API (@tavily/core)

Download Feature: TXT file generation on report page

🔹 Source Prioritization

Tavily must prioritize crawling/searching the following list of websites before falling back to the wider internet.

✅ Bangladeshi Mainstream News Sites

Prothom Alo → https://www.prothomalo.com

Bangladesh Pratidin → https://www.bd-pratidin.com

Jugantor → https://www.jugantor.com

Kaler Kantho → https://www.kalerkantho.com

Daily Samakal → https://www.samakal.com

The Daily Star → https://www.thedailystar.net

bdnews24.com → https://www.bdnews24.com

Dhaka Tribune → https://www.dhakatribune.com

Financial Express → https://thefinancialexpress.com.bd

New Age → https://www.newagebd.net

Daily Sun → https://www.daily-sun.com

The Independent → https://www.theindependentbd.com

Bangladesh Post → https://bangladeshpost.net

Daily Observer → https://observerbd.com

Banglanews24 → https://www.banglanews24.com

Bangla Tribune → https://www.banglatribune.com

Dhaka Post → https://www.dhakapost.com

Risingbd → https://www.risingbd.com

Barta24 → https://barta24.com

Dhaka Times → https://www.dhakatimes24.com

Somoy News → https://www.somoynews.tv

Jamuna TV → https://www.jamuna.tv

Independent TV → https://www.independent24.com

Channel 24 → https://www.channel24bd.tv

DBC News → https://www.dbcnews.tv

NTV → https://www.ntvbd.com

RTV → https://www.rtvonline.com

Manab Zamin → https://www.mzamin.com

Daily Sangbad → https://www.sangbad.net.bd

Jai Jai Din → https://www.jaijaidinbd.com

Bhorer Kagoj → https://www.bhorerkagoj.com

Daily Inqilab → https://www.dailyinqilab.com

Naya Diganta → https://www.nayadiganta.com

Dainik Azadi → https://www.dainikazadi.net

Dainik Purbokone → https://www.purbokone.net

Sylhet Express → https://www.sylhetexpress.com

Khulna Times → https://www.khulnatimes.com

Amader Barisal → https://www.amaderbarisal.com

Rajshahi News 24 → https://www.rajshahinews24.com

✅ Fact-Checking Websites (Bangladesh & Bengali)

Rumor Scanner → https://rumorscanner.com

FactWatch → https://www.fact-watch.org

Boom Bangladesh → https://www.boombangladesh.com

AFP Fact Check Bangla → https://factcheck.afp.com/bangla

BanglaFact (BSS) → https://www.bssnews.net/fact-check

Jachai → https://jachai.org

BD Fact Check → https://bdfactcheck.com

Dismislab → https://dismislab.com

Somoy Fact Check → (Somoy TV Digital)

Fact-Checking Bangladesh → (Facebook-based)

Alt News Bangla → https://bangla.altnews.in

Fact Crescendo Bangla → https://bangla.factcrescendo.com

Vishvas News Bangla → https://bangla.vishvasnews.com

✅ International Fact-Checking & Science Resources

Snopes → https://snopes.com

PolitiFact → https://www.politifact.com

FactCheck.org → https://www.factcheck.org

Reuters Fact Check → https://www.reuters.com/fact-check

AP Fact Check → https://apnews.com/APFactCheck

AFP Fact Check → https://factcheck.afp.com

BBC Reality Check → https://www.bbc.com/news/reality_check

Full Fact (UK) → https://fullfact.org

Washington Post Fact Checker → https://www.washingtonpost.com/news/fact-checker

Bellingcat → https://www.bellingcat.com

EUvsDisinfo → https://euvsdisinfo.eu

✅ Science & Health Verification

Health Feedback → https://healthfeedback.org

Science Feedback → https://sciencefeedback.co

NASA → https://www.nasa.gov

Skeptical Inquirer / CSI → https://skepticalinquirer.org

Quackwatch → https://quackwatch.org

Science Bee → https://www.sciencebee.com.bd

Biggan O Biggani → https://bijnan-o-bijnani.co.in

Biggan Blog → https://bigganblog.org

✅ YouTube Channels (to be crawled if supported)

Science BD → https://www.youtube.com/c/ScienceBD66

Science Bangla → https://www.youtube.com/c/ScienceBangla

Onnorokom Pathshala → https://www.youtube.com/c/OnnorokomPathshala

🔹 Search Pipeline (Technical)

User enters a claim in Bengali in the search bar.

System sends the query to /api/factcheck.

Tavily API first searches within the curated site list above.

Use client.search(query, { sites: [list above] })

If insufficient results, fall back to wider web search.

Tavily API optionally crawls matching URLs (client.crawl(url, { extractDepth: "advanced" })).

Content is passed into Gemini API → generate Bengali fact-checking report.

Report includes:

Step-by-step reasoning

Inline numbered references [1], [2], [3]

Reference list with clickable links at bottom

Option to Download as TXT

🔹 Styling & UX

(unchanged — Bengali-first, Hind Siliguri font, TailwindCSS, clean modern UI, responsive.)

🔹 Core Requirements
1. Global Layout

A persistent Navbar (on all pages) containing:

Fact Checks → redirects to /factchecks

AI Fact Check → redirects to /aifactcheck

About → redirects to /about

A clickable Khoj Logo + Title (in Bengali, Hind Siliguri font). Clicking it always redirects users to the homepage (/).

A detailed Footer (on all pages) containing:

About section

Documentation links

Quick Links

Contact / Social media

2. Homepage (/)

Logo + Title (Bengali styled, centered)

Search Bar (primary entry point):

On submit → redirect user to /results?query=... page

Search powered by Tavily API (client.search)

Crawling also used if needed (client.crawl)

Just under the search bar: dummy buttons (inactive for now)

Image (later for AI Image Verification)

Video (later for Video Verification)

AI Detector (later for AI-generated content detection)

Section: “আমাদের সাম্প্রতিক ফ্যাক্টচেক সমূহ”

Shows latest 10 fact-check article previews (title, meta description, first few lines, “Read More” link)

Clicking Read More → goes to /factchecks/[slug] (individual fact check article page)

At the bottom → “More” button → redirects to /factchecks

3. AI Fact Check Page (/aifactcheck)

When user searches, Tavily API fetches relevant resources.

Pipeline:

Fetch results with tavily.search(query)

Crawl deeper context with tavily.crawl(url, { extractDepth: "advanced" })

Pass fetched content → Gemini AI → Generate Fact Checking Report in Bengali (translate if needed)

Report must include:

Detailed explanation in Bengali

Referenced facts (with inline numbering [1], [2] ...)

Reference list at bottom (with clickable links)

Provide a Download as TXT option (AI-generated report downloadable)

4. Search Results Page (/results)

Shows results from Tavily Search API (formatted neatly in Bengali).

Each result has:

Title (clickable, goes to source)

Short summary

Source URL

5. Fact Checks Page (/factchecks)

Shows a searchable + filterable list of all manual fact check articles (with metadata).

Each article card contains:

Title

Short preview text

Read More button → /factchecks/[slug] (dedicated article page)

6. Article Page (/factchecks/[slug])

Shows full fact-checking article (static/manual content).

Bengali typography with Hind Siliguri font.

Sidebar (optional) with:

Related articles

Share buttons

7. About Page (/about)

Explains what Khoj is, how AI + Tavily + Gemini is used.

Bengali text, styled with proper font.

🔹 Technical Implementation Details
Tavily API Usage

Search Example:

// To install: npm i @tavily/core
const { tavily } = require('@tavily/core');
const client = tavily({ apiKey: "tvly-dev-XXXX" });

client.search("example query")
  .then(console.log);


Crawl Example:

client.crawl("https://example.com", {
  extractDepth: "advanced"
})
.then(console.log);

Gemini AI Integration

Use Gemini API in backend route /api/factcheck

Input: Crawled content from Tavily

Output: Bengali fact-checking report with inline references

🔹 Styling & UX

Clean, modern UI (Next.js + TailwindCSS)

Bengali-first UX (default language Bengali)

Typography: Hind Siliguri font everywhere

Responsive design (desktop + mobile)

Soft colors, readable Bengali text spacing


Tavily api key: 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
GEMINI API KEY= AIzaSyC9TG6eFVKpVe17FUDbW4bX3J6HQktdfrg
