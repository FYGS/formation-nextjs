// src/app/dashboard/page.tsx
import StatCards from '@/components/dashboard/StatCards';
import LatestInvoices from '@/components/dashboard/LatestInvoices';
// Optionnel: un composant pour les derniers clients ou graphiques
// import LatestCustomers from '@/components/dashboard/LatestCustomers';
// import RevenueChart from '@/components/dashboard/RevenueChart';
import {
	fetchCardData,
	fetchLatestInvoices /*, fetchRevenueData, fetchLatestCustomers */,
} from '@/lib/data';
import type { Metadata } from 'next';
import { Suspense } from 'react'; // Pour le streaming de sections individuelles
import {
	CardsSkeleton,
	LatestInvoicesSkeleton,
} from '@/components/dashboard/Skeletons'; // Skeletons à créer

export const metadata: Metadata = {
	title: 'Tableau de Bord',
	description: 'Aperçu de vos finances sur Acorn Finance.',
};

export const dynamic = 'force-dynamic'; // S'assurer que les données du dashboard sont toujours fraîches

export default async function DashboardPage() {
	// Récupérer les données en parallèle si elles sont indépendantes
	// Note: Pour la démo, je vais les appeler séquentiellement pour simplifier,
	// mais Promise.all est mieux pour les appels indépendants.
	// const cardData = await fetchCardData();
	// const latestInvoices = await fetchLatestInvoices();
	// const revenue = await fetchRevenueData(); // Si vous implémentez un graphique de revenus

	return (
		<main>
			<h1 className="mb-8 text-3xl md:text-4xl font-heading font-bold text-slate-800 dark:text-white">
				Tableau de Bord
			</h1>

			<div className="mb-8">
				<Suspense fallback={<CardsSkeleton />}>
					<CardDataWrapper />
				</Suspense>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
				<div className="xl:col-span-2">
					<Suspense fallback={<LatestInvoicesSkeleton />}>
						<LatestInvoicesWrapper />
					</Suspense>
				</div>
				<div className="lg:col-span-1 xl:col-span-1">
					{/* Placeholder pour un autre composant, ex: Graphe de revenus ou derniers clients */}
					{/* <Suspense fallback={<RevenueChartSkeleton />}>
            <RevenueChart />
          </Suspense> */}
					<div className="h-full rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg">
						<h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
							Activité Récente
						</h2>
						<p className="text-slate-600 dark:text-slate-300">
							D&apos;autres informations ou graphiques pourraient apparaître
							ici.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

// Composants Wrapper pour permettre le data fetching à l'intérieur de Suspense
async function CardDataWrapper() {
	const cardData = await fetchCardData();
	return <StatCards cardsData={cardData} />;
}

async function LatestInvoicesWrapper() {
	const latestInvoices = await fetchLatestInvoices();
	return <LatestInvoices latestInvoices={latestInvoices} />;
}
