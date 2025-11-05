import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// Define the expected classification result type
interface GeographyClassificationResult {
  type: 'bangladesh' | 'international'
  confidence: number
  reasoning: string
}

/**
 * API endpoint for geography-based query classification.
 * Classifies incoming queries into one of two types:
 * - "bangladesh": Bangladesh-specific claims, events, people, places, politics
 * - "international": Global or non-Bangladesh-specific claims
 */
export async function POST(request: NextRequest) {
  let query: string = ''
  
  try {
    const body = await request.json()
    query = body.query

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Valid query is required' }, { status: 400 })
    }

    console.log('🌍 Classifying query geography:', query)

    // Try Groq first (primary) - fast classification
    const groqApiKey = process.env.GROQ_API_KEY
    const geminiApiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY
    
    if (groqApiKey) {
      try {
        console.log('🚀 Using Groq GPT-OSS-120B for geography classification...')
        const groqClient = new Groq({ apiKey: groqApiKey })
        
        const prompt = `You are an intelligent geography classification system. Your task is to analyze a user's query and determine if it is a "bangladesh" query or an "international" query.

**Definition of Query Types:**
- **bangladesh:** The user is asking about Bangladesh-specific topics, including:
  * Bangladeshi people (e.g., "শেখ হাসিনা", "মুহম্মদ ইউনুস", "বাংলাদেশের প্রধানমন্ত্রী")
  * Bangladeshi places (e.g., "ঢাকা", "চট্টগ্রাম", "সিলেট", "বাংলাদেশ")
  * Bangladeshi politics, elections, government policies
  * Bangladeshi events, news, incidents
  * Bangladeshi organizations, institutions
  * Any claim specifically mentioning Bangladesh or Bangladeshi context
  * Example: "প্রধানমন্ত্রী শেখ হাসিনা আজ একটি নতুন প্রকল্প ঘোষণা করেছেন"
  * Example: "২০২৩ সালের বন্যায় সিলেট ডুবে গিয়েছিল"
  * Example: "বাংলাদেশের জাতীয় নির্বাচন"

- **international:** The user is asking about global or non-Bangladesh-specific topics, including:
  * International events, people, places outside Bangladesh
  * Global issues, world news
  * Foreign countries, their politics, elections
  * International organizations (UN, WHO, etc.)
  * Claims that don't specifically mention Bangladesh or Bangladeshi context
  * Example: "US election results"
  * Example: "Global climate change"
  * Example: "COVID-19 pandemic worldwide"

**Instructions:**
1. Analyze the user's query carefully.
2. Determine if it fits the "bangladesh" or "international" definition.
3. Provide a 'type' (either 'bangladesh' or 'international'), a 'confidence' score (0.0 to 1.0), and a brief 'reasoning' for your classification.
4. The output MUST be a JSON object.

**Output Format:**
\`\`\`json
{
  "type": "bangladesh" | "international",
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
        let classification: GeographyClassificationResult
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
          const jsonText = jsonMatch ? jsonMatch[1] : text
          classification = JSON.parse(jsonText.trim())
          
          // Validate the parsed structure
          if (!['bangladesh', 'international'].includes(classification.type) ||
              typeof classification.confidence !== 'number' ||
              typeof classification.reasoning !== 'string') {
            throw new Error('Invalid AI response structure')
          }
          console.log('✅ Groq Geography Classified:', classification)
          return NextResponse.json(classification)
        } catch (parseError) {
          console.error('Failed to parse Groq response as JSON:', parseError)
          console.log('Falling back to basic geography classification due to Groq response parsing error.')
          return NextResponse.json(basicGeographyClassification(query), { status: 200 })
        }
      } catch (groqError) {
        console.error('Groq geography classification failed:', groqError)
        console.log('Groq failed, trying Gemini fallback...')
      }
    }

    // Fallback to Gemini if Groq fails or not available
    if (geminiApiKey) {
      try {
        console.log('🔄 Using Gemini as fallback for geography classification...')
        const genAI = new GoogleGenerativeAI(geminiApiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const prompt = `You are an intelligent geography classification system. Your task is to analyze a user's query and determine if it is a "bangladesh" query or an "international" query.

**Definition of Query Types:**
- **bangladesh:** The user is asking about Bangladesh-specific topics, including:
  * Bangladeshi people (e.g., "শেখ হাসিনা", "মুহম্মদ ইউনুস", "বাংলাদেশের প্রধানমন্ত্রী")
  * Bangladeshi places (e.g., "ঢাকা", "চট্টগ্রাম", "সিলেট", "বাংলাদেশ")
  * Bangladeshi politics, elections, government policies
  * Bangladeshi events, news, incidents
  * Bangladeshi organizations, institutions
  * Any claim specifically mentioning Bangladesh or Bangladeshi context
  * Example: "প্রধানমন্ত্রী শেখ হাসিনা আজ একটি নতুন প্রকল্প ঘোষণা করেছেন"
  * Example: "২০২৩ সালের বন্যায় সিলেট ডুবে গিয়েছিল"
  * Example: "বাংলাদেশের জাতীয় নির্বাচন"

- **international:** The user is asking about global or non-Bangladesh-specific topics, including:
  * International events, people, places outside Bangladesh
  * Global issues, world news
  * Foreign countries, their politics, elections
  * International organizations (UN, WHO, etc.)
  * Claims that don't specifically mention Bangladesh or Bangladeshi context
  * Example: "US election results"
  * Example: "Global climate change"
  * Example: "COVID-19 pandemic worldwide"

**Instructions:**
1. Analyze the user's query carefully.
2. Determine if it fits the "bangladesh" or "international" definition.
3. Provide a 'type' (either 'bangladesh' or 'international'), a 'confidence' score (0.0 to 1.0), and a brief 'reasoning' for your classification.
4. The output MUST be a JSON object.

**Output Format:**
\`\`\`json
{
  "type": "bangladesh" | "international",
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
        let classification: GeographyClassificationResult
        try {
          // Extract JSON from markdown code blocks if present
          const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
          const jsonText = jsonMatch ? jsonMatch[1] : text
          classification = JSON.parse(jsonText.trim())
          
          // Validate the parsed structure
          if (!['bangladesh', 'international'].includes(classification.type) ||
              typeof classification.confidence !== 'number' ||
              typeof classification.reasoning !== 'string') {
            throw new Error('Invalid AI response structure')
          }
          console.log('✅ Gemini Geography Classified:', classification)
          return NextResponse.json(classification)
        } catch (parseError) {
          console.error('Failed to parse Gemini response as JSON:', parseError)
          console.log('Falling back to basic geography classification due to Gemini response parsing error.')
          return NextResponse.json(basicGeographyClassification(query), { status: 200 })
        }
      } catch (geminiError) {
        console.error('Gemini geography classification failed:', geminiError)
        console.log('Both AI models failed, using basic geography classification.')
        return NextResponse.json(basicGeographyClassification(query), { status: 200 })
      }
    } else {
      console.log('No AI API keys available, using basic geography classification.')
      return NextResponse.json(basicGeographyClassification(query), { status: 200 })
    }

  } catch (error) {
    console.error('Error in geography classification API:', error)
    // Fallback to basic classification on any API error
    if (query) {
      return NextResponse.json(basicGeographyClassification(query), { status: 200 })
    } else {
      return NextResponse.json({ error: 'Failed to process query' }, { status: 500 })
    }
  }
}

/**
 * Basic rule-based geography classification as fallback
 */
function basicGeographyClassification(query: string): GeographyClassificationResult {
  const lowerQuery = query.toLowerCase()

  // Bangladesh indicators
  const bangladeshIndicators = [
    'বাংলাদেশ', 'bangladesh', 'ঢাকা', 'dhaka', 'চট্টগ্রাম', 'chittagong',
    'সিলেট', 'sylhet', 'খুলনা', 'khulna', 'রাজশাহী', 'rajshahi',
    'শেখ হাসিনা', 'sheikh hasina', 'মুহম্মদ ইউনুস', 'muhammad yunus',
    'প্রধানমন্ত্রী', 'prime minister', 'বাংলাদেশের', 'of bangladesh',
    'জাতীয় নির্বাচন', 'national election', 'আওয়ামী লীগ', 'awami league',
    'বিএনপি', 'bnp', 'জামায়াত', 'jamaat'
  ]

  // International indicators
  const internationalIndicators = [
    'us election', 'united states', 'usa', 'uk', 'united kingdom',
    'europe', 'asia', 'global', 'worldwide', 'international',
    'who', 'un', 'united nations', 'eu', 'european union'
  ]

  let bangladeshScore = 0
  let internationalScore = 0

  bangladeshIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      bangladeshScore += 0.3
    }
  })

  internationalIndicators.forEach(indicator => {
    if (lowerQuery.includes(indicator.toLowerCase())) {
      internationalScore += 0.3
    }
  })

  if (bangladeshScore > internationalScore && bangladeshScore > 0) {
    return {
      type: 'bangladesh',
      confidence: Math.min(bangladeshScore, 0.75),
      reasoning: 'Query appears to be Bangladesh-specific (basic heuristic)'
    }
  } else if (internationalScore > bangladeshScore && internationalScore > 0) {
    return {
      type: 'international',
      confidence: Math.min(internationalScore, 0.75),
      reasoning: 'Query appears to be international/global (basic heuristic)'
    }
  } else {
    // Default to international if unclear (to be safe)
    return {
      type: 'international',
      confidence: 0.5,
      reasoning: 'Unable to determine geography, defaulting to international'
    }
  }
}

// GET method for testing
export async function GET() {
  return NextResponse.json({
    status: 'Geography Classification API is active',
    message: 'Use POST method with query parameter to classify query geography',
    example_bangladesh: { query: 'প্রধানমন্ত্রী শেখ হাসিনা আজ একটি নতুন প্রকল্প ঘোষণা করেছেন' },
    example_international: { query: 'US election results 2024' }
  })
}
