import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Acorn Finance - Votre Tableau de Bord Financier", // Titre par défaut pour le site
    template: "%s | Acorn Finance", // Modèle pour les titres des pages enfants (ex: "Factures | Acorn Finance")
  },
  description:
    "Gérez vos factures, dépenses et revenus facilement avec Acorn Finance. Prenez le contrôle de votre avenir financier.",
  keywords: [
    "finance",
    "tableau de bord",
    "factures",
    "dépenses",
    "revenus",
    "gestion financière",
  ],
  authors: [{ name: "Votre Nom/Entreprise", url: "https://votre-site.com" }], // Optionnel
  creator: "Votre Nom/Entreprise", // Optionnel
  publisher: "Votre Nom/Entreprise", // Optionnel
  // Open Graph (pour le partage sur les réseaux sociaux comme Facebook, LinkedIn)
  openGraph: {
    type: "website",
    locale: "fr_FR", // Important pour la langue
    url: "https://acorn-finance.example.com", // Remplacez par votre URL de production
    title: "Acorn Finance - Votre Tableau de Bord Financier",
    description: "Gérez vos factures, dépenses et revenus facilement.",
    siteName: "Acorn Finance",
    // images: [ // Vous pouvez ajouter des images pour le partage
    //   {
    //     url: "https://acorn-finance.example.com/og-image.png", // URL absolue
    //     width: 1200,
    //     height: 630,
    //     alt: "Acorn Finance Open Graph Image",
    //   },
    // ],
  },
  // Twitter Card (pour le partage sur Twitter)
  twitter: {
    card: "summary_large_image", // Type de carte : summary, summary_large_image, app, player
    // site: "@votretwitterhandle", // Optionnel: votre handle Twitter du site
    // creator: "@votrecreatorhandle", // Optionnel: handle Twitter du créateur de contenu
    title: "Acorn Finance - Votre Tableau de Bord Financier",
    description: "Gérez vos factures, dépenses et revenus facilement.",
    // images: ["https://acorn-finance.example.com/twitter-image.png"], // URL absolue de l'image pour Twitter
  },
  // Favicons et icônes
  icons: {
    icon: "/favicon.ico", // Chemin relatif depuis public/
    shortcut: "/favicon-16x16.png", // Ou /apple-touch-icon.png
    apple: "/apple-touch-icon.png",
    // autres icônes si besoin
  },
  // Pour les PWA (Progressive Web Apps)
  manifest: "/site.webmanifest", // Chemin vers votre fichier manifest
  // Robots pour les moteurs de recherche
  robots: {
    // Contrôle fin de l'indexation
    index: true,
    follow: true,
    nocache: false, // Permettre la mise en cache
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true, // Exemple: ne pas indexer les images sur cette page via Google
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Thème de couleur pour la barre d'adresse du navigateur
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4CAF50" }, // Vert pour le thème clair
    { media: "(prefers-color-scheme: dark)", color: "#2E7D32" }, // Vert plus foncé pour le thème sombre
  ],
  // Viewport (généralement bien géré par Next.js, mais peut être spécifié)
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1, // Empêche le zoom utilisateur si désiré, à utiliser avec prudence
  },
  // Canonical URL (très important pour le SEO pour éviter le contenu dupliqué)
  // Vous pouvez définir une URL canonique de base ici, et la surcharger dans les pages enfants
  //alternates: {
  //  canonical: "https://acorn-finance.example.com",
  //  languages: {
  //    'en-US': 'https://acorn-finance.example.com/en-US',
  //    'es-ES': 'https://acorn-finance.example.com/es-ES',
  //  },
  //},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 flex flex-col min-h-screen`}
      >
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
