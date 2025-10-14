import { useState } from 'react'
import { uploadAndAnalyze } from '../api'

export default function UploadArea({ onResult }: { onResult: (r: any) => void }) {
  const [loading, setLoading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      console.log('📤 正在上傳圖片至後端分析...', file.name)
      const resp = await uploadAndAnalyze(file)
      console.log('✅ 後端回傳結果:', resp)
      onResult(resp) // resp = { status:'ok', data:{ items:[...] } }
    } catch (err: any) {
      console.error(
        '❌ uploadAndAnalyze failed:',
        err?.response?.status,
        err?.response?.data || err?.message
      )
      alert('上傳或分析失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-3">
      <div className="text-white/80 mb-2">上傳餐點照片</div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      {loading && <p className="text-sm text-white/60">分析中...</p>}
    </div>
  )
}