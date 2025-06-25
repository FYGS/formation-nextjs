// src/components/Header.tsx
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { signOutUser } from '@/lib/actions';

// Composant pour le bouton de déconnexion
function SignOutButton() {
	return (
		<form action={signOutUser}>
			<button
				type="submit"
				className="text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
			>
				Se déconnecter
			</button>
		</form>
	);
}

export default async function Header() {
	const session = await auth();

	return (
		<header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
				<Link
					href="/"
					className="flex items-center text-2xl font-bold text-green-600 dark:text-green-400"
				>
					<Image
						src="/acorn-logo.svg"
						alt="Acorn Finance Logo"
						width={32}
						height={32}
						className="mr-2"
						priority
					/>
					Acorn Finance
				</Link>
				<div className="flex items-center space-x-2 sm:space-x-4">
					{' '}
					{/* Réduit space-x pour les petits écrans */}
					{/* Lien vers le tableau de bord toujours visible, le middleware gérera l'accès */}
					<Link
						href="/dashboard"
						className="text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
					>
						Tableau de bord
					</Link>
					{session?.user ? (
						<>
							<span className="text-sm text-slate-600 dark:text-slate-400 hidden md:block">
								{' '}
								{/* caché sur petits écrans */}
								{session.user.name || session.user.email}
							</span>
							<SignOutButton />
						</>
					) : (
						<Link
							href="/login"
							className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-colors"
						>
							Se connecter
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
