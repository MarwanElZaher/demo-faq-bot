import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { anthropic, DEFAULT_MODEL, cachedSystem } from "@/lib/ai";

const FAQ_SYSTEM_PROMPT = `You are the NovaTech internal FAQ assistant. You answer employee questions using the knowledge base provided.

Rules:
- Answer only from the provided FAQ entries
- If the answer is not in the knowledge base, say so clearly
- Be concise and direct
- Format your response in plain text`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const faqs = await db.faqEntry.findMany({ orderBy: { category: "asc" } });
  const knowledgeBase = faqs
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const systemContent = cachedSystem(
    `${FAQ_SYSTEM_PROMPT}\n\n---\nKNOWLEDGE BASE:\n\n${knowledgeBase}`
  );

  const aiRes = await anthropic.messages.create({
    model: DEFAULT_MODEL,
    max_tokens: 512,
    system: systemContent as Parameters<typeof anthropic.messages.create>[0]["system"],
    messages: [{ role: "user", content: message }],
  });

  const responseText =
    aiRes.content[0].type === "text" ? aiRes.content[0].text : "";

  const cached = (aiRes.usage as { cache_read_input_tokens?: number })
    .cache_read_input_tokens
    ? (aiRes.usage as { cache_read_input_tokens?: number })
        .cache_read_input_tokens! > 0
    : false;

  await db.faqQuery.create({
    data: { userMessage: message, aiResponse: responseText, cached },
  });

  return NextResponse.json({ answer: responseText, cached });
}

export async function GET() {
  const faqs = await db.faqEntry.findMany({ orderBy: { category: "asc" } });
  return NextResponse.json(faqs);
}
