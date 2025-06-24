// src/components/dashboard/invoices/CreateForm.tsx
'use client'; // Nécessaire pour useFormState et la gestion d'état du formulaire

import { Customer } from '@/lib/data';
import { createInvoice, State } from '@/lib/actions'; // Importer State également
import Link from 'next/link';
import {
	CurrencyEuroIcon,
	UserCircleIcon,
	CheckIcon,
	ClockIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/Button';
import { useFormState, useFormStatus } from 'react-dom'; // Importer les hooks nécessaires

// Composant pour le bouton de soumission qui affiche l'état pending
function SubmitButton() {
	const { pending } = useFormStatus(); // Hook pour connaître l'état de soumission du formulaire parent

	return (
		<Button type="submit" pending={pending}>
			Créer la Facture
		</Button>
	);
}

export default function CreateForm({ customers }: { customers: Customer[] }) {
	const initialState: State = { message: null, errors: {} };
	// Utiliser useFormState pour lier l'action et gérer l'état
	const [state, dispatch] = useFormState(createInvoice, initialState);

	return (
		// L'attribut `action` du formulaire est maintenant `dispatch` fourni par useFormState
		<form action={dispatch}>
			<div className="rounded-md bg-white dark:bg-slate-800 p-4 md:p-6 shadow">
				{/* Customer Name */}
				<div className="mb-4">
					<label
						htmlFor="customer"
						className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
					>
						Choisir un client
					</label>
					<div className="relative">
						<select
							id="customer"
							name="customerId"
							className="peer block w-full cursor-pointer rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-50 focus:ring-1 focus:ring-green-500 focus:border-green-500"
							defaultValue=""
							aria-describedby="customer-error" // Lié à l'affichage d'erreur
							required
						>
							<option value="" disabled>
								Sélectionner un client
							</option>
							{customers.map(customer => (
								<option key={customer.id} value={customer.id}>
									{customer.name}
								</option>
							))}
						</select>
						<UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
					</div>
					{/* Affichage des erreurs pour customerId */}
					<div id="customer-error" aria-live="polite" aria-atomic="true">
						{state.errors?.customerId &&
							state.errors.customerId.map((error: string) => (
								<p
									className="mt-2 text-sm text-red-500 dark:text-red-400"
									key={error}
								>
									{error}
								</p>
							))}
					</div>
				</div>

				{/* Invoice Amount */}
				<div className="mb-4">
					<label
						htmlFor="amount"
						className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
					>
						Choisir un montant
					</label>
					<div className="relative mt-2 rounded-md">
						<div className="relative">
							<input
								id="amount"
								name="amount"
								type="number"
								step="0.01"
								placeholder="Entrer le montant en EUR"
								className="peer block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-50 focus:ring-1 focus:ring-green-500 focus:border-green-500"
								aria-describedby="amount-error"
								required
							/>
							<CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 peer-focus:text-green-500" />
						</div>
					</div>
					{/* Affichage des erreurs pour amount */}
					<div id="amount-error" aria-live="polite" aria-atomic="true">
						{state.errors?.amount &&
							state.errors.amount.map((error: string) => (
								<p
									className="mt-2 text-sm text-red-500 dark:text-red-400"
									key={error}
								>
									{error}
								</p>
							))}
					</div>
				</div>

				{/* Invoice Status */}
				<fieldset className="mb-4">
					<legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
						Définir le statut de la facture
					</legend>
					<div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-[14px] py-3">
						<div className="flex flex-wrap gap-4">
							{' '}
							{/* flex-wrap pour un meilleur responsive */}
							<div className="flex items-center">
								<input
									id="pending"
									name="status"
									type="radio"
									value="pending"
									className="h-4 w-4 cursor-pointer border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
									aria-describedby="status-error"
								/>
								<label
									htmlFor="pending"
									className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-100 dark:bg-yellow-700 px-3 py-1.5 text-xs font-medium text-yellow-700 dark:text-yellow-100"
								>
									En attente <ClockIcon className="h-4 w-4" />
								</label>
							</div>
							<div className="flex items-center">
								<input
									id="paid"
									name="status"
									type="radio"
									value="paid"
									className="h-4 w-4 cursor-pointer border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
									aria-describedby="status-error"
								/>
								<label
									htmlFor="paid"
									className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-700 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-100"
								>
									Payée <CheckIcon className="h-4 w-4" />
								</label>
							</div>
						</div>
					</div>
					{/* Affichage des erreurs pour status */}
					<div id="status-error" aria-live="polite" aria-atomic="true">
						{state.errors?.status &&
							state.errors.status.map((error: string) => (
								<p
									className="mt-2 text-sm text-red-500 dark:text-red-400"
									key={error}
								>
									{error}
								</p>
							))}
					</div>
				</fieldset>

				{/* Message d'erreur général (s'il y en a) */}
				{state.message &&
					!state.errors?.customerId &&
					!state.errors?.amount &&
					!state.errors?.status && (
						<div
							aria-live="assertive"
							className="my-2 text-sm text-red-600 dark:text-red-400"
						>
							<p>{state.message}</p>
						</div>
					)}
			</div>

			<div className="mt-6 flex justify-end gap-4">
				<Link
					href="/dashboard/invoices"
					className="flex h-10 items-center rounded-lg bg-slate-100 dark:bg-slate-700 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
				>
					Annuler
				</Link>
				<SubmitButton /> {/* Utiliser le composant SubmitButton */}
			</div>
		</form>
	);
}
