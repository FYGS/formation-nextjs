export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-slate-800 dark:text-white">
          Acorn Finance
        </p>
      </div>

      <div className="relative flex place-items-center flex-col text-center">
        {/* Vous pouvez ajouter un logo ici avec next/image plus tard */}
        <h1 className="text-5xl font-bold mb-6">
          Gérez vos Finances avec{" "}
          <span className="text-green-400">Acorn Finance</span>
        </h1>
        <p className="text-xl mb-8 text-slate-300 max-w-2xl">
          La solution intuitive pour suivre vos factures, dépenses et revenus.
          Prenez le contrôle de votre avenir financier.
        </p>
        <div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Commencer Gratuitement
          </button>
          <button className="ml-4 border border-slate-300 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-lg transition duration-300 ease-in-out">
            En savoir plus
          </button>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        {/* ... Sections d'informations si besoin ... */}
      </div>
    </main>
  );
}
