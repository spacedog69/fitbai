"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Modal } from "@/components/ui/Modal";
import { EntryForm, type EntryFormData } from "@/components/forms/EntryForm";
import { ImageModal } from "@/components/ui/ImageModal";

interface EntryFile {
  name: string;
  path: string;
  size: number;
  type: string;
}

interface Entry {
  id: string;
  date: string;
  weight: number;
  waist: number | null;
  bodyFat: number | null;
  muscle: number | null;
  notes: string;
  files: EntryFile[];
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/entries");
      if (res.ok) setEntries(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSave = async (data: EntryFormData) => {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setModalOpen(false);
    setEditEntry(null);
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    fetchEntries();
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.bg }}>
        <div className="text-lg font-semibold" style={{ color: COLORS.accent }}>Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <Header onNewEntry={() => { setEditEntry(null); setModalOpen(true); }} />
      <div className="max-w-[900px] mx-auto px-6 py-5">
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>📋 Historial de registros</h2>

        <div className="rounded-2xl border overflow-hidden" style={{ background: COLORS.card, borderColor: COLORS.border }}>
          {sorted.length === 0 ? (
            <div className="text-center py-10" style={{ color: COLORS.textMuted }}>Sin registros.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Fecha", "Peso", "Cintura", "Grasa", "Musc.", "Adj.", "Notas", ""].map((h, i) => (
                      <th key={i} className="py-3.5 px-2.5 text-left text-[11px] uppercase tracking-wider font-semibold" style={{ color: COLORS.textMuted }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...sorted].reverse().map((e, i) => (
                    <tr key={e.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      <td className="py-3 px-2.5 font-semibold whitespace-nowrap" style={{ color: COLORS.text }}>{formatDate(e.date)}</td>
                      <td className="py-3 px-2.5 font-mono font-bold" style={{ color: COLORS.accent }}>{e.weight.toFixed(1)}</td>
                      <td className="py-3 px-2.5 font-mono" style={{ color: e.waist ? COLORS.blue : COLORS.textMuted }}>{e.waist?.toFixed(1) || "—"}</td>
                      <td className="py-3 px-2.5 font-mono" style={{ color: e.bodyFat ? COLORS.orange : COLORS.textMuted }}>{e.bodyFat?.toFixed(1) || "—"}</td>
                      <td className="py-3 px-2.5 font-mono" style={{ color: e.muscle ? COLORS.purple : COLORS.textMuted }}>{e.muscle?.toFixed(1) || "—"}</td>
                      <td className="py-3 px-2.5">
                        {e.files?.length > 0 ? (
                          <div className="flex gap-1">
                            {e.files.map((f, j) =>
                              f.path?.startsWith("data:image") ? (
                                <img key={j} src={f.path} alt="" className="w-7 h-7 object-cover rounded cursor-pointer" onClick={() => setPreviewImg(f.path)} />
                              ) : (
                                <span key={j} className="text-lg cursor-pointer" title={f.name}>📄</span>
                              )
                            )}
                          </div>
                        ) : <span style={{ color: COLORS.textMuted }}>—</span>}
                      </td>
                      <td className="py-3 px-2.5 max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: COLORS.textDim }}>
                        {e.notes || "—"}
                      </td>
                      <td className="py-3 px-2.5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditEntry(e); setModalOpen(true); }}
                            className="rounded-md py-1 px-2 text-xs cursor-pointer"
                            style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: COLORS.textDim }}
                          >✏️</button>
                          {deleteConfirm === e.id ? (
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="rounded-md py-1 px-2 text-[11px] font-semibold cursor-pointer"
                              style={{ background: `${COLORS.danger}22`, border: `1px solid ${COLORS.danger}44`, color: COLORS.danger }}
                            >OK</button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(e.id)}
                              className="rounded-md py-1 px-2 text-xs cursor-pointer"
                              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: COLORS.textDim }}
                            >🗑️</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditEntry(null); }} title={editEntry ? "✏️ Editar registro" : "📊 Nuevo registro"}>
        <EntryForm
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditEntry(null); }}
          existingData={editEntry ? {
            date: editEntry.date,
            weight: editEntry.weight,
            waist: editEntry.waist,
            bodyFat: editEntry.bodyFat,
            muscle: editEntry.muscle,
            notes: editEntry.notes,
            files: editEntry.files?.map(f => ({ name: f.name, size: f.size, data: f.path, type: f.type, addedAt: "" })) || [],
          } : null}
        />
      </Modal>
      <ImageModal src={previewImg} onClose={() => setPreviewImg(null)} />
    </>
  );
}
