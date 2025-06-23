// src/app/dashboard/invoices/[id]/edit/page.tsx
import Form from '@/components/dashboard/invoices/EditForm'; // Nouveau composant de formulaire
import Breadcrumbs from '@/components/dashboard/Breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const id = (await params).id;
	const invoice = await fetchInvoiceById(id); // Peut être null
	return {
		title: invoice
			? `Modifier Facture ${invoice.id.substring(0, 8)}...`
			: 'Facture non trouvée',
	};
}

export default async function EditInvoicePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const id = (await params).id;
	// Récupérer les données de la facture et des clients en parallèle
	const [invoice, customers] = await Promise.all([
		fetchInvoiceById(id),
		fetchCustomers(),
	]);

	// Si la facture n'est pas trouvée, afficher une 404
	if (!invoice) {
		notFound();
	}

	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Factures', href: '/dashboard/invoices' },
					{
						label: 'Modifier la Facture',
						href: `/dashboard/invoices/${id}/edit`,
						active: true,
					},
				]}
			/>
			<Form invoice={invoice} customers={customers} />
		</main>
	);
}
