"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS, DOC_CATEGORIES, MAX_FILE_KB } from "@/lib/constants";
import { formatDate, formatSize, compressImage } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { ImageModal } from "@/components/ui/ImageModal";

interface Doc {
  id: string;
  name: string;
  fileName: string;
  category: string;
  path: string;
  size: number;
  type: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [category, setCategory] = useState("fitdays");
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) setDocs(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    for (const file of Array.from(e.target.files)) {
      const data = await compressImage(file, MAX_FILE_KB);
      await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName || file.name,
          fileName: file.name,
          category,
          data,
          size: data.length,
          type: file.type,
        }),
      });
    }
    setDocName("");
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocs();
  };

  const catDocs = docs.filter((d) => d.category === category);
  const activeCat = DOC_CATEGORIES.find((c) => c.id === category);

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
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>🗂️ Documentos de salud</h2>

        {/* Category tabs */}
        <div className="flex gap-1.5 flex-wrap mb-5">
          {DOC_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              style={{
                border: `1px solid ${category === c.id ? c.color + "66" : COLORS.border}`,
                background: category === c.id ? c.color + "22" : "transparent",
                color: category === c.id ? c.color : COLORS.textDim,
              }}
            >
              <span>{c.icon}</span> {c.label}
              {docs.filter((d) => d.category === c.id).length > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
                  style={{ background: c.color + "33", color: c.color }}
                >
                  {docs.filter((d) => d.category === c.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Upload area */}
        <div
          className="rounded-xl border p-4 mb-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: COLORS.border }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: COLORS.textDim }}>
            Subir a: {activeCat?.icon} {activeCat?.label}
          </div>
          <input
            type="text"
            placeholder="Nombre del documento (opcional)"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full mb-2.5 py-2.5 px-3.5 rounded-xl text-[13px] outline-none"
            style={{ border: `1px solid ${COLORS.border}`, background: COLORS.bg, color: COLORS.text, boxSizing: "border-box" }}
          />
          <div
            onClick={() => fileRef.current?.click()}
            className="text-center cursor-pointer rounded-xl py-4"
            style={{ border: `2px dashed ${activeCat?.color || COLORS.border}44`, background: `${activeCat?.color || COLORS.accent}08` }}
          >
            <div className="text-2xl mb-1">{uploading ? "⏳" : "📤"}</div>
            <div className="text-[13px]" style={{ color: COLORS.textDim }}>{uploading ? "Procesando..." : "Pulsa para subir archivo"}</div>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" onChange={handleUpload} className="hidden" />
          </div>
        </div>

        {/* Documents list */}
        <div className="flex flex-col gap-2">
          {catDocs.length === 0 ? (
            <div className="text-center py-8" style={{ color: COLORS.textMuted }}>
              Sin documentos en esta categoría.
            </div>
          ) : (
            catDocs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 py-3 px-3.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${COLORS.border}` }}
              >
                {doc.path?.startsWith("data:image") ? (
                  <img
                    src={doc.path}
                    alt={doc.name}
                    className="w-12 h-12 object-cover rounded-lg cursor-pointer"
                    onClick={() => setPreviewImg(doc.path)}
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg text-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                    {doc.fileName?.endsWith(".pdf") ? "📄" : "📎"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[13px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: COLORS.text }}>{doc.name}</div>
                  <div className="text-[11px]" style={{ color: COLORS.textMuted }}>{formatDate(doc.createdAt)} · {formatSize(doc.size || 0)}</div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="rounded-lg py-1.5 px-2.5 text-[11px] font-semibold cursor-pointer"
                  style={{ background: `${COLORS.danger}15`, border: `1px solid ${COLORS.danger}33`, color: COLORS.danger }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <ImageModal src={previewImg} onClose={() => setPreviewImg(null)} />
    </>
  );
}
