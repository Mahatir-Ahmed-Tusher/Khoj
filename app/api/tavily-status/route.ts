import { NextResponse } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'

export async function GET() {
  try {
    const status = tavilyManager.getStatus()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 })
  }
}
