// src/components/dashboard/Pagination.tsx
'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
	totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams);
		params.set('page', pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

	// Générer les numéros de page à afficher
	const generatePagination = (currentPage: number, totalPages: number) => {
		// Si moins de 7 pages, afficher tout
		if (totalPages <= 7) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// Si plus de 7 pages, calculer les points de suspension
		// Afficher les 3 premières, "...", les pages autour de la page actuelle, "...", les 3 dernières
		if (currentPage <= 3) {
			return [1, 2, 3, '...', totalPages - 1, totalPages];
		}

		if (currentPage >= totalPages - 2) {
			return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
		}

		// currentPage est quelque part au milieu
		return [
			1,
			'...',
			currentPage - 1,
			currentPage,
			currentPage + 1,
			'...',
			totalPages,
		];
	};

	const allPages = generatePagination(currentPage, totalPages);

	if (totalPages <= 1) {
		return null; // Ne pas afficher la pagination s'il n'y a qu'une page ou moins
	}

	return (
		<div className="inline-flex -space-x-px">
			<PaginationArrow
				direction="left"
				href={createPageURL(currentPage - 1)}
				isDisabled={currentPage <= 1}
			/>

			{allPages.map((page, index) => {
				let position: 'first' | 'last' | 'single' | 'middle' | undefined;

				if (index === 0) position = 'first';
				if (index === allPages.length - 1) position = 'last';
				if (allPages.length === 1) position = 'single';
				if (page === '...') position = 'middle';

				return (
					<PaginationNumber
						key={`${page}-${index}`} // Clé unique même pour "..."
						href={createPageURL(page)}
						page={page}
						position={position}
						isActive={currentPage === page}
					/>
				);
			})}

			<PaginationArrow
				direction="right"
				href={createPageURL(currentPage + 1)}
				isDisabled={currentPage >= totalPages}
			/>
		</div>
	);
}

function PaginationNumber({
	page,
	href,
	isActive,
	position,
}: {
	page: number | string;
	href: string;
	position?: 'first' | 'last' | 'middle' | 'single';
	isActive: boolean;
}) {
	const className = `flex h-10 w-10 items-center justify-center text-sm border dark:border-slate-700 ${
		position === 'first' || position === 'single' ? 'rounded-l-md' : ''
	} ${position === 'last' || position === 'single' ? 'rounded-r-md' : ''} ${
		isActive
			? 'z-10 bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600'
			: 'hover:bg-slate-100 dark:hover:bg-slate-700'
	} ${
		page === '...'
			? 'text-slate-500 dark:text-slate-400 pointer-events-none'
			: 'text-slate-700 dark:text-slate-200'
	}`;

	return page === '...' ? (
		<div className={className}>...</div>
	) : (
		<Link href={href} className={className}>
			{page}
		</Link>
	);
}

function PaginationArrow({
	href,
	direction,
	isDisabled,
}: {
	href: string;
	direction: 'left' | 'right';
	isDisabled?: boolean;
}) {
	const className = `flex h-10 w-10 items-center justify-center rounded-md border dark:border-slate-700 text-slate-700 dark:text-slate-200 ${
		isDisabled
			? 'pointer-events-none text-slate-300 dark:text-slate-600'
			: 'hover:bg-slate-100 dark:hover:bg-slate-700'
	} ${
		direction === 'left'
			? 'mr-2 md:mr-4 rounded-l-md'
			: 'ml-2 md:ml-4 rounded-r-md'
	}`; // Ajustement pour les arrondis

	const icon =
		direction === 'left' ? (
			<ArrowLeftIcon className="w-4" />
		) : (
			<ArrowRightIcon className="w-4" />
		);

	return isDisabled ? (
		<div className={className}>{icon}</div>
	) : (
		<Link className={className} href={href}>
			{icon}
		</Link>
	);
}
