import axios from 'axios'

// 從環境變數載入後端 URL，確保沒有多餘的斜線
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string)?.replace(/\/$/, '') ||
  'http://localhost:8000'

// 建立 axios 實例
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  withCredentials: false,
})

// 上傳圖片並呼叫 /analyze/image
export async function uploadAndAnalyze(file: File) {
  const fd = new FormData()
  fd.append('file', file, file.name) // 帶上檔名

  try {
    // ❗不要手動設定 Content-Type，axios 會自動處理 boundary
    const { data } = await api.post('/analyze/image', fd)
    return data // { status, data: { items: [...] } }
  } catch (err: any) {
    console.error(
      '❌ upload error:',
      err?.response?.status,
      err?.response?.data || err?.message
    )
    throw err
  }
}

// 寫入 Notion 日誌
export async function logToNotion(payload: any) {
  try {
    const { data } = await api.post('/notion/log', payload)
    return data
  } catch (err: any) {
    console.error(
      '❌ notion log error:',
      err?.response?.status,
      err?.response?.data || err?.message
    )
    throw err
  }
}