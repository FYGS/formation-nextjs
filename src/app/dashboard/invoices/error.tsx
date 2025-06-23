// src/app/dashboard/invoices/error.tsx
'use client'; // Les erreurs composants doivent être des composants clients

import { useEffect } from 'react';
import Link from 'next/link';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'; // Utiliser une icône plus forte pour une erreur

export default function InvoicesErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void; // Fonction pour tenter de re-rendre le segment
}) {
	useEffect(() => {
		// Log l'erreur à un service de reporting d'erreur (ex: Sentry)
		console.error('Erreur capturée dans la page des factures:', error);
	}, [error]);

	return (
		<main className="flex flex-col items-center justify-center gap-4 text-center py-10 px-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-700 m-4">
			<ExclamationCircleIcon className="w-16 text-red-500 dark:text-red-400" />
			<h2 className="text-xl font-semibold text-red-700 dark:text-red-300">
				Oups ! Une erreur est survenue.
			</h2>
			<p className="text-red-600 dark:text-red-400 max-w-md">
				Nous n&apos;avons pas pu charger les informations des factures. Veuillez
				réessayer.
				{/* En développement, vous pourriez vouloir afficher error.message, mais soyez prudent en production */}
				{process.env.NODE_ENV === 'development' && (
					<span className="block text-xs mt-2 text-red-500">
						Détail: {error.message}
					</span>
				)}
			</p>
			<div className="flex gap-4 mt-4">
				<button
					onClick={() => reset()}
					className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
				>
					Réessayer
				</button>
				<Link
					href="/dashboard"
					className="rounded-md border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
				>
					Retour au Dashboard
				</Link>
			</div>
		</main>
	);
}
