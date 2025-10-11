import { useState } from 'react'
import UploadArea from './components/UploadArea'
import AnalysisResult from './components/AnalysisResult'
import NutritionSummary from './components/NutritionSummary'
import { API_BASE_URL } from './api'

export default function App(){
  const [result,setResult] = useState<any|null>(null)
  return <div className="min-h-dvh bg-[#0B1220] text-white">
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="font-semibold text-lg">Eatlyze — Tech Minimal</div>
        <div className="text-xs text-white/50">API: {API_BASE_URL}</div>
      </div>
    </header>
    <main className="mx-auto max-w-5xl p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <UploadArea onResult={setResult}/>
          <AnalysisResult data={result}/>
        </div>
        <aside className="space-y-4">
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="text-white/80 mb-2">總營養</div>
            <NutritionSummary totals={result?.summary?.totals}/>
          </div>
        </aside>
      </div>
    </main>
    <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-white/40 text-sm">
      © {new Date().getFullYear()} Eatlyze
    </footer>
  </div>
}