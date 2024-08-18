// fetcher.ts
const prefix = "http://localhost:5173/";

// 定义响应数据的接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// getFetcher函数，用于GET请求
export async function getFetcher<T>(key: string): Promise<T> {
  const response = await fetch(`${prefix}${key}`, { mode: "cors" });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ApiResponse<T> = await response.json();
  if (data.code !== 0) {
    throw new Error(`${data.message} (Code: ${data.code})`);
  }
  return data.data;
}

// postFetcher函数，用于POST请求
export async function postFetcher<T>(key: string, body: any): Promise<T> {
  const response = await fetch(`${prefix}${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ApiResponse<T> = await response.json();
  if (data.code !== 0) {
    throw new Error(`${data.message} (Code: ${data.code})`);
  }
  return data.data;
}