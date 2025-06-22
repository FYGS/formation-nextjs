import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      {/* ... (partie supérieure avec le nom Acorn Finance) ... */}
      <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-600 bg-gradient-to-b from-zinc-800/30 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-700 dark:bg-zinc-900/40 lg:static lg:w-auto lg:rounded-xl lg:border lg:border-gray-700 lg:bg-gray-800/60 lg:p-4">
        Acorn Finance
      </div>

      <div className="relative flex place-items-center flex-col text-center mt-16 lg:mt-0">
        <Image
          src="/acorn-logo.svg"
          alt="Acorn Finance"
          width={80}
          height={80}
          className="mb-8"
        />{" "}
        {/* Logo plus grand */}
        <h1 className="text-4xl sm:text-5xl font-bold font-heading mb-6">
          Gérez vos Finances avec{" "}
          <span className="text-green-400">Acorn Finance</span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-slate-300 max-w-2xl">
          La solution intuitive pour suivre vos factures, dépenses et revenus.
          Prenez le contrôle de votre avenir financier.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 block text-center"
            href="/dashboard"
          >
            {" "}
            Commencer Gratuitement
          </Link>
          <Link
            className="border border-slate-300 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out block text-center"
            href="/about"
          >
            {" "}
            En savoir plus
          </Link>
        </div>
      </div>

      {/* Placeholder pour d'autres sections de la page d'accueil si besoin */}
      <div className="mt-20 w-full max-w-5xl">
        {/* ... Autres sections ... */}
      </div>
    </main>
  );
}
