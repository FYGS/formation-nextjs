// src/app/dashboard/invoices/page.tsx
import InvoicesTable from '@/components/dashboard/invoices/InvoicesTable';
import { fetchFilteredInvoices } from '@/lib/data'; // Importer notre fonction
import Search from '@/components/dashboard/Search';
// import Pagination from '@/components/dashboard/Pagination'; // Nous ajouterons ce composant plus tard
// import { CreateInvoice } from '@/components/dashboard/invoices/Buttons'; // Nous ajouterons ce composant plus tard

export const dynamic = 'force-dynamic'; // Force le rendu dynamique pour cette route

// Cette page est maintenant un Server Component
export default async function InvoicesPage({
	searchParams,
}: {
	searchParams?: {
		query?: string;
		page?: string;
	};
}) {
	const query = searchParams?.query || '';
	const currentPage = Number(searchParams?.page) || 1;

	// Récupérer les données directement sur le serveur
	const { invoices } = await fetchFilteredInvoices(
		query,
		currentPage,
	);

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-white">
					Factures
				</h1>
				{/* Bouton Créer une facture (sera ajouté au Module 9) */}
				{/* <CreateInvoice /> */}
			</div>
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
				{/* Barre de recherche (sera ajoutée au Module 9) */}
				<Search placeholder="Rechercher des factures..." />
			</div>

			{/* La table reçoit maintenant les factures en props */}
			<InvoicesTable invoices={invoices} />

			<div className="mt-5 flex w-full justify-center">
				{/* Pagination (sera ajoutée au Module 9) */}
				{/* <Pagination totalPages={totalPages} /> */}
			</div>
		</div>
	);
}
