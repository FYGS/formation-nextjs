// src/app/dashboard/invoices/loading.tsx

// Fonction pour générer des lignes de skeleton
const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
    </td>
  </tr>
);

export default function InvoicesLoading() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
        {/* Skeleton pour le bouton "Ajouter" si vous en aviez un */}
      </div>
      <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                ID Facture
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                Client
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                Montant
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}
