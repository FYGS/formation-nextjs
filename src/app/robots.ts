// src/app/robots.ts
import { MetadataRoute } from 'next';

// Utiliser la même logique pour BASE_URL que dans sitemap.ts
const vercelURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL; // Ou BASE_URL si définie côté serveur
const BASE_URL = envBaseUrl || vercelURL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/login',
          '/signup',
          '/api/', // On peut aussi utiliser un pattern comme '/api/*'
          // Ajoutez d'autres chemins privés ou non pertinents pour le SEO
          // par exemple: '/admin/', '/private-content/'
        ],
      },
      // Vous pourriez ajouter des règles spécifiques pour certains bots
      // {
      //   userAgent: 'Googlebot-Image',
      //   disallow: ['/images-privees/'],
      // },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    // host: BASE_URL, // Ancienne directive, sitemap est préféré
  };
}