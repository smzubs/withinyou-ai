// src/app/api/clarity-summary/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge"; // optional, faster & cheaper

export async function POST(req: Request) {
  try {
    const { answers } = await req.json() as { answers: Array<{ question: string; value: string }> };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Missing or invalid 'answers' array." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server." },
        { status: 500 }
      );
    }

    // Build a concise prompt
    const prompt = `
You are a seasoned life coach. Based on these answers, write a ~120-word "Clarity Snapshot":
- 1–2 sentences on what the user is really aiming for.
- 2–3 bullet points: strengths you notice.
- 2–3 bullet points: next best steps for 7 days (simple, doable).
Keep it warm, kind, specific, and non-judgmental.

Answers:
${answers.map((a, i) => `${i + 1}. ${a.question}: ${a.value}`).join("\n")}
    `.trim();

    // Call OpenAI (uses the Chat Completions API)
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You create concise, practical, supportive clarity summaries." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!completion.ok) {
      const err = await completion.text();
      return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: 500 });
    }

    const data = await completion.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate your clarity snapshot.";

    return NextResponse.json({ summary: text }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Server error: ${err?.message || String(err)}` },
      { status: 500 }
    );
  }
}
