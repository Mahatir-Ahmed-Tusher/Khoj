import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const imageUrl = formData.get('imageUrl') as string

    if (!imageFile && !imageUrl) {
      return NextResponse.json(
        { error: 'Either image file or image URL is required' },
        { status: 400 }
      )
    }

    const apiUser = process.env.SIGHTENGINE_API_USER
    const apiSecret = process.env.SIGHTENGINE_API_SECRET

    if (!apiUser || !apiSecret) {
      return NextResponse.json(
        { error: 'Sightengine API credentials not configured' },
        { status: 500 }
      )
    }

    let response

    if (imageUrl) {
      // Option 1: Send image URL
      response = await axios.get('https://api.sightengine.com/1.0/check.json', {
        params: {
          'url': imageUrl,
          'models': 'genai',
          'api_user': apiUser,
          'api_secret': apiSecret,
        }
      })
    } else {
      // Option 2: Send raw image
      const form = new FormData()
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      form.append('media', buffer, {
        filename: imageFile.name,
        contentType: imageFile.type,
      })
      form.append('models', 'genai')
      form.append('api_user', apiUser)
      form.append('api_secret', apiSecret)

      response = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
        headers: {
          ...form.getHeaders(),
        },
      })
    }

    const result = response.data

    if (result.status === 'success') {
      const aiGeneratedScore = result.type?.ai_generated || 0
      
      // Determine the result based on the score
      let verdict = 'unverified'
      let confidence = 'low'
      let explanation = ''

      if (aiGeneratedScore >= 0.8) {
        verdict = 'true'
        confidence = 'high'
        explanation = 'এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা খুব বেশি।'
      } else if (aiGeneratedScore >= 0.6) {
        verdict = 'true'
        confidence = 'medium'
        explanation = 'এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা বেশি।'
      } else if (aiGeneratedScore >= 0.4) {
        verdict = 'misleading'
        confidence = 'medium'
        explanation = 'এই ছবিটি AI দ্বারা তৈরি হওয়ার কিছু লক্ষণ দেখা যাচ্ছে।'
      } else if (aiGeneratedScore >= 0.2) {
        verdict = 'false'
        confidence = 'medium'
        explanation = 'এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা কম।'
      } else {
        verdict = 'false'
        confidence = 'high'
        explanation = 'এই ছবিটি AI দ্বারা তৈরি হওয়ার সম্ভাবনা খুব কম।'
      }

      return NextResponse.json({
        success: true,
        verdict,
        confidence,
        explanation,
        aiGeneratedScore,
        requestId: result.request?.id,
        mediaId: result.media?.id,
      })
    } else {
      return NextResponse.json(
        { error: 'API request failed', details: result },
        { status: 400 }
      )
    }

  } catch (error: any) {
    console.error('Image check error:', error)
    
    if (error.response) {
      return NextResponse.json(
        { error: 'API request failed', details: error.response.data },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
