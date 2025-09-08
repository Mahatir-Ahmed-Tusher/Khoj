import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// Winston AI API function for AI detection
async function checkWithWinstonAI(text: string) {
  try {
    console.log('🤖 Checking with Winston AI...')
    
    const response = await fetch('https://api.gowinston.ai/v2/ai-content-detection', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WINSTON_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        version: "4.9",
        sentences: true,
        language: "auto"
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Winston AI analysis completed')
      return data
    } else {
      console.log(`❌ Winston AI failed with status: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error('❌ Winston AI error:', error)
    return null
  }
}

// Winston AI Plagiarism API function
async function checkWithWinstonPlagiarism(text: string) {
  try {
    console.log('🔍 Checking with Winston Plagiarism API...')
    
    const response = await fetch('https://api.gowinston.ai/v2/plagiarism', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WINSTON_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        language: "en",
        country: "us"
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Winston Plagiarism analysis completed')
      return data
    } else {
      console.log(`❌ Winston Plagiarism failed with status: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error('❌ Winston Plagiarism error:', error)
    return null
  }
}

// Helper function to create model-specific prompts
function createModelSpecificPrompt(text: string, type: string, modelType: 'gemini' | 'openai' | 'deepseek') {
  const baseContent = `
Text to analyze: ${text}
Analysis type: ${type}
`;

  if (modelType === 'deepseek') {
    return `${baseContent}

**CRITICAL INSTRUCTION FOR DEEPSEEK:**
You MUST write an EXTENSIVE, DETAILED, and COMPREHENSIVE analysis. Do NOT be concise or brief. Write as if you are a senior AI researcher writing a detailed technical report. Your analysis should be AT LEAST 1000-1500 words.

আপনি একজন অভিজ্ঞ AI গবেষক এবং টেক্সট বিশ্লেষক। নিম্নলিখিত টেক্সটটি বিশ্লেষণ করে একটি **বিস্তারিত, মানবিক এবং সহজবোধ্য রিপোর্ট** তৈরি করুন:

**গুরুত্বপূর্ণ নির্দেশনা DeepSeek-এর জন্য:**
- আপনি অবশ্যই একটি **বিস্তারিত এবং ব্যাপক বিশ্লেষণ** লিখবেন
- সংক্ষিপ্ত বা সংক্ষেপে লিখবেন না
- কমপক্ষে ১০০০-১৫০০ শব্দের বিশ্লেষণ লিখুন
- প্রতিটি বিষয় বিস্তারিতভাবে ব্যাখ্যা করুন
- উদাহরণ এবং বিশ্লেষণ দিয়ে পূর্ণ করুন
- পাঠক যেন সম্পূর্ণ চিত্র পায় এমনভাবে লিখুন

${type === 'ai-detection' ? `
**AI Detection Analysis:**
আপনার কাজ হল এই টেক্সটটি AI দ্বারা তৈরি হয়েছে কিনা তা নির্ধারণ করা।

**বিশ্লেষণের কাঠামো:**

## টেক্সট বিশ্লেষণ
[টেক্সটের মূল বিষয়বস্তু এবং বৈশিষ্ট্য বিশ্লেষণ করুন]

## AI Detection Result
[AI দ্বারা তৈরি/মানব দ্বারা তৈরি/মিশ্র - স্পষ্টভাবে লিখুন]

## বিস্তারিত বিশ্লেষণ
এই অংশে নিম্নলিখিত বিষয়গুলি অন্তর্ভুক্ত করুন:

**ভাষাগত বৈশিষ্ট্য:**
- বাক্য গঠন এবং ভাষার স্বাভাবিকতা
- শব্দচয়ন এবং অভিব্যক্তি
- লেখার শৈলী এবং প্রবণতা

**বিষয়বস্তু বিশ্লেষণ:**
- তথ্যের গভীরতা এবং বিস্তার
- যুক্তির ধারাবাহিকতা
- সৃজনশীলতা এবং অভিনবত্ব

**AI Indicators:**
- AI লেখার সাধারণ বৈশিষ্ট্যগুলি
- পুনরাবৃত্তিমূলক প্যাটার্ন
- অতিরিক্ত নিখুঁত বা যান্ত্রিক ভাষা

**মানব Indicators:**
- ব্যক্তিগত অভিজ্ঞতা বা আবেগ
- অনিয়মিততা বা ভুল
- প্রাকৃতিক ভাষার বৈচিত্র্য

## আত্মবিশ্বাসের মাত্রা
[উচ্চ/মাঝারি/নিম্ন - কেন এই মাত্রা]

## উপসংহার
- সারসংক্ষেপে মূল সিদ্ধান্ত
- কেন এই সিদ্ধান্তে পৌঁছানো হয়েছে
- বিশ্লেষণের সীমাবদ্ধতা

**গুরুত্বপূর্ণ নির্দেশনা:**
- সবকিছু সহজ, স্পষ্ট এবং মানবিক বাংলায় লিখুন
- জটিল বিষয়গুলি সহজভাবে ব্যাখ্যা করুন
- প্রতিটি ধাপে যুক্তি প্রদান করুন
- উদ্দেশ্যমূলক এবং প্রমাণ-ভিত্তিক হোন
- পাঠক যেন সহজেই বুঝতে পারে এমনভাবে লিখুন
- প্রশ্নোত্তর আকারে বা উদাহরণ দিয়ে জটিল বিষয়গুলি ব্যাখ্যা করুন

**আরও গুরুত্বপূর্ণ: এই বিশ্লেষণটি অবশ্যই বিস্তারিত এবং ব্যাপক হতে হবে। সংক্ষিপ্ত বা সংক্ষেপে লিখবেন না।**

Please provide your analysis in the following JSON format:
{
  "verdict": "ai-generated|human-written|mixed",
  "confidence": "high|medium|low",
  "score": 0.0-1.0,
  "explanation": "বিস্তারিত বাংলা ব্যাখ্যা"
}` : `
**Plagiarism Analysis:**
আপনার কাজ হল এই টেক্সটটি অন্যের লেখা থেকে কপি করা হয়েছে কিনা তা নির্ধারণ করা।

**বিশ্লেষণের কাঠামো:**

## টেক্সট বিশ্লেষণ
[টেক্সটের মূল বিষয়বস্তু এবং বৈশিষ্ট্য বিশ্লেষণ করুন]

## Plagiarism Detection Result
[মূল/অনুলিপি/মিশ্র - স্পষ্টভাবে লিখুন]

## বিস্তারিত বিশ্লেষণ
এই অংশে নিম্নলিখিত বিষয়গুলি অন্তর্ভুক্ত করুন:

**লেখার শৈলী:**
- লেখার স্বাভাবিকতা এবং ধারাবাহিকতা
- ব্যক্তিগত শৈলী এবং অভিব্যক্তি
- ভাষার বৈচিত্র্য এবং সৃজনশীলতা

**বিষয়বস্তু বিশ্লেষণ:**
- তথ্যের উৎস এবং নির্ভরযোগ্যতা
- যুক্তির ধারাবাহিকতা
- অভিনবত্ব এবং সৃজনশীলতা

**Plagiarism Indicators:**
- অনুলিপির সাধারণ বৈশিষ্ট্যগুলি
- অস্বাভাবিক ভাষার পরিবর্তন
- তথ্যের অসামঞ্জস্য

**Originality Indicators:**
- ব্যক্তিগত অভিজ্ঞতা বা মতামত
- প্রাকৃতিক ভাষার প্রবাহ
- সৃজনশীল চিন্তাভাবনা

## আত্মবিশ্বাসের মাত্রা
[উচ্চ/মাঝারি/নিম্ন - কেন এই মাত্রা]

## উপসংহার
- সারসংক্ষেপে মূল সিদ্ধান্ত
- কেন এই সিদ্ধান্তে পৌঁছানো হয়েছে
- বিশ্লেষণের সীমাবদ্ধতা

**গুরুত্বপূর্ণ নির্দেশনা:**
- সবকিছু সহজ, স্পষ্ট এবং মানবিক বাংলায় লিখুন
- জটিল বিষয়গুলি সহজভাবে ব্যাখ্যা করুন
- প্রতিটি ধাপে যুক্তি প্রদান করুন
- উদ্দেশ্যমূলক এবং প্রমাণ-ভিত্তিক হোন
- পাঠক যেন সহজেই বুঝতে পারে এমনভাবে লিখুন
- প্রশ্নোত্তর আকারে বা উদাহরণ দিয়ে জটিল বিষয়গুলি ব্যাখ্যা করুন

**আরও গুরুত্বপূর্ণ: এই বিশ্লেষণটি অবশ্যই বিস্তারিত এবং ব্যাপক হতে হবে। সংক্ষিপ্ত বা সংক্ষেপে লিখবেন না।**

Please provide your analysis in the following JSON format:
{
  "verdict": "original|plagiarized|mixed",
  "confidence": "high|medium|low",
  "score": 0.0-1.0,
  "explanation": "বিস্তারিত বাংলা ব্যাখ্যা"
}`}`;
  }

  // For Gemini and GROQ, use the original prompt
  return `${baseContent}

আপনি একজন অভিজ্ঞ AI গবেষক এবং টেক্সট বিশ্লেষক। নিম্নলিখিত টেক্সটটি বিশ্লেষণ করে একটি বিস্তারিত, মানবিক এবং সহজবোধ্য রিপোর্ট তৈরি করুন:

${type === 'ai-detection' ? `
**AI Detection Analysis:**
আপনার কাজ হল এই টেক্সটটি AI দ্বারা তৈরি হয়েছে কিনা তা নির্ধারণ করা।

Please provide your analysis in the following JSON format:
{
  "verdict": "ai-generated|human-written|mixed",
  "confidence": "high|medium|low",
  "score": 0.0-1.0,
  "explanation": "বিস্তারিত বাংলা ব্যাখ্যা"
}` : `
**Plagiarism Analysis:**
আপনার কাজ হল এই টেক্সটটি অন্যের লেখা থেকে কপি করা হয়েছে কিনা তা নির্ধারণ করা।

Please provide your analysis in the following JSON format:
{
  "verdict": "original|plagiarized|mixed",
  "confidence": "high|medium|low",
  "score": 0.0-1.0,
  "explanation": "বিস্তারিত বাংলা ব্যাখ্যা"
}`}`;
}

// Helper function to generate AI report with three-tier fallback: DeepSeek → Gemini → GROQ
async function generateAIReport(text: string, type: string, maxRetries: number = 3): Promise<string> {
  // Step 1: Try DeepSeek (deepseek-r1-0528:free) first (primary)
  try {
    console.log('🤖 Trying DeepSeek (deepseek-r1-0528:free)...')
    
    const deepseekPrompt = createModelSpecificPrompt(text, type, 'deepseek')
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://khoj-factchecker.vercel.app",
        "X-Title": "Khoj Fact Checker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
          {
            "role": "user",
            "content": deepseekPrompt
          }
        ],
        "max_tokens": 3000,
        "temperature": 0.7,
        "top_p": 0.9,
        "frequency_penalty": 0.1,
        "presence_penalty": 0.1
      })
    });

    if (response.ok) {
      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;
      if (generatedText) {
        console.log('✅ DeepSeek report generated successfully');
        return generatedText;
      }
    } else {
      console.log(`❌ DeepSeek failed with status: ${response.status}`);
    }
  } catch (deepseekError) {
    console.error('❌ DeepSeek error:', deepseekError);
  }

  // Step 2: Fallback to Gemini with retry logic
  console.log('🔄 DeepSeek failed, falling back to Gemini...');
  
  const geminiPrompt = createModelSpecificPrompt(text, type, 'gemini')
  
  // Try main Gemini model first
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Generating AI report with gemini-1.5-pro (attempt ${attempt}/${maxRetries})...`)
      const result = await model.generateContent(geminiPrompt)
      const response = await result.response
      return response.text()
    } catch (geminiError: any) {
      console.error(`❌ Gemini AI error (attempt ${attempt}):`, geminiError)
      
      // Check if it's a rate limit error
      if (geminiError.message && geminiError.message.includes('429')) {
        if (attempt < maxRetries) {
          // Calculate delay with exponential backoff (6s, 12s, 24s)
          const delay = Math.min(6000 * Math.pow(2, attempt - 1), 30000)
          console.log(`⏳ Rate limited. Waiting ${delay/1000}s before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        } else {
          console.log('❌ Max retries reached for rate limit, trying fallback model...')
          break
        }
      }
      
      // For other errors, try fallback model
      break
    }
  }
  
  // Try Gemini fallback model
  try {
    console.log('🔄 Trying fallback model (gemini-1.5-flash)...')
    const result = await fallbackModel.generateContent(geminiPrompt)
    const response = await result.response
    return response.text()
  } catch (fallbackError) {
    console.error('❌ Fallback model also failed:', fallbackError)
  }

  // Step 2: Fallback to GROQ (GPT-OSS-120B)
  try {
    console.log('🔄 Gemini failed, trying GROQ (openai/gpt-oss-120b)...')
    
    const groqPrompt = createModelSpecificPrompt(text, type, 'openai')
    
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": groqPrompt
        }
      ],
      "model": "openai/gpt-oss-120b",
      "temperature": 1,
      "max_tokens": 8192,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;
    if (generatedText) {
      console.log('✅ GROQ report generated successfully');
      return generatedText;
    }
  } catch (groqError) {
    console.error('❌ GROQ error:', groqError);
  }
  
  // Return fallback report if all attempts fail
  return 'AI সিস্টেমে সমস্যার কারণে বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।'
}

