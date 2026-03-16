import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { unlockedAt: "desc" },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true, streak: true },
  });

  return NextResponse.json({ achievements, stats: user });
}
