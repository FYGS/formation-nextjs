"use client"; // Ce composant a besoin d'état et d'effets, donc Client Component

import { useEffect, useState } from "react";
import Link from "next/link";

type Invoice = {
  id: string;
  customer: string;
  amount: number;
  status: "Payée" | "En attente" | "En retard";
  date: string;
};

// Fonction pour formater la date (simple exemple)
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Fonction pour formater le montant
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Fonction pour obtenir la classe de style en fonction du statut
const getStatusClass = (status: Invoice["status"]) => {
  switch (status) {
    case "Payée":
      return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
    case "En attente":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
    case "En retard":
      return "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
  }
};

export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/invoices"); // Appel à notre Route Handler
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue est survenue");
        }
        console.error("Erreur lors de la récupération des factures:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'une fois au montage

  if (loading) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
        Chargement des factures...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400 py-8">
        Erreur: {error}
      </p>
    );
  }

  if (invoices.length === 0) {
    return (
      <p className="text-center text-slate-500 dark:text-slate-400 py-8">
        Aucune facture à afficher.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
            >
              ID Facture
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
            >
              Montant
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
            >
              Statut
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                {invoice.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {invoice.customer}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {formatDate(invoice.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {formatCurrency(invoice.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                    invoice.status
                  )}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                >
                  Voir
                </Link>
                {/* Plus tard: Modifier, Supprimer */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
