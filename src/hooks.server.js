import cookie from 'cookie';
import {redirect} from '@sveltejs/kit';

export async function handle({event, resolve}) {
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');

  let user = null;
  if (cookies.auth) {
    try {
      const auth = JSON.parse(cookies.auth);
      user = {id: auth.id, role: auth.nom, token: auth.prenom};
    } catch (e) {
      console.error('Erreur de parsing du cookie auth:', e);
    }
  }

  const isAdminRoute = event.url.pathname.startsWith('/admin');
  const isLoginPage = event.url.pathname === '/login';

  if (isAdminRoute && !user) {
    return redirect(302, '/login');
  }

  // (Optionnel) empêcher un utilisateur déjà connecté d'aller sur /login
  if (isLoginPage && user) {
    return redirect(302, '/admin');
  }

  const response = await resolve(event);
  return response;
}
