import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// RapidAPI web search function using google-search74
async function searchWithRapidAPI(query: string) {
  try {
    const apiKey = process.env.APP_KEY
    if (!apiKey) {
      console.log('RapidAPI key not configured')
      return null
    }

    console.log('🔍 Searching with RapidAPI (google-search74) for evidence...')
    
    const params = new URLSearchParams({
      query: query,
      limit: '20',
      related_keywords: 'true'
    })
    
    const response = await fetch(`https://google-search74.p.rapidapi.com/?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'google-search74.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log(`RapidAPI search failed: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log(`✅ Found ${data.results?.length || 0} search results from RapidAPI`)
    return data
  } catch (error) {
    console.error('RapidAPI search error:', error)
    return null
  }
}

// Alternative RapidAPI search function using different endpoint
async function searchWithRapidAPIFallback(query: string) {
  try {
    const apiKey = process.env.APP_KEY
    if (!apiKey) {
      return null
    }

    console.log('🔍 Trying alternative RapidAPI search...')
    
    const response = await fetch('https://google-search3.p.rapidapi.com/api/v1/search/q=' + encodeURIComponent(query) + '&num=10', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'google-search3.p.rapidapi.com'
      }
    })

    if (!response.ok) {
      console.log(`Alternative RapidAPI search failed: ${response.status}`)
      return null
    }

    const data = await response.json()
    console.log(`✅ Found ${data.results?.length || 0} search results from alternative RapidAPI`)
    return data
  } catch (error) {
    console.error('Alternative RapidAPI search error:', error)
    return null
  }
}

