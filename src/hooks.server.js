import cookie from 'cookie';
import {redirect} from '@sveltejs/kit';
import {getAuthCookie, logout} from '$lib/auth';

export async function handle({event, resolve}) {
  const cookies = cookie.parse (event.request.headers.get ('cookie') || '');
  // Lire et décoder le cookie auth
  let user = null;
  if (cookies.auth) {
    try {
      const auth = JSON.parse (cookies.auth);
      user = {id: auth.id, role: auth.nom, token: auth.prenom};
    } catch (e) {
      console.error ('Erreur de parsing du cookie auth:', e);
    }
  }

 /*  // Protéger la route /admin en vérifiant l'authentification
  if (event.url.pathname.startsWith ('/admin') && !user) {
    // Redirection si l'utilisateur n'est pas authentifié
    return redirect (302, '/');
  }
  if (event.url.pathname == '/' && !user) {
    // Redirection si l'utilisateur n'est pas authentifié
    return redirect (302, '/admin');
  } */

  // Continuer la requête si tout va bien
  const response = await resolve (event);
  return response;
}
