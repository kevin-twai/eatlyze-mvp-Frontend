import React, { useRef, useState } from "react";
import { uploadAndAnalyze, AnalyzeResponse } from "../api";

interface Props {
  onResult?: (result: AnalyzeResponse) => void;
}

async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  const img = document.createElement("img");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
  img.src = dataUrl;
  await new Promise((r) => (img.onload = r));
  const scale = Math.min(maxSide / img.width, maxSide / img.height, 1);
  const w = img.width * scale;
  const h = img.height * scale;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return resolve(file);
        resolve(new File([blob], file.name, { type: file.type }));
      },
      file.type,
      quality
    );
  });
}

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const choose = () => fileRef.current?.click();

  const handleFile = async (f: File) => {
    // 先顯示使用者本地預覽圖
    if (previewURL) URL.revokeObjectURL(previewURL);
    setPreviewURL(URL.createObjectURL(f));

    setBusy(true);
    try {
      const small = await compressImage(f);
      const resp: AnalyzeResponse = await uploadAndAnalyze(small);
      onResult?.(resp);

      // ✅ 用後端回傳的實際 URL 取代本地預覽
      if (resp.image_url) setPreviewURL(resp.image_url);
    } catch (err: any) {
      console.error("Upload & Analyze failed:", err);
      alert("上傳或分析失敗，請重試");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">上傳餐點照片</div>
        <button
          onClick={choose}
          disabled={busy}
          className={`px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm ${
            busy ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {busy ? "分析中..." : "選擇圖片"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      {previewURL && (
        <div className="mt-3">
          <img
            src={previewURL}
            alt="preview"
            className="rounded-xl border border-white/10 max-h-[480px] mx-auto"
          />
        </div>
      )}
    </div>
  );
}