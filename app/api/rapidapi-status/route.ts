import { NextRequest, NextResponse } from 'next/server'
import { getRapidAPIStatus, RapidAPIKeyManager } from '@/lib/rapidapi-manager'

export async function GET(request: NextRequest) {
  try {
    const keyManager = RapidAPIKeyManager.getInstance()
    const status = getRapidAPIStatus()
    
    return NextResponse.json({
      message: 'RapidAPI Fallback System Status',
      status: status,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAppKey: !!process.env.APP_KEY,
        hasAppKey2: !!process.env.APP_KEY_2,
        hasAppKey3: !!process.env.APP_KEY_3,
        hasAppKey4: !!process.env.APP_KEY_4,
        hasAppKey5: !!process.env.APP_KEY_5,
        hasAppKey6: !!process.env.APP_KEY_6,
        hasAppKey7: !!process.env.APP_KEY_7,
        hasAppKey8: !!process.env.APP_KEY_8,
        hasAppKey9: !!process.env.APP_KEY_9,
        hasAppKey10: !!process.env.APP_KEY_10,
        hasAppKey11: !!process.env.APP_KEY_11,
        hasAppKey12: !!process.env.APP_KEY_12,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to get RapidAPI status', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'reset') {
      const keyManager = RapidAPIKeyManager.getInstance()
      keyManager.resetFailedKeys()
      
      return NextResponse.json({
        message: 'All failed keys have been reset',
        status: getRapidAPIStatus(),
        timestamp: new Date().toISOString()
      })
    }
    
    if (action === 'test-fallback') {
      const { searchWithRapidAPIFallback } = await import('@/lib/rapidapi-manager')
      
      // Test with a simple query
      const testQuery = 'বাংলাদেশের মুক্তিযুদ্ধ'
      console.log('🧪 Testing RapidAPI fallback system with query:', testQuery)
      
      const result = await searchWithRapidAPIFallback(testQuery, 5)
      
      return NextResponse.json({
        message: 'Fallback test completed',
        testQuery: testQuery,
        result: result ? {
          hasResults: !!result.results,
          resultCount: result.results?.length || 0,
          firstResult: result.results?.[0] || null
        } : null,
        status: getRapidAPIStatus(),
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to execute action', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
