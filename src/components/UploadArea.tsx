import { useRef, useState } from "react";
import { uploadAndAnalyze } from "../api";

type Props = {
  onResult?: (data: any) => void;
};

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);

  const choose = () => fileRef.current?.click();

  const handleFile = async (e: any) => {
    const f: File | null = e.target.files?.[0] ?? null;
    if (!f) return;

    // ✅ 1) 先用 Object URL 立即預覽（使用者有回饋）
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    const localUrl = URL.createObjectURL(f);
    lastObjectUrlRef.current = localUrl;
    setPreviewURL(localUrl);

    setBusy(true);
    try {
      // 你若有壓縮邏輯，可在這裡先壓（略）
      const resp = await uploadAndAnalyze(f);
      onResult?.(resp);

      // ✅ 2) 後端若有回傳 image_url，就覆蓋為可公開網址（加上防快取參數）
      if (resp?.image_url) {
        const finalUrl = `${resp.image_url}${resp.image_url.includes("?") ? "&" : "?"}t=${Date.now()}`;
        setPreviewURL(finalUrl);
        // 釋放本地 object url
        if (lastObjectUrlRef.current) {
          URL.revokeObjectURL(lastObjectUrlRef.current);
          lastObjectUrlRef.current = null;
        }
      }
    } catch (err) {
      console.error("Upload & Analyze failed:", err);
      alert("上傳或分析失敗，請重試");
    } finally {
      setBusy(false);
      // 清空 input，避免同檔名無法再次觸發 change
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">上傳餐點照片</div>
        <button
          onClick={choose}
          disabled={busy}
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "分析中..." : "選擇圖片"}
        </button>
      </div>

      {/* ✅ 3) 預覽區塊：給固定高度，確保可見；沒有圖時顯示提示框 */}
      {previewURL ? (
        <div className="rounded-xl overflow-hidden bg-black/20">
          <img
            src={previewURL}
            alt="preview"
            className="w-full max-h-[560px] object-contain"
            crossOrigin="anonymous"
          />
        </div>
      ) : (
        <div className="h-64 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/60">
          尚未選擇圖片
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}