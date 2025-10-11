import axios from 'axios'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const api = axios.create({ baseURL: API_BASE_URL, timeout: 60000 })
export async function uploadAndAnalyze(file: File){
  const fd=new FormData(); fd.append('file', file)
  const {data}=await api.post('/analyze/image', fd, {headers:{'Content-Type':'multipart/form-data'}}); return data
}
export async function logToNotion(payload:any){ const {data}=await api.post('/notion/log', payload); return data }