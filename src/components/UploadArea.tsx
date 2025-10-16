import { useState } from 'react'
import { uploadAndAnalyze } from '../api'

export default function UploadArea({ onResult }: { onResult: (r: any) => void }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // 顯示圖片預覽
    const url = URL.createObjectURL(file)
    setPreview(url)

    setBusy(true)
    try {
      const resp = await uploadAndAnalyze(file) // 後端回 { items, summary }
      onResult(resp)
    } catch (err: any) {
      console.error('uploadAndAnalyze failed:', err?.response?.status, err?.response?.data || err?.message)
      alert('上傳或分析失敗，請重試')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/80 mb-2">上傳餐點照片</div>
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer">
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
        <span>{busy ? '分析中…' : '選擇檔案'}</span>
      </label>

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="預覽"
            className="w-full max-h-[360px] object-contain rounded-xl border border-white/10"
          />
        </div>
      )}
    </div>
  )
}