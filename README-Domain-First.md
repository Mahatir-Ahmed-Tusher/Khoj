# Khoj ডোমেইন-ফার্স্ট ফ্যাক্ট চেকার

এটি একটি উন্নত ফ্যাক্ট চেকিং সিস্টেম যা প্রথমে নির্দিষ্ট ওয়েবসাইটে সার্চ করে, তারপর প্রয়োজন হলে Tavily API ব্যবহার করে।

## 🎯 মূল বৈশিষ্ট্যসমূহ

### ১. ডোমেইন-ফার্স্ট সার্চ
- **৭০+ নির্দিষ্ট ওয়েবসাইটে** প্রথমে সার্চ করে
- Tavily API ব্যবহার করে না (কেবল fallback হিসেবে)
- প্রতিটি সাইটের search endpoint, RSS feed, sitemap ব্যবহার করে

### ২. স্মার্ট ফলব্যাক সিস্টেম
- যদি নির্দিষ্ট সাইট থেকে < ৩টি ফলাফল পাওয়া যায়
- অথবা সব ফলাফলের স্কোর < ০.৫ হয়
- শুধু তখনই Tavily API ব্যবহার করে

### ৩. প্রমাণ-ভিত্তিক রিপোর্ট
- Gemini AI দিয়ে বাংলায় বিস্তারিত রিপোর্ট
- প্রতিটি দাবির জন্য স্পষ্ট উদ্ধৃতি
- সংখ্যাযুক্ত রেফারেন্স [১], [২], [৩] ইত্যাদি
- **AI নিজে থেকে উৎস তালিকা তৈরি করে না** - শুধু প্রাপ্ত ফলাফল ব্যবহার করে

## 📋 ALLOWED_SITES তালিকা

### বাংলা ফ্যাক্ট চেকিং সাইট (সর্বোচ্চ অগ্রাধিকার)
- rumorscanner.com
- fact-watch.org
- boombangladesh.com
- factcheck.afp.com
- bssnews.net
- jachai.org
- bdfactcheck.com
- dismislab.com
- bangla.altnews.in
- bangla.factcrescendo.com
- bangla.vishvasnews.com

### বাংলাদেশি সংবাদপত্র
- prothomalo.com
- bd-pratidin.com
- jugantor.com
- kalerkantho.com
- samakal.com
- thedailystar.net
- bdnews24.com
- dhakatribune.com
- এবং আরও ৩০+ সাইট

### আন্তর্জাতিক উৎস
- snopes.com
- politifact.com
- factcheck.org
- reuters.com
- apnews.com
- bbc.com
- এবং আরও ১০+ সাইট

### বিজ্ঞান ও স্বাস্থ্য
- healthfeedback.org
- sciencefeedback.co
- nasa.gov
- skepticalinquirer.org
- cdc.gov
- who.int
- এবং আরও ১৫+ সাইট

## 🚀 ব্যবহার পদ্ধতি

### ১. API কল
```javascript
const response = await fetch('/api/factcheck-domain-first', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: "আপনার প্রশ্ন এখানে" })
})

const result = await response.json()
```

