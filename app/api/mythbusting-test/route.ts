import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const geminiKey = process.env.GEMINI_API_KEY_2
    const rapidApiKeys = [
      process.env.APP_KEY,
      process.env.APP_KEY_2,
      process.env.APP_KEY_3,
      process.env.APP_KEY_4,
      process.env.APP_KEY_5
    ].filter(Boolean)

    return NextResponse.json({
      status: 'Environment Test',
      gemini_api_key_2_configured: !!geminiKey,
      gemini_api_key_2_length: geminiKey ? geminiKey.length : 0,
      rapidapi_keys_configured: rapidApiKeys.length,
      rapidapi_keys_available: rapidApiKeys.map((key, index) => ({
        key: `APP_KEY_${index === 0 ? '' : index + 1}`,
        configured: !!key,
        length: key ? key.length : 0
      })),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
