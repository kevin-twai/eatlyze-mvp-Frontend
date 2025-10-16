// src/components/AnalysisResult.tsx
type Item = {
  name: string
  canonical?: string
  weight_g?: number | null
  is_garnish?: boolean
  kcal?: number
  protein_g?: number
  fat_g?: number
  carb_g?: number
}

export default function AnalysisResult({ data }: { data: any }) {
  // 兼容：data 可能是陣列，也可能是 { items, ... }
  const items: Item[] = Array.isArray(data) ? data : (data?.items ?? [])
  const empty = items.length === 0

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/70">
          <div className="font-medium mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((x, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">{x.name}</div>
                  {!!x.canonical && x.canonical !== x.name && (
                    <div className="text-white/50 text-xs truncate">標準名：{x.canonical}</div>
                  )}
                </div>
                <div className="text-white/70 text-sm tabular-nums">
                  {x.weight_g ?? 0} g
                </div>
              </div>

              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                <Pill label="kcal" value={fmt(x.kcal)} unit="kcal" />
                <Pill label="蛋白" value={fmt(x.protein_g)} unit="g" />
                <Pill label="脂肪" value={fmt(x.fat_g)} unit="g" />
                <Pill label="碳水" value={fmt(x.carb_g)} unit="g" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function fmt(v?: number | null) {
  return typeof v === 'number' ? (Math.round(v * 10) / 10).toString() : '–'
}

function Pill({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-white/5 rounded-lg px-2 py-1.5 flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className="text-white/90 tabular-nums">{value} <span className="text-white/50">{unit}</span></span>
    </div>
  )
}