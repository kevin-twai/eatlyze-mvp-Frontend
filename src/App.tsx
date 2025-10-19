import { useState } from "react";
import UploadArea from "./components/UploadArea";
import AnalysisResult from "./components/AnalysisResult";
import NutritionSummary from "./components/NutritionSummary";
import type { AnalyzeResponse, Totals } from "./api";

export default function App() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  // 關鍵：總營養直接取 result.summary（不是 result.summary.totals）
  const totals: Totals | null = result?.summary ?? null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold text-lg">Eatlyze — Tech Minimal</div>
          <div className="text-white/50 text-sm">
            API: https://eatlyze-backend.onrender.com
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：上傳 + 細項 */}
        <div className="lg:col-span-2 space-y-4">
          <UploadArea onResult={(r) => setResult(r)} />
          <AnalysisResult data={result?.items ?? []} />
        </div>

        {/* 右側：總營養 */}
        <aside className="space-y-4">
          <NutritionSummary totals={totals} />
        </aside>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-white/40">
        © 2025 Eatlyze
      </footer>
    </div>
  );
}