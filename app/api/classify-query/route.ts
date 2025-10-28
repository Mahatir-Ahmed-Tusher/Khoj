import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// Define the expected classification result type
interface ClassificationResult {
  type: 'mythbusting' | 'factcheck' | 'url'
  confidence: number
  reasoning: string
}

/**
 * API endpoint for intelligent query classification.
 * Classifies incoming queries into one of three types:
 * - "mythbusting": General beliefs, pseudoscience, folklore, common misconceptions
 * - "factcheck": Specific events, news claims, factual statements about real incidents
 * - "url": URL-based verification
 */

export async function POST(request: NextRequest) {
  let query: string = ''
  
  try {
    const body = await request.json()
    query = body.query

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Valid query is required' }, { status: 400 })
    }

    console.log('🔍 Classifying query:', query)

    // Quick check: if it's a URL, return url type immediately
    // Use strict URL detection - must have protocol or clear URL pattern
    const isUrlQuery = isUrl(query.trim())
    console.log('URL detection result:', isUrlQuery)

    if (isUrlQuery) {
      console.log('✅ Classified as URL')
      return NextResponse.json({
        type: 'url',
        confidence: 1.0,
        reasoning: 'Input is a valid URL'
      })
    }

    console.log('❌ Not a URL, proceeding with AI classification...')

    // Try Groq first (primary) - fast classification
    const groqApiKey = process.env.GROQ_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY
    
    if (groqApiKey) {
      try {
        console.log('🚀 Using Groq GPT-OSS-120B for fast classification...')
        const groqClient = new Groq({ apiKey: groqApiKey })
        
        const prompt = `You are an intelligent query classification system. Your task is to analyze a user's query and determine if it is a "mythbusting" query or a "factcheck" query.

**Definition of Query Types:**
- **mythbusting:** The user is asking to verify a general belief, common misconception, pseudoscience, folklore, or a scientific explanation that is often misunderstood. These queries often ask "if something is true" or "how something works" in a general sense.
  *   Example: "দুধ আর আনারস খেলে কি বিষক্রিয়া হয়?" (Does eating milk and pineapple cause poisoning?)
  *   Example: "ভূত আছে কি নাই?" (Are there ghosts?)
  *   Example: "অ্যাস্ট্রোলজি কি সত্য?" (Is astrology true?)
  *   Example: "৫জি নেটওয়ার্ক ক্ষতিকর?" (Is 5G network harmful?)

- **factcheck:** The user is asking to verify a specific event, a news claim, a statement about a real incident, or a claim involving specific people, dates, or locations. These queries are about concrete, verifiable occurrences.
  *   Example: "দুধ আর আনারস খাওয়ায় ড মুহম্মদ ইউনুস বিষক্রিয়ায় মারা গেলেন" (Dr. Muhammad Yunus died of poisoning after eating milk and pineapple)
  *   Example: "প্রধানমন্ত্রী শেখ হাসিনা আজ একটি নতুন প্রকল্প ঘোষণা করেছেন" (Prime Minister Sheikh Hasina announced a new project today)
  *   Example: "২০২৩ সালের বন্যায় সিলেট ডুবে গিয়েছিল" (Sylhet was submerged in the 2023 flood)

**Instructions:**
1. Analyze the user's query carefully.
2. Determine if it fits the "mythbusting" or "factcheck" definition.
3. Provide a 'type' (either 'mythbusting' or 'factcheck'), a 'confidence' score (0.0 to 1.0), and a brief 'reasoning' for your classification.
4. The output MUST be a JSON object.

**Output Format:**
\`\`\`json
{
  "type": "mythbusting" | "factcheck",
  "confidence": number,
  "reasoning": string
}
\`\`\`

**Query to classify:** "${query}"

**Begin Classification Output:**`

        const completion = await groqClient.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 1,
          max_tokens: 8192,
          top_p: 1
        })
        
        const text = completion.choices[0]?.message?.content || ''
        console.log('Groq raw response:', text)

        // Attempt to parse the JSON response
        let classification: ClassificationResult
        try {
          classification = JSON.parse(text)
          // Validate the parsed structure
          if (!['mythbusting', 'factcheck'].includes(classification.type) ||
              typeof classification.confidence !== 'number' ||
              typeof classification.reasoning !== 'string') {
            throw new Error('Invalid AI response structure')
          }
          console.log('✅ Groq Classified:', classification)
          return NextResponse.json(classification)
        } catch (parseError) {
          console.error('Failed to parse Groq response as JSON:', parseError)
          console.log('Falling back to basic classification due to Groq response parsing error.')
          return NextResponse.json(basicClassification(query), { status: 200 })
        }
      } catch (groqError) {
        console.error('Groq classification failed:', groqError)
        console.log('Groq failed, trying Gemini fallback...')
      }
    }

    // Fallback to Gemini if Groq fails or not available
    if (geminiApiKey) {
      try {
        console.log('🔄 Using Gemini as fallback for classification...')
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `You are an intelligent query classification system. Your task is to analyze a user's query and determine if it is a "mythbusting" query or a "factcheck" query.

**Definition of Query Types:**
- **mythbusting:** The user is asking to verify a general belief, common misconception, pseudoscience, folklore, or a scientific explanation that is often misunderstood. These queries often ask "if something is true" or "how something works" in a general sense.
  *   Example: "দুধ আর আনারস খেলে কি বিষক্রিয়া হয়?" (Does eating milk and pineapple cause poisoning?)
  *   Example: "ভূত আছে কি নাই?" (Are there ghosts?)
  *   Example: "অ্যাস্ট্রোলজি কি সত্য?" (Is astrology true?)
  *   Example: "৫জি নেটওয়ার্ক ক্ষতিকর?" (Is 5G network harmful?)

- **factcheck:** The user is asking to verify a specific event, a news claim, a statement about a real incident, or a claim involving specific people, dates, or locations. These queries are about concrete, verifiable occurrences.
  *   Example: "দুধ আর আনারস খাওয়ায় ড মুহম্মদ ইউনুস বিষক্রিয়ায় মারা গেলেন" (Dr. Muhammad Yunus died of poisoning after eating milk and pineapple)
  *   Example: "প্রধানমন্ত্রী শেখ হাসিনা আজ একটি নতুন প্রকল্প ঘোষণা করেছেন" (Prime Minister Sheikh Hasina announced a new project today)
  *   Example: "২০২৩ সালের বন্যায় সিলেট ডুবে গিয়েছিল" (Sylhet was submerged in the 2023 flood)

**Instructions:**
1. Analyze the user's query carefully.
2. Determine if it fits the "mythbusting" or "factcheck" definition.
3. Provide a 'type' (either 'mythbusting' or 'factcheck'), a 'confidence' score (0.0 to 1.0), and a brief 'reasoning' for your classification.
4. The output MUST be a JSON object.

**Output Format:**
\`\`\`json
{
  "type": "mythbusting" | "factcheck",
  "confidence": number,
  "reasoning": string
}
\`\`\`

**Query to classify:** "${query}"

**Begin Classification Output:**`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()

        console.log('Gemini raw response:', text)

        // Attempt to parse the JSON response
        let classification: ClassificationResult
        try {
          classification = JSON.parse(text)
          // Validate the parsed structure
          if (!['mythbusting', 'factcheck'].includes(classification.type) ||
              typeof classification.confidence !== 'number' ||
              typeof classification.reasoning !== 'string') {
            throw new Error('Invalid AI response structure')
          }
          console.log('✅ Gemini Classified:', classification)
          return NextResponse.json(classification)
        } catch (parseError) {
          console.error('Failed to parse Gemini response as JSON:', parseError)
          console.log('Falling back to basic classification due to Gemini response parsing error.')
          return NextResponse.json(basicClassification(query), { status: 200 })
        }
      } catch (geminiError) {
        console.error('Gemini classification failed:', geminiError)
        console.log('Both AI models failed, using basic classification.')
        return NextResponse.json(basicClassification(query), { status: 200 })
      }
    } else {
      console.log('No AI API keys available, using basic classification.')
      return NextResponse.json(basicClassification(query), { status: 200 })
    }

  } catch (error) {
    console.error('Error in query classification API:', error)
    // Fallback to basic classification on any API error
    if (query) {
      return NextResponse.json(basicClassification(query), { status: 200 })
    } else {
      return NextResponse.json({ error: 'Failed to process query' }, { status: 500 })
    }
  }
}

