import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { details } = body

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured in environment variables')
      return NextResponse.json(
        { error: 'Email generation service is temporarily unavailable. Please check back later.' },
        { status: 503 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    
    return NextResponse.json({ 
      email: response.text || "Could not generate email. Please try again." 
    })
  } catch (error) {
    console.error('Email generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please check your inputs and try again.' },
      { status: 500 }
    )
  }
}

