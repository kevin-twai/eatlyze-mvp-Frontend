import { useRef, useState } from 'react'
import { uploadAndAnalyze } from '../api'

type Props = {
  onResult: (data: any) => void
}

/** 圖片壓縮函式，避免超大圖檔上傳失敗 */
async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  const img = new Image()
  img.src = URL.createObjectURL(file)
  await new Promise((res) => (img.onload = res))

  const canvas = document.createElement('canvas')
  const scale = Math.min(maxSide / img.width, maxSide / img.height, 1)
  canvas.width = img.width * scale
  canvas.height = img.height * scale

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context error')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) throw new Error('Image compression failed')
        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      quality
    )
  })
}

/** 主元件 */
export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  /** 開啟檔案選擇器 */
  const choose = () => fileRef.current?.click()

  /** 處理上傳流程 */
  const handleFile = async (f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))
    setBusy(true)

    try {
      const small = await compressImage(f) // 壓縮圖片
      const resp = await uploadAndAnalyze(small) // 呼叫後端
      console.log('[UploadArea] resp:', resp)
      onResult?.(resp) // ✅ 統一結構，直接丟 {items, summary}
    } catch (err: any) {
      console.error('Upload/Analyze failed:', err)
      alert('上傳或分析失敗，請重試')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl bg-white/5 p-4 text-white">
      <div className="mb-2 text-white/80">上傳餐點照片</div>

      <div className="flex items-center justify-between">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        <button
          onClick={choose}
          disabled={busy}
          className={`rounded-lg px-4 py-2 font-medium transition ${
            busy
              ? 'bg-gray-500 text-white/80 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {busy ? '分析中…' : '選擇圖片'}
        </button>
      </div>

      {previewUrl && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <img
            src={previewUrl}
            alt="preview"
            className="w-full object-cover transition-opacity duration-300"
          />
        </div>
      )}
    </div>
  )
}