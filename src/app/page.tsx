"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { COLORS } from "@/lib/constants";
import Link from "next/link";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-6">◆</div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4" style={{ color: COLORS.text }}>
          Fit<span style={{ color: COLORS.accent }}>BAI</span>
        </h1>
        <p className="text-xl mb-2" style={{ color: COLORS.textDim }}>
          Body Analytics Intelligence
        </p>
        <p className="text-base max-w-lg mx-auto mb-10" style={{ color: COLORS.textMuted }}>
          Trackea tu composición corporal, visualiza tu progreso con gráficas avanzadas,
          desbloquea logros, y accede a un nutricionista AI personalizado.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-xl text-base font-bold no-underline text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, #059669)`,
              boxShadow: `0 4px 20px ${COLORS.accent}33`,
            }}
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl text-base font-semibold no-underline border"
            style={{ color: COLORS.textDim, borderColor: COLORS.border }}
          >
            Iniciar sesión
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
          {[
            { icon: "📊", title: "Métricas completas", desc: "Peso, cintura, grasa corporal, músculo esquelético y más." },
            { icon: "📈", title: "Gráficas avanzadas", desc: "Visualiza tendencias, composición corporal y cambios semanales." },
            { icon: "🏆", title: "Gamificación", desc: "Logros, rachas, niveles y frases motivacionales." },
            { icon: "🗂️", title: "Documentos", desc: "Sube informes Fitdays, analíticas, planes de dieta y entreno." },
            { icon: "🤖", title: "AI Coach (Pro)", desc: "Nutricionista IA que conoce tus datos y te da planes personalizados." },
            { icon: "🔗", title: "Comparte", desc: "Exporta tus datos o comparte tu progreso con un link." },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border p-6"
              style={{
                background: `linear-gradient(135deg, ${COLORS.card} 0%, ${COLORS.bg} 100%)`,
                borderColor: COLORS.border,
              }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold mb-1" style={{ color: COLORS.text }}>{f.title}</h3>
              <p className="text-xs m-0" style={{ color: COLORS.textMuted }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
