// src/components/UploadArea.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";

export type Totals = {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
};

export type AnalyzeResp = {
  items: any[];
  totals: Totals;
  error?: string | null;
  model?: string;
  image_url?: string;
};

type Props = {
  onResult?: (data: AnalyzeResp) => void;
  className?: string;
  apiBase?: string; // 可覆寫 API base
};

// ✅ Vite 環境下正確讀取 API Base 的寫法
const resolveApiBase = (override?: string): string => {
  return (
    override ||
    (import.meta as any)?.env?.VITE_API_URL ||
    (import.meta as any)?.env?.VITE_API_BASE_URL ||
    (window as any)?.__API_BASE__ ||
    "https://eatlyze-backend.onrender.com"
  );
};

/** 壓縮影像：限制長邊、輸出 JPEG */
async function compressImage(
  file: File,
  maxSide = 1280,
  quality = 0.8
): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bmp, 0, 0, w, h);

    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve((b as Blob) || file), "image/jpeg", quality)
    );
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

async function uploadAndAnalyze(
  apiBase: string,
  file: File,
  includeGarnish: boolean
): Promise<AnalyzeResp> {
  const fd = new FormData();
  fd.append("file", file, file.name);
  fd.append("include_garnish", includeGarnish ? "1" : "0");

  const url = `${apiBase}/analyze/image`;
  const res = await fetch(url, { method: "POST", body: fd });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload/Analyze failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = (await res.json().catch(() => ({}))) as Partial<AnalyzeResp>;

  const safe: AnalyzeResp = {
    items: Array.isArray(json?.items) ? json.items : [],
    totals: {
      kcal: Number(json?.totals?.kcal || 0),
      protein_g: Number(json?.totals?.protein_g || 0),
      fat_g: Number(json?.totals?.fat_g || 0),
      carb_g: Number(json?.totals?.carb_g || 0),
    },
    error: json?.error ?? null,
    model: json?.model,
    image_url: json?.image_url,
  };

  return safe;
}

export default function UploadArea({ onResult, className = "", apiBase }: Props) {
  const API_BASE = useMemo(() => resolveApiBase(apiBase), [apiBase]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [busy, setBusy] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [includeGarnish, setIncludeGarnish] = useState(false);

  const resetPreview = () => {
    setPreviewURL(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const choose = () => inputRef.current?.click();

  const handleFile = useCallback(
    async (f: File) => {
      setBusy(true);
      try {
        const small = await compressImage(f);
        setPreviewURL(URL.createObjectURL(small));

        const resp = await uploadAndAnalyze(API_BASE, small, includeGarnish);
        onResult?.(resp);

        if (resp.image_url) setPreviewURL(resp.image_url);
        if (resp.error)
          console.warn("[analyze] backend warning:", resp.error);
      } catch (err: any) {
        console.error("Upload & Analyze failed:", err);
        alert("上傳或分析失敗，請再試一次。");
      } finally {
        setBusy(false);
      }
    },
    [API_BASE, includeGarnish, onResult]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  return (
    <div className={className}>
      <input
        ref={inputRef}
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
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-white/70 text-sm">
              <input
                type="checkbox"
                checked={includeGarnish}
                onChange={(e) => setIncludeGarnish(e.target.checked)}
              />
              併入配菜(蔥花/香草…)
            </label>
            <button
              onClick={choose}
              disabled={busy}
              className={`px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm ${
                busy ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {busy ? "分析中…" : "選擇圖片"}
            </button>
            {previewURL && (
              <button
                onClick={resetPreview}
                disabled={busy}
                className="px-3 py-1 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm"
              >
                清除
              </button>
            )}
          </div>
        </div>

        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="rounded-xl overflow-hidden border border-white/10 min-h-[180px] flex items-center justify-center bg-black/20"
        >
          {previewURL ? (
            <img
              src={previewURL}
              alt="preview"
              className="block w-full h-auto object-contain"
            />
          ) : (
            <div className="text-white/40 text-sm py-12 text-center">
              尚未選擇圖片，拖曳到此或點右上角「選擇圖片」上傳。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}