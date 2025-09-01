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

// Helper function to generate AI report with three-tier fallback: DeepSeek → Gemini → GROQ
async function generateAIReport(contentForAI: string, maxRetries: number = 3): Promise<string> {
  // Step 1: Try DeepSeek (deepseek-r1-0528:free) first (primary)
  try {
    console.log('🤖 Trying DeepSeek (deepseek-r1-0528:free)...')
    
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
            "content": contentForAI
          }
        ],
        "max_tokens": 2000,
        "temperature": 0.3
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
  
  // Try main Gemini model first
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Generating AI report with gemini-1.5-pro (attempt ${attempt}/${maxRetries})...`)
      const result = await model.generateContent(contentForAI)
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
    const result = await fallbackModel.generateContent(contentForAI)
    const response = await result.response
    return response.text()
  } catch (fallbackError) {
    console.error('❌ Fallback model also failed:', fallbackError)
  }

  // Step 3: Try GROQ (GPT-OSS-20B) as final fallback
  try {
    console.log('🔄 Gemini failed, trying GROQ (openai/gpt-oss-20b)...')
    
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": contentForAI
        }
      ],
      "model": "openai/gpt-oss-20b",
      "temperature": 0.3,
      "max_tokens": 2000,
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
    const aiResponse = await generateAIReport(contentForAI)
    
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
