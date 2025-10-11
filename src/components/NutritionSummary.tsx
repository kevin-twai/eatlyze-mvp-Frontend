export default function NutritionSummary({ totals }:{ totals?: any }){
  if(!totals) return null
  const items=[
    {label:'熱量', value:`${totals.kcal ?? '-'} kcal`},
    {label:'蛋白質', value:`${totals.protein_g ?? '-'} g`},
    {label:'脂肪', value:`${totals.fat_g ?? '-'} g`},
    {label:'碳水', value:`${totals.carb_g ?? '-'} g`},
  ]
  return <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {items.map(it=>(
      <div key={it.label} className="bg-white/5 rounded-xl p-4 text-center">
        <div className="text-white/60 text-xs">{it.label}</div>
        <div className="text-xl font-semibold mt-1">{it.value}</div>
      </div>
    ))}
  </div>
}