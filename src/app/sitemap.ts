// src/app/sitemap.ts
import { MetadataRoute } from 'next';
// import { sql } from '@vercel/postgres'; // Pour récupérer les ID des factures
import { unstable_noStore as noStore } from 'next/cache';


// Type pour les entrées du sitemap, bien que MetadataRoute.Sitemap le fournisse
// type SitemapEntry = {
//   url: string;
//   lastModified?: string | Date;
//   changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
//   priority?: number;
// };

// Définir l'URL de base de votre site (à configurer dans les variables d'environnement)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  noStore(); // S'assurer que le sitemap est généré dynamiquement si les données changent souvent

  // 1. Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      // lastModified: new Date().toISOString(), // Peut être omis si peu de changement
      changeFrequency: 'yearly',
      priority: 0.5, // Moins prioritaire pour l'indexation
    },
    {
      url: `${BASE_URL}/signup`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    // Note: Nous n'incluons généralement pas les pages du dashboard dans un sitemap public
    // car elles sont derrière une authentification. Si certaines étaient publiques, on les ajouterait.
    // {
    //   url: `${BASE_URL}/dashboard/invoices`,
    //   // ...
    // },
  ];

  // 2. Pages dynamiques (par exemple, les détails des factures - UNIQUEMENT SI ELLES SONT PUBLIQUES)
  // Pour notre application Acorn Finance, les pages de détail des factures sont derrière une authentification,
  // donc il n'est PAS RECOMMANDÉ de les inclure dans un sitemap public.
  // L'exemple ci-dessous est purement illustratif pour montrer comment faire pour des pages dynamiques publiques.

  // let dynamicInvoicePages: MetadataRoute.Sitemap = [];
  /*
  // SI LES PAGES DE FACTURES ÉTAIENT PUBLIQUES :
  try {
    const invoicesData = await sql<{ id: string; date: Date }>`
      SELECT id, date FROM invoices ORDER BY date DESC
    `; // Supposons que 'date' est la date de dernière modification ou de publication

    dynamicInvoicePages = invoicesData.rows.map((invoice) => ({
      url: `${BASE_URL}/dashboard/invoices/${invoice.id}`, // Ajuster le chemin si la structure URL est différente pour le public
      lastModified: new Date(invoice.date).toISOString(), // Utiliser la date de la facture comme lastModified
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch dynamic invoice URLs for sitemap:", error);
    // Ne pas bloquer la génération du sitemap si cette partie échoue
  }
  */

  // Combiner toutes les entrées
  // return [...staticPages, ...dynamicInvoicePages];
  return staticPages; // Pour l'instant, ne retournons que les pages statiques publiques
}