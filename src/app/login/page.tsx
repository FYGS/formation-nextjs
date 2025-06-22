import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Acorn Finance.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Ajuster min-h pour tenir compte du header/footer */}
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Ou{" "}
            <Link
              href="/signup"
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
            >
              créez un nouveau compte
            </Link>{" "}
            {/* Pointe vers une future page d'inscription */}
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          {" "}
          {/* L'action et la méthode seront gérées par les Server Actions plus tard */}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-slate-300 dark:border-slate-600 px-3 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Adresse e-mail"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-slate-300 dark:border-slate-600 px-3 py-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-green-600 focus:ring-green-500 dark:focus:ring-green-400 dark:ring-offset-slate-800"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-900 dark:text-slate-300"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-3 px-4 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
