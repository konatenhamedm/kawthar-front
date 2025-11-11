import * as cookie from 'cookie';
import { goto } from '$app/navigation';

export const BASE_URL_API_LOGIN = "https://back.kawthar-expertise.com/web";
export const BASE_URL_API = "https://back.kawthar-expertise.com/web";
export const BASE_URL_API_DEUX = "https://back.kawthar-expertise.com/api";
export const BASE_URL_API_UPLOAD = "https://back.kawthar-expertise.com";

// Fonction utilitaire pour récupérer le token
function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookies = cookie.parse(document.cookie);
    
    if (!cookies.auth || cookies.auth === 'undefined') {
      console.warn('Cookie auth non trouvé');
      return null;
    }

    const auth = JSON.parse(cookies.auth);
    
    if (!auth || !auth.token) {
      console.warn('Token non trouvé dans le cookie auth');
      return null;
    }

    return auth.token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    // Nettoyer le cookie corrompu
    document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    return null;
  }
}

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
    token = auth.token;
  }

  const headers: Record<string, string> = {
    ...(method !== 'GET' ? { 'Content-Type': 'application/json', Accept: 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };


  const requestOptions: RequestInit = {
    ...options,
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const fullUrl = provenance ? BASE_URL_API + url : BASE_URL_API_DEUX + url;
  console.log(`Requête API: ${method} ${fullUrl}`);

  try {
    const response = await fetch(fullUrl, requestOptions);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Non autorisé - Token invalide ou expiré');
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Rediriger vers login si nécessaire
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const jsonData = await response.json();
      console.log(`Réponse API ${url}:`, jsonData);
      return jsonData;
    }
    
    return response.text();
  } catch (error) {
    console.error(`Erreur API pour ${url}:`, error);
    throw error;
  }
}