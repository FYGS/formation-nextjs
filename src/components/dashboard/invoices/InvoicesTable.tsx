import Link from "next/link";
import { FormattedInvoice } from "@/lib/data";
import Image from "next/image";

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
const getStatusClass = (status: FormattedInvoice["status"]) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100";
    case "overdue":
      return "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100";
  }
};

// status to french
const statusToFrench = (status: FormattedInvoice["status"]): "En attente" | "Payée" | "En retard" => {
  switch (status) {
    case "pending":
      return "En attente";
    case "paid":
      return "Payée";
    case "overdue":
      return "En retard";
    default:
      return "En attente";
  }
};

type InvoicesTableProps = {
	invoices: FormattedInvoice[]; // Accepte les factures en props
};

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
	// Plus besoin de useState, useEffect, loading, error pour le fetch initial ici

	if (!invoices || invoices.length === 0) {
		return (
			<p className="text-center text-slate-500 dark:text-slate-400 py-8">
				Aucune facture à afficher.
			</p>
		);
	}

	return (
		<div className="mt-6 flow-root">
			<div className="inline-block min-w-full align-middle">
				<div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md sm:rounded-lg">
					<table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
						<thead className="bg-slate-50 dark:bg-slate-700">
							<tr>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Client
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Email
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Montant
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Date
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Statut
								</th>
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
							{invoices.map(invoice => (
								<tr
									key={invoice.id}
									className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
								>
									<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div className="flex items-center">
											<div className="h-10 w-10 flex-shrink-0">
												<Image
													className="h-10 w-10 rounded-full object-cover"
													src={
														invoice.customer_image_url ||
														'/placeholder-avatar.png'
													} // Prévoir un placeholder
													alt={`Avatar de ${invoice.customer_name}`}
													width={40} // Pour <Image>, si utilisé
													height={40} // Pour <Image>, si utilisé
												/>
											</div>
											<div className="ml-4">
												<div className="font-medium text-slate-900 dark:text-white">
													{invoice.customer_name}
												</div>
											</div>
										</div>
									</td>
									<td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
										{invoice.customer_email}
									</td>
									<td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
										{formatCurrency(invoice.amount)}
									</td>
									<td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
										{formatDate(invoice.date)}
									</td>
									<td className="px-3 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
												invoice.status,
											)}`}
										>
											{statusToFrench(invoice.status)}
										</span>
									</td>
									<td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
										<div className="flex justify-end gap-3">
											<Link
												href={`/dashboard/invoices/${invoice.id}`}
												className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
											>
												Voir
											</Link>
											<Link
												href={`/dashboard/invoices/${invoice.id}/edit`}
												className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
											>
												Modifier {/* Sera implémenté au Module 9 */}
											</Link>
											{/* Bouton Supprimer (sera implémenté au Module 9) */}
											{/* <DeleteInvoice id={invoice.id} /> */}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
