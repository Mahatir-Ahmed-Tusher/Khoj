import { NextRequest, NextResponse } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { query, type } = await request.json()

    if (!query || !type) {
      return NextResponse.json(
        { error: 'Query and type are required' },
        { status: 400 }
      )
    }

    if (type === 'fact-check') {
      // Use Tavily search for fact checking
      try {
        const searchResults = await tavilyManager.search(query, {
          max_results: 5,
          include_domains: [
            'bbc.com',
            'reuters.com',
            'ap.org',
            'prothomalo.com',
            'bdnews24.com',
            'jugantor.com',
            'kalerkantho.com',
            'ittefaq.com.bd',
            'samakal.com',
            'banglatribune.com'
          ]
        })

        // Format the response with sources
        const sources = searchResults.results?.map(result => ({
          title: result.title || 'No title',
          url: result.url || '',
          snippet: result.content || result.snippet || ''
        })) || []

        // Use Gemini to create a professional fact-check response
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const systemPrompt = `You are a professional fact-checker and journalist named খোঁজ সহযোগী, created by the Khoj team. Your task is to analyze search results and provide a comprehensive, detailed fact-check report in Bengali. Follow this structure:

1. **Title**: Create a clear, descriptive title for the fact-check
2. **Claim Analysis**: Analyze the claim/question thoroughly
3. **Evidence Review**: Review all provided sources systematically
4. **Verdict**: Provide a clear verdict (True/False/Misleading/Unverified)
5. **Detailed Analysis**: Explain your reasoning with specific evidence
6. **Source Citations**: Reference sources with proper numbering [1], [2], etc.

Guidelines:
- Be objective and evidence-based
- Use professional journalistic language in Bengali
- Cite sources with numbered references [1], [2], [3]
- Provide detailed analysis, not just summaries
- Be thorough and comprehensive
- Maintain journalistic integrity

Question/Claim: ${query}

Sources found: ${searchResults.results?.length || 0}

Source details:
${searchResults.results?.map((result, index) => `
[${index + 1}] ${result.title}
URL: ${result.url}
Content: ${result.content || result.snippet || 'No detailed content available'}
`).join('\n') || 'No sources found'}

Please provide a comprehensive fact-check report in Bengali following the structure above.`

        const result = await model.generateContent(systemPrompt)
        const factCheckResponse = result.response.text()

        return NextResponse.json({
          response: factCheckResponse,
          sources: sources
        })

      } catch (error) {
        console.error('Tavily search error:', error)
        return NextResponse.json({
          response: `দুঃখিত, "${query}" বিষয়ে তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ভিন্নভাবে প্রশ্ন করুন অথবা অন্য কোনো বিষয়ে জানতে চান।`,
          sources: []
        })
      }

    } else if (type === 'general') {
      // Use Gemini free model for general questions
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `You are a helpful AI assistant. Provide comprehensive, accurate, and well-structured answers in Bengali. Follow these guidelines:

- Use clear, professional Bengali language
- Structure your response with proper headings and formatting
- Provide detailed explanations when appropriate
- Use markdown formatting for better readability
- Be informative and helpful
- If you're unsure about something, mention it

Question: ${query}

Please provide a detailed and well-formatted answer in Bengali.`

        const result = await model.generateContent(prompt)
        const response = result.response.text()

        return NextResponse.json({
          response: response
        })

      } catch (error) {
        console.error('Gemini API error:', error)
        return NextResponse.json({
          response: `দুঃখিত, "${query}" বিষয়ে উত্তর দিতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।`
        })
      }

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "fact-check" or "general"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Khoj chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
