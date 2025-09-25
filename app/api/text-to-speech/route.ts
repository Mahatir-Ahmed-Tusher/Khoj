import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, action } = await request.json()

    if (!text || !action) {
      return NextResponse.json(
        { error: 'Text and action are required' },
        { status: 400 }
      )
    }

    if (action === 'synthesize') {
      // Clean the text for better speech
      const cleanText = text
        .replace(/[\[\]()]/g, '')
        .replace(/\*\*/g, '')
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\n+/g, ' ') // Replace multiple newlines with space
        .trim()

      if (!cleanText) {
        return NextResponse.json(
          { error: 'No valid text to synthesize' },
          { status: 400 }
        )
      }

      // For now, return a simple response indicating TTS is not available
      // This prevents the error and allows the chat to work
      return NextResponse.json({
        success: false,
        message: 'TTS temporarily disabled - text-to-speech will be re-enabled soon',
        text: cleanText
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "synthesize"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
