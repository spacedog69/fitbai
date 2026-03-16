"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/charts", label: "Gráficas", icon: "📈" },
  { href: "/history", label: "Historial", icon: "📋" },
  { href: "/gallery", label: "Galería", icon: "📸" },
  { href: "/documents", label: "Documentos", icon: "🗂️" },
  { href: "/achievements", label: "Logros", icon: "🏆" },
  { href: "/ai-coach", label: "AI Coach", icon: "🤖", premium: true },
  { href: "/profile", label: "Perfil", icon: "👤" },
  { href: "/share", label: "Compartir", icon: "🔗" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] border-r z-50"
      style={{
        background: COLORS.card,
        borderColor: COLORS.border,
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: COLORS.border }}>
        <h1 className="text-lg font-extrabold m-0 tracking-tight">
          <span style={{ color: COLORS.accent }}>◆</span>{" "}
          <span style={{ color: COLORS.text }}>FitBAI</span>
        </h1>
        <p className="text-[10px] mt-1 m-0 uppercase tracking-widest" style={{ color: COLORS.textMuted }}>
          Body Analytics
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium no-underline"
              style={{
                background: active ? `${COLORS.accent}18` : "transparent",
                color: active ? COLORS.accent : COLORS.textDim,
                borderLeft: active ? `3px solid ${COLORS.accent}` : "3px solid transparent",
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {item.premium && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto"
                  style={{ background: `${COLORS.warning}22`, color: COLORS.warning }}
                >
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-center" style={{ borderColor: COLORS.border }}>
        <p className="text-[10px] m-0" style={{ color: COLORS.textMuted }}>
          v0.1.0
        </p>
      </div>
    </aside>
  );
}
