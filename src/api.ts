import axios from "axios";

/** 單一食材項目（後端 enrich 後會帶 kcal/P/F/C 以及 matched） */
export type Item = {
  name: string;
  canonical?: string | null;
  weight_g: number;
  is_garnish?: boolean;

  // enrich 後
  kcal?: number;
  protein_g?: number;
  fat_g?: number;
  carb_g?: number;
  matched?: boolean;
};

export type Totals = {
  kcal: number;
  protein_g: number;
  fat_g: number;
  carb_g: number;
};

export type AnalyzeResponse = {
  /** 後端儲存後的實際圖片 URL，用於 <img src> 顯示 */
  image_url?: string;
  items: Item[];
  summary?: { totals: Totals };
};

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://eatlyze-backend.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000,
  withCredentials: false,
});

/** 上傳圖片並做分析，回傳資料格式已型別化（含 image_url） */
export async function uploadAndAnalyze(file: File): Promise<AnalyzeResponse> {
  const fd = new FormData();
  fd.append("file", file);

  const { data } = await api.post("/analyze/image", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 後端是 { status:'ok', data:{ ...payload } }
  const payload = data?.data ?? data;
  return payload as AnalyzeResponse;
}