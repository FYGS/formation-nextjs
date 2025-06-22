// src/components/dashboard/invoices/Buttons.tsx
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

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

// ... (Plus tard, UpdateInvoice et DeleteInvoice pourraient aller ici)
