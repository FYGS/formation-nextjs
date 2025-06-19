"use client"; // Sidebar devient un Client Component car usePathname est un hook client

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
	HomeIcon,
	DocumentDuplicateIcon,
	UsersIcon,
	Cog6ToothIcon,
	ArrowLeftOnRectangleIcon,
	Bars3Icon,
	XMarkIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: "Vue d'ensemble", href: "/dashboard",  icon: HomeIcon },
  { name: "Factures", href: "/dashboard/invoices", icon: DocumentDuplicateIcon },
  { name: "Clients", href: "/dashboard/customers", icon: UsersIcon },
];

const secondaryNavigation = [
  { name: "Paramètres", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={classNames(
          "fixed lg:sticky top-0 z-30 lg:z-0 h-[100dvh]",
          "w-64 shrink-0",
          "transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4 h-full border-r border-slate-700">
          <div className="flex h-16 shrink-0 items-center">
            <Link
              href="/dashboard"
              className="flex items-center text-xl font-bold text-green-400"
            >
              <Image
                src="/acorn-logo.svg"
                alt="Acorn Dashboard Logo"
                width={24}
                height={24}
                className="mr-2"
              />
              Acorn DB
            </Link>
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" &&
                        pathname.startsWith(item.href));
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-slate-800 text-green-400"
                              : "text-slate-300 hover:text-green-400 hover:bg-slate-800", // text-slate-300 pour un meilleur contraste
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors" // Ajouté items-center
                          )}
                        >
                          {/* Si vous ajoutez des icônes, elles s'aligneront bien */}
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              {/* ... (navigation secondaire et lien "Quitter") ... */}
              {/* Pour la navigation secondaire, vous pouvez appliquer la même logique isActive si besoin */}
              <li className="mt-auto">
                {" "}
                {/* Pousse la navigation secondaire en bas */}
                <ul
                  role="list"
                  className="-mx-2 space-y-1 pt-4 border-t border-slate-700"
                >
                  {secondaryNavigation.map((item) => {
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-slate-800 text-green-400"
                              : "text-slate-300 hover:text-green-400 hover:bg-slate-800",
                            "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors"
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-6 -mx-2">
                  <Link
                    href="/"
                    className="text-slate-300 hover:text-red-400 hover:bg-slate-800 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
                    Quitter le tableau de bord
                  </Link>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
