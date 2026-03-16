"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { COLORS } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email o contraseña incorrectos");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.text,
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: COLORS.bg }}>
      <div
        className="w-full max-w-[400px] rounded-2xl border p-8"
        style={{ background: COLORS.card, borderColor: COLORS.border }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">◆</div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: COLORS.text }}>
            Fit<span style={{ color: COLORS.accent }}>BAI</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.textDim }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: COLORS.textDim }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              required
            />
          </div>

          {error && (
            <div className="text-xs text-center py-2 px-3 rounded-lg" style={{ background: `${COLORS.danger}15`, color: COLORS.danger }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[15px] font-bold border-none cursor-pointer text-white mt-2"
            style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: COLORS.textMuted }}>
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold no-underline" style={{ color: COLORS.accent }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
