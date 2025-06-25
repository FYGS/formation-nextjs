// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { authenticate, LoginFormState } from '@/lib/actions';
import React from 'react'; // Importer React pour React.useActionState
import { useFormStatus } from 'react-dom'; // useFormStatus reste de react-dom
import {
	ArrowRightIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

function LoginButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 py-3 px-4 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-75 disabled:cursor-not-allowed"
			aria-disabled={pending}
			disabled={pending}
		>
			{pending ? (
				<>
					<svg
						className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Connexion...
				</>
			) : (
				<>
					Se connecter
					<ArrowRightIcon className="ml-auto h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</>
			)}
		</button>
	);
}

export default function LoginPage() {
	// L'état initial peut être un objet simple ou undefined si l'action le gère.
	// Pour React.useActionState, l'état initial est le deuxième argument.
	// L'action elle-même est le premier argument.
	const initialState: LoginFormState = { message: null, errors: {} };
	// Utiliser React.useActionState
	const [state, dispatch] = React.useActionState(authenticate, initialState);

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Link href="/" className="inline-block mb-6">
						<Image
							className="mx-auto h-16 w-auto"
							src="/acorn-logo.svg"
							alt="Acorn Finance"
							width={60}
							height={60}
						/>
					</Link>
					<h2 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white">
						Connectez-vous
					</h2>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Ou{' '}
						<Link
							href="/signup"
							className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
						>
							créez un nouveau compte
						</Link>
					</p>
				</div>

				<div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-xl">
					{/* Retirer method="POST" du formulaire */}
					<form className="space-y-6" action={dispatch}>
						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-slate-700 dark:text-slate-200"
							>
								Adresse e-mail
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="relative block w-full rounded-md border px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm border-slate-300 dark:border-slate-600"
									placeholder="vous@exemple.com"
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium text-slate-700 dark:text-slate-200"
								>
									Mot de passe
								</label>
								<div className="text-sm">
									<a
										href="#" // TODO: Implémenter la page de mot de passe oublié
										className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
									>
										Mot de passe oublié?
									</a>
								</div>
							</div>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full rounded-md border px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm border-slate-300 dark:border-slate-600"
									placeholder="Votre mot de passe"
								/>
							</div>
						</div>

						{/* Affichage des erreurs d'authentification */}
						{state?.errors?.credentials && (
							<div
								className="flex items-center gap-x-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400"
								role="alert"
							>
								<ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
								<div>
									{state.errors.credentials.map((error: string) => (
										<p key={error}>{error}</p>
									))}
								</div>
							</div>
						)}
						{state?.message && !state.errors?.credentials && (
							<div
								className={`flex items-center gap-x-2 rounded-md p-3 text-sm ${
									state.errors // Si state.errors existe et n'est pas vide (même si credentials est vide)
										? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
										: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' // Cas de succès (peu probable ici à cause du redirect)
								}`}
								role="alert"
							>
								{state.errors ? (
									<ExclamationCircleIcon
										className="h-5 w-5"
										aria-hidden="true"
									/>
								) : null}
								<p>{state.message}</p>
							</div>
						)}
						<div>
							<LoginButton />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
