// src/components/AnalysisResult.tsx
import React from "react";

type Item = {
  name: string;
  canonical?: string;
  weight_g: number | null;
  is_garnish?: boolean;
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;
  matched?: boolean;
};

type Totals = {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
};

type Props = {
  data?: {
    items?: Item[];
    summary?: { totals?: Totals };
  } | null;
};

const fmt = (n: number | undefined | null, digits = 1) =>
  typeof n === "number" && isFinite(n) ? Number(n.toFixed(digits)) : 0;

export default function AnalysisResult({ data }: Props) {
  const items: Item[] = Array.isArray(data?.items) ? data!.items! : [];
  const empty = items.length === 0;

  return (
    <div className="bg-white/5 rounded-2xl p-4">
      <div className="text-white/80 mb-3">辨識結果</div>

      {empty ? (
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
          <div className="font-medium mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc pl-5 space-y-1">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((x, i) => {
            const kcal = fmt(x.kcal, 0);
            const p = fmt(x.protein_g, 1);
            const f = fmt(x.fat_g, 1);
            const c = fmt(x.carb_g, 1);

            return (
              <div
                key={`${x.name}-${i}`}
                className="rounded-xl border border-white/10 bg-black/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {x.name}
                      {x.is_garnish && (
                        <span className="ml-2 text-xs text-white/50">(配菜)</span>
                      )}
                    </div>
                    <div className="text-xs text-white/50 truncate">
                      標準名：{x.canonical || x.name}
                      {!x.matched && (
                        <span className="ml-2 text-amber-400">（未完全比對）</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 ml-3 text-sm text-white/80">
                    {fmt(x.weight_g ?? 0, 0)} g
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                  <div className="rounded-lg border border-white/10 px-2 py-1">
                    <div className="text-white/50">kcal</div>
                    <div className="font-semibold">{kcal} kcal</div>
                  </div>
                  <div className="rounded-lg border border-white/10 px-2 py-1">
                    <div className="text-white/50">蛋白質</div>
                    <div className="font-semibold">{p} g</div>
                  </div>
                  <div className="rounded-lg border border-white/10 px-2 py-1">
                    <div className="text-white/50">脂肪</div>
                    <div className="font-semibold">{f} g</div>
                  </div>
                  <div className="rounded-lg border border-white/10 px-2 py-1">
                    <div className="text-white/50">碳水</div>
                    <div className="font-semibold">{c} g</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}