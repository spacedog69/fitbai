"use client";

import { useSession, signOut } from "next-auth/react";
import { COLORS } from "@/lib/constants";

interface HeaderProps {
  onNewEntry?: () => void;
}

export function Header({ onNewEntry }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className="border-b px-6 py-4 lg:ml-[220px]"
      style={{
        background: `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.card} 50%, ${COLORS.bg} 100%)`,
        borderColor: COLORS.border,
      }}
    >
      <div className="max-w-[900px] mx-auto flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="lg:hidden text-xl font-extrabold m-0 tracking-tight">
            <span style={{ color: COLORS.accent }}>◆</span>{" "}
            <span style={{ color: COLORS.text }}>FitBAI</span>
          </h1>
          {session?.user?.name && (
            <p className="text-xs m-0 mt-1" style={{ color: COLORS.textMuted }}>
              Hola, {session.user.name} 👋
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {onNewEntry && (
            <button
              onClick={onNewEntry}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold border-none cursor-pointer text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, #059669)`,
                boxShadow: `0 4px 20px ${COLORS.accent}33`,
              }}
            >
              <span className="text-base">+</span> Registro
            </button>
          )}
          {session && (
            <button
              onClick={() => signOut()}
              className="px-3 py-2 rounded-xl text-xs font-medium border cursor-pointer"
              style={{
                background: "transparent",
                borderColor: COLORS.border,
                color: COLORS.textMuted,
              }}
            >
              Salir
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
