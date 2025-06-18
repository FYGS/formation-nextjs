export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>© {currentYear} Acorn Finance. Tous droits réservés.</p>
        <p className="mt-1">
          Construit avec{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Next.js
          </a>{" "}
          et
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 dark:text-green-400 hover:underline ml-1"
          >
            Tailwind CSS
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
