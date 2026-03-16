import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndGrantAchievements } from "@/lib/achievements";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const docs = await prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await req.json();

  const doc = await prisma.document.create({
    data: {
      userId,
      name: data.name,
      fileName: data.fileName,
      category: data.category,
      path: data.data, // base64 stored directly
      size: data.size,
      type: data.type,
    },
  });

  // Check achievements
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const allEntries = await prisma.entry.findMany({ where: { userId }, orderBy: { date: "asc" } });
  const docCount = await prisma.document.count({ where: { userId } });

  if (user) {
    const start = JSON.parse(user.startJson);
    const goals = JSON.parse(user.goalsJson);
    await checkAndGrantAchievements(userId, allEntries, start, goals, docCount);
  }

  return NextResponse.json(doc, { status: 201 });
}
