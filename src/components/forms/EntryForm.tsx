"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS, MAX_FILE_KB } from "@/lib/constants";
import { compressImage } from "@/lib/utils";
import { FilePreview } from "@/components/ui/FilePreview";

interface EntryFile {
  name: string;
  size: number;
  data: string;
  type: string;
  addedAt: string;
}

export interface EntryFormData {
  date: string;
  weight: number;
  waist: number | null;
  bodyFat: number | null;
  muscle: number | null;
  notes: string;
  files: EntryFile[];
}

interface EntryFormProps {
  onSave: (data: EntryFormData) => void;
  onClose: () => void;
  existingData?: EntryFormData | null;
}

export function EntryForm({ onSave, onClose, existingData }: EntryFormProps) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    waist: "",
    bodyFat: "",
    muscle: "",
    notes: "",
    files: [] as EntryFile[],
  });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingData) {
      setForm({
        date: existingData.date,
        weight: existingData.weight?.toString() || "",
        waist: existingData.waist?.toString() || "",
        bodyFat: existingData.bodyFat?.toString() || "",
        muscle: existingData.muscle?.toString() || "",
        notes: existingData.notes || "",
        files: existingData.files || [],
      });
    }
  }, [existingData]);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: EntryFile[] = [];
    for (const file of Array.from(e.target.files)) {
      const data = await compressImage(file, MAX_FILE_KB);
      newFiles.push({
        name: file.name,
        size: data.length,
        data,
        type: file.type,
        addedAt: new Date().toISOString(),
      });
    }
    setForm((f) => ({ ...f, files: [...f.files, ...newFiles] }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!form.weight) return;
    onSave({
      date: form.date,
      weight: parseFloat(form.weight),
      waist: form.waist ? parseFloat(form.waist) : null,
      bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : null,
      muscle: form.muscle ? parseFloat(form.muscle) : null,
      notes: form.notes,
      files: form.files,
    });
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
    fontSize: 12,
    color: COLORS.textDim,
    marginBottom: 4,
    display: "block",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label style={labelStyle}>Fecha</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Peso (kg) *</label>
          <input
            type="number"
            step="0.1"
            placeholder="102.3"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Cintura (cm)</label>
          <input
            type="number"
            step="0.5"
            placeholder="104"
            value={form.waist}
            onChange={(e) => setForm({ ...form, waist: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Grasa corporal (%)</label>
          <input
            type="number"
            step="0.1"
            placeholder="26.0"
            value={form.bodyFat}
            onChange={(e) => setForm({ ...form, bodyFat: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Músculo esq. (kg)</label>
          <input
            type="number"
            step="0.1"
            placeholder="43.9"
            value={form.muscle}
            onChange={(e) => setForm({ ...form, muscle: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Notas</label>
        <input
          type="text"
          placeholder="BBQ, fiesta, semana buena..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          style={inputStyle}
        />
      </div>

      {/* File attachment */}
      <div>
        <label style={labelStyle}>Adjuntar archivos (Fitdays, fotos...)</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="text-center cursor-pointer"
          style={{
            border: `2px dashed ${COLORS.border}`,
            borderRadius: 12,
            padding: 20,
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div className="text-[28px] mb-1.5">📎</div>
          <div className="text-[13px]" style={{ color: COLORS.textDim }}>
            Pulsa para adjuntar imagen o PDF
          </div>
          <div className="text-[11px] mt-1" style={{ color: COLORS.textMuted }}>
            Máx. ~800KB por archivo (las imágenes se comprimen)
          </div>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFiles}
            className="hidden"
          />
        </div>
        {form.files.length > 0 && (
          <div className="flex flex-col gap-2 mt-2.5">
            {form.files.map((f, i) => (
              <FilePreview
                key={i}
                file={f}
                small
                onRemove={() =>
                  setForm((fm) => ({
                    ...fm,
                    files: fm.files.filter((_, j) => j !== i),
                  }))
                }
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-2 py-3.5 rounded-xl text-[15px] font-bold border-none cursor-pointer text-white"
        style={{
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
          boxShadow: `0 4px 20px ${COLORS.accent}44`,
        }}
      >
        {existingData ? "Actualizar" : "Guardar registro"}
      </button>
    </div>
  );
}
