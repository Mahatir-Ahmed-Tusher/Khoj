import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Use the second Gemini API key for this specific chatbot
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY_2 not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different model names in case gemini-pro is not available
    let model
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    } catch (error) {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
      } catch (error2) {
        try {
          model = genAI.getGenerativeModel({ model: 'gemini-pro' })
        } catch (fallbackError) {
          console.error('All Gemini models failed:', fallbackError)
          return NextResponse.json({ error: 'No compatible Gemini model found. Please check your API key and model availability.' }, { status: 500 })
        }
      }
    }

    // System prompt for Bangladesh Liberation War chatbot
    const systemPrompt = `You are a specialized AI assistant focused on the Bangladesh Liberation War of 1971. You have comprehensive knowledge about:

1. **Historical Context**: The political situation in East Pakistan, the language movement, and the events leading to the war
2. **War Timeline**: Key events from March 1971 to December 1971
3. **Genocide Statistics**: Documented death tolls, including the 3 million Bangladeshis killed
4. **War Crimes**: Mass killings, rapes, and atrocities committed by Pakistani forces
5. **Muktijuddho (Liberation War)**: The role of Mukti Bahini, freedom fighters, and civilians
6. **International Response**: India's support, international recognition, and UN involvement
7. **Key Figures**: Sheikh Mujibur Rahman, General Tikka Khan, General Niazi, and other important personalities
8. **Geographic Details**: Important locations, battle sites, and refugee camps
9. **Cultural Impact**: How the war shaped Bangladesh's national identity
10. **Documentation**: Books, films, and resources about the war

**Important Guidelines:**
- Always provide accurate, well-documented information
- Use respectful language when discussing sensitive topics
- Include specific dates, numbers, and sources when possible
- Answer in Bangla (Bengali) when the user asks in Bangla
- Be comprehensive but sensitive to the traumatic nature of the events
- If you're unsure about specific details, acknowledge the limitations of available data
- Emphasize the heroic nature of the liberation struggle
- Use respectful terms like "শহীদ" (martyr) when referring to those who died

**Response Format:**
- Provide detailed, factual responses
- Include relevant dates and statistics
- Mention sources when appropriate
- Be respectful and educational in tone
- Use Bangla terms where appropriate

Please respond to the user's question about the Bangladesh Liberation War of 1971.`

    const prompt = `${systemPrompt}

User Question: ${message}

Please provide a comprehensive and accurate response about the Bangladesh Liberation War of 1971.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Mukti Corner Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
