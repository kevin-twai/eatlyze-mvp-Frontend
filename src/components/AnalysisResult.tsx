type Item = {
  name: string
  canonical?: string
  weight_g?: number | null
  is_garnish?: boolean
  kcal?: number
  protein?: number
  fat?: number
  carb?: number
}

type Props = {
  data: Item[] // 直接傳 items 陣列進來：res.data.items（App 已處理）
}

export default function AnalysisResult({ data }: Props) {
  const items = Array.isArray(data) ? data : []
  const empty = items.length === 0

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <EmptyHint />
      ) : (
        <div className="space-y-2">
          {items.map((x, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {x.name}
                    {!!x.is_garnish && (
                      <span className="ml-2 text-xs text-white/60">(配菜)</span>
                    )}
                  </div>
                  {x.canonical && x.canonical !== x.name && (
                    <div className="text-white/50 text-xs truncate">
                      標準名：{x.canonical}
                    </div>
                  )}
                </div>
                <div className="text-sm text-white/90 shrink-0">
                  {typeof x.weight_g === 'number' ? `${x.weight_g} g` : '— g'}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                <Nut label="kcal" value={x.kcal} unit="kcal" roundInt />
                <Nut label="蛋白" value={x.protein} unit="g" />
                <Nut label="脂肪" value={x.fat} unit="g" />
                <Nut label="碳水" value={x.carb} unit="g" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Nut({
  label,
  value,
  unit,
  roundInt = false,
}: {
  label: string
  value?: number | null
  unit?: string
  roundInt?: boolean
}) {
  const ok = typeof value === 'number' && !Number.isNaN(value)
  const shown = ok
    ? roundInt
      ? Math.round(value as number).toString()
      : (Math.round((value as number) * 10) / 10).toString()
    : '—'
  return (
    <div className="bg-black/20 rounded-md px-2 py-1 flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className="text-white/90">
        {shown}
        {unit ? <span className="text-white/50 ml-0.5">{unit}</span> : null}
      </span>
    </div>
  )
}

function EmptyHint() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-white/70 text-sm">
      未辨識出食物，請嘗試：
      <ul className="list-disc pl-5 mt-1 space-y-0.5">
        <li>使用更均勻的光線</li>
        <li>拉遠一些，讓餐盤完整入鏡</li>
        <li>避免過度裁切或太斜的角度</li>
      </ul>
    </div>
  )
}