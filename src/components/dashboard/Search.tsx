// src/components/dashboard/Search.tsx
'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Assurez-vous d'avoir @heroicons/react
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	const handleSearch = useDebouncedCallback((term: string) => {
		console.log(`Searching... ${term}`);
		const params = new URLSearchParams(searchParams);
		params.set('page', '1'); // Réinitialiser à la page 1 lors d'une nouvelle recherche
		if (term) {
			params.set('query', term);
		} else {
			params.delete('query');
		}
		replace(`${pathname}?${params.toString()}`);
	}, 300); // Déclenche la recherche 300ms après la dernière frappe

	return (
		<div className="relative flex flex-1 flex-shrink-0">
			<label htmlFor="search" className="sr-only">
				Rechercher
			</label>
			<input
				id="search"
				className="peer block w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-[9px] pl-10 text-sm outline-2 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400"
				placeholder={placeholder}
				onChange={e => {
					handleSearch(e.target.value);
				}}
				defaultValue={searchParams.get('query')?.toString()} // Pour pré-remplir si query dans l'URL
			/>
			<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500 peer-focus:text-green-500 dark:peer-focus:text-green-400" />
		</div>
	);
}
