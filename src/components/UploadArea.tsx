import { useRef, useState } from 'react'
import { uploadAndAnalyze } from '../api'

type Props = { onResult?: (r: { items: any[]; summary?: any }) => void }

async function compressImage(file: File, maxSide = 1600, quality = 0.8): Promise<File> {
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const el = new Image()
      el.onload = () => res(el)
      el.onerror = rej
      el.src = URL.createObjectURL(file)
    })
    const ratio = Math.min(1, maxSide / Math.max(img.width, img.height))
    const w = Math.round(img.width * ratio)
    const h = Math.round(img.height * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)

    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', quality))
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [previewURL, setPreviewURL] = useState<string | null>(null)

  const choose = () => fileRef.current?.click()

  const handle = async (f?: File) => {
    if (!f) return
    if (previewURL) URL.revokeObjectURL(previewURL)
    setPreviewURL(URL.createObjectURL(f))

    setBusy(true)
    try {
      const small = await compressImage(f)
      const resp = await uploadAndAnalyze(small)
      console.log('[UploadArea] analyze result:', resp) // ← 看看形狀：應該長這樣 { items:[], summary:{ totals:{} } }
      onResult?.(resp)
    } catch (e: any) {
      alert('上傳或分析失敗，請重試')
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">上傳餐點照片</div>
        <button
          className="px-3 py-1.5 rounded-lg bg-blue-500/80 hover:bg-blue-500 transition text-sm"
          onClick={choose}
          disabled={busy}
        >
          {busy ? '分析中…' : '選擇圖片'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.currentTarget.files?.[0] || undefined)}
      />

      {previewURL && (
        <div className="rounded-xl overflow-hidden border border-white/10">
          <img src={previewURL} className="w-full object-cover" />
        </div>
      )}
    </div>
  )
}