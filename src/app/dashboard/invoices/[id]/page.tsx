import Link from "next/link";
import type { Metadata } from "next";

// Fonction pour générer les métadonnées dynamiquement (exemple)
export async function generateMetadata({
  params,
}: InvoiceDetailPageProps): Promise<Metadata> {
  return {
    title: `Facture ${(await params).id}`,
  };
}

type InvoiceDetailPageProps = {
  params: Promise<{ id: string }>;
};

// Simuler la récupération d'une facture par ID
// Au Jour 2, cela viendrait d'une vraie source de données
const getInvoiceById = async (id: string) => {
  // Données fictives
  const dummyInvoices = [
    {
      id: "INV001",
      customer: "Stark Industries",
      amount: 1500.75,
      status: "Payée" as const,
      date: "2023-01-15",
      items: [
        {
          description: "Consulting Services",
          quantity: 10,
          unitPrice: 150.075,
        },
      ],
      address: "1 Stark Tower, New York, NY",
    },
    {
      id: "INV002",
      customer: "Wayne Enterprises",
      amount: 200.0,
      status: "En attente" as const,
      date: "2023-02-01",
      items: [
        { description: "Batarangs (Lot de 100)", quantity: 2, unitPrice: 100 },
      ],
      address: "1007 Mountain Drive, Gotham City",
    },
    {
      id: "INV003",
      customer: "Oscorp",
      amount: 3250.5,
      status: "En retard" as const,
      date: "2023-01-20",
      items: [
        {
          description: "Goblin Serum Research",
          quantity: 1,
          unitPrice: 3250.5,
        },
      ],
      address: "Oscorp Tower, New York, NY",
    },
  ];
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simuler un délai
  return dummyInvoices.find((inv) => inv.id === id) || null;
};

// Helper pour le statut
const getStatusPill = (
  status: "Payée" | "En attente" | "En retard" | undefined
) => {
  if (!status) return null;
  let className = "px-3 py-1 text-xs font-semibold rounded-full ";
  if (status === "Payée")
    className +=
      "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
  else if (status === "En attente")
    className +=
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
  else if (status === "En retard")
    className += "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
  return <span className={className}>{status}</span>;
};

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    // Au Jour 2, nous pourrions utiliser notFound() de next/navigation
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Facture non trouvée</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Désolé, la facture avec l&apos;ID {id} n&apos;a pas pu être
          trouvée.
        </p>
        <Link
          href="/dashboard/invoices"
          className="mt-6 inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Retour à la liste des factures
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
            Facture <span className="text-green-500">#{invoice.id}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Date d&apos;émission:{" "}
            {new Date(invoice.date).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">{getStatusPill(invoice.status)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Client:
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            {invoice.customer}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {invoice.address || "Adresse non fournie"}
          </p>
        </div>
        <div className="text-left md:text-right">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Montant Total:
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(invoice.amount)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Détails des articles:
        </h2>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-md">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">
                  Qté
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">
                  Prix Unit.
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-300">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-600 dark:text-slate-300">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800 dark:text-white">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    }).format(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          Imprimer
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          Marquer comme Payée
        </button>
      </div>
    </div>
  );
}
