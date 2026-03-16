import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as { id: string })?.id;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const entry = await prisma.entry.findFirst({
    where: { id: params.id, userId },
    include: { files: true },
  });

  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(entry);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const data = await req.json();
  const entry = await prisma.entry.updateMany({
    where: { id: params.id, userId },
    data: {
      weight: data.weight,
      waist: data.waist || null,
      bodyFat: data.bodyFat || null,
      muscle: data.muscle || null,
      notes: data.notes || "",
    },
  });

  if (entry.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await prisma.entry.deleteMany({
    where: { id: params.id, userId },
  });

  if (result.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}
