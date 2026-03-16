import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAndGrantAchievements, updateStreak } from "@/lib/achievements";

async function getUserId(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const entries = await prisma.entry.findMany({
    where: { userId },
    include: { files: true },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await req.json();
  if (!data.weight || !data.date) {
    return NextResponse.json({ error: "Peso y fecha requeridos" }, { status: 400 });
  }

  // Upsert entry (update if same date exists)
  const entry = await prisma.entry.upsert({
    where: { userId_date: { userId, date: data.date } },
    create: {
      userId,
      date: data.date,
      weight: data.weight,
      waist: data.waist || null,
      bodyFat: data.bodyFat || null,
      muscle: data.muscle || null,
      notes: data.notes || "",
    },
    update: {
      weight: data.weight,
      waist: data.waist || null,
      bodyFat: data.bodyFat || null,
      muscle: data.muscle || null,
      notes: data.notes || "",
    },
    include: { files: true },
  });

  // Handle file attachments (stored as base64 in EntryFile for simplicity)
  if (data.files?.length > 0) {
    // Remove old files for this entry
    await prisma.entryFile.deleteMany({ where: { entryId: entry.id } });
    for (const file of data.files) {
      await prisma.entryFile.create({
        data: {
          entryId: entry.id,
          name: file.name,
          path: file.data, // base64 data stored directly for now
          size: file.size,
          type: file.type,
        },
      });
    }
  }

  // Update streak
  await updateStreak(userId, data.date);

  // Check achievements
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const allEntries = await prisma.entry.findMany({ where: { userId }, orderBy: { date: "asc" } });
  const docCount = await prisma.document.count({ where: { userId } });

  if (user) {
    const start = JSON.parse(user.startJson);
    const goals = JSON.parse(user.goalsJson);
    await checkAndGrantAchievements(userId, allEntries, start, goals, docCount);
  }

  return NextResponse.json(entry, { status: 201 });
}
