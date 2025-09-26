import { NextRequest } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'
import { Groq } from 'groq-sdk'

export async function POST(request: NextRequest) {
  try {
    const { query, type, citizenServiceData, mode } = await request.json()

    if (!query || !type) {
      return new Response('Query and type are required', { status: 400 })
    }

    // Create a ReadableStream for streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        try {
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
              const sources = searchResults.results?.map((result: any) => ({
                title: result.title || 'No title',
                url: result.url || '',
                snippet: result.content || result.snippet || ''
              })) || []

              // Send sources first
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', data: sources })}\n\n`))

              // Use Groq to create a professional fact-check response
              const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY
              })

              const systemPrompt = `You are খোঁজ এআই, a professional fact-checker and journalist created by the Khoj team. When asked about your identity, always introduce yourself as "খোঁজ এআই". Your task is to analyze search results and provide a comprehensive, detailed fact-check report in Bengali.

CRITICAL INSTRUCTIONS:
- NEVER create tables, charts, or structured data formats
- ALWAYS write in analytical paragraphs with detailed explanations
- Focus on connecting all dots from the search results
- Provide thorough analysis of all available information
- Do NOT hallucinate or make up information not found in sources
- Base your response ONLY on the provided search results

Structure your response as:
1. **Title**: Clear, descriptive title for the fact-check
2. **Claim Analysis**: Thorough analysis of the claim/question in paragraph form
3. **Evidence Review**: Systematic review of all sources in analytical paragraphs
4. **Verdict**: Clear verdict (True/False/Misleading/Unverified) with reasoning
5. **Detailed Analysis**: Comprehensive explanation connecting all evidence
6. **Source Citations**: Reference sources with numbered citations [1], [2], etc.

Guidelines:
- Write in analytical paragraphs, not bullet points or tables
- Connect all information from sources to provide comprehensive analysis
- Use professional journalistic language in Bengali
- Cite sources with numbered references [1], [2], [3]
- Provide detailed analysis, not just summaries
- Be thorough and comprehensive in connecting all dots
- Maintain journalistic integrity
- Format ALL URLs as clickable markdown links [text](url)
- When mentioning sources, create clickable links like [Source Name](https://example.com)
- If information is insufficient, clearly state this limitation
- Do NOT create tables, charts, or structured formats

Question/Claim: ${query}

Sources found: ${searchResults.results?.length || 0}

Source details:
${searchResults.results?.map((result: any, index: number) => `
[${index + 1}] ${result.title}
URL: ${result.url}
Content: ${result.content || result.snippet || 'No detailed content available'}
`).join('\n') || 'No sources found'}

Provide a comprehensive fact-check report in Bengali using analytical paragraphs. Connect all dots from the search results and provide thorough analysis. Do NOT create tables or structured formats.`

              const chatCompletion = await groq.chat.completions.create({
                messages: [
                  {
                    role: "user",
                    content: systemPrompt
                  }
                ],
                model: "openai/gpt-oss-20b",
                temperature: 1,
                max_tokens: 8192,
                top_p: 1,
                stream: true,
                stop: null
              })

              // Stream the response from Groq
              for await (const chunk of chatCompletion) {
                const content = chunk.choices[0]?.delta?.content || ''
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: content })}\n\n`))
                  await new Promise(resolve => setTimeout(resolve, 7)) // 3x faster (20/3 ≈ 7ms)
                }
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))

            } catch (error) {
              console.error('Tavily search error:', error)
              const errorResponse = `দুঃখিত, "${query}" বিষয়ে তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ভিন্নভাবে প্রশ্ন করুন অথবা অন্য কোনো বিষয়ে জানতে চান।`
              
              for (let i = 0; i < errorResponse.length; i++) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: errorResponse[i] })}\n\n`))
                await new Promise(resolve => setTimeout(resolve, 7))
              }
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
            }

          } else if (type === 'citizen-service' && mode === 'citizen-service' && citizenServiceData) {
            // Handle citizen service queries with Tavily crawling
            try {
              // Find relevant service URLs based on query
              const relevantUrls: string[] = []
              
              // Search through citizen service data to find relevant URLs
              Object.entries(citizenServiceData).forEach(([serviceName, urls]) => {
                if (Array.isArray(urls) && (query.toLowerCase().includes(serviceName.toLowerCase()) || 
                    serviceName.toLowerCase().includes(query.toLowerCase()))) {
                  relevantUrls.push(...urls)
                }
              })

              // If no specific service found, search in all URLs
              if (relevantUrls.length === 0) {
                Object.values(citizenServiceData).forEach(urls => {
                  if (Array.isArray(urls)) {
                    relevantUrls.push(...urls)
                  }
                })
              }

              // Limit to first 10 URLs to avoid overwhelming the search
              const searchUrls = relevantUrls.slice(0, 10)

              // Use Tavily to search with specific domains
              const searchResults = await tavilyManager.search(query, {
                max_results: 8,
                include_domains: searchUrls.map(url => {
                  try {
                    return new URL(url).hostname
                  } catch {
                    return url
                  }
                }).filter(Boolean)
              })

              // Format the response with sources
              const sources = searchResults.results?.map((result: any) => ({
                title: result.title || 'No title',
                url: result.url || '',
                snippet: result.content || result.snippet || ''
              })) || []

              // Send sources first
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', data: sources })}\n\n`))

              // Use Groq to create a comprehensive citizen service response
              const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY
              })

              const systemPrompt = `You are খোঁজ এআই, a helpful government service assistant created by the Khoj team. When asked about your identity, always introduce yourself as "খোঁজ এআই". Your task is to provide comprehensive information about Bangladeshi government services based on search results.

CRITICAL INSTRUCTIONS:
- NEVER create tables, charts, or structured data formats
- ALWAYS write in analytical paragraphs with detailed explanations
- Focus on connecting all dots from the search results
- Provide thorough analysis of all available information
- Do NOT hallucinate or make up information not found in sources
- Base your response ONLY on the provided search results

Guidelines:
- Write in analytical paragraphs, not bullet points or tables
- Connect all information from sources to provide comprehensive analysis
- Provide detailed, accurate information about government services
- Use clear, professional Bengali language
- Structure your response with proper headings and formatting
- Include step-by-step procedures when applicable in paragraph form
- Mention relevant websites and contact information
- Be helpful and informative
- Use markdown formatting for better readability
- Format ALL URLs as clickable markdown links using [text](url) format
- When mentioning websites, create clickable links like [Website Name](https://example.com)
- Make sure users can click on links to visit the actual websites
- Do NOT create tables, charts, or structured formats

Question: ${query}

Sources found: ${searchResults.results?.length || 0}

Source details:
${searchResults.results?.map((result: any, index: number) => `
[${index + 1}] ${result.title}
URL: ${result.url}
Content: ${result.content || result.snippet || 'No detailed content available'}
`).join('\n') || 'No sources found'}

Provide a comprehensive answer about the government service in Bengali using analytical paragraphs. Connect all dots from the search results and provide thorough analysis. Do NOT create tables or structured formats. Include relevant procedures, requirements, and contact information. Make sure to format all URLs as clickable markdown links [text](url) so users can click and visit the websites directly.`

              const chatCompletion = await groq.chat.completions.create({
                messages: [
                  {
                    role: "user",
                    content: systemPrompt
                  }
                ],
                model: "openai/gpt-oss-20b",
                temperature: 1,
                max_tokens: 8192,
                top_p: 1,
                stream: true,
                stop: null
              })

              // Stream the response from Groq
              for await (const chunk of chatCompletion) {
                const content = chunk.choices[0]?.delta?.content || ''
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: content })}\n\n`))
                  await new Promise(resolve => setTimeout(resolve, 7))
                }
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))

            } catch (error) {
              console.error('Citizen service search error:', error)
              const errorResponse = `দুঃখিত, "${query}" বিষয়ে সরকারি সেবা সম্পর্কে তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ভিন্নভাবে প্রশ্ন করুন অথবা অন্য কোনো সরকারি সেবা সম্পর্কে জানতে চান।`
              
              for (let i = 0; i < errorResponse.length; i++) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: errorResponse[i] })}\n\n`))
                await new Promise(resolve => setTimeout(resolve, 7))
              }
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
            }

          } else if (type === 'general') {
            // Use Tavily search for general questions to prevent hallucination
            try {
              // First, try to get web search results for factual information
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
                  'banglatribune.com',
                  'wikipedia.org',
                  'britannica.com',
                  'who.int',
                  'un.org',
                  'worldbank.org'
                ]
              })

              // Format the response with sources
              const sources = searchResults.results?.map((result: any) => ({
                title: result.title || 'No title',
                url: result.url || '',
                snippet: result.content || result.snippet || ''
              })) || []

              // Send sources first
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'sources', data: sources })}\n\n`))

              const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY
              })

              const prompt = `You are খোঁজ এআই, a helpful AI assistant created by the Khoj team. When asked about your identity, always introduce yourself as "খোঁজ এআই".

