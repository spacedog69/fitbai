"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS } from "@/lib/constants";

const MOBILE_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "📊" },
  { href: "/charts", label: "Gráficas", icon: "📈" },
  { href: "/history", label: "Historial", icon: "📋" },
  { href: "/achievements", label: "Logros", icon: "🏆" },
  { href: "/profile", label: "Perfil", icon: "👤" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 border-t z-50 flex"
      style={{
        background: COLORS.card,
        borderColor: COLORS.border,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {MOBILE_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium no-underline"
            style={{ color: active ? COLORS.accent : COLORS.textMuted }}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
