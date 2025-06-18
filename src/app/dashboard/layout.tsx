import Sidebar from "@/components/dashboard/Sidebar"; // Assurez-vous que le chemin est correct

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      {" "}
      {/* h-screen pour que le layout prenne toute la hauteur de la vue */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {" "}
        {/* overflow-y-auto pour le scroll si le contenu dépasse */}
        {/* Ici, on pourrait ajouter un header spécifique au dashboard si besoin */}
        {children}
      </main>
    </div>
  );
}
