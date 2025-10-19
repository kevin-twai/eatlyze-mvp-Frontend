import React from "react";

/**
 * 總營養小卡
 * - 傳入 summary 物件即可渲染；若缺少則顯示 0
 */

export type Totals = {
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;
};

type Props = {
  totals?: Totals | null;
  className?: string;
};

function fmt(n?: number) {
  if (n === null || n === undefined || Number.isNaN(n)) return 0;
  // 只顯示到 1 位小數（整數就顯示整數）
  const x = Math.round(n * 10) / 10;
  return Number.isInteger(x) ? x : x.toFixed(1);
}

export default function NutritionSummary({ totals, className = "" }: Props) {
  const kcal = fmt(totals?.kcal);
  const p = fmt(totals?.protein_g);
  const f = fmt(totals?.fat_g);
  const c = fmt(totals?.carb_g);

  const card =
    "rounded-2xl bg-[#101318] border border-white/10 shadow-sm p-5 flex flex-col justify-center";

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${className}`}>
      <div className={card}>
        <div className="text-white/60 text-sm">熱量</div>
        <div className="mt-2 text-4xl font-bold text-white">
          {kcal}
          <span className="ml-1 text-base text-white/60 align-top">kcal</span>
        </div>
      </div>

      <div className={card}>
        <div className="text-white/60 text-sm">蛋白質</div>
        <div className="mt-2 text-4xl font-bold text-white">
          {p}
          <span className="ml-1 text-base text-white/60 align-top">g</span>
        </div>
      </div>

      <div className={card}>
        <div className="text-white/60 text-sm">脂肪</div>
        <div className="mt-2 text-4xl font-bold text-white">
          {f}
          <span className="ml-1 text-base text-white/60 align-top">g</span>
        </div>
      </div>

      <div className={card}>
        <div className="text-white/60 text-sm">碳水</div>
        <div className="mt-2 text-4xl font-bold text-white">
          {c}
          <span className="ml-1 text-base text-white/60 align-top">g</span>
        </div>
      </div>
    </div>
  );
}