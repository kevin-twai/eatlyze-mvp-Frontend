// frontend/src/components/AnalysisResult.tsx
import React from "react";

type Item = {
  // 來源名稱（英文或中文，視後端而定）
  name: string;
  // 後端新增的中文標籤（若可用，優先顯示）
  label?: string;
  // 標準化英文名稱（退而求其次）
  canonical?: string;

  weight_g?: number | null;
  is_garnish?: boolean;

  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;

  matched?: boolean; // 從營養資料庫中是否有完全對到
};

type Props =
  | { data: Item[] } // 直接給陣列
  | { data: { items?: Item[] } | null }; // 或給物件（含 items）

export default function AnalysisResult(props: Props) {
  // 同時支援兩種輸入型別
  const items: Item[] =
    Array.isArray((props as any).data)
      ? ((props as any).data as Item[])
      : ((props as any).data?.items ?? []);

  const empty = !items || items.length === 0;

  return (
    <div>
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="text-white/80 mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc list-inside text-white/60 leading-7">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const title = item.label ?? item.name ?? item.canonical ?? "未命名食材";
            const weight = item.weight_g ?? 0;

            const kcal = item.kcal ?? 0;
            const p = item.protein_g ?? 0;
            const f = item.fat_g ?? 0;
            const c = item.carb_g ?? 0;

            const matched = item.matched !== false; // 預設 true

            return (
              <div key={`${title}-${idx}`} className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-white text-base font-medium">
                    {title}
                    {item.canonical ? (
                      <span className="ml-2 text-white/40 text-sm">
                        標準名：{item.canonical}
                      </span>
                    ) : null}
                    {item.is_garnish ? (
                      <span className="ml-2 text-xs text-amber-300/80 border border-amber-300/40 px-2 py-0.5 rounded">
                        配菜
                      </span>
                    ) : null}
                  </div>
                  <div className="text-white/60 text-sm">{weight} g</div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <div className="text-white/60">kcal</div>
                    <div className="text-white font-medium">{kcal} kcal</div>
                  </div>
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <div className="text-white/60">蛋白</div>
                    <div className="text-white font-medium">{p} g</div>
                  </div>
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <div className="text-white/60">脂肪</div>
                    <div className="text-white font-medium">{f} g</div>
                  </div>
                  <div className="bg-white/5 rounded-xl px-3 py-2">
                    <div className="text-white/60">碳水</div>
                    <div className="text-white font-medium">{c} g</div>
                  </div>
                </div>

                {!matched && (
                  <div className="mt-2 text-xs text-amber-300/80">
                    沒在資料表中找到完全對應，已先以 0 顯示。
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}