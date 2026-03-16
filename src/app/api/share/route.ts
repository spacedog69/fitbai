import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { daysToExpire = 7 } = await req.json();

  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + daysToExpire * 24 * 60 * 60 * 1000);

  const link = await prisma.sharedLink.create({
    data: { userId, token, expiresAt },
  });

  return NextResponse.json({
    token: link.token,
    url: `${process.env.NEXTAUTH_URL}/share/${link.token}`,
    expiresAt: link.expiresAt,
  });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

  const link = await prisma.sharedLink.findUnique({ where: { token } });
  if (!link) return NextResponse.json({ error: "Link no encontrado" }, { status: 404 });
  if (new Date() > link.expiresAt) return NextResponse.json({ error: "Link expirado" }, { status: 410 });

  const user = await prisma.user.findUnique({
    where: { id: link.userId },
    select: { name: true, goalsJson: true, startJson: true, level: true, xp: true },
  });

  const entries = await prisma.entry.findMany({
    where: { userId: link.userId },
    orderBy: { date: "asc" },
    select: { date: true, weight: true, waist: true, bodyFat: true, muscle: true },
  });

  return NextResponse.json({
    user: {
      name: user?.name,
      goals: user ? JSON.parse(user.goalsJson) : null,
      start: user ? JSON.parse(user.startJson) : null,
      level: user?.level,
    },
    entries,
  });
}
