import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { details } = body

    // Support OpenAI-compatible APIs (PackyAPI, OpenAI, etc.)
    const apiKey = process.env.OPENAI_API_KEY || process.env.PACKY_API_KEY || process.env.GEMINI_API_KEY
    const apiBaseUrl = process.env.OPENAI_API_BASE_URL || process.env.PACKY_API_BASE_URL || 'https://www.packyapi.com/v1'
    const model = process.env.OPENAI_MODEL || process.env.PACKY_MODEL || 'gpt-5.1'

    if (!apiKey) {
      console.error('API key is not configured in environment variables')
      return NextResponse.json(
        { error: 'Email generation service is temporarily unavailable. Please check back later.' },
        { status: 503 }
      )
    }
    
    let prompt = `Write a polite, professional email from a college student named "${details.studentName}" to Professor "${details.profName}" for the course "${details.course}". `
    
    switch(details.type) {
      case 'extension':
        prompt += `The goal is to ask for an assignment extension. Reason: ${details.reason || 'personal emergency'}.`
        break
      case 'grade':
        prompt += `The goal is to respectfully ask for clarification on a recent grade or see if there's a chance for a regrade. Context: ${details.reason}.`
        break
      case 'missing':
        prompt += `The goal is to apologize for missing class and ask what was missed.`
        break
      case 'recommendation':
        prompt += `The goal is to ask for a letter of recommendation for a job/internship.`
        break
    }
    
    prompt += ` Keep the tone respectful and concise. Do not include subject line in the body, just the message body.`

    // Use OpenAI-compatible API format
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error:', response.status, errorData)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const email = data.choices?.[0]?.message?.content || "Could not generate email. Please try again."
    
    return NextResponse.json({ 
      email: email.trim()
    })
  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please check your inputs and try again.' },
      { status: 500 }
    )
  }
}

