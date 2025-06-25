// src/components/dashboard/LatestInvoices.tsx
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { FormattedInvoice } from '@/lib/data'; // Utiliser le type existant
// Importer les helpers de formatage depuis InvoicesTable ou un fichier utils
const formatCurrency = (amount: number) =>
	new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
		amount,
	);
const statusToFrench = (
	status: FormattedInvoice['status'],
): 'En attente' | 'Payée' | 'En retard' => {
	switch (status) {
		case 'pending':
			return 'En attente';
		case 'paid':
			return 'Payée';
		case 'overdue':
			return 'En retard';
		default:
			return 'Payée';
	}
};
const getStatusClass = (status: FormattedInvoice['status']) => {
	switch (status) {
		case 'paid':
			return 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
		case 'pending':
			return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100';
		case 'overdue':
			return 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100';
		default:
			return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100';
	}
};

export default function LatestInvoices({
	latestInvoices,
}: {
	latestInvoices: FormattedInvoice[];
}) {
	if (!latestInvoices || latestInvoices.length === 0) {
		return (
			<p className="mt-4 text-center text-slate-500 dark:text-slate-400">
				Aucune facture récente à afficher.
			</p>
		);
	}
	return (
		<div className="flex w-full flex-col">
			<h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
				Dernières Factures
			</h2>
			<div className="flex-grow rounded-xl bg-white dark:bg-slate-800 p-4 shadow-lg">
				<div className="divide-y divide-slate-200 dark:divide-slate-700">
					{latestInvoices.map((invoice, i) => {
						return (
							<Link
								key={invoice.id}
								href={`/dashboard/invoices/${invoice.id}`}
								className={`flex flex-row items-center justify-between py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
									i !== 0
										? 'border-t border-slate-200 dark:border-slate-700'
										: ''
								}`}
							>
								<div className="flex items-center">
									<Image
										src={
											invoice.customer_image_url || '/placeholder-avatar.png'
										}
										alt={`Avatar de ${invoice.customer_name}`}
										width={32}
										height={32}
										className="mr-3 rounded-full object-cover"
									/>
									<div className="min-w-0">
										<p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
											{invoice.customer_name}
										</p>
										<p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
											{invoice.customer_email}
										</p>
									</div>
								</div>
								<div className="flex flex-col items-end">
									<p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
										{formatCurrency(invoice.amount)}
									</p>
									<span
										className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
											invoice.status,
										)}`}
									>
										{statusToFrench(invoice.status)}
									</span>
								</div>
							</Link>
						);
					})}
				</div>
				<div className="flex items-center border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
					<ArrowPathIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
					<h3 className="ml-2 text-sm text-slate-500 dark:text-slate-400">
						Mis à jour il y a quelques instants
					</h3>
				</div>
			</div>
		</div>
	);
}
