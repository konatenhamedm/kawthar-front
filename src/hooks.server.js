// hooks.server.js
export async function handle({ event, resolve }) {
  const authCookie = event.cookies.get('auth');
  
  try {
    if (authCookie && authCookie !== 'undefined') {
      event.locals.user = JSON.parse(authCookie);
    } else {
      event.locals.user = null;
    }
  } catch (error) {
    console.error('Erreur de parsing du cookie auth:', error);
    event.locals.user = null;
    // Optionnel : supprimer le cookie corrompu
    event.cookies.delete('auth', { path: '/' });
  }
  
  return await resolve(event);
}