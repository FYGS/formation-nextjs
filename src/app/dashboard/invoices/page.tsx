import InvoicesTable from "@/components/dashboard/invoices/InvoicesTable"; // Vérifiez le chemin d'importation

export default function InvoicesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-slate-800 dark:text-white">
          Liste des Factures
        </h1>
        {/* Plus tard, un bouton pour ajouter une facture ici */}
        {/* <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
          Ajouter une Facture
        </button> */}
      </div>
      <InvoicesTable />
    </div>
  );
}
