import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function weekLabel(d: string) {
  return new Date(d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return `Hace ${Math.floor(diffDays / 30)} meses`;
}

export async function compressImage(
  file: File,
  maxKB: number
): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!file.type.startsWith("image/")) {
        resolve(result);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width,
          h = img.height;
        const maxDim = 1200;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.7;
        let output = canvas.toDataURL("image/jpeg", quality);
        while (output.length / 1024 > maxKB && quality > 0.2) {
          quality -= 0.1;
          output = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(output);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}

export function calculateProgress(
  current: number,
  start: number,
  goal: number
) {
  if (start === goal) return 100;
  return Math.min(100, Math.max(0, ((start - current) / (start - goal)) * 100));
}

export function getRandomQuote(quotes: { text: string; author: string }[]) {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
