<img width="1892" height="448" alt="image" src="https://github.com/user-attachments/assets/74c854f5-a5ca-4a7b-af71-fa1c71c871be" /> 
# 🔍 Khoj — The World's First AI-Powered Bengali Fact-Checking Platform

## 🚀 **Live Demo**

[https://khoj-bd.com/](https://khoj-bd.com/) – Experience the future of Bengali fact-checking right now!

---

## 🌟 **Revolutionary Achievement**

**Khoj** stands as the **world's first comprehensive AI-powered fact-checking platform specifically designed for the Bengali language**. After extensive research and analysis of over 50 sources, we can confidently claim that no previous platform has offered complete AI-driven fact-checking capabilities for Bengali content.

### 🏆 **Why We're Pioneers**

- ✅ **First Bengali AI Fact-Checker**: Revolutionary AI-powered claim verification in Bengali
- ✅ **Comprehensive Platform**: Integrated solution for text, image, and historical fact verification
- ✅ **Open Source Excellence**: MIT licensed, community-driven development
- ✅ **Cultural Sensitivity**: Designed with deep respect for Bangladeshi context and history
- ✅ **Research-Backed**: Extensive verification of our "first" claim with credible sources

---

## 🎯 **Core Features**

### 🤖 **Advanced AI Fact-Checking Engine**

- **Structured Bengali Reports**: Clear verdicts (True/False/unverified) with up to 10 credible sources
- **Domain-First Search Strategy**: Prioritizes trusted Bangladeshi news and fact-check sites
- **Intelligent Fallback System**: Seamlessly integrates English sources when local coverage is insufficient
- **Native Language Processing**: Always delivers results in Bengali, regardless of source language
- **Multi-Model AI Chain**: DeepSeek → Gemini → GROQ fallback for maximum reliability

### 🖼️ **Cutting-Edge Multimedia Verification**

- **AI Image Authenticity Detection**: Advanced Sightengine integration to detect AI-generated images
- **Reverse Image Search**: Google Lens powered visual matching and provenance analysis
- **Text Analysis Suite**: Winston AI powered AI-detection and plagiarism analysis
- **Deepfake Detection**: State-of-the-art technology to identify manipulated content

### 🛠️ **Specialized AI Tools**

- **Mukti Corner**: Revolutionary AI chat for 1971 Liberation War history and fact verification
- **Mythbusting Engine**: AI-powered rumor debunking and myth analysis
- **E-Library Integration**: Digital book and resource collection for comprehensive research
- **Historical Context AI**: Specialized knowledge base for Bangladeshi historical events

### 🎨 **Premium User Experience**

- **Responsive Design**: Flawless experience across all devices and screen sizes
- **Bengali Typography**: Beautiful Solaiman Lipi font integration for authentic Bengali text
- **Cultural Design Language**: Red-green theme reflecting Bangladeshi identity
- **Fact-Check Library**: Browse and search through verified fact-check reports
- **Smart Recommendation System**: AI-powered related article suggestions
- **Interactive Site Tour**: Guided onboarding for first-time visitors

---

## 🏗️ **Advanced Technology Stack**

### **Frontend Architecture**

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS with `tailwind-merge` and `clsx` for optimal performance
- **Icons**: Lucide React for consistent, beautiful iconography
- **Typography**: Solaiman Lipi (Bengali), Times Now (Headings)
- **Performance**: Optimized with React.memo, useMemo, and useCallback

### **AI and Search Infrastructure**

- **AI Models**: Google Gemini (Pro/Flash), DeepSeek via OpenRouter, GROQ (GPT-OSS-20B)
- **Search Engine**: Tavily API with 16 API keys supporting 1,600 searches/month
- **Media Analysis**: Sightengine (AI image detection), SerpAPI (Google Lens)
- **Text Intelligence**: Winston AI (AI detection & plagiarism analysis)
- **Fallback System**: Intelligent API key rotation for maximum uptime

### **Data Management and Storage**

- **Local Storage**: Browser-based user data persistence
- **Markdown Processing**: Custom parser with HTML sanitization
- **API Architecture**: Scalable JSON endpoints with comprehensive error handling
- **Caching Strategy**: Optimized for performance and reliability

---

## 🚀 **How It Works**

### **Step-by-Step Process**

1. **Claim Submission**: User submits a claim in Bengali through our intuitive interface
2. **Intelligent Source Discovery**: System searches trusted Bangladeshi sources first, intelligently augmenting with English sources when needed
3. **AI Analysis Pipeline**: Top sources are compiled and analyzed by our multi-model AI chain (DeepSeek → Gemini → GROQ)
4. **Report Generation**: A comprehensive Bengali report is generated with clear verdict, reasoning, and citations
5. **Smart Storage**: User-generated reports are stored locally for future access and management
6. **Recommendation Engine**: Related articles from our library are suggested for deeper understanding

### **Advanced Features**

- **Real-time Processing**: Instant fact-checking with live progress indicators
- **Source Verification**: Automatic credibility scoring of information sources
- **Context Awareness**: AI understands cultural nuances and historical context
- **Multi-language Support**: Processes Bengali and English sources while delivering Bengali results

---

## 📡 **API Endpoints**

### **Core Fact-Checking**

- **POST** `/api/factcheck` - Internal fact-checking endpoint with mixed-source Bengali reports
- **POST** `/api/factcheck-domain-first` - Domain-first search strategy with automatic fallback to general search
- **POST** `/api/v1/factcheck` - Public API endpoint for third-party integration (requires API key authentication)
- **GET** `/api/v1/factcheck` - API information and documentation

### **Media Verification**

- **POST** `/api/image-check` - AI-powered image authenticity detection using Sightengine
- **POST** `/api/source-search` - Reverse image search using Google Lens via SerpAPI
- **POST** `/api/image-to-text` - Extract text from images using OCR
- **POST** `/api/text-check` - AI content detection and plagiarism analysis using Winston AI

### **Specialized AI Chat**

- **POST** `/api/mukti-corner` - Liberation War (1971) historical fact-checking and Q&A chat
- **GET** `/api/mukti-corner` - Get Mukti Corner categories and information
- **POST** `/api/mukti-corner-chat` - Alternative Mukti Corner chat endpoint
- **POST** `/api/mythbusting` - Myth debunking and rumor analysis AI chat
- **GET** `/api/mythbusting` - Get mythbusting API information
- **POST** `/api/mythbusting-test` - Testing endpoint for mythbusting features

### **General AI Chat**

- **POST** `/api/khoj-chat` - General purpose AI chat interface
- **POST** `/api/khoj-chat-stream` - Streaming version of Khoj chat
- **POST** `/api/gemini-chat` - Direct Gemini AI chat integration

### **News & Content Verification**

- **POST** `/api/news-verification` - News article verification endpoint
- **POST** `/api/news-verification-v2` - Enhanced news verification with improved features
- **POST** `/api/news-collection` - Collect and process news articles

### **Search & Classification**

- **POST** `/api/search` - Smart search across Bangladeshi and priority sites
- **POST** `/api/classify-query` - Intelligent query classification (mythbusting/factcheck/url)
- **POST** `/api/classify-geography` - Classify queries as Bangladesh or international
- **POST** `/api/parse-query` - Parse and extract information from queries

### **API Management**

- **POST** `/api/api-keys/assign` - Assign API key to authenticated user (requires Google OAuth)
- **GET** `/api/api-keys/assign` - Get user's assigned API key (requires authentication)
- **GET** `/api/api-docs-content` - Get API documentation markdown content

### **Status & Monitoring**

- **GET** `/api/tavily-status` - Monitor status and usage of all Tavily API keys
- **GET** `/api/rapidapi-status` - Monitor status and usage of RapidAPI keys
- **POST** `/api/rapidapi-status` - Update RapidAPI key status

### **Utility Endpoints**

- **GET** `/api/categories` - Get categories for Mukti Corner
- **POST** `/api/gen-audio` - Generate audio from text
- **POST** `/api/text-to-speech` - Text-to-speech conversion
- **GET** `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints

---

## 📱 **Complete Application Pages**

### **Core Pages**

- `/` - **Homepage**: Hero search interface, latest fact-checks, AI widget, and interactive tour
- `/factcheck-detail` - **AI Fact-Checking Interface**: Main fact-checking tool with advanced search
- `/factchecks` - **Fact-Check Library**: Comprehensive listing with advanced filters
- `/factchecks/[slug]` - **Individual Fact-Check Pages**: Detailed reports with recommendations

### **Multimedia Tools**

- `/image-check` - **Image Authenticity Checker**: AI-powered image verification tool
- `/text-check` - **Text Analysis Suite**: AI detection and plagiarism analysis
- `/source-search` - **Reverse Image Search**: Visual source discovery tool

### **Specialized Features**

- `/mukti-corner` - **Liberation War Chat**: Historical fact-checking and education
- `/mythbusting` - **Myth Debunking Chat**: Rumor analysis and myth busting
- `/e-library` - **Digital Library**: Educational resources and digital books
- `/domain-first-factcheck` - **Advanced Fact-Checking**: Experimental domain-first flow

### **User Management**

- `/factcheck-view` - **AI Fact-Check History**: All user-generated reports
- `/factcheck-view/[id]` - **Individual Report Viewer**: Detailed report analysis
- `/fact-checking-verification` - **Our Claim Verification**: Proof of being first

### **Information Pages**

- `/about` - **Project Overview**: Comprehensive project information
- `/faq` - **Frequently Asked Questions**: User support and guidance
- `/privacy-policy` - **Privacy Policy**: Data protection and privacy information
- `/terms` - **Terms of Service**: Usage terms and conditions

---

## 🔧 **Complete Installation and Setup Guide**

### **Prerequisites**

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/Mahatir-Ahmed-Tusher/Khoj.git
cd Khoj
```

### **Step 2: Install Dependencies**

```bash
npm install
# or
yarn install
```

### **Step 3: Environment Configuration**

Create your environment file by copying the example:

```bash
cp env.example .env.local
```

**Important:** The `.env.local` file is not tracked by Git and contains your sensitive API keys. Never commit this file to version control.

### **Step 4: Configure Environment Variables**

Edit `.env.local` and add your API keys. See the [Environment Variables](#-environment-variables) section below for detailed information about each variable.

### **Step 5: Run Development Server**

```bash
npm run dev
# or
yarn dev
```

### **Step 6: Access the Application**

Open [http://localhost:3000](http://localhost:3000) in your browser

### **Step 7: Production Build**

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

---

## 🔑 **Environment Variables**

The application requires several environment variables to function properly. Copy `env.example` to `.env.local` and fill in your API keys.

### **Required Environment Variables**

#### **Search API Keys (Tavily)**

Tavily API keys are used for web search and content crawling. The system automatically falls back to the next available key when a key's monthly limit (100 searches) is reached. With 19 API keys, you can perform up to 1,900 searches per month.

```env
# Primary Tavily API Key (Required)
TAVILY_API_KEY=your_primary_tavily_api_key_here

# Additional Tavily API Keys (Optional, for fallback)
TAVILY_API_KEY_2=your_second_tavily_api_key_here
TAVILY_API_KEY_3=your_third_tavily_api_key_here
# ... up to TAVILY_API_KEY_19
```

**Note:** You can start with just one Tavily API key, but adding more keys increases your monthly search capacity and provides automatic fallback when limits are reached.

#### **AI Model API Keys**

```env
# OpenRouter API Key (Required for DeepSeek AI - primary model)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Google Gemini API Key (Required for fact-checking reports - secondary model)
GEMINI_API_KEY=your_gemini_api_key_here

# Secondary Gemini API Key (Optional, for Mukti Corner and Mythbusting)
GEMINI_API_KEY_2=your_second_gemini_api_key_here

# GROQ API Key (Required for GPT-OSS-20B - tertiary fallback)
GROQ_API_KEY=your_groq_api_key_here
```

#### **Media Analysis API Keys**

```env
# Sightengine API (Required for AI image detection)
SIGHTENGINE_API_USER=your_sightengine_api_user_here
SIGHTENGINE_API_SECRET=your_sightengine_api_secret_here

# SerpAPI Key (Required for Google Lens reverse image search)
SERPAPI_KEY=your_serpapi_key_here

# Winston AI Token (Optional, for AI detection and plagiarism analysis)
WINSTON_TOKEN=your_winston_token_here

# Imgur API Key (Optional, needed for OpenRouter image analysis)
IMGUR_CLIENT_ID=your_imgur_client_id_here
```

#### **RapidAPI Keys (Optional, for additional web search)**

```env
# RapidAPI Keys for web search functionality (multiple keys for fallback)
APP_KEY=your_rapidapi_key_here
APP_KEY_2=your_second_rapidapi_key_here
# ... up to APP_KEY_15
```

**Note:** With 15 RapidAPI keys, you can perform up to 1,500 searches per month.

#### **Authentication Configuration**

```env
# NextAuth.js Configuration (Required for Google OAuth)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Credentials (Required for user authentication)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

#### **Application Configuration**

```env
# Application URL (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Convex Backend URL (Optional, for database features)
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url_here
```

#### **Public API Configuration**

```env
# API Authentication Setting
# Set to "false" to disable API key requirement (for testing only)
# Default: "true" (API key required)
# WARNING: Only set to false in development/testing environments!
API_AUTH_REQUIRED=true
```

### **Getting API Keys**

1. **Tavily API**: Sign up at [tavily.com](https://tavily.com) (Free tier: 1,000 searches/month)
2. **OpenRouter**: Get your key at [openrouter.ai](https://openrouter.ai)
3. **Google Gemini**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **GROQ**: Sign up at [groq.com](https://groq.com)
5. **Sightengine**: Register at [sightengine.com](https://sightengine.com)
6. **SerpAPI**: Get your key at [serpapi.com](https://serpapi.com)
7. **Winston AI**: Sign up at [winston.ai](https://winston.ai)
8. **Google OAuth**: Create credentials at [Google Cloud Console](https://console.cloud.google.com)

### **Environment File Best Practices**

- ✅ **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- ✅ **Use `.env.example`** as a template for other developers
- ✅ **Keep API keys secure** and rotate them regularly
- ✅ **Use different keys** for development and production environments
- ✅ **Start with minimum required keys** and add more as needed

### **Minimum Required Variables**

To get started quickly, you only need these essential variables:

```env
TAVILY_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
SIGHTENGINE_API_USER=your_user_here
SIGHTENGINE_API_SECRET=your_secret_here
SERPAPI_KEY=your_key_here
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 **Complete File Structure**

```
FACT CHECKER/
├─ app/                                    # Next.js App Router
│  ├─ api/                                # API Routes
│  │  ├─ categories/route.ts             # Dynamic category management
│  │  ├─ factcheck/route.ts              # Mixed-source Bengali fact-check
│  │  ├─ factcheck-domain-first/route.ts # Domain-first gatherer + fallback
│  │  ├─ factcheck-simple/               # Simplified fact-checking
│  │  ├─ gemini-chat/route.ts            # Gemini chat integration
│  │  ├─ gemini-test/                    # Gemini testing endpoints
│  │  ├─ image-check/route.ts            # Sightengine AI image detection
│  │  ├─ mukti-corner/route.ts           # Liberation war AI chat
│  │  ├─ mythbusting/route.ts            # Myth debunking AI chat
│  │  ├─ search/route.ts                 # Priority + general search
│  │  ├─ source-search/route.ts          # Google Lens via SerpAPI
│  │  ├─ tavily-status/route.ts          # Tavily API monitoring
│  │  ├─ test/                           # Testing endpoints
│  │  └─ text-check/route.ts             # Winston AI + fallback
│  ├─ about/page.tsx                     # Project overview page
│  ├─ ai-detector/page.tsx               # AI detection tools
│  ├─ aifactcheck/                       # AI fact-checking interface
│  ├─ domain-first-factcheck/page.tsx    # Advanced fact-checking flow
│  ├─ e-library/page.tsx                 # Digital library interface
│  ├─ fact-checking-verification/page.tsx # Our claim verification
│  ├─ factcheck-detail/page.tsx         # Main fact-checking interface
│  ├─ factcheck-view/                    # User fact-check history
│  │  ├─ [id]/page.tsx                   # Individual report viewer
│  │  └─ page.tsx                        # All reports listing
│  ├─ factchecks/                        # Fact-check library
│  │  ├─ [slug]/page.tsx                 # Individual fact-check pages
│  │  └─ page.tsx                        # Library listing
│  ├─ faq/page.tsx                       # Frequently asked questions
│  ├─ hamburger-test/page.tsx            # UI testing page
│  ├─ image-check/page.tsx               # Image authenticity checker
│  ├─ mukti-corner/page.tsx              # Liberation war chat interface
│  ├─ mythbusting/page.tsx              # Myth debunking interface
│  ├─ page.tsx                           # Homepage
│  ├─ performance-test/page.tsx          # Performance testing
│  ├─ privacy-policy/page.tsx            # Privacy policy
│  ├─ results/page.tsx                   # Search results
│  ├─ source-search/page.tsx             # Reverse image search
│  ├─ terms/page.tsx                     # Terms of service
│  ├─ text-check/page.tsx                # Text analysis tools
│  ├─ tour-fix-test/page.tsx             # Tour testing page
│  ├─ visit-tracking-demo/page.tsx      # Visit tracking demo
│  ├─ fab-test/page.tsx                  # FAB testing page
│  ├─ video-check/                       # Video verification (future)
│  ├─ favicon.ico                        # Site favicon
│  ├─ globals.css                        # Global styles
│  └─ layout.tsx                         # Root layout
├─ components/                           # React Components
│  ├─ AIFactCheckWidget.tsx              # User AI fact-check history widget
│  ├─ DomainFirstFactChecker.tsx         # Domain-first fact-checker
│  ├─ FeatureWidget.tsx                   # Feature promotion widget
│  ├─ Footer.tsx                         # Site footer
│  ├─ MuktiSidebar.tsx                   # Mukti Corner sidebar
│  ├─ MythbustingSidebar.tsx             # Mythbusting sidebar
│  ├─ Navbar.tsx                         # Site navigation
│  ├─ PromotionalWidget.tsx              # Promotional features
│  ├─ RecommendationWidget.tsx           # Article recommendations
│  ├─ SearchBar.tsx                      # Search bar component
│  └─ SiteTour.tsx                       # Interactive site tour
├─ lib/                                  # Utility Libraries
│  ├─ ai-factcheck-utils.ts              # AI fact-check storage utilities
│  ├─ data.ts                            # Fact-check articles and helpers
│  ├─ markdown.ts                        # Markdown parsing and HTML sanitization
│  ├─ tavily-manager.ts                  # Tavily API management
│  ├─ types.ts                           # TypeScript type definitions
│  ├─ utils.ts                           # PRIORITY_SITES, ALLOWED_SITES, helpers
│  └─ visit-tracker.ts                   # Visit tracking system
├─ public/                               # Static Assets
│  ├─ assets/                            # Asset collections
│  │  └─ founders-images/                # Founder photos
│  │      ├─ mahatir.png
│  │      ├─ sagar.png
│  │      └─ tania.png
│  ├─ screenshots/                       # Feature screenshots
│  ├─ thumbnails/                        # Article thumbnails
│  ├─ khoj-cover.png                     # README cover image
│  ├─ khoj-logo.png                      # Main logo
│  ├─ khoj.png                           # Hero image
│  ├─ mukti.png                          # Mukti Corner logo
│  ├─ mythbusting.png                    # Mythbusting logo
│  ├─ mukti-chat-bg-desktop.png          # Desktop background
│  ├─ mukti-chat-bg-mobile.png           # Mobile background
│  ├─ searching.png                      # FAB icon
│  └─ favicon.ico                        # Site favicon
├─ .env.example                          # Environment variables template
├─ .gitignore                            # Git ignore rules
├─ FEATURES.md                           # Feature documentation
├─ next-env.d.ts                         # Next.js type definitions
├─ next.config.js                        # Next.js configuration
├─ nodejs-implementation-example.md      # Implementation examples
├─ package.json                          # Project dependencies
├─ package-lock.json                     # Dependency lock file
├─ postcss.config.js                     # PostCSS configuration
├─ README.md                             # Project documentation
├─ README-Domain-First.md                # Domain-first documentation
├─ tailwind.config.js                    # Tailwind CSS configuration
└─ tsconfig.json                         # TypeScript configuration
```

---

## 🎮 **Available Scripts**

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build optimized production bundle
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Alternative with Yarn
yarn dev             # Start development server
yarn build           # Build for production
yarn start           # Start production server
yarn lint            # Run linting
```

---

## 🏆 **For Hackathon Judges and Evaluators**

### **Quick Demo Setup**

1. Add API keys to `.env.local`
2. Run `npm run dev`
3. Open the homepage and experience the interactive tour

### **Key Features to Test**

- **Bengali Fact-Checking**: Submit claims in Bengali and see AI-generated reports
- **Multimedia Tools**:
  - Image authenticity: `/image-check`
  - Reverse image search: `/source-search`
  - Text analysis: `/text-check` (ai-detection or plagiarism)
- **Specialized Features**:
  - AI fact-check history: Desktop widget or mobile sidebar
  - Mukti Corner: `/mukti-corner` for liberation war topics
  - Mythbusting: `/mythbusting` for myth debunking
  - Article recommendations: Click any fact-check article
- **Advanced Flow**: `/domain-first-factcheck` for experimental features

### **Technical Highlights**

- **Performance**: Optimized with React.memo, useMemo, useCallback
- **Responsive Design**: Flawless mobile and desktop experience
- **AI Integration**: Multiple AI models with intelligent fallback
- **Cultural Sensitivity**: Bengali-first design and functionality

---

## 👥 **Meet the Visionary Team**

- **Mahatir Ahmed Tusher** — Founder, Lead Developer & AI Architect
- **Sagar Chandra Dey** — UI/UX Designer & Frontend Specialist
- **Tania Chaity** — Data Scientist & Research Specialist

**GitHub**: [https://github.com/Mahatir-Ahmed-Tusher/Khoj](https://github.com/Mahatir-Ahmed-Tusher/Khoj)

---

## 🤝 **Contributing to the Future**

We welcome contributions from developers, researchers, and fact-checking enthusiasts worldwide!

### **How to Contribute**

1. **Fork the Repository**

   ```bash
   git clone https://github.com/your-username/Khoj.git
   cd Khoj
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow our coding standards
   - Add tests for new features
   - Update documentation

4. **Commit Your Changes**

   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to Your Branch**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide detailed description
   - Include screenshots if applicable
   - Reference any related issues

### **Contribution Areas**

- **AI Model Integration**: New AI models and fallback strategies
- **Language Support**: Additional Bengali dialects and regional variations
- **UI/UX Improvements**: Enhanced user experience and accessibility
- **Performance Optimization**: Speed and efficiency improvements
- **Documentation**: Better guides and examples
- **Testing**: Comprehensive test coverage
- **Security**: Enhanced security measures

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

### **Technology Partners**

- **Next.js & React**: Modern web development framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript development

### **AI and Search Partners**

- **Tavily**: Advanced search API for reliable information
- **Google Gemini**: Cutting-edge AI model for natural language processing
- **OpenRouter DeepSeek**: High-performance AI model integration
- **GROQ**: Fast inference for AI models

### **Media Analysis Partners**

- **Sightengine**: AI-powered image authenticity detection
- **SerpAPI**: Google Lens integration for reverse image search
- **Winston AI**: Advanced AI detection and plagiarism analysis

### **Typography and Design**

- **Solaiman Lipi**: Beautiful Bengali typography
- **Times Now**: Professional heading font
- **Lucide React**: Consistent iconography

---

## 🌟 **Why Khoj Matters**

Khoj isn't just a fact-checking platform—it's a testament to the power of AI in preserving truth and combating misinformation in the Bengali language. We believe that accurate information should be accessible to everyone, especially in languages that have been historically underserved by technology.

Our mission is to:

- **Combat Misinformation**: Fight against fake news and unverified information
- **Promote Digital Literacy**: Educate users about fact-checking and critical thinking
- **Preserve Cultural Heritage**: Protect Bengali language and cultural context
- **Empower Communities**: Give people tools to verify information independently
- **Advance Technology**: Push the boundaries of AI in non-English languages

**Join us in the fight for truth and accuracy!** 🔍✨

---

## 📞 **Contact and Support**

- **Email**: fact@khoj-bd.com
- **GitHub Issues**: [Report bugs or request features](https://github.com/Mahatir-Ahmed-Tusher/Khoj/issues)
- **Discussions**: [Join our community discussions](https://github.com/Mahatir-Ahmed-Tusher/Khoj/discussions)

---

_Built with ❤️ for the Bengali-speaking community and the global fight against misinformation._
