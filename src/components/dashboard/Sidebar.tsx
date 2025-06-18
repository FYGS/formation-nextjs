import Link from "next/link";
// Plus tard, nous pourrions ajouter des icônes ici
// import { HomeIcon, DocumentDuplicateIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const navigation = [
  {
    name: "Vue d'ensemble",
    href: "/dashboard",
    /* icon: HomeIcon, */ current: true,
  }, // 'current' sera géré dynamiquement plus tard
  {
    name: "Factures",
    href: "/dashboard/invoices",
    /* icon: DocumentDuplicateIcon, */ current: false,
  },
  {
    name: "Clients",
    href: "/dashboard/customers",
    /* icon: UsersIcon, */ current: false,
  }, // Exemple de page future
];

const secondaryNavigation = [
  { name: "Paramètres", href: "/dashboard/settings" /* icon: Cog6ToothIcon */ }, // Exemple de page future
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 w-64 min-h-screen">
      {" "}
      {/* min-h-screen ici pour qu'elle prenne toute la hauteur */}
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-green-400">
          {/* Optionnel: Logo spécifique au dashboard */}
          Acorn DB
        </Link>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-slate-800 text-green-400"
                        : "text-slate-400 hover:text-green-400 hover:bg-slate-800",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                    )}
                  >
                    {/* {item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />} */}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            {" "}
            {/* Pousse la navigation secondaire en bas */}
            <ul
              role="list"
              className="-mx-2 space-y-1 pt-4 border-t border-slate-700"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-green-400 hover:bg-slate-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
                  >
                    {/* {item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />} */}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 -mx-2">
              <Link
                href="/" // Lien pour retourner à la page d'accueil publique
                className="text-slate-400 hover:text-red-400 hover:bg-slate-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors"
              >
                {/* Optionnel: Icône de déconnexion ou retour */}
                Quitter le tableau de bord
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}
