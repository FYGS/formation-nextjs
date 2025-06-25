// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  // Spécifier des pages personnalisées (optionnel, mais recommandé pour une meilleure UX)
  pages: {
    signIn: '/login', // Redirige vers /login si l'utilisateur doit se connecter
    // error: '/auth/error', // Page pour afficher les erreurs d'authentification (à créer)
    signOut: '/', // Page vers laquelle rediriger après déconnexion (par défaut la page actuelle)
    // verifyRequest: '/auth/verify-request', // (pour les emails de type magic link)
    // newUser: '/auth/new-user' // Page pour les nouveaux utilisateurs après inscription OAuth
  },
  // Callbacks pour personnaliser le comportement
  callbacks: {
    // `authorized` est utilisé pour vérifier si une requête est autorisée à accéder à une page
    // via le Middleware Next.js. Il est appelé avant qu'une requête ne soit complétée.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log('[AUTH_CALLBACK] Path:', nextUrl.pathname, 'isLoggedIn:', isLoggedIn, 'isOnDashboard:', isOnDashboard);

      if (isOnDashboard) {
        if (isLoggedIn) return true; // Si sur le dashboard et connecté, autoriser
        return false; // Rediriger les utilisateurs non authentifiés vers la page de connexion
      } else if (isLoggedIn) {
        // Si connecté et essayant d'accéder à une page publique comme /login,
        // rediriger vers le dashboard (optionnel, mais bonne UX)
        // Vous pourriez vouloir rediriger de /login vers /dashboard si déjà connecté :
        if (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
        return true;
      }
      return true; // Par défaut, autoriser l'accès aux autres pages (publiques)
    },
    // `jwt` callback est appelé chaque fois qu'un JWT est créé ou mis à jour.
    // Vous pouvez y ajouter des informations au token.
    async jwt({ token, user }) {
      if (user) { // `user` est disponible uniquement lors de la connexion initiale
        token.id = user.id; // Ajouter l'ID utilisateur au token
        // token.role = user.role; // Si vous avez des rôles
      }
      return token;
    },
    // `session` callback est appelé chaque fois qu'une session est accédée.
    // Il reçoit le token JWT et vous permet de définir ce qui est exposé au client.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // Ajouter l'ID utilisateur à l'objet session.user
        // session.user.role = token.role; // Si vous avez des rôles
      }
      return session;
    },
  },
  providers: [
    // Les providers (Credentials, GitHub, Google, etc.) seront listés ici.
    // Pour l'instant, on le laisse vide car ils seront définis dans auth.ts
    // et ce fichier est utilisé par le middleware qui n'a pas besoin des détails des providers.
  ],
  // session: { strategy: "jwt" }, // JWT est la stratégie par défaut
} satisfies NextAuthConfig;