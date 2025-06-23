// src/app/dashboard/invoices/create/page.tsx
import Form from '@/components/dashboard/invoices/CreateForm'; // Nous allons créer ce composant
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';
import { fetchCustomers } from '@/lib/data'; // Pour récupérer les clients
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Créer une Facture',
};

export default async function CreateInvoicePage() {
	const customers = await fetchCustomers(); // Récupérer les clients côté serveur

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Factures', href: '/dashboard/invoices' },
					{
						label: 'Créer une Facture',
						href: '/dashboard/invoices/create',
						active: true,
					},
				]}
			/>
			{/* Le formulaire recevra les clients pour le <select> */}
			<Form customers={customers} />
		</main>
	);
}
