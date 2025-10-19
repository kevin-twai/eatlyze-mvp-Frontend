import React from "react";

type Item = {
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

// 中文對照表（可擴充）
const CN_MAP: Record<string, string> = {
  "boiled egg": "水煮蛋",
  "egg": "雞蛋",
  "baby corn": "玉米筍",
  "lotus root": "蓮藕",
  "pumpkin": "南瓜",
  "carrot": "紅蘿蔔",
  "eggplant": "茄子",
  "green pepper": "青椒",
  "onion": "洋蔥",
  "tofu": "豆腐",
  "broccoli": "花椰菜",
  "chicken breast": "雞胸肉",
  "pork": "豬肉",
  "fish": "魚肉",
  "rice": "白飯",
  "noodle": "麵條",
  "mushroom": "香菇",
  "bean sprout": "豆芽菜",
};

type Props =
  | { data: Item[] }
  | { data: { items?: Item[] } | null };

export default function AnalysisResult(props: Props) {
  const items: Item[] = Array.isArray((props as any).data)
    ? ((props as any).data as Item[])
    : ((props as any).data?.items ?? []);

  const empty = !items || items.length === 0;

  return (
    <div>
      <div className="text-white/80 text-sm mb-2">辨識結果</div>

      {empty ? (
        <div className="text-white/40 text-sm">尚無資料</div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => {
            const normalize = (s?: string | null) =>
            (s || "").trim().toLowerCase();

          const baseName =
            item.label ||
            CN_MAP[normalize(item.name)] ||
            CN_MAP[normalize(item.canonical)] ||
            item.name ||
            item.canonical ||
            "未知食材";

          const standard =
            CN_MAP[normalize(item.canonical)] ||
            item.canonical ||
            item.name;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-white">
                    {baseName}
                    {item.is_garnish && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-600/20 text-yellow-400 rounded-full">
                        配菜
                      </span>
                    )}
                  </div>
                  {item.weight_g && (
                    <div className="text-white/50 text-sm">
                      {item.weight_g} g
                    </div>
                  )}
                </div>

                <div className="text-white/40 text-xs mb-2">
                  標準名：{standard}
                </div>

                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-white/50 text-xs">kcal</div>
                    <div className="text-white font-medium text-sm">
                      {item.kcal ?? 0} kcal
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-white/50 text-xs">蛋白</div>
                    <div className="text-white font-medium text-sm">
                      {item.protein_g ?? 0} g
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-white/50 text-xs">脂肪</div>
                    <div className="text-white font-medium text-sm">
                      {item.fat_g ?? 0} g
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <div className="text-white/50 text-xs">碳水</div>
                    <div className="text-white font-medium text-sm">
                      {item.carb_g ?? 0} g
                    </div>
                  </div>
                </div>

                {!item.matched && (
                  <div className="text-yellow-400/80 text-xs mt-2">
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