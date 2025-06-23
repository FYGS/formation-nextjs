// src/lib/data.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

// Types que nous allons utiliser
export type Customer = {
  id: string; // UUID
  name: string;
  email: string;
  image_url: string; // Peut être un chemin relatif vers /public ou une URL complète
  // address?: string; // Déjà dans le schéma, peut être ajouté au type si besoin ici
};

export type InvoiceFromDB = {
  id: string;
  customer_id: string;
  amount_in_cents: number;
  status: 'pending' | 'paid' | 'overdue';
  date: Date;
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

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // En euros
  total: number; // En euros
};

export type FullInvoice = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_image_url?: string;
  amount: number; // Total en euros
  status: 'pending' | 'paid' | 'overdue';
  date: string; // Format YYYY-MM-DD
  billing_address: string | null;
  items: InvoiceItem[];
};


const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
): Promise<{ invoices: FormattedInvoice[]; totalPages: number }> {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // SIMULER UNE ERREUR SERVEUR
  console.log("Simulating server error in fetchFilteredInvoices...");
  throw new Error('Erreur simulée lors de la récupération des factures !');

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
      amount: invoice.amount_in_cents / 100,
      date: new Date(invoice.date).toISOString().split('T')[0],
    })) as FormattedInvoice[];

    const totalCount = Number(countData.rows[0].count ?? '0');
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return { invoices, totalPages };
  } catch (error) {
    console.error('Database Error fetching invoices:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchAllInvoicesSimple(): Promise<FormattedInvoice[]> {
  noStore();
  try {
    const data = await sql<InvoiceFromDB & { customer_name: string; customer_email: string; customer_image_url: string; }>`
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

    const formattedInvoices = data.rows.map((invoice) => ({
      id: invoice.id,
      customer_id: invoice.customer_id,
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_image_url: invoice.customer_image_url,
      amount: invoice.amount_in_cents / 100,
      status: invoice.status,
      date: new Date(invoice.date).toISOString().split('T')[0],
    }));
    return formattedInvoices;
  } catch (error) {
    console.error('Database Error (fetchAllInvoicesSimple):', error);
    throw new Error('Failed to fetch all invoices.');
  }
}

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
    return null; // Ou throw new Error si vous voulez qu'un error.tsx le capture au niveau page
  }
}

export async function fetchCustomers(): Promise<Customer[]> {
  noStore(); // Désactive le caching pour cette requête pour toujours avoir la liste à jour
  try {
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Simuler un délai si besoin pour tester le loading state
    const data = await sql<Customer>`
      SELECT
        id,
        name,
        email,
        image_url
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error fetching customers:', err);
    throw new Error('Failed to fetch all customers.');
  }
}