/**
 * Basic rule-based classification as fallback
 */
function basicClassification(query: string): ClassificationResult {
  const lowerQuery = query.toLowerCase()

  // Mythbusting indicators
  const mythIndicators = [
    'কি সত্য', 'কি হয়', 'আসলে কি', 'সত্যি কি', 'কেন হয়',
    'is it true', 'does it', 'can it', 'will it', 'should i',
    'ভূত', 'জিন', 'অ্যাস্ট্রোলজি', 'হোমিওপ্যাথি', '৫জি', '5g'
  ]

  // Factcheck indicators (specific events, actions)
  const factcheckIndicators = [
    'মারা গেলেন', 'ঘোষণা করেছেন', 'বলেছেন', 'করেছেন', 'হয়েছে',
    'announced', 'declared', 'said', 'did', 'happened', 'resigned'
  ]

  let mythScore = 0
  let factcheckScore = 0

  // Check for question words (usually mythbusting)
  if (lowerQuery.includes('কি') || lowerQuery.includes('কেন') ||
      lowerQuery.includes('?') || lowerQuery.includes('how') ||
      lowerQuery.includes('why') || lowerQuery.includes('what')) {
    mythScore += 0.3
  }

  mythIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      mythScore += 0.2
    }
  })

  factcheckIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      factcheckScore += 0.25
    }
  })

  if (factcheckScore > mythScore) {
    return {
      type: 'factcheck',
      confidence: Math.min(factcheckScore, 0.75),
      reasoning: 'Query appears to be about a specific event (basic heuristic)'
    }
  } else {
    return {
      type: 'mythbusting',
      confidence: Math.min(Math.max(mythScore, 0.6), 0.75),
      reasoning: 'Query appears to be about a general belief (basic heuristic)'
    }
  }
}

