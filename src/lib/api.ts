import * as cookie from 'cookie';
export const BASE_URL_API_LOGIN = "https://back.kawthar-expertise.com/api";
export const BASE_URL_API = "https://back.kawthar-expertise.com/web";
export const BASE_URL_API_DEUX = "https://back.kawthar-expertise.com/api";

export const BASE_URL_API_UPLOAD = "https://back.kawthar-expertise.com";

export async function apiFetch(
  provenance: boolean,
  url: string,
  method: string = "GET",
  data: any = null,
  options: RequestInit = {}
): Promise<any> {
  // Récupération du token depuis les cookies
  let token: string | undefined;
  
  // Si on est côté client (navigateur)
  if (typeof window !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    token = cookies.token; // Supposant que votre token est stocké dans un cookie nommé "token"
  }

  // Définition des headers avec typage correct
  const headers: Record<string, string> = {
    ...(method !== "GET" ? { "Content-Type": "application/json","Accept": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  // Configuration de la requête
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