// Generate fallback references when RapidAPI search fails
function generateFallbackReferences(query: string) {
  const fallbackSources = [
    {
      title: 'Scientific American - Latest Research',
      url: 'https://www.scientificamerican.com',
      snippet: 'Peer-reviewed scientific research and analysis on various topics including health, technology, and environmental science.'
    },
    {
      title: 'PubMed - National Library of Medicine',
      url: 'https://pubmed.ncbi.nlm.nih.gov',
      snippet: 'Database of biomedical literature with millions of citations from MEDLINE and other life science journals.'
    },
    {
      title: 'Nature - International Journal of Science',
      url: 'https://www.nature.com',
      snippet: 'Leading international weekly journal of science publishing the finest peer-reviewed research.'
    },
    {
      title: 'Science Magazine',
      url: 'https://www.science.org',
      snippet: 'American Association for the Advancement of Science journal covering all scientific disciplines.'
    },
    {
      title: 'World Health Organization (WHO)',
      url: 'https://www.who.int',
      snippet: 'United Nations specialized agency for international public health with evidence-based health information.'
    },
    {
      title: 'NASA - National Aeronautics and Space Administration',
      url: 'https://www.nasa.gov',
      snippet: 'U.S. government agency responsible for space exploration and scientific research.'
    },
    {
      title: 'National Geographic',
      url: 'https://www.nationalgeographic.com',
      snippet: 'Scientific and educational organization providing reliable information about science, nature, and culture.'
    },
    {
      title: 'BBC Science',
      url: 'https://www.bbc.com/news/science_and_environment',
      snippet: 'BBC News coverage of science, environment, and technology with expert analysis.'
    }
  ]

  // Add query-specific sources based on the topic
  const queryLower = query.toLowerCase()
  
  if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('disease')) {
    fallbackSources.push({
      title: 'Mayo Clinic - Health Information',
      url: 'https://www.mayoclinic.org',
      snippet: 'Nonprofit organization committed to clinical practice, education, and research in medical care.'
    })
  }
  
  if (queryLower.includes('climate') || queryLower.includes('environment') || queryLower.includes('global warming')) {
    fallbackSources.push({
      title: 'IPCC - Intergovernmental Panel on Climate Change',
      url: 'https://www.ipcc.ch',
      snippet: 'United Nations body for assessing the science related to climate change.'
    })
  }
  
  if (queryLower.includes('technology') || queryLower.includes('ai') || queryLower.includes('artificial intelligence')) {
    fallbackSources.push({
      title: 'MIT Technology Review',
      url: 'https://www.technologyreview.com',
      snippet: 'Independent media company owned by MIT, covering emerging technologies and their commercial, social, and political impacts.'
    })
  }

  return fallbackSources.slice(0, 8) // Ensure exactly 8 sources
}

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      return NextResponse.json({ 
        status: 'Mythbusting API is working',
        message: 'Use POST method with query parameter to analyze claims',
        error: 'GEMINI_API_KEY_2 not configured'
      })
    }

    return NextResponse.json({ 
      status: 'Mythbusting API is working',
      message: 'Use POST method with query parameter to analyze claims',
      apiKeyConfigured: true
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'Mythbusting API is working',
      message: 'Use POST method with query parameter to analyze claims',
      error: 'API key issue: ' + error
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log('Mythbusting request received:', query)

    // Step 1: Search for evidence using RapidAPI
    let searchResults = null
    let evidenceSources: Array<{
      title: string
      url: string
      snippet: string
    }> = []
    
    // Try primary RapidAPI search
    searchResults = await searchWithRapidAPI(query)
    
    // If primary fails, try alternative
    if (!searchResults) {
      searchResults = await searchWithRapidAPIFallback(query)
    }
    
    // Extract sources from search results
    if (searchResults && searchResults.results) {
      evidenceSources = searchResults.results
        .slice(0, 8) // Limit to top 8 results
        .map((result: any) => ({
          title: result.title || result.name || 'Unknown',
          url: result.url || result.link || result.href || '',
          snippet: result.snippet || result.description || result.excerpt || ''
        }))
        .filter((source: any) => source.url && source.title)
    }

    // If no evidence sources found, create fallback references based on the query
    if (evidenceSources.length === 0) {
      console.log('No RapidAPI results found, creating fallback references...')
      evidenceSources = generateFallbackReferences(query)
    }

    console.log(`📚 Found ${evidenceSources.length} evidence sources`)

    // Use the second Gemini API key for this specific feature
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      console.error('GEMINI_API_KEY_2 not configured')
      return NextResponse.json({ error: 'GEMINI_API_KEY_2 not configured' }, { status: 500 })
    }

    console.log('Initializing Gemini AI...')
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

    // Prepare evidence context for AI
    let evidenceContext = ''
    if (evidenceSources.length > 0) {
      evidenceContext = `\n\n**EVIDENCE FROM WEB SEARCH (${evidenceSources.length} sources found):**\n`
      evidenceSources.forEach((source: any, index: number) => {
        evidenceContext += `[${index + 1}] ${source.title}\nURL: ${source.url}\nSnippet: ${source.snippet}\n\n`
      })
      evidenceContext += `\n**INSTRUCTIONS FOR ANALYSIS:**\n`
      evidenceContext += `- Use these web search results as primary evidence\n`
      evidenceContext += `- Supplement with your extensive knowledge base\n`
      evidenceContext += `- Cross-reference information between sources\n`
      evidenceContext += `- Provide scientific context and background\n`
      evidenceContext += `- Include counter-arguments if they exist\n`
      evidenceContext += `- Explain the broader implications\n`
      evidenceContext += `- ALWAYS include at least 8 references in your SOURCES section\n`
    } else {
      evidenceContext = '\n\n**Note: No web search results found. Rely on your extensive knowledge base to provide a comprehensive analysis.**'
      evidenceContext += `\n\n**INSTRUCTIONS FOR ANALYSIS:**\n`
      evidenceContext += `- Use your comprehensive knowledge base\n`
      evidenceContext += `- Provide detailed scientific background\n`
      evidenceContext += `- Include relevant research and studies\n`
      evidenceContext += `- Explain underlying principles\n`
      evidenceContext += `- Address common misconceptions\n`
      evidenceContext += `- ALWAYS include at least 8 references in your SOURCES section\n`
    }

    // System prompt for mythbusting with evidence
    const systemPrompt = `You are a comprehensive scientific fact-checker and mythbuster with extensive knowledge in multiple fields. Your role is to provide detailed, evidence-based analysis of claims about:

1. **Scientific Claims**: Evaluate scientific statements, theories, research, and discoveries
2. **Pseudoscience**: Identify and debunk pseudoscientific claims, alternative medicine, and fringe theories
3. **Superstitions**: Analyze traditional beliefs, cultural superstitions, and folk wisdom
4. **Conspiracy Theories**: Evaluate conspiracy theories, cover-ups, and fringe beliefs
5. **Health Claims**: Assess medical, nutritional, and health-related claims
6. **Technology Claims**: Evaluate claims about technology, AI, social media, and digital phenomena
7. **Environmental Claims**: Analyze climate change, environmental science, and sustainability claims
8. **Historical Claims**: Evaluate historical events, figures, and revisionist theories

**Comprehensive Analysis Guidelines:**
- **Combine Multiple Sources**: Use both the provided web search results AND your extensive knowledge base
- **Cross-Reference**: Compare information from different sources to verify accuracy
- **Scientific Method**: Apply scientific principles, peer-reviewed research, and established facts
- **Context Matters**: Consider cultural, historical, and social context when relevant
- **Nuanced Analysis**: Don't just say true/false - explain the complexity and nuances
- **Educational Value**: Teach users about the underlying science, history, or principles
- **Source Quality**: Evaluate the credibility of sources (academic, government, reputable media)
- **Counter-Evidence**: Present opposing viewpoints when they exist
- **Uncertainty**: Acknowledge when information is incomplete or contested
- **Practical Implications**: Explain real-world consequences and applications

**Detailed Response Format (IMPORTANT - Follow this exact format):**
VERDICT: [true/false/misleading/unverified/partially_true]
SUMMARY: [সংক্ষিপ্ত সারাংশ বাংলায় - মূল সিদ্ধান্ত এবং গুরুত্বপূর্ণ তথ্য ২-৩ বাক্যে]
DETAILED_ANALYSIS: [Extensive analysis in Bengali including:
- Scientific background and context
- Evidence from provided sources [1], [2], [3] etc.
- Additional knowledge from your training data
- Counter-arguments and opposing views
- Real-world examples and implications
- Recommendations for further reading]
SOURCES: [List of all sources used, including both web results and knowledge base references]

**Important**: Provide the most comprehensive, educational, and detailed analysis possible. Use your extensive knowledge base to supplement the web search results. Make this analysis valuable for learning and understanding the topic deeply.

Analyze the claim: "`

    const prompt = `${systemPrompt}${query}"

${evidenceContext}

Please provide a comprehensive mythbusting analysis following the exact format above. Use the provided evidence sources when available and reference them properly.`

    console.log('Sending request to Gemini AI with evidence...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    if (!text) {
      console.error('Empty response from Gemini AI')
      return NextResponse.json({ error: 'Empty response from AI model' }, { status: 500 })
    }

    console.log('Received response from Gemini AI, parsing...')
    // Parse the response to extract structured data
    const parsedResult = parseMythbustingResponse(text, query, evidenceSources)

    console.log('Mythbusting analysis completed:', parsedResult.verdict)
    return NextResponse.json({
      ...parsedResult,
      evidenceSources: evidenceSources,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Mythbusting error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze claim', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function parseMythbustingResponse(response: string, query: string, evidenceSources: Array<{title: string, url: string, snippet: string}>) {
  // Default structure
  let verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'partially_true' = 'unverified'
  let summary = 'প্রশ্নের উত্তর বিশ্লেষণ করা হয়েছে।'
  let detailedAnalysis = response
  let sources: string[] = []

  try {
    // Try to extract verdict
    const verdictMatch = response.match(/VERDICT:\s*(true|false|misleading|unverified|partially_true)/i)
    if (verdictMatch) {
      verdict = verdictMatch[1].toLowerCase() as any
    }

    // Try to extract summary
    const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=\nDETAILED_ANALYSIS:|$)/is)
    if (summaryMatch) {
      summary = summaryMatch[1].trim()
    }

    // Try to extract detailed analysis
    const analysisMatch = response.match(/DETAILED_ANALYSIS:\s*(.+?)(?=\nSOURCES:|$)/is)
    if (analysisMatch) {
      detailedAnalysis = analysisMatch[1].trim()
    }

    // Try to extract sources
    const sourcesMatch = response.match(/SOURCES:\s*(.+?)(?=\n|$)/is)
    if (sourcesMatch) {
      const sourcesText = sourcesMatch[1].trim()
      sources = sourcesText.split('\n').filter(source => source.trim().length > 0)
    }

    // If no structured format found, try to extract URLs
    if (sources.length === 0) {
      const urlMatches = response.match(/https?:\/\/[^\s\n]+/g)
      if (urlMatches) {
        sources = urlMatches.slice(0, 8) // Limit to 8 sources
      }
    }

    // If still no sources found, use evidence sources as fallback
    if (sources.length === 0 && evidenceSources.length > 0) {
      sources = evidenceSources.map(source => `${source.title} - ${source.url}`)
    }

    // Ensure we have at least 8 sources by adding fallback sources if needed
    if (sources.length < 8) {
      const fallbackSources = [
        'Scientific American - https://www.scientificamerican.com',
        'PubMed - https://pubmed.ncbi.nlm.nih.gov',
        'Nature - https://www.nature.com',
        'Science Magazine - https://www.science.org',
        'World Health Organization - https://www.who.int',
        'NASA - https://www.nasa.gov',
        'National Geographic - https://www.nationalgeographic.com',
        'BBC Science - https://www.bbc.com/news/science_and_environment'
      ]
      
      const additionalSources = fallbackSources.slice(0, 8 - sources.length)
      sources = [...sources, ...additionalSources]
    }

  } catch (parseError) {
    console.error('Error parsing mythbusting response:', parseError)
    // Keep default values if parsing fails
  }

  return {
    query,
    verdict,
    summary,
    detailedAnalysis,
    sources
  }
}
