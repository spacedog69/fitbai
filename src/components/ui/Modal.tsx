"use client";

import { useEffect } from "react";
import { COLORS } from "@/lib/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 460 }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[1000] p-5"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl overflow-y-auto animate-slide-up"
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          padding: 28,
          maxWidth,
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold m-0" style={{ color: COLORS.text }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer"
            style={{ color: COLORS.textMuted }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
