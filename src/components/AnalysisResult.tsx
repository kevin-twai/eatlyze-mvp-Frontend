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
  matched_name?: string
}

type Props = {
  /** 可能是 {items, summary} 或 {status, data:{items, summary}} */
  data?: any
}

export default function AnalysisResult({ data }: Props) {
  // 兼容兩種資料形狀
  const root: any = data && (data as any).items ? data : (data as any)?.data || data
  const items: Item[] = Array.isArray(root?.items) ? root.items : []
  const empty = items.length === 0

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="mb-2 text-white/80">辨識結果</div>

      {empty ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          <div className="mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((x, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {x.name}
                    {x.is_garnish && (
                      <span className="ml-2 align-middle rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
                        (點綴)
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate text-xs text-white/60">
                    標準名：{x.matched ? x.matched_name || x.canonical || '—' : x.canonical || '—'}
                  </div>
                </div>

                {!x.matched && (
                  <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
                    未匹配
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-5 items-center gap-2 text-xs text-white/80">
                <div>
                  <div className="text-white/50">重量</div>
                  <div className="mt-0.5">{round1(x.weight_g)} g</div>
                </div>
                <div>
                  <div className="text-white/50">熱量</div>
                  <div className="mt-0.5">{round1(x.kcal)} kcal</div>
                </div>
                <div>
                  <div className="text-white/50">蛋白質</div>
                  <div className="mt-0.5">{round1(x.protein_g)} g</div>
                </div>
                <div>
                  <div className="text-white/50">脂肪</div>
                  <div className="mt-0.5">{round1(x.fat_g)} g</div>
                </div>
                <div>
                  <div className="text-white/50">碳水</div>
                  <div className="mt-0.5">{round1(x.carb_g)} g</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function round1(v: number | null | undefined) {
  const n = Number(v ?? 0)
  return Math.round(n * 10) / 10
}