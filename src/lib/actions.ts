// src/lib/actions.ts
'use server';

import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { signIn, signOut as authSignOut } from './auth';
import bcrypt from 'bcryptjs';

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    required_error: "Le client est requis.", // Si le champ est manquant
    invalid_type_error: 'Veuillez sélectionner un client valide.',
  }).uuid({ message: "L'ID du client doit être un UUID valide." }),

  amount: z.coerce
    .number({
      required_error: "Le montant est requis.",
      invalid_type_error: "Veuillez entrer un montant numérique valide.",
    })
    .min(0.01, { message: 'Le montant doit être d\'au moins 0.01 €.' }) // Utiliser .min() au lieu de .gt(0) pour inclure 0.01
    .transform(val => Math.round(val * 100)) // Déplacer la transformation en centimes ici
    .refine(val => val > 0, { message: 'Le montant en centimes doit être supérieur à 0.' }), // Valider les centimes si besoin

  status: z.enum(['pending', 'paid', 'overdue'], {
    required_error: "Le statut est requis.",
    invalid_type_error: 'Veuillez sélectionner un statut valide pour la facture.',
  }),
  date: z.string(),
});

const CreateInvoiceSchema = InvoiceSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    // Si on ajoutait plus de champs comme la date ou des items
    // date?: string[];
    // items?: string[]; // Pour une erreur globale sur les items
  };
  message?: string | null; // Pour les messages généraux (succès, erreur DB)
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validation des champs avec le schéma de création
  const validatedFields = CreateInvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Si la validation échoue, retourner les erreurs spécifiques
  if (!validatedFields.success) {
    console.error('Validation Errors (createInvoice):', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la création de la facture.',
    };
  }

  // Préparer les données pour l'insertion
  const { customerId, amount: amountInCents, status } = validatedFields.data; // amount est déjà en centimes
  const currentDate = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount_in_cents, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${currentDate})
  `;
  } catch (error) {
    console.error('Database Error (createInvoice):', error);
    return {
      message: 'Erreur de base de données : Échec de la création de la facture.',
      errors: {}, // Pas d'erreurs de champ spécifiques ici, mais une erreur globale
    };
  }

  // Si succès, revalider le cache et rediriger
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  // Ce code n'est pas atteint à cause du redirect, mais pour satisfaire le type de retour
  // return { message: 'Facture créée avec succès !', errors: {} };
}

// Nous avons besoin du schéma complet pour la mise à jour, car l'ID est nécessaire.
// La date n'est toujours pas modifiable via le formulaire pour l'instant.
const UpdateInvoiceSchema = InvoiceSchema.omit({ date: true }); // id est inclus

export async function updateInvoice(
  id: string, // L'ID de la facture à mettre à jour, passé en argument lié (bound)
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoiceSchema.safeParse({
    id: id, // Ajouter l'ID ici pour qu'il soit inclus dans validatedFields.data si besoin
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    console.error('Validation Errors (updateInvoice):', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la mise à jour de la facture.',
    };
  }

  const { customerId, amount: amountInCents, status } = validatedFields.data;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount_in_cents = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.error('Database Error (updateInvoice):', error);
    return {
      message: 'Erreur de base de données : Échec de la mise à jour de la facture.',
      errors: {}
    };
  }

  revalidatePath('/dashboard/invoices'); // Revalider la liste
  revalidatePath(`/dashboard/invoices/${id}`); // Revalider la page de détail
  redirect('/dashboard/invoices'); // Rediriger vers la liste
}

export async function deleteInvoice(id: string) {
  // Pour des raisons de sécurité, on pourrait ajouter une vérification ici
  // pour s'assurer que l'utilisateur a le droit de supprimer cette facture.

  // throw new Error('Simulated Deletion Error'); // Pour tester error.tsx plus tard

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    // Note: Les invoice_items liés seront supprimés automatiquement grâce à ON DELETE CASCADE
    revalidatePath('/dashboard/invoices'); // Revalider la liste des factures
    return { message: 'Facture supprimée.' }; // Message optionnel pour le client
  } catch (error) {
    console.error('Database Error (deleteInvoice):', error);
    return { message: 'Erreur de base de données : Échec de la suppression de la facture.' };
  }
}

// Type d'état pour le formulaire de connexion
export type LoginFormState = {
  errors?: {
    credentials?: string[]; // Erreur générale pour les identifiants
    // email?: string[]; // Si on voulait des erreurs par champ
    // password?: string[];
  };
  message?: string | null; // Pour d'autres messages (ex: succès non applicable ici)
};

export async function authenticate(
  prevState: LoginFormState | undefined, // prevState peut être undefined au premier appel
  formData: FormData,
) {
  try {
    // Le provider 'credentials' est celui que nous avons configuré dans auth.ts
    // Les clés dans l'objet passé à signIn (email, password) doivent correspondre
    // aux `name` des inputs dans votre formulaire de connexion.
    // La redirection vers /dashboard en cas de succès est gérée par le middleware ou le callback authorized.
    await signIn('credentials', formData);
    // Ce code ne sera PAS atteint si signIn redirige avec succès.
    // S'il est atteint, c'est qu'il y a eu un problème non géré par une redirection ou AuthError.
    // On pourrait considérer cela comme un cas d'erreur inattendu.
    return { message: 'Tentative de connexion traitée.', errors: { credentials: ['Un problème inattendu est survenu.'] } };
  } catch (error) {
    // Si l'erreur est NEXT_REDIRECT, elle doit être relancée pour que Next.js puisse l'exécuter.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: null, errors: { credentials: ['Identifiants invalides. Veuillez réessayer.'] } };
        case 'CallbackRouteError': // Peut arriver si le callback authorize retourne null
          console.error('CallbackRouteError details:', error); // Log pour le débogage serveur
          return { message: null, errors: { credentials: ['Erreur de configuration ou identifiants invalides.'] } };
        default:
          console.error('Auth Error Type:', error.type);
          return { message: null, errors: { credentials: ['Une erreur d\'authentification est survenue.'] } };
      }
    }
    // Pour toute autre erreur non gérée (qui n'est pas une AuthError ou NEXT_REDIRECT)
    console.error('Unexpected Error during authentication:', error);
    return { message: null, errors: { credentials: ['Une erreur serveur inattendue est survenue.'] } };
  }
}

export async function signOutUser() {
  await authSignOut({ redirectTo: '/' }); // Redirige vers / après déconnexion
}

const SignupFormSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(255, { message: "Le nom ne peut pas dépasser 255 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
  password: z.string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
    .max(255, { message: "Le mot de passe ne peut pas dépasser 255 caractères." }),
});

export type SignupFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    form?: string[]; // Pour les erreurs générales du formulaire
  };
  message?: string | null; // Message général (succès ou erreur)
};

export async function signUpUser(
  prevState: SignupFormState | undefined, // prevState est fourni par useActionState
  formData: FormData,
): Promise<SignupFormState> { // L'action doit retourner un type compatible avec SignupFormState
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la création du compte.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.rowCount && existingUser.rowCount > 0) {
      return {
        errors: { email: ['Cette adresse e-mail est déjà utilisée.'] },
        message: 'Échec de la création du compte.', // message peut être string
      };
    }

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `;
  } catch (dbError) {
    console.error('Database Error (signUpUser - insert):', dbError);
    return {
      errors: { form: ['Une erreur de base de données est survenue.'] },
      message: 'Échec de la création du compte en raison d\'une erreur serveur.', // message string
    };
  }

  // Tentative de connexion automatique après inscription
  try {
    await signIn('credentials', {
      email,
      password, // Passer le mot de passe original, pas le hash, à signIn
      redirectTo: '/dashboard', // signIn s'occupera de la redirection
    });
    // Si signIn réussit et redirige, ce code n'est pas atteint.
    // S'il ne redirige pas mais réussit (rare), on pourrait retourner un état de succès.
    // Mais la redirection est le comportement standard.
    // Pour satisfaire la signature de retour au cas où :
    return { message: "Connexion en cours...", errors: {} }; // message string
  } catch (authError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((authError as any).digest?.startsWith('NEXT_REDIRECT')) {
      // La redirection est en cours, la relancer pour que Next.js la gère
      throw authError;
    }

    // Si signIn échoue spécifiquement (ex: AuthError) mais que l'utilisateur a été créé
    console.error('Sign In after Signup Error:', authError);
    if (authError instanceof AuthError) {
      // On ne veut probablement pas afficher une erreur de "credentials" ici car l'utilisateur
      // vient d'être créé. On veut plutôt le rediriger vers login avec un message.
      // Cependant, useActionState attend un retour.
      // Pour éviter la redirection ici et afficher un message sur la page signup :
      return {
        message: null, // message null
        errors: { form: ['Compte créé ! La connexion automatique a échoué. Veuillez vous connecter manuellement.'] }
      };
    }
    // Pour d'autres erreurs inattendues lors de la tentative de signIn
    return {
      message: null, // message null
      errors: { form: ['Compte créé, mais une erreur inattendue est survenue lors de la connexion automatique.'] }
    };
    // Alternative plus simple si on veut toujours rediriger vers login après création et échec de signIn auto:
    // redirect('/login?message=Compte créé avec succès ! Veuillez vous connecter.');
  }
}