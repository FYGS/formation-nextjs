// src/components/dashboard/invoices/CreateForm.tsx
// Pour l'instant, pas besoin de 'use client' si on n'utilise pas useFormState
// Mais il le deviendra à l'étape de validation avancée.
// Pour être prêt, on peut déjà le marquer 'use client'.
'use client';

import { Customer } from '@/lib/data'; // Type pour les clients
import { createInvoice } from '@/lib/actions'; // Notre Server Action
import Link from 'next/link';
import {
	CurrencyEuroIcon,
	UserCircleIcon,
	CheckIcon,
	ClockIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/Button'; // Un composant bouton générique

export default function CreateForm({ customers }: { customers: Customer[] }) {
	// Si nous n'utilisons pas useFormState pour l'instant, l'action peut être passée directement.
	// const [state, dispatch] = useFormState(createInvoice, initialState); // Pour l'étape suivante

	return (
		// L'attribut `action` du formulaire pointe vers notre Server Action
		// Quand le formulaire est soumis, Next.js appelle `createInvoice` avec les données du formulaire.
		<form action={createInvoice}>
			{' '}
			{/* Pour l'instant, prevState n'est pas géré ici */}
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
							name="customerId" // Important : le nom doit correspondre à ce que la Server Action attend
							className="peer block w-full cursor-pointer rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-50 focus:ring-1 focus:ring-green-500 focus:border-green-500"
							defaultValue=""
							aria-describedby="customer-error" // Pour les erreurs de validation futures
							required // Validation HTML basique
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
					{/* div pour afficher l'erreur customerId plus tard */}
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
								name="amount" // Correspond à la Server Action
								type="number"
								step="0.01" // Pour les centimes
								placeholder="Entrer le montant en EUR"
								className="peer block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 py-2 pl-10 text-sm outline-2 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-50 focus:ring-1 focus:ring-green-500 focus:border-green-500"
								required
							/>
							<CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 peer-focus:text-green-500" />
						</div>
					</div>
					{/* div pour afficher l'erreur amount plus tard */}
				</div>

				{/* Invoice Status */}
				<fieldset className="mb-4">
					<legend className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
						Définir le statut de la facture
					</legend>
					<div className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-[14px] py-3">
						<div className="flex gap-4">
							<div className="flex items-center">
								<input
									id="pending"
									name="status" // Correspond à la Server Action
									type="radio"
									value="pending"
									className="h-4 w-4 cursor-pointer border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
									required
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
									required
								/>
								<label
									htmlFor="paid"
									className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-700 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-100"
								>
									Payée <CheckIcon className="h-4 w-4" />
								</label>
							</div>
							{/* Vous pouvez ajouter 'overdue' ici si c'est un statut initial possible */}
						</div>
					</div>
					{/* div pour afficher l'erreur status plus tard */}
				</fieldset>

				{/* div pour afficher un message d'erreur général plus tard */}
			</div>
			<div className="mt-6 flex justify-end gap-4">
				<Link
					href="/dashboard/invoices"
					className="flex h-10 items-center rounded-lg bg-slate-100 dark:bg-slate-700 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-600"
				>
					Annuler
				</Link>
				{/* Type submit pour que le formulaire appelle l'action */}
				<Button type="submit">Créer la Facture</Button>
			</div>
		</form>
	);
}
