import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paramètres",
  description:
    "Gérez les paramètres de votre compte et de l'application Acorn Finance.",
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-slate-800 dark:text-white mb-8">
        Paramètres du Compte
      </h1>

      <div className="space-y-12">
        {/* Section Profil */}
        <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white">
              Profil Utilisateur
            </h3>
            <div className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              <p>Mettez à jour vos informations personnelles.</p>
            </div>
            <form className="mt-5 sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-3">
              {/* Formulaire simplifié pour l'exemple */}
              <div className="w-full sm:max-w-xs">
                <label htmlFor="username" className="sr-only">
                  Nom d&apos;utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  defaultValue="UtilisateurExemple"
                  className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 px-3 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm text-slate-900 dark:text-slate-50"
                  placeholder="Nom d'utilisateur"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                Sauvegarder
              </button>
            </form>
          </div>
        </div>

        {/* Section Notifications */}
        <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white">
              Notifications
            </h3>
            <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Gérez vos préférences de notification.
            </p>
            <div className="mt-5 space-y-4">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id="email-notifications"
                    name="email-notifications"
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label
                    htmlFor="email-notifications"
                    className="font-medium text-slate-900 dark:text-white"
                  >
                    Notifications par e-mail
                  </label>
                  <p className="text-slate-500 dark:text-slate-400">
                    Recevez des mises à jour importantes par e-mail.
                  </p>
                </div>
              </div>
              {/* ... autres options de notification ... */}
            </div>
          </div>
        </div>

        {/* Section Thème (placeholder) */}
        <div className="bg-white dark:bg-slate-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white">
              Apparence
            </h3>
            <p className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Choisissez le thème de l&apos;application.
            </p>
            <div className="mt-5">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Un sélecteur de thème (Clair/Sombre/Système) sera implémenté
                ici.
              </p>
              {/* Bouton pour switcher le thème (nécessitera du JS et un contexte/état global) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
