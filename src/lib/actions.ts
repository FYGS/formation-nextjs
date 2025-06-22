// src/app/lib/actions.ts
'use server'; // Indique que toutes les fonctions exportées dans ce fichier sont des Server Actions

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod'; // Nous l'utiliserons pour la validation à l'étape suivante

// Schéma de validation avec Zod (sera affiné plus tard)
const InvoiceSchema = z.object({
  customerId: z.string().uuid({ message: "Veuillez sélectionner un client." }),
  amount: z.coerce // Transforme la chaîne en nombre
    .number()
    .gt(0, { message: "Veuillez entrer un montant supérieur à 0." }),
  status: z.enum(['pending', 'paid', 'overdue'], {
    invalid_type_error: "Veuillez sélectionner un statut de facture.",
  }),
  // date: z.string(), // La date sera générée automatiquement pour l'instant
});

// Ce type sera utilisé pour le retour d'état avec useFormState
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
    // date?: string[]; // Si on ajoutait la date au formulaire
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Valider les champs du formulaire en utilisant Zod
  const validatedFields = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Si la validation du formulaire échoue, retourner les erreurs tôt. Sinon, continuer.
  if (!validatedFields.success) {
    console.log('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Champs manquants ou invalides. Échec de la création de la facture.',
    };
  }

  // Préparer les données pour l'insertion dans la base de données
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100; // Convertir en centimes
  const date = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount_in_cents, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Erreur de base de données : Échec de la création de la facture.',
    };
  }

  // Revalider le cache pour la page des factures et rediriger l'utilisateur.
  revalidatePath('/dashboard/invoices'); // Met à jour les données affichées sur cette page
  redirect('/dashboard/invoices'); // Redirige vers la liste des factures

  // Théoriquement, le redirect interrompt l'exécution, donc ce return n'est pas toujours atteint.
  // Mais pour la cohérence du type de retour de useFormState, on peut l'ajouter.
  // return { message: 'Facture créée avec succès (ce message ne sera pas vu à cause du redirect)', errors: {} };
}