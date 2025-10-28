import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Query Classification API
 * 
 * This endpoint uses AI to intelligently classify user queries into:
 * - "mythbusting": General beliefs, pseudoscience, folklore, common misconceptions
 * - "factcheck": Specific events, news claims, factual statements about real incidents
 * - "url": URL-based verification
 */

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

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

    // Use AI to classify the query
    const apiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('No Gemini API key configured')
      // Fallback to basic classification
      return NextResponse.json(basicClassification(query))
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are an expert query classifier for a fact-checking platform. Analyze the following query in Bengali/English and classify it into ONE of these categories:

**MYTHBUSTING**: General beliefs, pseudoscience, myths, folklore, common misconceptions, "does X cause Y?" questions, scientific principles, superstitions, health myths, conspiracy theories, etc.
Examples:
- "দুধ আর আনারস খেলে কি বিষক্রিয়া হয়?"
- "ভূত আছে কি নাই?"
- "5G causes cancer"
- "Does eating bananas at night cause cough?"
- "অ্যাস্ট্রোলজি কি সত্য?"

**FACTCHECK**: Specific events, news claims, statements about real people/places/incidents, recent happenings, "X person did Y" statements, dated events, political claims about specific actions.
Examples:
- "দুধ আর আনারস খাওয়ায় ড মুহম্মদ ইউনুস বিষক্রিয়ায় মারা গেলেন"
- "The president announced new policy yesterday"
- "শেখ হাসিনা পদত্যাগ করেছেন"
- "Elon Musk bought Twitter"

Query to classify: "${query}"

Respond ONLY with this exact JSON format (no additional text):
{
  "type": "mythbusting" or "factcheck",
  "confidence": 0.0 to 1.0,
  "reasoning": "Brief explanation in English"
}

Consider:
- Questions about general principles = mythbusting
- Questions with "কি", "কেন", "আসলে", "সত্যি কি" about general topics = mythbusting  
- Statements about specific people/events/dates = factcheck
- "X person did Y" or "X happened in Y" = factcheck
- General health/science questions = mythbusting
- Specific incident claims = factcheck`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('📝 AI Response:', text)

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('Could not parse AI response, using basic classification')
      return NextResponse.json(basicClassification(query))
    }

    const classification = JSON.parse(jsonMatch[0])
    console.log('✅ Classification result:', classification)

    return NextResponse.json({
      type: classification.type,
      confidence: classification.confidence,
      reasoning: classification.reasoning,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Classification error:', error)
    // Fallback to basic classification
    const { query } = await request.json()
    return NextResponse.json(basicClassification(query))
  }
}

// Basic rule-based classification as fallback
function basicClassification(query: string): {
  type: 'mythbusting' | 'factcheck'
  confidence: number
  reasoning: string
} {
  const lowerQuery = query.toLowerCase()

  // Mythbusting indicators
  const mythIndicators = [
    'কি সত্য', 'কি হয়', 'আসলে কি', 'সত্যি কি', 'কেন হয়',
    'is it true', 'does it', 'can it', 'will it', 'should i',
    'ভূত', 'জিন', 'অ্যাস্ট্রোলজি', 'হোমিওপ্যাথি', '৫জি', '5g',
    'superstition', 'myth', 'belief', 'folklore', 'pseudoscience'
  ]

  // Factcheck indicators
  const factcheckIndicators = [
    'মারা গেলেন', 'ঘোষণা করেছেন', 'বলেছেন', 'করেছেন', 'হয়েছে',
    'announced', 'declared', 'said', 'did', 'happened', 'resigned',
    'died', 'killed', 'arrested', 'appointed', 'elected'
  ]

  // Check for person names (strong indicator of factcheck)
  const personNames = [
    'ড মুহম্মদ ইউনুস', 'শেখ হাসিনা', 'খালেদা জিয়া', 'নরেন্দ্র মোদি',
    'donald trump', 'joe biden', 'elon musk', 'bill gates'
  ]

  // Scoring
  let mythScore = 0
  let factcheckScore = 0

  // Check for question words (usually mythbusting)
  if (lowerQuery.includes('কি') || lowerQuery.includes('কেন') || 
      lowerQuery.includes('?') || lowerQuery.includes('how') || 
      lowerQuery.includes('why') || lowerQuery.includes('what')) {
    mythScore += 0.3
  }

  // Check mythbusting indicators
  mythIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      mythScore += 0.2
    }
  })

  // Check factcheck indicators
  factcheckIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      factcheckScore += 0.25
    }
  })

  // Check for person names (strong indicator)
  personNames.forEach(name => {
    if (lowerQuery.includes(name.toLowerCase())) {
      factcheckScore += 0.5
    }
  })

  // Determine classification
  if (factcheckScore > mythScore) {
    return {
      type: 'factcheck',
      confidence: Math.min(factcheckScore, 0.85),
      reasoning: 'Query appears to be about a specific event or person'
    }
  } else {
    return {
      type: 'mythbusting',
      confidence: Math.min(Math.max(mythScore, 0.6), 0.85),
      reasoning: 'Query appears to be about a general belief or principle'
    }
  }
}

// Strict URL detection helper
function isUrl(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  const trimmedText = text.trim()
  
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
  
  // If it has spaces, it's definitely not a URL
  if (trimmedText.includes(' ')) {
    console.log('✗ Contains spaces, not a URL:', trimmedText.substring(0, 50))
    return false
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
    message: 'Use POST method with { "query": "your query here" }',
    endpoints: {
      classify: '/api/classify-query'
    },
    types: {
      mythbusting: 'General beliefs, pseudoscience, folklore',
      factcheck: 'Specific events, news claims, factual statements',
      url: 'URL-based verification'
    }
  })
}

