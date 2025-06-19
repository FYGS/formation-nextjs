import Image from "next/image";
import Link from "next/link";
// Importer le composant Image de Next.js si vous avez un logo
// import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center text-2xl font-bold text-green-600 dark:text-green-400"
        >
          <Image
            src="/acorn-logo.svg" // Chemin depuis public/
            alt="Acorn Finance Logo"
            width={32} // Largeur réelle de l'image (ou ratio)
            height={32} // Hauteur réelle de l'image (ou ratio)
            className="mr-2" // Un peu d'espace à droite
            priority // Indique à Next.js de charger cette image en priorité (LCP)
          />
          Acorn Finance
        </Link>
        <div>
          <Link
            href="/dashboard"
            className="text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Tableau de bord
          </Link>
          <Link
            href="/login"
            className="ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
          >
            Se connecter
          </Link>
          {/* Plus tard, nous pourrions ajouter un bouton pour changer de thème (light/dark) */}
        </div>
      </nav>
    </header>
  );
}
