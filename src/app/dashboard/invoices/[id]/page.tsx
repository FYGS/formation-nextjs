import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchInvoiceById, FormattedInvoice } from "@/lib/data";

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

// Helper pour le statut
const getStatusPill = (
  status: FormattedInvoice["status"] | undefined
) => {
  if (!status) return null;
  let className = "px-3 py-1 text-xs font-semibold rounded-full ";
  if (status === "paid")
    className +=
      "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
  else if (status === "pending")
    className +=
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
  else if (status === "overdue")
    className += "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
  return <span className={className}>{status}</span>;
};

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;
  const invoice = await fetchInvoiceById(id);

  if (!invoice) {
		notFound(); // Si la facture n'est pas trouvée, déclencher la page 404
	}

  return (
		<div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-8">
			{/* ... (affichage des détails de la facture) ... */}
			<div className="flex flex-col sm:flex-row justify-between items-start mb-6">
				<div>
					<h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
						Facture{' '}
						<span className="text-green-500">
							#{invoice.id.substring(0, 8)}...
						</span>{' '}
						{/* Affichage partiel de l'ID pour la propreté */}
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
						Date d&apos;émission:{' '}
						{new Date(invoice.date).toLocaleDateString('fr-FR')}
					</p>
				</div>
				<div className="mt-4 sm:mt-0">{getStatusPill(invoice.status)}</div>
			</div>
			{/* ... reste de l'affichage des détails ... */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<div>
					<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
						Client:
					</h2>
					<p className="text-slate-600 dark:text-slate-300">
						{invoice.customer_name}
					</p>
					<p className="text-slate-500 dark:text-slate-400 text-sm">
						{invoice.billing_address || 'Adresse non fournie'}
					</p>
				</div>
				<div className="text-left md:text-right">
					<h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
						Montant Total:
					</h2>
					<p className="text-3xl font-bold text-green-600 dark:text-green-400">
						{new Intl.NumberFormat('fr-FR', {
							style: 'currency',
							currency: 'EUR',
						}).format(invoice.amount)}
					</p>
				</div>
			</div>
			{/* ... items ... */}
			<div className="mt-8 flex justify-end space-x-3">
				<button
					type="button"
					className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
				>
					Imprimer
				</button>
				<Link
					href={`/dashboard/invoices/${invoice.id}/edit`}
					className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
				>
					Modifier
				</Link>
			</div>
		</div>
	);
}
