interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  pending?: boolean; // Pour l'état de soumission
}
export function Button({ children, className, pending, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`flex h-10 items-center rounded-lg bg-green-500 px-4 text-sm font-medium text-white transition-colors hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-300 disabled:cursor-not-allowed ${
        className || ''
      }`}
      disabled={pending} // Désactiver le bouton pendant la soumission
      aria-disabled={pending}
    >
      {pending ? 'Création...' : children}
    </button>
  );
}
