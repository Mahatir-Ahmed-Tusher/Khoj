import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query, category, subcategory } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Get the Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY_2
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    // Create category-specific prompts
    let systemPrompt = ''
    if (category === 'genocide') {
      if (subcategory === 'statistical') {
        systemPrompt = `আপনি বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সালের গণহত্যা সম্পর্কে বিশেষজ্ঞ। 
        আপনার উত্তর বাংলায় লিখুন এবং শুধুমাত্র আপনার জ্ঞানের ভিত্তিতে সঠিক তথ্য প্রদান করুন।
        কোনো বই বা উৎসের নাম উল্লেখ করবেন না। শুধু আপনার জ্ঞানের ভিত্তিতে উত্তর দিন।`
      } else {
        systemPrompt = `আপনি বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সালের গণহত্যা সম্পর্কে বিশেষজ্ঞ।
        আপনার উত্তর বাংলায় লিখুন এবং শুধুমাত্র আপনার জ্ঞানের ভিত্তিতে সঠিক তথ্য প্রদান করুন।
        কোনো বই বা উৎসের নাম উল্লেখ করবেন না।`
      }
    } else if (category === 'rape') {
      systemPrompt = `আপনি বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সালে পাকিস্তানি সেনাবাহিনীর দ্বারা সংঘটিত ধর্ষণের ঘটনা সম্পর্কে বিশেষজ্ঞ।
        আপনার উত্তর বাংলায় লিখুন এবং সংবেদনশীলভাবে কিন্তু সত্যতা বজায় রেখে শুধুমাত্র আপনার জ্ঞানের ভিত্তিতে তথ্য প্রদান করুন।
        কোনো বই বা উৎসের নাম উল্লেখ করবেন না।`
    } else {
      systemPrompt = `আপনি বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সম্পর্কে বিশেষজ্ঞ।
        আপনার উত্তর বাংলায় লিখুন এবং শুধুমাত্র আপনার জ্ঞানের ভিত্তিতে সঠিক তথ্য প্রদান করুন।
        কোনো বই বা উৎসের নাম উল্লেখ করবেন না।`
    }

    // Create the full prompt
    const prompt = `${systemPrompt}

প্রশ্ন: ${query}

বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সম্পর্কে আপনার জ্ঞানের ভিত্তিতে উত্তর প্রদান করুন। আপনার উত্তর বাংলায় লিখুন এবং নিম্নলিখিত বিষয়গুলি অন্তর্ভুক্ত করুন:

1. প্রশ্নের সরাসরি উত্তর
2. বিস্তারিত ব্যাখ্যা
3. ঐতিহাসিক প্রেক্ষাপট
4. গুরুত্বপূর্ণ ব্যক্তিত্ব এবং ঘটনা
5. সংখ্যাগত তথ্য (যদি জানা থাকে)

মনে রাখবেন: শুধুমাত্র আপনার জ্ঞানের ভিত্তিতে উত্তর দিন, কোনো বই বা উৎসের নাম উল্লেখ করবেন না।`

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    return NextResponse.json({
      response: generatedText,
      sources: []
    })

  } catch (error) {
    console.error('Error in Gemini chat:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
