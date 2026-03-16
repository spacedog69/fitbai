"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { COLORS, DEFAULT_GOALS, DEFAULT_START } from "@/lib/constants";
import { Header } from "@/components/layout/Header";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [start, setStart] = useState(DEFAULT_START);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setGoals(data.goals || DEFAULT_GOALS);
          setStart(data.start || DEFAULT_START);
          setName(data.name || "");
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, goals, start }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: "'JetBrains Mono', monospace",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: COLORS.textDim, marginBottom: 4, display: "block",
    fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="text-lg font-semibold" style={{ color: COLORS.accent }}>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[600px] mx-auto px-6 py-5">
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>👤 Mi perfil</h2>

        <div className="rounded-2xl border p-6 mb-5" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-4" style={{ color: COLORS.text }}>Datos personales</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label style={labelStyle}>Nombre</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={session?.user?.email || ""} disabled style={{ ...inputStyle, opacity: 0.5 }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 mb-5" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-4" style={{ color: COLORS.text }}>🎯 Objetivos</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Peso objetivo (kg)</label>
              <input type="number" step="0.5" value={goals.weight} onChange={(e) => setGoals({ ...goals, weight: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cintura objetivo (cm)</label>
              <input type="number" step="0.5" value={goals.waist} onChange={(e) => setGoals({ ...goals, waist: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Grasa objetivo (%)</label>
              <input type="number" step="0.1" value={goals.bodyFat} onChange={(e) => setGoals({ ...goals, bodyFat: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Músculo objetivo (kg)</label>
              <input type="number" step="0.1" value={goals.muscle} onChange={(e) => setGoals({ ...goals, muscle: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-6 mb-5" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-4" style={{ color: COLORS.text }}>📍 Punto de partida</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Peso inicial (kg)</label>
              <input type="number" step="0.1" value={start.weight} onChange={(e) => setStart({ ...start, weight: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Cintura inicial (cm)</label>
              <input type="number" step="0.5" value={start.waist} onChange={(e) => setStart({ ...start, waist: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Grasa inicial (%)</label>
              <input type="number" step="0.1" value={start.bodyFat} onChange={(e) => setStart({ ...start, bodyFat: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Músculo inicial (kg)</label>
              <input type="number" step="0.1" value={start.muscle} onChange={(e) => setStart({ ...start, muscle: parseFloat(e.target.value) })} style={inputStyle} />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 rounded-xl text-[15px] font-bold border-none cursor-pointer text-white"
          style={{
            background: saved
              ? `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent})`
              : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saved ? "✓ Guardado" : saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </>
  );
}
