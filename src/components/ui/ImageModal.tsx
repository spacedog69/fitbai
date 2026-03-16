"use client";

interface ImageModalProps {
  src: string | null;
  onClose: () => void;
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center z-[2000] p-5 cursor-zoom-out"
      style={{
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <img
        src={src}
        alt="Preview"
        className="max-w-[95%] max-h-[95%] rounded-xl"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
      />
    </div>
  );
}
