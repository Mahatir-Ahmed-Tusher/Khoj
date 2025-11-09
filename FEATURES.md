# খোঁজ (Khoj) - Complete Feature Documentation

## 🚀 Platform Overview

**খোঁজ** is a comprehensive AI-powered fact-checking platform specifically designed for Bengali content. It combines advanced AI technologies with user-friendly interfaces to combat misinformation and promote digital literacy in Bangladesh.

---

## 📋 Feature Catalog

### 1. **Fact-Checking Articles System**

- **Bengali Content**: All articles written in authentic Bengali
- **Verdict Categories**:
  - ✅ সত্য (True) - Verified factual claims
  - ❌ অসত্য (False) - Debunked false claims
  - ⚠️ ভ্রান্তিমূলক (Misleading) - Partially true but misleading
  - 🔍 খন্ডন (Debunk) - Exposed misinformation
  - ❓ অযাচাইকৃত (Unverified) - Pending verification
- **Rich Media**: Images, videos, and interactive elements
- **Markdown Support**: Proper formatting with headers, lists, links
- **Search & Filter**: Advanced filtering by category and search terms
- **Responsive Design**: Mobile-optimized interface

### 2. **AI Text Analysis Tools**

- **Winston AI Integration**: Professional-grade text analysis
- **AI Detection**: Identifies AI-generated vs human-written content
- **Plagiarism Checker**: Scans for duplicate content across the web
- **Detailed Metrics**:
  - Human score percentage
  - Readability analysis
  - Attack detection
  - Source identification
  - Word-level analysis
- **Bengali Interface**: User-friendly Bengali language support
- **Export Options**: Copy to clipboard and download functionality

### 3. **Reverse Media Search**

- **Image Search**: Google Lens integration via SerpAPI
- **File Upload**: Drag-and-drop interface for multiple formats
- **Real Results**: Actual search results with similarity scores
- **Progress Tracking**: Real-time upload and search indicators
- **File Preview**: Image preview before processing
- **Future Expansion**: Audio and video search capabilities

### 4. **Khoj Chat - AI Assistant**

- **Intelligent Q&A**: AI-powered question answering system
- **Dual Mode Operation**:
  - **Fact-Check Mode**: Professional fact-checking with source citations
  - **General Mode**: Conversational AI for general questions
- **GROQ Integration**: Fast inference using GPT-OSS-20B model
- **Tavily Search**: Real-time web search for current information
- **Source Citations**: Numbered references [1], [2], [3] with proper attribution
- **Bengali Interface**: Native Bengali language support
- **Professional Formatting**: Structured responses with clear sections
- **Search Integration**: Prioritizes Bangladeshi news sources
- **Export Options**: Copy responses and download functionality

### 5. **Mukti Corner - Liberation War Engine**

- **Specialized Knowledge**: Focused on Bangladesh Liberation War 1971
- **Python Backend**: Advanced RAG (Retrieval-Augmented Generation)
- **Knowledge Categories**:
  - একাত্তোর (General History)
  - গণহত্যা (Genocide) with statistical and historical subcategories
  - ধর্ষণ (War Crimes)
  - মুক্তিবাহিনী (Freedom Fighters)
  - আন্তর্জাতিক প্রতিক্রিয়া (International Response)
  - নেতৃবৃন্দ (Key Leaders)
- **FAISS Database**: Efficient vector-based document retrieval
- **Gemini AI**: Advanced AI responses with source citations
- **Document Sources**:
  - Srinath Raghavan's comprehensive history
  - War crime documentation
  - Statistical analysis of casualties
- **Export Features**: Copy and download responses

### 6. **User Interface & Experience**

- **Bengali Typography**: Solaiman Lipi font for authentic experience
- **Color Theme**: Red and green representing Bangladesh flag
- **Responsive Layout**: Works on all devices and screen sizes
- **Interactive Elements**: Smooth animations and hover effects
- **Loading States**: Professional progress indicators
- **Error Handling**: User-friendly Bengali error messages

---

## 🛠️ Technical Specifications

### Frontend Architecture

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for rapid development
- **Icons**: Lucide React for modern iconography
- **State Management**: React hooks and context
- **File Handling**: Drag-and-drop upload functionality

### Backend Services

- **Next.js API Routes**: Serverless API endpoints
- **Python FastAPI**: Advanced backend for Mukti Corner
- **External Integrations**:
  - Winston AI for text analysis
  - SerpAPI for search functionality
  - Imgur API for image hosting
  - Google Gemini for AI responses

### Data Management

