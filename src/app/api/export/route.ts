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

  const format = req.nextUrl.searchParams.get("format") || "csv";

  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { date: "asc" },
  });

  if (format === "csv") {
    const header = "Fecha,Peso (kg),Cintura (cm),Grasa (%),Músculo (kg),Notas\n";
    const rows = entries.map((e) =>
      `${e.date},${e.weight},${e.waist || ""},${e.bodyFat || ""},${e.muscle || ""},"${e.notes || ""}"`
    ).join("\n");

    return new NextResponse(header + rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="fitbai-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  // JSON export
  return NextResponse.json(entries);
}
