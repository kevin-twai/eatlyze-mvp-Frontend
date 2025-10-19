import React, { useRef, useState } from 'react'
import { uploadAndAnalyze } from '../api'

type Props = {
  onResult?: (payload: any) => void
}

// 客端壓縮：長邊 <=1280、JPEG 品質 0.72（速度/畫質折衷）
async function compressImage(file: File, maxSide = 1280, quality = 0.72): Promise<File> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = URL.createObjectURL(file)
  })

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const { width, height } = img
  const ratio = width > height ? maxSide / width : maxSide / height
  const w = Math.max(1, Math.round(width * Math.min(1, ratio)))
  const h = Math.max(1, Math.round(height * Math.min(1, ratio)))

  canvas.width = w
  canvas.height = h
  ctx.drawImage(img, 0, 0, w, h)

  const blob: Blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b as Blob), 'image/jpeg', quality)
  })

  URL.revokeObjectURL(img.src)
  return new File([blob], file.name.replace(/\.(png|jpe?g|webp)$/i, '') + '.jpg', {
    type: 'image/jpeg',
  })
}

export default function UploadArea({ onResult }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [previewURL, setPreviewURL] = useState<string | null>(null)

  const choose = () => fileRef.current?.click()

  const handleFile = async (f: File) => {
    // 先顯示本地預覽
    if (previewURL) URL.revokeObjectURL(previewURL)
    setPreviewURL(URL.createObjectURL(f))

    setBusy(true)
    try {
      // 壓縮再上傳 → 更快
      const small = await compressImage(f)
      const resp = await uploadAndAnalyze(small) // 後端分析
      onResult?.(resp)

      // 後端會回傳實際可公開讀取的 image_url（/image/...）
      if (resp && typeof resp.image_url === 'string' && resp.image_url.length > 0) {
        setPreviewURL(resp.image_url)
      }
    } catch (err: any) {
      console.error('Upload & Analyze failed:', err)
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
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-50 cursor-not-allowed"
        >
          {busy ? '分析中…' : '選擇圖片'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
        className="hidden"
      />

      {previewURL ? (
        <img src={previewURL} className="w-full rounded-lg" alt="preview" />
      ) : (
        <div className="text-white/40 text-sm">尚未選擇圖片</div>
      )}
    </div>
  )
}