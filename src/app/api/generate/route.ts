import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // Initialize Gemini 1.5 Flash (fast & great for writing tasks)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // System prompt helps Gemini understand its role in BharatDocs
    const result = await model.generateContent(`
      You are an expert AI writing assistant for BharatDocs, an Indian word processor. 
      Help the user with their request: "${prompt}"
      
      Requirements:
      - Maintain a helpful and professional tone.
      - If the user asks in an Indian language, respond in that language.
      - Provide clean text without unnecessary conversational filler.
    `);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}