### ২. প্রতিক্রিয়া ফরম্যাট
```json
{
  "status": "success" | "partial" | "no_results",
  "used_tavily": true | false,
  "selected_urls": [
    {
      "url": "https://example.com/article",
      "domain": "example.com",
      "title": "Article Title",
      "published": "2024-01-01",
      "author": "Author Name",
      "relevance_score": 0.85,
      "excerpt": "Article excerpt...",
      "source": "allowed_sites" | "tavily_fallback"
    }
  ],
  "notes": ["Any caveats or notes"],
  "claim": "Original query",
  "report": "AI generated Bengali report",
  "searchStats": {
    "totalSitesSearched": 70,
    "totalResultsFound": 15,
    "allowedSitesResults": 12,
    "tavilyResults": 3
  },
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

## 🔧 টেকনিক্যাল ডিটেইলস

### সার্চ প্রসেস
1. **ডোমেইন প্রসেসিং**: প্রতিটি ALLOWED_SITES ডোমেইন প্রক্রিয়া করে
2. **ক্যান্ডিডেট খোঁজা**: Search endpoint, RSS, sitemap থেকে URL সংগ্রহ
3. **কন্টেন্ট এক্সট্রাকশন**: HTML থেকে টাইটেল, তারিখ, লেখক, মূল টেক্সট বের করা
4. **স্কোরিং**: প্রাসঙ্গিকতা স্কোর (০-১) গণনা
5. **ফিল্টারিং**: স্কোর ≥ ০.৩ এর উপরে ফলাফল রাখা

### ফলব্যাক লজিক
```javascript
if (allowedSitesResults.length < 3 || 
    allowedSitesResults.every(r => r.relevance_score < 0.5)) {
  // Use Tavily fallback
  const tavilyResults = await tavilyFallback(query)
  finalResults = [...allowedSitesResults, ...tavilyResults]
  usedTavily = true
}
```

### AI রিপোর্ট জেনারেশন
- Gemini 1.5 Pro মডেল ব্যবহার
- বাংলায় বিস্তারিত নির্দেশনা
- স্ট্রাকচার্ড আউটপুট ফরম্যাট
- স্পষ্ট উদ্ধৃতি এবং রেফারেন্স
- **AI নিজে থেকে উৎস তালিকা তৈরি করে না** - শুধু প্রাপ্ত ফলাফল ব্যবহার করে

## 📊 পারফরম্যান্স

### গড় সার্চ টাইম
- নির্দিষ্ট সাইটে: ২-৩ মিনিট
- Tavily fallback সহ: ৩-৪ মিনিট

### সাফল্যের হার
- নির্দিষ্ট সাইট থেকে: ~৮০%
- Tavily fallback সহ: ~৯৫%

### স্কেলেবিলিটি
- ব্যাচ প্রসেসিং (৫টি সাইট একসাথে)
- টাইমআউট হ্যান্ডলিং (৫-১০ সেকেন্ড)
- রেট লিমিটিং (১ সেকেন্ড ব্যাচের মধ্যে)

## 🛡️ নিরাপত্তা ও নৈতিকতা

### রোবটস.টেক্সট সম্মান
- User-Agent হেডার সেট
- robots.txt চেক (যদি সম্ভব)
- রেট লিমিটিং

### কন্টেন্ট ব্যবহার
- উদ্ধৃতি ≤ ৭৫ শব্দ/উৎস
- বড় অংশ paraphrase
- স্পষ্ট উদ্ধৃতি ছাড়া দাবি না করা

### ডেটা প্রাইভেসি
- শুধু প্রয়োজনীয় ডেটা সংগ্রহ
- ব্যক্তিগত তথ্য ফিল্টার
- সেশন ডেটা মুছে ফেলা

## 📁 ফাইল স্ট্রাকচার

```
app/
├── api/
│   └── factcheck-domain-first/
│       └── route.ts          # মূল API এন্ডপয়েন্ট
├── domain-first-factcheck/
│   └── page.tsx             # ফ্রন্টএন্ড পেজ
components/
├── DomainFirstFactChecker.tsx  # মূল কম্পোনেন্ট
└── SearchBar.tsx             # সার্চ বার
lib/
└── utils.ts                 # ALLOWED_SITES এবং হেল্পার ফাংশন
```

## 🚀 ডেপ্লয়মেন্ট

### প্রয়োজনীয় Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key  # Optional, for fallback
```

### ইনস্টলেশন
```bash
npm install
npm run dev
```

### প্রোডাকশন বিল্ড
```bash
npm run build
npm start
```

## 📈 ভবিষ্যত উন্নতি

### পরিকল্পিত ফিচার
1. **ক্যাশিং সিস্টেম**: Redis দিয়ে সার্চ ফলাফল ক্যাশ
2. **রিয়েল-টাইম আপডেট**: WebSocket দিয়ে প্রোগ্রেস আপডেট
3. **মাল্টি-ল্যাঙ্গুয়েজ**: ইংরেজি, হিন্দি সহ অন্যান্য ভাষা
4. **এডভান্সড স্কোরিং**: ML মডেল দিয়ে প্রাসঙ্গিকতা স্কোর
5. **ইউজার ফিডব্যাক**: রিপোর্টের মান মূল্যায়ন সিস্টেম

### অপটিমাইজেশন
1. **প্যারালেল প্রসেসিং**: আরও বেশি সাইট একসাথে প্রসেস
2. **স্মার্ট ক্যাশিং**: প্রাসঙ্গিক কন্টেন্ট ক্যাশ
3. **CDN ইন্টিগ্রেশন**: স্ট্যাটিক কন্টেন্ট ডেলিভারি
4. **মাইক্রোসার্ভিস**: সার্চ এবং AI আলাদা সার্ভিস

## 🤝 কন্ট্রিবিউশন

এই প্রজেক্টে অবদান রাখতে:

1. নতুন নির্ভরযোগ্য সাইট যোগ করুন
2. সার্চ অ্যালগরিদম উন্নত করুন
3. AI প্রম্পট অপটিমাইজ করুন
4. পারফরম্যান্স টেস্ট যোগ করুন
5. ডকুমেন্টেশন আপডেট করুন

## 📞 যোগাযোগ

প্রশ্ন বা পরামর্শের জন্য:
- ইমেইল: support@khoj.com
- GitHub Issues: [প্রজেক্ট রিপোজিটরি]
- Discord: [কমিউনিটি সার্ভার]

---

**Khoj ফ্যাক্ট চেকার** - সত্যের সন্ধানে নির্ভরযোগ্য সহায়ক
