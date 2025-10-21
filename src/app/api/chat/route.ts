// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, systemPrompt, model, temperature, maxTokens } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'messages' array" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful, empathetic life coach and transformation guide.",
        },
        ...messages,
      ],
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 1000,
    });

    const responseMessage = completion.choices[0].message.content;

    if (!responseMessage) {
      throw new Error("Empty response from OpenAI");
    }

    return NextResponse.json({
      message: responseMessage,
      usage: completion.usage,
    });

  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
        { status: 500 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "OpenAI rate limit reached. Please try again later." },
        { status: 429 }
      );
    }

    if (error?.status === 500) {
      return NextResponse.json(
        { error: "OpenAI service error. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to get AI response" },
      { status: 500 }
    );
  }
}