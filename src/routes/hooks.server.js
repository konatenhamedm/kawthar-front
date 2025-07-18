import cookie from "cookie";
import { redirect } from "@sveltejs/kit";
import { BASE_URL_API } from "$lib/api";

export async function handle({ event, resolve }) {
  const cookies = cookie.parse(event.request.headers.get("cookie") || "");
  let user = null;
  let abonnementExpire = false;

  if (cookies.auth) {
    try {
      const auth = JSON.parse(cookies.auth);
      user = {
        id: auth.id ,
        nom: auth.nom ,
        prenoms: auth.prenoms ,
        tel: auth.tel || "",
        d_type: auth.d_type ,
        email: auth.email,
        token: auth.token ,
      };
      

    } catch (e) {
      console.error("Erreur parsing ou appel API:", e);
    }
  }

  // ⛔ Redirection pour les pages restreintes si abonnement expiré
  const protectedPagesWhenExpired = [
    "/site/dossiers",
    "/site/forum",
    "/site/documents",
    "/site/chatbox",
    "/site/forum/all-forums",
    "/site/faq",
    "/site/alerte",
    "/site/profil"
  ];

  
  // Redirections basées sur le rôle
  if (event.url.pathname.startsWith("/admin") && !user) {
    return redirect(302, "/login");
  }

  if (event.url.pathname === "/login" && user) {
    return redirect(302, "/admin");
  }



  // Attache l'utilisateur dans `event.locals` pour y accéder ailleurs
  event.locals.user = user;
  const response = await resolve(event);
  return response;
}
