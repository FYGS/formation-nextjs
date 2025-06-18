type InvoiceDetailPageProps = {
  params: Promise<{
    id: string; // L'ID de la facture proviendra de l'URL
  }>;
  // searchParams?: { [key: string]: string | string[] | undefined }; // Si vous aviez besoin des query params
};

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-800 dark:text-white mb-6">
        Détail de la Facture N° <span className="text-green-500">{id}</span>
      </h1>
      <p className="text-slate-600 dark:text-slate-300">
        Les informations complètes de la facture avec l&apos;ID &quot;
        {id}&quot; seront affichées ici.
      </p>
      {/* Plus tard: détails de la facture, actions (modifier, supprimer) */}
    </div>
  );
}
