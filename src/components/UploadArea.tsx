import { useRef, useState } from 'react'
import { uploadAndAnalyze, logToNotion } from '../api'

export default function UploadArea({ onResult }:{ onResult: (data:any)=>void }){
  const inputRef = useRef<HTMLInputElement|null>(null)
  const [loading,setLoading] = useState(false)
  const [imgURL,setImgURL] = useState<string|null>(null)
  const [meal,setMeal] = useState('午餐')
  const [note,setNote] = useState('')

  async function onPick(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return
    setImgURL(URL.createObjectURL(f)); setLoading(true)
    try{
      const res = await uploadAndAnalyze(f)
      onResult(res); (window as any).__EATLYZE_RESULT__ = res
    }catch(err){ console.error(err); alert('上傳或分析失敗') }finally{ setLoading(false) }
  }

  async function onSaveToNotion(){
    const raw = (window as any).__EATLYZE_RESULT__; if(!raw) return alert('尚未有分析結果')
    const payload = {
      date: new Date().toISOString().slice(0,10),
      meal,
      items: raw.summary?.items || [],
      totals: raw.summary?.totals || {},
      image_url: imgURL,
      notes: note
    }
    try{
      const r = await logToNotion(payload)
      if(r.ok) alert('已寫入 Notion ✅'); else alert('Notion 寫入失敗：'+(r.error||'未知錯誤'))
    }catch(e:any){ alert('Notion 寫入失敗：'+(e?.message||'未知錯誤')) }
  }

  return <div className="bg-white/5 rounded-2xl p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="text-lg font-semibold">上傳餐點照片</div>
      <div className="flex items-center gap-2">
        <select className="bg-white/5 rounded-lg px-2 py-1" value={meal} onChange={e=>setMeal(e.target.value)}>
          <option>早餐</option><option>午餐</option><option>晚餐</option><option>點心</option>
        </select>
        <button className="bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1" onClick={()=>inputRef.current?.click()}>
          選擇圖片
        </button>
      </div>
    </div>
    <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden"/>
    {imgURL ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src={imgURL} className="rounded-xl border border-white/10"/>
        <div className="space-y-3">
          <textarea placeholder="AI 建議／備註（可選填）" className="w-full bg-white/5 rounded-xl p-3 h-32"
            value={note} onChange={e=>setNote(e.target.value)} />
          <button onClick={onSaveToNotion} className="bg-brand-500 hover:bg-brand-600 rounded-xl px-4 py-2 w-full">儲存到 Notion</button>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center h-40 bg-white/5 rounded-xl">
        <span className="text-white/70">{loading?'分析中…':'拖曳圖片到此或點擊「選擇圖片」'}</span>
      </div>
    )}
  </div>
}