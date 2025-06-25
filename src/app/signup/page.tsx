// src/app/signup/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react'; // Pour React.useActionState
import { useFormStatus } from 'react-dom';
import { signUpUser, SignupFormState } from '@/lib/actions';
import {
	UserPlusIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// export const metadata: Metadata = { // Metadata pour les Client Components est un peu délicat
//   title: "Créer un Compte",
//   description: "Rejoignez Acorn Finance et prenez le contrôle de vos finances.",
// };

function SignupButton() {
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
						className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /* ... spinner SVG ... */
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
					Création du compte...
				</>
			) : (
				<>
					Créer mon compte
					<UserPlusIcon className="ml-auto h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</>
			)}
		</button>
	);
}

export default function SignupPage() {
	const initialState: SignupFormState = { message: null, errors: {} };
	// L'action `signUpUser` attend (prevState | undefined, formData)
	// `React.useActionState` fournit cela correctement.
	const [state, dispatch] = React.useActionState<SignupFormState, FormData>(
		signUpUser,
		initialState, // L'état initial est passé ici
	);

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] sm:min-h-[calc(100vh-150px)] px-4 sm:px-6 lg:px-8 py-12">
			<div className="w-full max-w-md space-y-8">
				{/* ... (header de la page signup) ... */}
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
						Créez votre compte Acorn Finance
					</h2>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Déjà membre ?{' '}
						<Link
							href="/login"
							className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
						>
							Connectez-vous ici
						</Link>
					</p>
				</div>
				<div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-xl">
					<form className="space-y-6" action={dispatch}>
						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-slate-700 dark:text-slate-200"
							>
								Nom complet
							</label>
							<div className="mt-1">
								<input
									id="name"
									name="name"
									type="text"
									autoComplete="name"
									required
									className="block w-full rounded-md border px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm border-slate-300 dark:border-slate-600"
									placeholder="Votre nom complet"
									aria-describedby="name-error"
								/>
							</div>
							<div id="name-error" aria-live="polite" aria-atomic="true">
								{state?.errors?.name &&
									state.errors.name.map((error: string) => (
										<p
											className="mt-1 text-xs text-red-500 dark:text-red-400"
											key={error}
										>
											{error}
										</p>
									))}
							</div>
						</div>

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
									className="block w-full rounded-md border px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm border-slate-300 dark:border-slate-600"
									placeholder="vous@exemple.com"
									aria-describedby="email-error"
								/>
							</div>
							<div id="email-error" aria-live="polite" aria-atomic="true">
								{state?.errors?.email &&
									state.errors.email.map((error: string) => (
										<p
											className="mt-1 text-xs text-red-500 dark:text-red-400"
											key={error}
										>
											{error}
										</p>
									))}
							</div>
						</div>

						{/* Password */}
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-slate-700 dark:text-slate-200"
							>
								Mot de passe
							</label>
							<div className="mt-1">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="new-password"
									required
									className="block w-full rounded-md border px-3 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:z-10 focus:border-green-500 dark:focus:border-green-400 focus:outline-none focus:ring-green-500 sm:text-sm border-slate-300 dark:border-slate-600"
									placeholder="Au moins 6 caractères"
									aria-describedby="password-error"
								/>
							</div>
							<div id="password-error" aria-live="polite" aria-atomic="true">
								{state?.errors?.password &&
									state.errors.password.map((error: string) => (
										<p
											className="mt-1 text-xs text-red-500 dark:text-red-400"
											key={error}
										>
											{error}
										</p>
									))}
							</div>
						</div>

						{/* Erreurs générales du formulaire */}
						{state?.errors?.form && (
							<div
								className="flex items-center gap-x-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400"
								role="alert"
							>
								<ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" />
								<div>
									{state.errors.form.map((error: string) => (
										<p key={error}>{error}</p>
									))}
								</div>
							</div>
						)}
						{/* Message général (ex: erreur DB non spécifique à un champ, ou succès si pas de redirect) */}
						{state?.message &&
							!state.errors?.form &&
							!state.errors?.name &&
							!state.errors?.email &&
							!state.errors?.password && (
								<div
									className="flex items-center gap-x-2 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400"
									role="alert"
								>
									<ExclamationCircleIcon
										className="h-5 w-5"
										aria-hidden="true"
									/>
									<p>{state.message}</p>
								</div>
							)}
						<div>
							<SignupButton />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
