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

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, name: true, image: true, premium: true,
      goalsJson: true, startJson: true, xp: true, level: true, streak: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json({
    ...user,
    goals: JSON.parse(user.goalsJson),
    start: JSON.parse(user.startJson),
  });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await req.json();
  const updateData: Record<string, string> = {};

  if (data.name) updateData.name = data.name;
  if (data.goals) updateData.goalsJson = JSON.stringify(data.goals);
  if (data.start) updateData.startJson = JSON.stringify(data.start);

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({ success: true, user });
}
