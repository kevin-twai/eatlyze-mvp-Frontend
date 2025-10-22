import { useMemo, useState } from "react";
import UploadArea, { AnalyzeResp } from "./components/UploadArea";
import AnalysisResult from "./components/AnalysisResult";
import NutritionSummary from "./components/NutritionSummary";

// 解析 API Base（Vite + fallback）
const resolveApiBase = (): string => {
  return (
    (import.meta as any)?.env?.VITE_API_URL ||
    (import.meta as any)?.env?.VITE_API_BASE_URL ||
    (window as any)?.__API_BASE__ ||
    "https://eatlyze-backend.onrender.com"
  );
};

export default function App() {
  const [result, setResult] = useState<AnalyzeResp | null>(null);

  // ✅ 這裡改成讀 result?.totals（不是 summary）
  const totals = useMemo(
    () =>
      result?.totals ?? {
        kcal: 0,
        protein_g: 0,
        fat_g: 0,
        carb_g: 0,
      },
    [result]
  );

  const apiBase = resolveApiBase();

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div className="font-semibold text-lg">Eatlyze — Tech Minimal</div>
          <div className="text-white/60 text-sm">
            API: <span className="underline">{apiBase}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：上傳 + 明細 */}
        <div className="lg:col-span-2 space-y-4">
          <UploadArea onResult={(r) => setResult(r)} apiBase={apiBase} />
          <AnalysisResult data={result?.items ?? []} />
        </div>

        {/* 右側：總營養 */}
        <aside className="space-y-4">
          <NutritionSummary totals={totals} />
        </aside>
      </main>
    </div>
  );
}