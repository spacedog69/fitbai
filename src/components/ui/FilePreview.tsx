"use client";

import { COLORS } from "@/lib/constants";
import { formatSize } from "@/lib/utils";

interface FileData {
  name: string;
  size: number;
  data?: string;
  type?: string;
}

interface FilePreviewProps {
  file: FileData;
  onRemove?: () => void;
  small?: boolean;
}

export function FilePreview({ file, onRemove, small }: FilePreviewProps) {
  const isImage = file.data?.startsWith("data:image");
  const dim = small ? 32 : 48;

  return (
    <div
      className="flex items-center gap-2.5 rounded-xl"
      style={{
        padding: small ? "6px 10px" : "10px 14px",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${COLORS.border}`,
        fontSize: small ? 12 : 13,
      }}
    >
      {isImage ? (
        <img
          src={file.data}
          alt={file.name}
          className="object-cover rounded-md"
          style={{ width: dim, height: dim }}
        />
      ) : (
        <div
          className="flex items-center justify-center rounded-md"
          style={{
            width: dim,
            height: dim,
            background: "rgba(255,255,255,0.05)",
            fontSize: small ? 16 : 20,
          }}
        >
          {file.name?.endsWith(".pdf") ? "📄" : "📎"}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div
          className="font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: COLORS.text }}
        >
          {file.name}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: small ? 10 : 11 }}>
          {formatSize(file.size || 0)}
        </div>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="bg-transparent border-none cursor-pointer text-base p-1"
          style={{ color: COLORS.textMuted }}
        >
          ×
        </button>
      )}
    </div>
  );
}
