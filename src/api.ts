import axios from 'axios'

/** 後端 Base URL（.env 裡的 VITE_API_BASE_URL），結尾不加斜線 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000'

/** 共用 axios instance */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  withCredentials: false,
})

/** 後端 /analyze/image 正規化後的回傳形狀 */
export type AnalyzeTotals = {
  kcal: number
  protein_g: number
  fat_g: number
  carb_g: number
}

export type AnalyzeItem = {
  name: string
  canonical?: string
  weight_g?: number
  is_garnish?: boolean
  kcal?: number
  protein_g?: number
  fat_g?: number
  carb_g?: number
  matched?: boolean
  matched_name?: string
}

export type AnalyzeResult = {
  items: AnalyzeItem[]
  summary?: { totals?: AnalyzeTotals }
}

/**
 * 上傳圖片並取得分析結果。
 * 無論後端回傳是 {status, data:{items, summary}} 或 {items, summary}，
 * 最後都統一回傳 {items, summary}。
 */
export async function uploadAndAnalyze(file: File): Promise<AnalyzeResult> {
  const fd = new FormData()
  fd.append('file', file)

  const { data } = await api.post('/analyze/image', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  // 統一內層結構
  const inner = data?.data ?? data
  return inner as AnalyzeResult
}

/** 將紀錄寫入 Notion（如果你前端需要） */
export async function logToNotion(payload: any) {
  try {
    const { data } = await api.post('/notion/log', payload)
    return data
  } catch (err: any) {
    const msg = err?.response?.data?.detail || err?.response?.data || err?.message || 'LogToNotion failed'
    throw new Error(msg)
  }
}