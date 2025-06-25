// src/lib/data.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { User } from './definitions';

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

// Fonction pour récupérer un utilisateur par email
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Mettre à jour le type Customer si on veut ajouter le total des factures ou le nombre de factures
export type CustomerWithStats = Customer & {
  total_invoices: number;
  total_pending_in_cents: number;
  total_paid_in_cents: number;
};

// Nombre de clients par page pour la pagination
const CUSTOMERS_PER_PAGE = 10;

// Nouvelle fonction pour récupérer les clients avec recherche et pagination
export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
): Promise<{ customers: Customer[]; totalPages: number }> { // Retourne des Customer simples pour l'instant
  noStore();
  const offset = (currentPage - 1) * CUSTOMERS_PER_PAGE;

  try {
    const customersQuery = sql<Customer>`
      SELECT
        id,
        name,
        email,
        image_url
        -- Pour des stats plus tard :
        -- COUNT(invoices.id) AS total_invoices,
        -- SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount_in_cents ELSE 0 END) AS total_pending_in_cents,
        -- SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount_in_cents ELSE 0 END) AS total_paid_in_cents
      FROM customers
      -- LEFT JOIN invoices ON customers.id = invoices.customer_id -- Si on ajoute les stats
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
      -- GROUP BY customers.id, customers.name, customers.email, customers.image_url -- Si on ajoute les stats
      ORDER BY customers.name ASC
      LIMIT ${CUSTOMERS_PER_PAGE} OFFSET ${offset}
    `;

    const countQuery = sql`
      SELECT COUNT(*)
      FROM customers
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
    `;

    const [customersData, countData] = await Promise.all([
      customersQuery,
      countQuery,
    ]);

    // Pour l'instant, customersData.rows est déjà de type Customer[]
    const customers = customersData.rows;

    const totalCount = Number(countData.rows[0].count ?? '0');
    const totalPages = Math.ceil(totalCount / CUSTOMERS_PER_PAGE);

    return { customers, totalPages };
  } catch (error) {
    console.error('Database Error fetching customers:', error);
    throw new Error('Failed to fetch customers.');
  }
}

// L'ancienne fonction fetchCustomers peut être renommée ou supprimée si plus utilisée
// export async function fetchAllCustomersSimple(): Promise<Customer[]> { /* ... */ }
// Si vous la gardez, assurez-vous qu'elle est distincte.
// Pour l'instant, je vais commenter l'ancienne et la remplacer par la nouvelle fetchCustomers pour le formulaire de création de facture
// ou nous pouvons juste utiliser fetchFilteredCustomers avec query='' et page=1 pour obtenir tous les clients pour le select.
// Pour le select du formulaire de facture, on veut tous les clients, pas de pagination.
export async function fetchAllCustomersForSelect(): Promise<Customer[]> {
  noStore();
  try {
    const data = await sql<Customer>`
        SELECT
            id,
            name
        FROM customers
        ORDER BY name ASC
        `;
    return data.rows;
  } catch (err) {
    console.error('Database Error fetching all customers for select:', err);
    throw new Error('Failed to fetch all customers for select.');
  }
}