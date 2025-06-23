// src/lib/actions.ts
'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Définition du schéma Zod pour la validation de la facture
const InvoiceSchema = z.object({
  id: z.string(), // Utilisé pour la modification, pas pour la création ici
  customerId: z.string({
    invalid_type_error: 'Veuillez sélectionner un client.', // Message si pas une chaîne (ne devrait pas arriver avec <select>)
  }).uuid({ message: "L'ID client doit être un UUID valide." }), // S'assurer que c'est un UUID

  amount: z.coerce // z.coerce tente de convertir la valeur en nombre avant de valider
    .number({
      invalid_type_error: "Veuillez entrer un montant numérique.",
    })
    .gt(0, { message: 'Le montant doit être supérieur à 0 €.' }),

  status: z.enum(['pending', 'paid', 'overdue'], { // Assure que le statut est l'une de ces valeurs
    invalid_type_error: 'Veuillez sélectionner un statut pour la facture.',
  }),
  date: z.string(), // La date sera générée, donc pas besoin de validation complexe ici pour la création
});

// Nous n'avons besoin que d'un sous-ensemble pour la création
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
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100); // Convertir en centimes et arrondir
  const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format YYYY-MM-DD

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

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100);

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