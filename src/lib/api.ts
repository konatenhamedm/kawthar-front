import * as cookie from 'cookie';
export const BASE_URL_API_LOGIN = "https://back.kawthar-expertise.com/web";
export const BASE_URL_API = "https://back.kawthar-expertise.com/web";
export const BASE_URL_API_DEUX = "https://back.kawthar-expertise.com/api";
import { getAuthCookie, logout } from '$lib/auth';

export const BASE_URL_API_UPLOAD = "https://back.kawthar-expertise.com";

export async function apiFetch(
  provenance: boolean,
  url: string,
  method: string = "GET",
  data: any = null,
  options: RequestInit = {}
): Promise<any> {
 
  let token: string | undefined;
  
  if (typeof window !== 'undefined') {
       const cookies = cookie.parse(document.cookie);
       const auth = JSON.parse(cookies.auth);
        token =auth.token; 
  }

  const headers: Record<string, string> = {
    ...(method !== "GET" ? { "Content-Type": "application/json","Accept": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };


  const requestOptions: RequestInit = {
    ...options,
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(
      provenance ? BASE_URL_API + url : BASE_URL_API_DEUX + url,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }
    
    return response.text();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}