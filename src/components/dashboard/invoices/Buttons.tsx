// src/components/dashboard/invoices/Buttons.tsx
'use client'; // Ce composant deviendra client si on utilise un onClick pour confirmation
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteInvoice } from '@/lib/actions'; // Importer l'action
// import { useFormStatus } from 'react-dom'; // Si on voulait un état pending
export function CreateInvoice() {
	return (
		<Link
			href="/dashboard/invoices/create"
			className="flex h-10 items-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
		>
			<span className="hidden md:block">Créer une Facture</span>{' '}
			<PlusIcon className="h-5 md:ml-2" />
		</Link>
	);
}

export function UpdateInvoice({ id }: { id: string }) {
	return (
		<Link
			href={`/dashboard/invoices/${id}/edit`}
			className="rounded-md border p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
			title="Modifier la facture"
		>
			<PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />
		</Link>
	);
}

// Composant pour le bouton de suppression
export function DeleteInvoiceButton({ id }: { id: string }) {
	// Lier l'ID à l'action. La Server Action deleteInvoice recevra cet ID.
	const deleteInvoiceWithId = deleteInvoice.bind(null, id);

	// const { pending } = useFormStatus(); // Si on veut un état de soumission

	// Ajout d'une confirmation avant la suppression
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // Empêche la soumission par défaut
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
			// Si confirmé, appeler l'action liée
			// Pour un feedback plus riche (erreurs, succès), on pourrait utiliser useFormState ici aussi.
			// Pour l'instant, appel direct.
			try {
				const result = await deleteInvoiceWithId(); // Appel direct, pas de FormData ici
				if (result?.message?.includes('Erreur')) {
					alert(result.message); // Afficher l'erreur
				}
				// La revalidation se fait dans l'action, la page devrait se mettre à jour.
			} catch (e) {
				console.error('Erreur lors de la suppression de la facture:', e);
				// Afficher un message d'erreur générique
				alert('Une erreur est survenue lors de la suppression.');
			}
		}
	};

	return (
		// La Server Action peut être appelée directement par un formulaire
		// ou via un appel programmatique comme ci-dessous après confirmation.
		<form onSubmit={handleSubmit}>
			{/* On pourrait ajouter un input hidden avec l'id si on ne le liait pas,
          mais .bind est plus propre pour les actions simples. */}
			<button
				type="submit"
				className="rounded-md border p-2 hover:bg-red-100 dark:hover:bg-red-700/20"
				title="Supprimer la facture"
				// disabled={pending} // Si on utilise useFormStatus
				// aria-disabled={pending}
			>
				<span className="sr-only">Supprimer</span>
				<TrashIcon className="w-5 text-red-500 dark:text-red-400" />
			</button>
		</form>
	);
}