// Strict URL detection helper (duplicated from lib/utils.ts for API self-containment)
function isUrl(text: string): boolean {
  if (!text || typeof text !== 'string') return false

  const trimmedText = text.trim()

  // If it has spaces, it's definitely not a URL
  if (trimmedText.includes(' ')) {
    console.log('✗ Contains spaces, not a URL:', trimmedText.substring(0, 50))
    return false
  }

  // First, check if it has a protocol (http:// or https://)
  const hasProtocol = /^https?:\/\//i.test(trimmedText)

  if (hasProtocol) {
    try {
      new URL(trimmedText)
      console.log('✓ URL with protocol detected:', trimmedText.substring(0, 50))
      return true
    } catch {
      console.log('✗ Invalid URL despite protocol:', trimmedText.substring(0, 50))
      return false
    }
  }

  // Check if it looks like a domain without protocol (e.g., "example.com" or "www.example.com")
  // Must have at least one dot and look like a domain
  const domainPattern = /^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/
  if (domainPattern.test(trimmedText)) {
    try {
      new URL(`https://${trimmedText}`)
      console.log('✓ Domain without protocol detected:', trimmedText.substring(0, 50))
      return true
    } catch {
      console.log('✗ Invalid domain format:', trimmedText.substring(0, 50))
      return false
    }
  }

  // Check for clear URL indicators (must have domain + path)
  const hasValidDomain = /[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(trimmedText)
  const hasPath = /\/[a-zA-Z0-9-_\/]+/i.test(trimmedText)

  if (hasValidDomain && hasPath) {
    try {
      new URL(`https://${trimmedText}`)
      console.log('✓ URL pattern detected:', trimmedText.substring(0, 50))
      return true
    } catch {
      console.log('✗ Failed URL validation:', trimmedText.substring(0, 50))
      return false
    }
  }

  console.log('✗ Not a URL (natural language text):', trimmedText.substring(0, 50))
  return false
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'Query Classification API is active',
    message: 'Use POST method with query parameter to classify queries',
    example_mythbusting: { query: 'দুধ আর আনারস খেলে কি বিষক্রিয়া হয়?' },
    example_factcheck: { query: 'দুধ আর আনারস খাওয়ায় ড মুহম্মদ ইউনুস বিষক্রিয়ায় মারা গেলেন' },
    example_url: { query: 'https://www.prothomalo.com/article' }
  })
}