import axios from 'axios'

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  withCredentials: false,
})

export async function uploadAndAnalyze(
  file: File
): Promise<{ items: any[]; summary?: { totals: { kcal: number; protein_g: number; fat_g: number; carb_g: number } } }> {
  const fd = new FormData()
  fd.append('file', file)

  try {
    const { data } = await api.post('/analyze/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    // 後端回傳 { status:'ok', data:{ ... } }
    return data?.data ?? data
  } catch (err: any) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      'Upload/Analyze failed'
    throw new Error(msg)
  }
}

export async function logToNotion(payload: any) {
  try {
    await api.post('/notion/log', payload)
  } catch {
    // 忽略記錄錯誤，避免影響使用者流程
  }
}