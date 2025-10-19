import React, { useRef, useState } from "react";

export type AnalyzeResp = {
  image_url?: string;
  items: any[];
  summary?: {
    kcal?: number;
    protein_g?: number;
    fat_g?: number;
    carb_g?: number;
  };
  error?: string;
};

type Props = {
  onResult?: (data: AnalyzeResp) => void;
  className?: string;
};

const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (window as any).__API_BASE__ ||
  "https://eatlyze-backend.onrender.com";

async function compressImage(
  file: File,
  maxSide = 1280,
  quality = 0.72
): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  const scale = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", quality)
  );

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

async function uploadAndAnalyze(file: File): Promise<AnalyzeResp> {
  const fd = new FormData();
  fd.append("file", file, file.name);

  const url = `${API_BASE}/analyze/image`;
  const res = await fetch(url, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Upload/Analyze failed (${res.status}) ${res.statusText} ${text}`
    );
  }
  const json = (await res.json().catch(() => ({}))) as AnalyzeResp;
  return json || { items: [], summary: undefined };
}

export default function UploadArea({ onResult, className = "" }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const choose = () => fileRef.current?.click();

  const handleFile = async (f: File) => {
    setBusy(true);
    try {
      const small = await compressImage(f);
      const resp = await uploadAndAnalyze(small);

      if (resp?.image_url) {
        setPreviewURL(resp.image_url);
      } else {
        setPreviewURL(URL.createObjectURL(f));
      }

      console.log("[UploadArea] analyze resp:", resp);
      onResult?.(resp);
    } catch (err: any) {
      console.error("Upload & Analyze failed:", err);
      alert("上傳或分析失敗，請重試");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.currentTarget.value = "";
        }}
      />

      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white/80 mb-2">上傳餐點照片</div>
          <button
            onClick={choose}
            disabled={busy}
            className={`px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm ${
              busy ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {busy ? "分析中..." : "選擇圖片"}
          </button>
        </div>

        {previewURL ? (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img
              src={previewURL}
              alt="preview"
              className="block w-full h-auto object-contain bg-black/20"
            />
          </div>
        ) : (
          <div className="text-white/40 text-sm">
            尚未選擇圖片，請先上傳餐點照片。
          </div>
        )}
      </div>
    </div>
  );
}