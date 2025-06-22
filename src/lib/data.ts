// src/lib/data.ts
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache'; // Pour désactiver le caching si besoin

// Types que nous allons utiliser (vous pouvez les affiner)
export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type InvoiceItem = {
  id: string; // id de l'invoice_item
  description: string;
  quantity: number;
  unitPrice: number; // En euros (converti depuis les centimes)
  total: number; // En euros (quantity * unitPrice)
};

export type FullInvoice = {
  id: string; // id de la facture
  invoice_number_display?: string; // Si vous avez un formatage INV001
  customer_id: string;
  customer_name: string;
  customer_email: string; // de la table customers
  customer_image_url?: string; // de la table customers
  amount: number; // Total en euros (converti depuis les centimes)
  status: 'pending' | 'paid' | 'overdue';
  date: string; // Format YYYY-MM-DD
  billing_address: string | null; // Adresse de facturation de la facture
  items: InvoiceItem[];
};

export async function fetchInvoiceById(id: string): Promise<FullInvoice | null> {
  noStore();
  try {
    // Récupérer les détails de la facture et les infos client
    const invoiceData = await sql`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount_in_cents,
        invoices.status,
        invoices.date,
        invoices.billing_address,
        customers.name AS customer_name,
        customers.email AS customer_email,
        customers.image_url AS customer_image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.id = ${id};
    `;

    const invoice = invoiceData.rows[0];

    if (!invoice) {
      return null;
    }

    // Récupérer les items de la facture
    const itemsData = await sql`
      SELECT
        id,
        description,
        quantity,
        unit_price_in_cents
      FROM invoice_items
      WHERE invoice_id = ${id};
    `;

    const items: InvoiceItem[] = itemsData.rows.map(item => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price_in_cents / 100.0, // Convertir en euros
      total: (item.quantity * item.unit_price_in_cents) / 100.0, // Convertir en euros
    }));

    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_image_url: invoice.customer_image_url || undefined,
      amount: invoice.amount_in_cents / 100.0, // Convertir en euros
      status: invoice.status as 'pending' | 'paid' | 'overdue',
      date: new Date(invoice.date).toISOString().split('T')[0], // Assurer le format YYYY-MM-DD
      billing_address: invoice.billing_address,
      items: items,
    };

  } catch (error) {
    console.error('Database Error fetching invoice by ID:', error);
    // Ne pas jeter l'erreur ici pour permettre à la page de gérer le cas null
    // ou jeter une erreur spécifique si vous voulez qu'un error.tsx la capture.
    return null; // Ou throw new Error('Failed to fetch invoice.');
  }
}

// Fonction pour récupérer les factures (sera complétée dans le prochain atelier)
export async function fetchInvoices(query?: string, currentPage?: number) {
  noStore(); // Désactive le caching pour cette requête, pour toujours avoir les données fraîches
  // La logique SQL viendra ici
  console.log("Fetching invoices... (query, currentPage à implémenter)");
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simuler un délai
  return { invoices: [], totalPages: 1 }; // Placeholder
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<Customer>`SELECT id, name, email, image_url FROM customers ORDER BY name ASC`;
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

// ... autres fonctions de data à venir ...