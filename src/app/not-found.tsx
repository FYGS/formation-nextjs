// src/app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-12 bg-slate-50 dark:bg-slate-900">
			<Image
				src="/acorn-logo.svg"
				alt="Acorn Finance"
				width={64}
				height={64}
				className="mb-8"
			/>
			<h1 className="text-5xl sm:text-6xl font-bold font-heading text-green-500 dark:text-green-400 mb-4">
				404
			</h1>
			<h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white mb-6">
				Page Introuvable
			</h2>
			<p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
				Oups ! Il semble que la page que vous cherchez ait pris des vacances ou
				n&apos;existe plus.
			</p>
			<div className="flex space-x-4">
				<Link
					href="/"
					className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors"
				>
					Retour à l&apos;Accueil
				</Link>
				<Link
					href="/dashboard"
					className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
				>
					Aller au Tableau de Bord
				</Link>
			</div>
		</div>
	);
}