- **Static Content**: JSON-based article storage
- **Markdown Processing**: Custom parser with HTML sanitization
- **File Validation**: Server-side file processing
- **Environment Security**: Protected API key management

---

## 📱 Application Pages

### Core Pages

1. **Homepage** (`/`) - Landing with featured fact-checks
2. **About Us** (`/about`) - Team and platform information
3. **Fact Checks** (`/factchecks`) - Complete article listing
4. **Article Detail** (`/factchecks/[slug]`) - Individual fact-check reports
5. **Text Check** (`/text-check`) - AI detection and plagiarism tool
6. **Source Search** (`/source-search`) - Reverse media search
7. **Mukti Corner** (`/mukti-corner`) - Liberation War search engine

### Navigation Features

- **Responsive Navbar**: Logo, navigation links, mobile menu
- **Footer**: Quick links, social media, contact info
- **Search Integration**: Global search functionality
- **Breadcrumbs**: Clear navigation hierarchy

---

## 🔒 Security & Performance

### Security Measures

- **API Protection**: Environment variable security
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error management
- **Data Sanitization**: HTML sanitization for user content

### Performance Optimization

- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Strategic caching implementation

---

## 🌐 Multilingual & Accessibility

### Language Support

- **Primary**: Bengali (বাংলা) throughout the platform
- **Secondary**: English for technical terms
- **Font Optimization**: Bengali-specific typography
- **RTL Support**: Right-to-left text where needed

### Accessibility Features

- **Alt Text**: All images have descriptive alt text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader**: Compatible with screen readers
- **Color Contrast**: High contrast for readability

---

## 📊 Content Management

### Article Structure

- **Categories**: Organized content classification
- **Tags**: Flexible tagging system
- **References**: Hyperlinked sources and citations
- **Media Library**: Organized image and video assets
- **Version Control**: Git-based content management

### Editorial Features

- **Rich Text Editor**: Markdown-based content creation
- **Media Upload**: Easy image and video upload
- **Preview Mode**: Real-time content preview
- **Publishing Workflow**: Draft and publish system

---

## 🚀 Deployment & Hosting

### Production Ready

- **Vercel Optimized**: Ready for Vercel deployment
- **Environment Setup**: Easy configuration management
- **Build Optimization**: Production-ready builds
- **SEO Ready**: Meta tags and structured data

### Scalability

- **CDN Integration**: Global content delivery
- **Database Ready**: Prepared for database integration
- **API Scaling**: Designed for high traffic
- **Monitoring**: Built-in performance monitoring

---

## 📈 Future Roadmap

### Planned Features

- **Audio/Video Search**: Complete multimedia search
- **User Authentication**: User accounts and profiles
- **Community Features**: User submissions and voting
- **Mobile App**: Native mobile application
- **API Documentation**: Comprehensive API docs
- **Analytics Dashboard**: Content performance tracking

### Technical Enhancements

- **Real-time Updates**: Live content updates
- **Advanced AI**: More sophisticated AI models
- **Machine Learning**: Predictive fact-checking
- **Blockchain**: Immutable fact-check records

---

## 🛠️ Installation Guide

### Prerequisites

- Node.js 18 or higher
- Python 3.8 or higher
- npm or yarn package manager

### Quick Start

```bash
# Clone repository
git clone [repository-url]
cd khoj-fact-checker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# For Mukti Corner backend
cd backend/Mukti-Corner
pip install -r requirements.txt
python server.py
```

### Environment Variables

```env
# Required API Keys
WINSTON_TOKEN=your_winston_api_key
SERPAPI_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY_2=your_second_gemini_key

# Optional Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🤝 Contributing

### Development Guidelines

- Follow TypeScript best practices
- Use Bengali for user-facing content
- Maintain responsive design principles
- Write comprehensive tests
- Document new features

### Community Standards

- Respectful communication
- Fact-based discussions
- Constructive feedback
- Inclusive development

---

## 📄 License & Legal

### License

This project is licensed under the MIT License.

### Legal Compliance

- GDPR compliant data handling
- Copyright protection
- Fair use guidelines
- Source attribution requirements

---

## 🏆 Acknowledgments

### Team Members

- **Mahatir Ahmed Tusher** - Founder & Lead Developer
- **Sagar Chandra Dey** - UI/UX Designer
- **Tania Chaity** - Content Researcher

### Technology Partners

- Winston AI for text analysis
- Google Gemini for AI responses
- SerpAPI for search functionality
- Imgur for media hosting

---

**খোঁজ** - Empowering truth through technology 🇧🇩

_Building a more informed and fact-checked digital Bangladesh_
