// src/app/dashboard/invoices/not-found.tsx
import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function InvoiceNotFound() {
	return (
		<main className="flex h-full flex-col items-center justify-center gap-2 text-center py-10">
			<ExclamationTriangleIcon className="w-16 text-slate-500 dark:text-slate-400" />
			<h2 className="text-xl font-semibold text-slate-800 dark:text-white">
				404 - Facture Non Trouvée
			</h2>
			<p className="text-slate-600 dark:text-slate-300">
				Désolé, nous n&apos;avons pas pu trouver la facture que vous cherchez.
			</p>
			<Link
				href="/dashboard/invoices"
				className="mt-4 rounded-md bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-400"
			>
				Retour à la liste des factures
			</Link>
		</main>
	);
}