CRITICAL INSTRUCTIONS:
- NEVER create tables, charts, or structured data formats
- ALWAYS write in analytical paragraphs with detailed explanations
- Focus on connecting all dots from the search results
- Provide thorough analysis of all available information
- Do NOT hallucinate or make up information not found in sources
- Base your response ONLY on the provided search results

Guidelines:
- Write in analytical paragraphs, not bullet points or tables
- Connect all information from sources to provide comprehensive analysis
- Use clear, professional Bengali language
- Structure your response with proper headings and formatting
- Base your answer on the provided search results
- Cite sources with numbered references [1], [2], [3]
- If you're unsure about something, mention it
- Format ALL URLs as clickable markdown links using [text](url) format
- When mentioning sources, create clickable links like [Source Name](https://example.com)
- Make sure users can click on links to visit the actual websites
- If search results are insufficient, clearly state this limitation
- Do NOT create tables, charts, or structured formats

Question: ${query}

Search results found: ${searchResults.results?.length || 0}

Source details:
${searchResults.results?.map((result: any, index: number) => `
[${index + 1}] ${result.title}
URL: ${result.url}
Content: ${result.content || result.snippet || 'No detailed content available'}
`).join('\n') || 'No sources found'}

Provide a detailed and well-formatted answer in Bengali using analytical paragraphs. Connect all dots from the search results and provide thorough analysis. Do NOT create tables or structured formats. Make sure to cite sources with numbered references and format all URLs as clickable markdown links [text](url) so users can click and visit the websites directly.`

              const chatCompletion = await groq.chat.completions.create({
                messages: [
                  {
                    role: "user",
                    content: prompt
                  }
                ],
                model: "openai/gpt-oss-20b",
                temperature: 1,
                max_tokens: 8192,
                top_p: 1,
                stream: true,
                stop: null
              })

              // Stream the response from Groq
              for await (const chunk of chatCompletion) {
                const content = chunk.choices[0]?.delta?.content || ''
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: content })}\n\n`))
                  await new Promise(resolve => setTimeout(resolve, 7)) // 3x faster
                }
              }

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))

            } catch (error) {
              console.error('General search error:', error)
              const errorResponse = `দুঃখিত, "${query}" বিষয়ে তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ভিন্নভাবে প্রশ্ন করুন অথবা অন্য কোনো বিষয়ে জানতে চান।`
              
              for (let i = 0; i < errorResponse.length; i++) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: errorResponse[i] })}\n\n`))
                await new Promise(resolve => setTimeout(resolve, 7))
              }
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
            }

          } else {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: 'Invalid type. Use "fact-check", "citizen-service", or "general"' })}\n\n`))
          }

        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', data: 'Internal server error' })}\n\n`))
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Khoj chat stream API error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}
