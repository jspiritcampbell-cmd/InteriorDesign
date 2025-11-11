import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";

export const runtime = "edge";

const InputSchema = z.object({
  roomType: z.string().optional(),
  dimensions: z.string().optional(),
  vibe: z.string().optional(),
  colors: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = InputSchema.parse(json);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // Use a small, capable model for speed/cost. Update model name as needed.
    const model = "gpt-4o-mini";

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(data) }
      ],
      response_format: { type: "json_object" }
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";

    // Basic guard: validate expected structure
    const OutputSchema = z.object({
      theme: z.string(),
      palette: z.array(z.string()).min(3).max(6),
      suggestions: z.array(z.string()).min(3),
      layout_tips: z.array(z.string()).min(2),
      image_prompt: z.string(),
      budget_notes: z.string()
    });

    const parsed = OutputSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          error: "Model returned unexpected structure",
          details: parsed.error.flatten()
        }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed.data), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Request failed", details: String(err?.message || err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
