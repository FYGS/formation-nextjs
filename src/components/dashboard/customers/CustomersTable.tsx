// src/components/dashboard/customers/CustomersTable.tsx
import Image from 'next/image';
import { Customer } from '@/lib/data'; // Utiliser le type Customer simple pour l'instant
// import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Pour futures actions

// Vous pourriez vouloir créer des boutons spécifiques pour les clients plus tard
// import { UpdateCustomerButton, DeleteCustomerButton } from './Buttons';

type CustomersTableProps = {
	customers: Customer[]; // Ou CustomerWithStats[] si vous implémentez les stats
};

export default function CustomersTable({ customers }: CustomersTableProps) {
	if (!customers || customers.length === 0) {
		return (
			<p className="text-center text-slate-500 dark:text-slate-400 py-8">
				Aucun client à afficher.
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
									className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-200 sm:pl-6"
								>
									Nom
								</th>
								<th
									scope="col"
									className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200"
								>
									Email
								</th>
								{/* Si vous ajoutez les stats de factures : */}
								{/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Factures Totales</th> */}
								{/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Montant En Attente</th> */}
								{/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">Montant Payé</th> */}
								<th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
							{customers.map(customer => (
								<tr
									key={customer.id}
									className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
								>
									<td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
										<div className="flex items-center">
											<div className="h-10 w-10 flex-shrink-0">
												<Image
													className="h-10 w-10 rounded-full object-cover"
													src={customer.image_url || '/placeholder-avatar.png'}
													alt={`Avatar de ${customer.name}`}
													width={40}
													height={40}
												/>
											</div>
											<div className="ml-4">
												<div className="font-medium text-slate-900 dark:text-white">
													{customer.name}
												</div>
											</div>
										</div>
									</td>
									<td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">
										{customer.email}
									</td>
									{/* Si vous ajoutez les stats */}
									{/* <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">{customer.total_invoices}</td> */}
									{/* <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">{formatCurrency(customer.total_pending_in_cents / 100)}</td> */}
									{/* <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-300">{formatCurrency(customer.total_paid_in_cents / 100)}</td> */}
									<td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
										<div className="flex items-center justify-end gap-2">
											{/* Boutons d'action pour les clients (Modifier, Supprimer) à créer si besoin */}
											{/* <Link href={`/dashboard/customers/${customer.id}/edit`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        <PencilIcon className="w-5" />
                      </Link> */}
											{/* <form action={deleteCustomerWithId}> <button> <TrashIcon className="w-5 text-red-500" /> </button> </form> */}
											<span className="text-slate-400 dark:text-slate-500 text-xs italic">
												Actions à venir
											</span>
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
// N'oubliez pas d'importer formatCurrency si vous ajoutez les montants
// const formatCurrency = (amount: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
