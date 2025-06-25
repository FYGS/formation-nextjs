import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config'; // Importer la config de base
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { getUser } from "./data";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Étendre la configuration de base
  providers: [
    Credentials({
      // Vous pouvez optionnellement fournir un formulaire personnalisé ici,
      // mais nous allons gérer le formulaire nous-mêmes.
      async authorize(credentials) {
        console.log('Authorizing with credentials:', credentials);
        // Valider les identifiants avec Zod
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log('User fetched:', user);
          if (!user) return null; // Utilisateur non trouvé

          // Comparer le mot de passe fourni avec le hash stocké
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user; // Succès, retourner l'objet utilisateur
        }
        console.log('Invalid credentials');
        return null; // Échec de l'authentification
      },
    }),
    // Ajoutez d'autres providers ici (GitHub, Google, etc.)
    // GitHub({
    //   clientId: process.env.AUTH_GITHUB_ID,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET,
    // }),
  ],
})