/* eslint-disable @typescript-eslint/no-explicit-any */
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

// ... (Types Customer, Invoice, InvoiceWithCustomer restent les mêmes) ...
// MAJ du type Invoice pour correspondre à la DB (amount_in_cents, status avec nos valeurs)
export type InvoiceFromDB = {
  id: string;
  customer_id: string;
  amount_in_cents: number;
  status: 'pending' | 'paid' | 'overdue';
  date: Date; // Le driver pg retourne les dates comme des objets Date
};

export type FormattedInvoice = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_image_url: string;
  amount: number; // En euros
  status: 'pending' | 'paid' | 'overdue';
  date: string; // Format YYYY-MM-DD pour l'affichage
};

const ITEMS_PER_PAGE = 6; // Nous l'utiliserons plus tard pour la pagination

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<{ invoices: FormattedInvoice[]; totalPages: number }> {
  noStore(); // Désactive le caching pour cette requête CRUCIAL pour forcer le rafraîchissement des données
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // // SIMULER UN DÉLAI IMPORTANT
  // console.log('Simulating slow data fetch for invoices...');
  // await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 secondes de délai
  // console.log('Delay finished, fetching data...');

  try {
    const invoicesQuery = sql`
      SELECT
        invoices.id,
        invoices.amount_in_cents,
        invoices.date,
        invoices.status,
        customers.name AS customer_name,
        customers.email AS customer_email,
        customers.image_url AS customer_image_url,
        invoices.customer_id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        CAST(invoices.amount_in_cents / 100.0 AS TEXT) ILIKE ${`%${query}%`} OR
        TO_CHAR(invoices.date, 'YYYY-MM-DD') ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const countQuery = sql`
      SELECT COUNT(*)
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        CAST(invoices.amount_in_cents / 100.0 AS TEXT) ILIKE ${`%${query}%`} OR
        TO_CHAR(invoices.date, 'YYYY-MM-DD') ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
    `;

    const [invoicesData, countData] = await Promise.all([
      invoicesQuery,
      countQuery,
    ]);

    const invoices = invoicesData.rows.map((invoice: any) => ({
      ...invoice,
      amount: invoice.amount_in_cents / 100, // Convertir en euros
      date: new Date(invoice.date).toISOString().split('T')[0], // Formater la date
    })) as FormattedInvoice[];

    const totalCount = Number(countData.rows[0].count ?? '0');
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { invoices, totalPages };
  } catch (error) {
    console.error('Database Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

// Ancienne fonction fetchInvoices (simple, sans recherche/pagination)
// Kept for reference or simpler use cases if needed, but fetchFilteredInvoices is preferred
export async function fetchAllInvoicesSimple(): Promise<FormattedInvoice[]> {
  noStore();
  try {
    const data = await sql`
      SELECT
        invoices.id,
        invoices.amount_in_cents,
        invoices.date,
        invoices.status,
        customers.name AS customer_name,
        customers.email AS customer_email,
        customers.image_url AS customer_image_url,
        invoices.customer_id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC;
    `;

    // Formater les données pour le frontend
    const formattedInvoices = data.rows.map((invoice: any) => ({
      id: invoice.id,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_image_url: invoice.customer_image_url,
      amount: invoice.amount_in_cents / 100, // Convertir en euros
      status: invoice.status as 'pending' | 'paid' | 'overdue',
      date: new Date(invoice.date).toISOString().split('T')[0], // Format YYYY-MM-DD
    }));
    return formattedInvoices;
  } catch (error) {
    console.error('Database Error (fetchAllInvoicesSimple):', error);
    throw new Error('Failed to fetch all invoices.');
  }
}


// ... (fetchCustomers et fetchInvoiceById restent comme définis précédemment) ...
// S'assurer que fetchInvoiceById utilise bien amount_in_cents et unit_price_in_cents
// et fait la conversion en euros pour les montants.
// Par exemple, pour fetchInvoiceById :
export async function fetchInvoiceById(id: string): Promise<FullInvoice | null> {
  noStore();
  try {
    const invoiceData = await sql<InvoiceFromDB & { customer_name: string; customer_email: string; customer_image_url: string; billing_address: string | null; }>`
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

    const itemsData = await sql<{ id: string; description: string; quantity: number; unit_price_in_cents: number; }>`
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
      unitPrice: item.unit_price_in_cents / 100.0,
      total: (item.quantity * item.unit_price_in_cents) / 100.0,
    }));

    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_image_url: invoice.customer_image_url || undefined,
      amount: invoice.amount_in_cents / 100.0,
      status: invoice.status,
      date: new Date(invoice.date).toISOString().split('T')[0],
      billing_address: invoice.billing_address,
      items: items,
    };
  } catch (error) {
    console.error('Database Error fetching invoice by ID:', error);
    return null;
  }
}
// Nouveaux types pour fetchInvoiceById
export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};
export type FullInvoice = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_image_url?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: string;
  billing_address: string | null;
  items: InvoiceItem[];
};