import { useRef, useState } from 'react'
import { uploadAndAnalyze, logToNotion } from '../api'

type Props = {
  onResult: (res: any) => void
}

export default function UploadArea({ onResult }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [meal, setMeal] = useState<'早餐' | '午餐' | '晚餐'>('午餐')
  const [lastRes, setLastRes] = useState<any>(null)

  const pickFile = () => inputRef.current?.click()

  const onChoose = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setLoading(true)
    try {
      const res = await uploadAndAnalyze(f)          // 後端 JSON body
      setLastRes(res)
      onResult(res)                                  // 交給 App 做 items/summary 的組裝
    } catch (err: any) {
      console.error(err)
      alert('上傳或分析失敗，請重試')
    } finally {
      setLoading(false)
    }
  }

  const sendToNotion = async () => {
    const items = lastRes?.data?.items || []
    if (!items.length) {
      alert('沒有可寫入的辨識結果')
      return
    }

    // 嘗試從 items 聚合出 totals（若後端尚未提供單項營養則為 0）
    const totals = {
      kcal: items.reduce((s: number, x: any) => s + (x.kcal ?? 0), 0),
      protein: items.reduce((s: number, x: any) => s + (x.protein ?? 0), 0),
      fat: items.reduce((s: number, x: any) => s + (x.fat ?? 0), 0),
      carb: items.reduce((s: number, x: any) => s + (x.carb ?? 0), 0),
    }

    try {
      const payload = {
        date: new Date().toISOString(),     // 建議用 ISO，後端可自行取日期
        meal,                               // 早餐 / 午餐 / 晚餐
        note,
        items,                              // 逐項明細（含重量/營養）
        totals,                             // ⬅️ 新增總營養
      }
      const res = await logToNotion(payload)
      if (res?.status === 'ok') {
        alert('已寫入 Notion ✅')
      } else {
        alert(`寫入 Notion 失敗：${res?.reason || '未知錯誤'}`)
      }
    } catch (e) {
      console.error(e)
      alert('寫入 Notion 失敗')
    }
  }

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/80">上傳餐點照片</div>
        <div className="flex gap-2">
          <select
            className="bg-white/10 rounded px-2 py-1 text-sm"
            value={meal}
            onChange={(e) => setMeal(e.target.value as any)}
          >
            <option>早餐</option>
            <option>午餐</option>
            <option>晚餐</option>
          </select>
          <button
            className="bg-white/10 hover:bg-white/20 rounded px-3 py-1 text-sm"
            onClick={pickFile}
            disabled={loading}
          >
            選擇圖片
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="aspect-[3/4] bg-black/30 rounded-xl overflow-hidden flex items-center justify-center">
          {file ? (
            <img
              alt="preview"
              src={URL.createObjectURL(file)}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-white/40">尚未選擇圖片</div>
          )}
        </div>

        <div className="flex flex-col">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="AI 建議 / 備註（可選填）"
            className="flex-1 bg-white/10 rounded-xl p-3 outline-none"
          />
          <div className="mt-3 flex gap-3">
            <button
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg px-4 py-2"
              onClick={sendToNotion}
              disabled={loading || !lastRes?.data?.items?.length}
            >
              儲存到 Notion
            </button>
            {loading && <div className="text-white/60 self-center text-sm">分析中…</div>}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChoose}
      />
    </div>
  )
}