export async function POST(request: NextRequest) {
  try {
    const { text, type } = await request.json()

    if (!text || !type) {
      return NextResponse.json({ error: 'Text and type are required' }, { status: 400 })
    }

    // Check minimum character requirements based on type
    if (type === 'ai-detection' && text.length < 300) {
      return NextResponse.json({ error: 'Text must be at least 300 characters long for reliable AI detection' }, { status: 400 })
    }
    
    if (type === 'plagiarism' && text.length < 100) {
      return NextResponse.json({ error: 'Text must be at least 100 characters long for plagiarism detection' }, { status: 400 })
    }

    if (type === 'ai-detection') {
      // Use Winston AI API for AI detection
      const winstonResult = await checkWithWinstonAI(text)
      
      if (winstonResult && winstonResult.status === 200) {
        // Convert Winston score to our format (Winston: 0-100, where higher = more human)
        const humanScore = winstonResult.score
        const aiScore = (100 - humanScore) / 100 // Convert to 0-1 scale where 1 = AI
        
        // Determine verdict based on score
        let verdict = 'human-written'
        let confidence = 'medium'
        
        if (humanScore < 30) {
          verdict = 'ai-generated'
          confidence = 'high'
        } else if (humanScore < 50) {
          verdict = 'ai-generated'
          confidence = 'medium'
        } else if (humanScore < 70) {
          verdict = 'human-written'
          confidence = 'medium'
        } else {
          verdict = 'human-written'
          confidence = 'high'
        }

        // Generate explanation in Bengali
        const explanation = humanScore < 50 
          ? `এই লেখাটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা বেশি (মানুষের লেখার স্কোর: ${humanScore}%)। লেখার শৈলী, বাক্য গঠন এবং শব্দ ব্যবহার AI দ্বারা তৈরি লেখার বৈশিষ্ট্য দেখাচ্ছে।`
          : `এই লেখাটি মানুষের দ্বারা লেখা হওয়ার সম্ভাবনা বেশি (মানুষের লেখার স্কোর: ${humanScore}%)। লেখার শৈলী, বাক্য গঠন এবং শব্দ ব্যবহার মানুষের স্বাভাবিক লেখার বৈশিষ্ট্য দেখাচ্ছে।`

        return NextResponse.json({
          success: true,
          type: 'ai-detection',
          verdict,
          confidence,
          score: aiScore,
          explanation,
          details: {
            humanScore,
            readabilityScore: winstonResult.readability_score,
            creditsUsed: winstonResult.credits_used,
            creditsRemaining: winstonResult.credits_remaining,
            version: winstonResult.version,
            language: winstonResult.language,
            attackDetected: winstonResult.attack_detected
          },
          generatedAt: new Date().toISOString()
        })
      } else {
        // Fallback to AI analysis if Winston fails
        console.log('🔄 Winston AI failed, falling back to AI analysis...')
      }
    } else if (type === 'plagiarism') {
      // Use Winston Plagiarism API for plagiarism detection
      const winstonPlagiarismResult = await checkWithWinstonPlagiarism(text)
      
      if (winstonPlagiarismResult && winstonPlagiarismResult.status === 200) {
        const plagiarismScore = winstonPlagiarismResult.result.score
        const plagiarismPercentage = plagiarismScore / 100 // Convert to 0-1 scale
        
        // Determine verdict based on score
        let verdict = 'original'
        let confidence = 'medium'
        
        if (plagiarismScore > 70) {
          verdict = 'plagiarized'
          confidence = 'high'
        } else if (plagiarismScore > 40) {
          verdict = 'plagiarized'
          confidence = 'medium'
        } else if (plagiarismScore > 20) {
          verdict = 'original'
          confidence = 'medium'
        } else {
          verdict = 'original'
          confidence = 'high'
        }

        // Generate explanation in Bengali
        const explanation = plagiarismScore > 40 
          ? `এই লেখায় প্লেজিয়ারিজম সনাক্ত হয়েছে (প্লেজিয়ারিজম স্কোর: ${plagiarismScore}%)। ${winstonPlagiarismResult.result.sourceCounts}টি উৎসে মিল পাওয়া গেছে। মোট ${winstonPlagiarismResult.result.totalPlagiarismWords}টি শব্দ প্লেজিয়ারাইজড।`
          : `এই লেখাটি মূল বলে মনে হচ্ছে (প্লেজিয়ারিজম স্কোর: ${plagiarismScore}%)। লেখায় উল্লেখযোগ্য প্লেজিয়ারিজম সনাক্ত হয়নি।`

        return NextResponse.json({
          success: true,
          type: 'plagiarism',
          verdict,
          confidence,
          score: plagiarismPercentage,
          explanation,
          details: {
            plagiarismScore,
            sourceCounts: winstonPlagiarismResult.result.sourceCounts,
            textWordCounts: winstonPlagiarismResult.result.textWordCounts,
            totalPlagiarismWords: winstonPlagiarismResult.result.totalPlagiarismWords,
            identicalWordCounts: winstonPlagiarismResult.result.identicalWordCounts,
            similarWordCounts: winstonPlagiarismResult.result.similarWordCounts,
            sources: winstonPlagiarismResult.sources,
            attackDetected: winstonPlagiarismResult.attackDetected,
            creditsUsed: winstonPlagiarismResult.credits_used,
            creditsRemaining: winstonPlagiarismResult.credits_remaining
          },
          generatedAt: new Date().toISOString()
        })
      } else {
        // Fallback to AI analysis if Winston Plagiarism fails
        console.log('🔄 Winston Plagiarism failed, falling back to AI analysis...')
      }
    }

    // For fallback cases, use the existing AI analysis
    let contentForAI = ''
    let expectedResponseFormat = ''

    if (type === 'plagiarism') {
      contentForAI = `
Text to analyze for plagiarism:
"${text}"

Please analyze this text and determine if it appears to be plagiarized or original. Consider:
- Unusual word choices or phrases
- Inconsistent writing style
- Sudden changes in tone or complexity
- Repetitive patterns
- Contextual coherence

Provide your analysis in the following JSON format:
{
  "verdict": "plagiarized" or "original",
  "confidence": "high", "medium", or "low",
  "score": 0.0 to 1.0 (where 1.0 = definitely plagiarized, 0.0 = definitely original),
  "explanation": "Detailed explanation in Bengali"
}
`
      expectedResponseFormat = 'JSON with verdict, confidence, score, and explanation'
    } else if (type === 'ai-detection') {
      // Fallback AI analysis for AI detection
      contentForAI = `
Text to analyze for AI generation:
"${text}"

Please analyze this text and determine if it was likely written by AI or a human. Consider:
- Writing style and patterns
- Vocabulary usage
- Sentence structure
- Repetition patterns
- Creativity and originality
- Contextual understanding

Provide your analysis in the following JSON format:
{
  "verdict": "ai-generated" or "human-written",
  "confidence": "high", "medium", or "low",
  "score": 0.0 to 1.0 (where 1.0 = definitely AI, 0.0 = definitely human),
  "explanation": "Detailed explanation in Bengali"
}
`
      expectedResponseFormat = 'JSON with verdict, confidence, score, and explanation'
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be "ai-detection" or "plagiarism"' }, { status: 400 })
    }

    // Generate analysis with AI
    const aiResponse = await generateAIReport(text, type)
    
    // Try to parse JSON response
    let result
    try {
      // Extract JSON from response if it's wrapped in other text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      
      // Fallback response
      result = {
        verdict: 'unverified',
        confidence: 'low',
        score: 0.5,
        explanation: 'AI সিস্টেমে সমস্যার কারণে বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।'
      }
    }

    return NextResponse.json({
      success: true,
      type,
      verdict: result.verdict || 'unverified',
      confidence: result.confidence || 'low',
      score: result.score || 0.5,
      explanation: result.explanation || 'বিশ্লেষণ সম্পন্ন করা যায়নি।',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Text check error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    )
  }
}
