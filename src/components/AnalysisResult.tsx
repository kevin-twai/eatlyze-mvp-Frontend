import React, { useEffect, useState } from "react";

/** ===== Types ===== */
export type Item = {
  name: string;
  canonical?: string;
  label?: string;
  weight_g?: number | null;
  is_garnish?: boolean;
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;
  matched?: boolean;
};

type Props =
  | { data: Item[] }
  | { data: { items: Item[] } | null };

/** ===== Helper Functions ===== */
const normalize = (s?: string | null) => (s ?? "").trim().toLowerCase();

/** ===== CSV → Map Parser ===== */
function parseCSVtoMap(csvText: string): Record<string, string> {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  const map: Record<string, string> = {};

  for (const line of lines.slice(1)) {
    const parts = line.split(",");
    if (parts.length < 2) continue;

    const rawName = normalize(parts[0]);
    const cnName = normalize(parts[1]);
    if (rawName && cnName) map[rawName] = parts[1].trim();
  }

  return map;
}

/** ===== UI ===== */
export default function AnalysisResult(props: Props) {
  const items: Item[] = Array.isArray((props as any).data)
    ? ((props as any).data as Item[])
    : ((props as any).data?.items ?? []);

  const [CN_MAP, setCN_MAP] = useState<Record<string, string>>({});
  const empty = !items || items.length === 0;

  /** ⬇️ 自動載入 CSV 中的中英文對照表 */
  useEffect(() => {
    fetch("/foods_tw.csv")
      .then((res) => res.text())
      .then((txt) => setCN_MAP(parseCSVtoMap(txt)))
      .catch(() => console.warn("⚠️ 無法載入 foods_tw.csv，使用預設中英文對照。"));
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-white/80 mb-2">辨識結果</div>

      {empty ? (
        <div className="rounded-2xl bg-white/5 p-6 text-white/70">
          <div className="font-medium mb-2">未辨識出食物，請嘗試：</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>更均勻的光線</li>
            <li>拉遠一點，讓餐點完整入鏡</li>
            <li>避免過度裁切或太斜的角度</li>
          </ul>
        </div>
      ) : (
        items.map((item, idx) => {
          const nm = normalize(item.name);
          const ca = normalize(item.canonical);
          const lb = normalize(item.label);

          const displayName =
            item.label ||
            CN_MAP[nm] ||
            CN_MAP[ca] ||
            item.name ||
            item.canonical ||
            "未知食材";

          const standard =
            CN_MAP[ca] ||
            item.canonical ||
            item.name;

          return (
            <div
              key={`${idx}-${item.name}-${item.canonical ?? ""}`}
              className="rounded-2xl bg-white/5 p-5 text-white/90"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg font-semibold">{displayName}</div>
                {item.is_garnish ? (
                  <span className="text-xs rounded-full bg-yellow-500/20 text-yellow-300 px-2 py-0.5">
                    配菜
                  </span>
                ) : null}
              </div>

              <div className="text-sm text-white/60 mb-4">
                標準名：<span className="text-white/80">{standard}</span>
                {typeof item.weight_g === "number" ? (
                  <span className="ml-2 text-white/50">{item.weight_g} g</span>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <CardStat label="kcal" value={`${item.kcal ?? 0} kcal`} />
                <CardStat label="蛋白" value={`${item.protein_g ?? 0} g`} />
                <CardStat label="脂肪" value={`${item.fat_g ?? 0} g`} />
                <CardStat label="碳水" value={`${item.carb_g ?? 0} g`} />
              </div>

              {item.matched === false && (
                <div className="mt-3 text-xs text-amber-300/80">
                  沒在資料表中找到完全對應，已先以 <span className="font-semibold">0</span> 顯示。
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/** 小卡片顯示單一數值 */
function CardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 border border-white/10 p-4">
      <div className="text-white/60 text-sm mb-1">{label}</div>
      <div className="text-white text-lg font-medium">{value}</div>
    </div>
  );
}