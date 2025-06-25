// src/app/dashboard/invoices/page.tsx
import InvoicesTable from '@/components/dashboard/invoices/InvoicesTable';
import { fetchFilteredInvoices } from '@/lib/data'; // Importer notre fonction
import Search from '@/components/dashboard/Search';
import Pagination from '@/components/dashboard/Pagination';
import { CreateInvoice } from '@/components/dashboard/invoices/Buttons';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Liste des Factures', // Sera "Liste des Factures | Acorn Finance"
	description:
		'Consultez, recherchez et gérez toutes vos factures sur Acorn Finance.',
	openGraph: {
		// title: "Acorn Finance : Simplifiez Votre Gestion Financière", // Héritera du title global ou du title.default
		// description: "Découvrez comment Acorn Finance peut transformer la gestion de vos finances.", // Héritera de la description ci-dessus
		images: [
			{
				url: '/og-invoices.png', // Assurez-vous que cette image existe dans public/
				width: 1200,
				height: 630,
				alt: "Page des Factures Acorn Finance",
			},
		],
		url: 'https://acorn-finance-nine.vercel.app', // Héritera de RootLayout si non spécifié
	},
	// Les pages du dashboard sont généralement derrière une authentification,
	// donc le SEO est moins critique, mais de bonnes métadonnées peuvent aider à la navigation
	// ou si certaines parties du dashboard devenaient publiques.
	// Par défaut, on peut laisser les robots hériter du RootLayout ou les bloquer spécifiquement.
};

export const dynamic = 'force-dynamic'; // Force le rendu dynamique pour cette route

// Cette page est maintenant un Server Component
export default async function InvoicesPage({
	searchParams,
}: {
	searchParams?: Promise<{
		query?: string;
		page?: string;
	}>;
}) {
	const query = (await searchParams)?.query || '';
	const currentPage = Number((await searchParams)?.page) || 1;

	// Récupérer les données directement sur le serveur
	const { invoices, totalPages } = await fetchFilteredInvoices(
		query,
		currentPage,
	);

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-800 dark:text-white">
					Factures
				</h1>
				{/* Bouton Créer une facture */}
				<CreateInvoice />
			</div>
			<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Barre de recherche */}
				<Search placeholder="Rechercher des factures..." />
			</div>

			{/* La table reçoit maintenant les factures en props */}
			<InvoicesTable invoices={invoices} />

			<div className="mt-5 flex w-full justify-center">
				{/* Pagination */}
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	);
}
