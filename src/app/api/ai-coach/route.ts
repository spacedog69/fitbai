import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Check premium
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.premium) {
    return NextResponse.json({ error: "Función premium requerida" }, { status: 403 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
  }

  const { message, conversationId } = await req.json();

  // Get user's latest entries for context
  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
  });

  const goals = JSON.parse(user.goalsJson);
  const start = JSON.parse(user.startJson);

  const systemPrompt = `Eres un nutricionista y entrenador personal con IA llamado FitBAI Coach.
Hablas en español. Eres motivador, directo y basado en evidencia científica.

Datos del usuario:
- Peso inicial: ${start.weight}kg, Objetivo: ${goals.weight}kg
- Cintura inicial: ${start.waist}cm, Objetivo: ${goals.waist}cm
- Grasa corporal inicial: ${start.bodyFat}%, Objetivo: ${goals.bodyFat}%
- Músculo esquelético inicial: ${start.muscle}kg, Objetivo: ${goals.muscle}kg

Últimas medidas:
${entries.map(e => `${e.date}: ${e.weight}kg${e.waist ? `, cintura ${e.waist}cm` : ""}${e.bodyFat ? `, grasa ${e.bodyFat}%` : ""}${e.muscle ? `, músculo ${e.muscle}kg` : ""}`).join("\n")}

Puedes ayudar con:
- Planes de dieta semanales personalizados
- Ajustes de entrenamiento
- Consejos de sueño y recuperación
- Análisis de progreso
- Motivación y estrategias

Sé conciso y práctico. Usa emojis moderadamente.`;

  // Load or create conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.aiConversation.findFirst({
      where: { id: conversationId, userId },
    });
  }

  const previousMessages = conversation
    ? JSON.parse(conversation.messagesJson)
    : [];

  const messages = [
    ...previousMessages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "";

    // Save conversation
    const allMessages = [
      ...previousMessages,
      { role: "user", content: message },
      { role: "assistant", content: assistantMessage },
    ];

    const saved = conversation
      ? await prisma.aiConversation.update({
          where: { id: conversation.id },
          data: { messagesJson: JSON.stringify(allMessages) },
        })
      : await prisma.aiConversation.create({
          data: {
            userId,
            title: message.slice(0, 50),
            messagesJson: JSON.stringify(allMessages),
          },
        });

    return NextResponse.json({
      message: assistantMessage,
      conversationId: saved.id,
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return NextResponse.json({ error: "Error al contactar con el AI Coach" }, { status: 500 });
  }
}
