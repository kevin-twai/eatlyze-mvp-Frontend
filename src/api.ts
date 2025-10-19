import axios from "axios";

/** 後端 API base URL（.env 用 VITE_API_BASE_URL 覆蓋；預設指向 Render 後端） */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://eatlyze-backend.onrender.com";

/** 共用 axios instance */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  withCredentials: false,
});

/* ---------- 型別 ---------- */
export type Totals = {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
};

export type Item = {
  name: string;
  canonical?: string | null;
  weight_g?: number | null;
  is_garnish?: boolean;
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;
  matched?: boolean;
};

export type AnalyzeResponse = {
  image_url?: string;
  items: Item[];
  summary: Totals; // 注意：這裡是 summary（不是 summary.totals）
};

/* ---------- API ---------- */
export async function uploadAndAnalyze(file: File): Promise<AnalyzeResponse> {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await api.post("/analyze/image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 後端回傳 { image_url, items, summary }，直接回傳即可
  return data as AnalyzeResponse;
}