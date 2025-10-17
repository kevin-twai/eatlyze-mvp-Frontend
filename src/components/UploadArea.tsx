import { useRef, useState } from 'react'
import { uploadAndAnalyze } from '../api'

type Props = {
  onResult?: (data: any) => void
}

/** 壓縮圖片成 JPEG（最大邊 1600px，品質 0.8） */
async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  const src = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image()
      im.onload = () => resolve(im)
      im.onerror = reject
      im.src = src
    })

    const { width, height } = img
    const scale = Math.min(1, maxSide / Math.max(width, height))
    const targetW = Math.round(width * scale)
    const targetH = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, targetW, targetH)

    const blob: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b as Blob), 'image/jpeg', quality)
    )

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } finally {
    URL.revokeObjectURL(src)
  }
}

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const choose = () => fileRef.current?.click()

  const handleFile = async (f: File) => {
    // 預覽
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))

    setBusy(true)
    try {
      const small = await compressImage(f)
      const resp = await uploadAndAnalyze(small) // 這裡已是 { items, summary }
      onResult?.(resp) // ✅ 不要 resp.data
    } catch (err: any) {
      console.error('uploadAndAnalyze failed:', err?.response?.status, err?.response?.data || err?.message)
      alert('上傳或分析失敗，請重試')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">上傳餐點照片</div>
        <button
          onClick={choose}
          disabled={busy}
          className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-sm disabled:opacity-60"
        >
          {busy ? '分析中…' : '選擇圖片'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />

      <div className="rounded-2xl bg-black/30 border border-white/10 aspect-[4/3] flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="預覽" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-white/40 text-sm">尚未選擇圖片</div>
        )}
      </div>
    </div>
  )
}