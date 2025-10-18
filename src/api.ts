import axios from 'axios'

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://eatlyze-backend.onrender.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: false,
})

/** 送圖給後端，回傳「內層」的 { items, summary } 形狀 */
export async function uploadAndAnalyze(
  file: File
): Promise<{ items: any[]; summary?: { totals?: { kcal: number; protein_g: number; fat_g: number; carb_g: number } } }> {
  const fd = new FormData()
  fd.append('file', file)

  try {
    const { data } = await api.post('/analyze/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // 後端回傳 { status:'ok', data:{ items, summary } }
    return data?.data ?? data
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      'Upload/Analyze failed'
    console.error('uploadAndAnalyze failed:', err?.response?.status, err?.response?.data || err?.message)
    throw new Error(msg)
  }
}

export async function logToNotion(payload: any) {
  try {
    const { data } = await api.post('/notion/log', payload)
    return data
  } catch (err: any) {
    const msg = err?.response?.data?.detail || err?.message || 'Notion log failed'
    console.error('logToNotion failed:', msg)
    throw new Error(msg)
  }
}