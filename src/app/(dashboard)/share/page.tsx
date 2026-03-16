"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { Header } from "@/components/layout/Header";

export default function SharePage() {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const createShareLink = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daysToExpire: 7 }),
      });
      if (res.ok) {
        const data = await res.json();
        setShareUrl(data.url);
      }
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export?format=csv");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fitbai-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  const exportJSON = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/export?format=json");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fitbai-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  const buttonStyle: React.CSSProperties = {
    padding: "14px 20px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.05)",
    color: COLORS.text,
    width: "100%",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  return (
    <>
      <Header />
      <div className="max-w-[600px] mx-auto px-6 py-5">
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>🔗 Compartir y exportar</h2>

        {/* Share link */}
        <div className="rounded-2xl border p-6 mb-5" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-2" style={{ color: COLORS.text }}>Compartir progreso</h3>
          <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
            Genera un link temporal (7 días) para compartir tu progreso con otros.
          </p>

          {shareUrl ? (
            <div className="flex flex-col gap-3">
              <div
                className="py-2.5 px-3.5 rounded-lg text-sm font-mono break-all"
                style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.accent }}
              >
                {shareUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold border-none cursor-pointer text-white"
                  style={{ background: copied ? COLORS.accent : `${COLORS.accent}88` }}
                >
                  {copied ? "✓ Copiado" : "📋 Copiar link"}
                </button>
                <button
                  onClick={createShareLink}
                  className="py-2.5 px-4 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textDim }}
                >
                  Nuevo link
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={createShareLink}
              disabled={creating}
              className="w-full py-3 rounded-xl text-sm font-bold border-none cursor-pointer text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
                opacity: creating ? 0.7 : 1,
              }}
            >
              {creating ? "Generando..." : "🔗 Generar link de compartir"}
            </button>
          )}
        </div>

        {/* Export */}
        <div className="rounded-2xl border p-6" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-2" style={{ color: COLORS.text }}>Exportar datos</h3>
          <p className="text-xs mb-4" style={{ color: COLORS.textMuted }}>
            Descarga todos tus registros en el formato que prefieras.
          </p>

          <div className="flex flex-col gap-3">
            <button onClick={exportCSV} disabled={exporting} style={buttonStyle}>
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-bold">Exportar CSV</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Compatible con Excel, Google Sheets</div>
              </div>
            </button>
            <button onClick={exportJSON} disabled={exporting} style={buttonStyle}>
              <span className="text-2xl">📦</span>
              <div>
                <div className="font-bold">Exportar JSON</div>
                <div className="text-xs" style={{ color: COLORS.textMuted }}>Para desarrolladores o backup completo</div>
              </div>
            </button>
          </div>
        </div>

        {/* Social sharing tips */}
        <div className="rounded-2xl border p-6 mt-5" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <h3 className="text-base font-bold mb-2" style={{ color: COLORS.text }}>📱 Compartir en redes</h3>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            Usa el link generado para compartir en WhatsApp, Twitter, Instagram Stories o cualquier red social.
            El link muestra un resumen visual de tu progreso.
          </p>
        </div>
      </div>
    </>
  );
}
