// src/app/dashboard/customers/page.tsx
import CustomersTable from '@/components/dashboard/customers/CustomersTable';
import { fetchFilteredCustomers } from '@/lib/data';
import Search from '@/components/dashboard/Search'; // Réutiliser le composant Search
import Pagination from '@/components/dashboard/Pagination'; // Réutiliser le composant Pagination
// import { CreateCustomerButton } from '@/components/dashboard/customers/Buttons'; // À créer si besoin
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Clients',
	description: 'Gérez votre liste de clients sur Acorn Finance.',
};

export const dynamic = 'force-dynamic';

export default async function CustomersPage({
	searchParams,
}: {
	searchParams?: Promise<{
		query?: string;
		page?: string;
	}>;
}) {
	const resolvedSearchParams = searchParams ? await searchParams : {};
	const query = resolvedSearchParams.query || '';
	const currentPage = Number(resolvedSearchParams.page) || 1;

	const { customers, totalPages } = await fetchFilteredCustomers(
		query,
		currentPage,
	);

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-white">
					Clients
				</h1>
				<div>
					{/* <CreateCustomerButton /> Bouton à créer pour ajouter un client */}
					<span className="text-sm text-slate-500 dark:text-slate-400">
						(Fonctionnalité d&apos;ajout à venir)
					</span>
				</div>
			</div>
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8 mb-4">
				<Search placeholder="Rechercher des clients..." />
			</div>

			<CustomersTable customers={customers} />

			<div className="mt-8 flex w-full justify-center">
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
}
