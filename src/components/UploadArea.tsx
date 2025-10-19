import { useRef, useState } from "react";
import { uploadAndAnalyze, AnalyzeResponse } from "../api";

type Props = {
  onResult?: (r: AnalyzeResponse) => void;
};

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const choose = () => fileRef.current?.click();

  const handleFile = async (f: File) => {
    setBusy(true);
    try {
      // 呼叫後端：回傳 { image_url, items, summary }
      const resp = await uploadAndAnalyze(f);

      // 通知上層
      onResult?.(resp);

      // 預覽：以後端回傳公開 URL 為主；若沒有就用本地 URL
      if (resp?.image_url) setPreviewURL(resp.image_url);
      else setPreviewURL(URL.createObjectURL(f));
    } catch (err) {
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
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          onClick={choose}
          disabled={busy}
        >
          {busy ? "分析中..." : "選擇圖片"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      {previewURL && (
        <div className="rounded-xl overflow-hidden border border-white/10">
          <img src={previewURL} alt="uploaded" className="w-full object-cover" />
        </div>
      )}
    </div>
  );
}