"use client";

import { useState, useEffect } from "react";
import { COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { ImageModal } from "@/components/ui/ImageModal";

interface GalleryImage {
  name: string;
  data: string;
  date: string;
  weight?: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [er, dr] = await Promise.all([fetch("/api/entries"), fetch("/api/documents")]);
        const allImages: GalleryImage[] = [];

        if (er.ok) {
          const entries = await er.json();
          entries.forEach((e: { files?: { name: string; path: string }[]; date: string; weight: number }) => {
            (e.files || [])
              .filter((f: { path: string }) => f.path?.startsWith("data:image"))
              .forEach((f: { name: string; path: string }) => allImages.push({ name: f.name, data: f.path, date: e.date, weight: e.weight }));
          });
        }

        if (dr.ok) {
          const docs = await dr.json();
          docs
            .filter((d: { path: string }) => d.path?.startsWith("data:image"))
            .forEach((d: { name: string; path: string; createdAt: string }) => allImages.push({ name: d.name, data: d.path, date: d.createdAt }));
        }

        allImages.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        setImages(allImages);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

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
        <h2 className="text-xl font-bold mb-5" style={{ color: COLORS.text }}>📸 Galería</h2>

        {images.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl border-dashed border"
            style={{ background: COLORS.card, borderColor: COLORS.border }}
          >
            <div className="text-5xl mb-4">📷</div>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              Sin imágenes todavía. Adjunta tus informes Fitdays al crear registros o sube documentos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setPreviewImg(img.data)}
                className="cursor-pointer rounded-xl overflow-hidden border"
                style={{ background: COLORS.card, borderColor: COLORS.border }}
              >
                <img src={img.data} alt={img.name} className="w-full h-40 object-cover block" />
                <div className="p-2">
                  <div className="text-[11px] overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: COLORS.textDim }}>
                    {img.name}
                  </div>
                  <div className="text-[10px]" style={{ color: COLORS.textMuted }}>
                    {formatDate(img.date)} {img.weight ? `· ${img.weight}kg` : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ImageModal src={previewImg} onClose={() => setPreviewImg(null)} />
    </>
  );
}
