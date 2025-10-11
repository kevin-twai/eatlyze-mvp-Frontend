export default function AnalysisResult({ data }:{ data?: any }){
  if(!data) return null
  const detItems = data?.detection?.items || []
  const total = data?.summary?.totals
  return <div className="space-y-4">
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-brand-500 font-medium">辨識結果</div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {detItems.length===0 && <div className="text-yellow-300/80">未辨識出食物，請換角度或光線</div>}
        {detItems.map((it:any, idx:number)=>(
          <div key={idx} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
            <div className="text-white/90">{it.name}</div>
            <div className="text-white/60 text-sm">{it.grams} g</div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/80 text-sm">總營養統計</div>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="熱量" value={total?.kcal} unit="kcal"/>
        <Stat label="蛋白質" value={total?.protein_g} unit="g"/>
        <Stat label="脂肪" value={total?.fat_g} unit="g"/>
        <Stat label="碳水" value={total?.carb_g} unit="g"/>
      </div>
    </div>
  </div>
}
function Stat({label,value,unit}:{label:string,value?:number,unit?:string}){
  const v = (value ?? '-') + (unit?` ${unit}`:'')
  return <div className="bg-white/5 rounded-xl p-3">
    <div className="text-white/60 text-xs">{label}</div>
    <div className="text-xl font-semibold mt-1">{v}</div>
  </div>
}