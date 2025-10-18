type Item = {
  name: string
  canonical?: string
  weight_g?: number | null
  is_garnish?: boolean
  kcal?: number
  protein_g?: number
  fat_g?: number
  carb_g?: number
  matched?: boolean
}

type Props =
  | { data: Item[] }                         // 直接給陣列
  | { data: { items?: Item[] } | null }      // 或給物件（含 items）

export default function AnalysisResult(props: Props) {
  // 同時支援兩種形狀
  const items: Item[] = Array.isArray((props as any).data)
    ? ((props as any).data as Item[])
    : (props as any).data?.items ?? []

  const empty = !items || items.length === 0

  return (
    <div>
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/70">
          <div className="font-medium mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((x, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {x.name}
                  {x.canonical && x.canonical !== x.name ? (
                    <span className="ml-2 text-xs text-white/50">標準名：{x.canonical}</span>
                  ) : null}
                  {x.is_garnish ? (
                    <span className="ml-2 text-xs text-white/50">(配菜)</span>
                  ) : null}
                </div>
                <div className="text-sm text-white/70">{x.weight_g ?? 0} g</div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                <div className="rounded-lg bg-black/20 px-2 py-1">
                  <div className="text-xs text-white/50">kcal</div>
                  <div>{x.kcal ?? 0} kcal</div>
                </div>
                <div className="rounded-lg bg-black/20 px-2 py-1">
                  <div className="text-xs text-white/50">蛋白</div>
                  <div>{x.protein_g ?? 0} g</div>
                </div>
                <div className="rounded-lg bg-black/20 px-2 py-1">
                  <div className="text-xs text-white/50">脂肪</div>
                  <div>{x.fat_g ?? 0} g</div>
                </div>
                <div className="rounded-lg bg-black/20 px-2 py-1">
                  <div className="text-xs text-white/50">碳水</div>
                  <div>{x.carb_g ?? 0} g</div>
                </div>
              </div>

              {x.matched === false && (
                <div className="mt-2 text-xs text-amber-300/80">
                  沒在資料表中找到完全對應，已先以 0 顯示。
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}