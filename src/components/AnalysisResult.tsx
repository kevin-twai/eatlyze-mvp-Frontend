import React from 'react'

type Item = {
  name: string
  canonical?: string
  weight_g?: number
  is_garnish?: boolean
  // 計算後欄位（後端 nutrition_service.py 產出）
  kcal?: number
  protein_g?: number
  fat_g?: number
  carb_g?: number
  matched?: boolean
  matched_name?: string
  matched_mode?: string
}

type Totals = {
  kcal: number
  protein_g: number
  fat_g: number
  carb_g: number
}

type Props = {
  data?: {
    items?: Item[]
    summary?: { totals?: Totals }
  } | null
}

const fmt = (n: number | undefined | null, unit: 'g' | 'kcal') => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0' + (unit === 'kcal' ? ' kcal' : ' g')
  const v = Math.round(n * 10) / 10
  return unit === 'kcal' ? `${v} kcal` : `${v} g`
}

export default function AnalysisResult({ data }: Props) {
  const items: Item[] = Array.isArray(data?.items) ? data!.items! : []
  const empty = items.length === 0

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          <div className="mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc pl-5 space-y-1">
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
                  <div className="font-medium truncate">
                    {x.name}
                    {x.is_garnish && (
                      <span className="ml-2 align-middle rounded bg-white/10 px-2 py-0.5 text-xs text-white/80">
                        (點綴)
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-white/60 truncate">
                    {/* 有匹配就顯示 matched_name；否則顯示 canonical（若有） */}
                    {x.matched ? (
                      <>標準名：{x.matched_name || x.canonical || '—'}</>
                    ) : (
                      <>標準名：{x.canonical || '—'}</>
                    )}
                  </div>
                </div>

                {/* 未匹配徽章 */}
                {!x.matched && (
                  <span className="shrink-0 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">
                    未匹配
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-5 items-center gap-2 text-xs text-white/80">
                <div className="col-span-1">
                  <div className="text-white/50">重量</div>
                  <div className="mt-0.5">{fmt(x.weight_g ?? 0, 'g')}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-white/50">熱量</div>
                  <div className="mt-0.5">{fmt(x.kcal ?? 0, 'kcal')}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-white/50">蛋白質</div>
                  <div className="mt-0.5">{fmt(x.protein_g ?? 0, 'g')}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-white/50">脂肪</div>
                  <div className="mt-0.5">{fmt(x.fat_g ?? 0, 'g')}</div>
                </div>
                <div className="col-span-1">
                  <div className="text-white/50">碳水</div>
                  <div className="mt-0.5">{fmt(x.carb_g ?? 0, 'g')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}