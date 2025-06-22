// src/components/dashboard/Breadcrumbs.tsx
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid'; // ou 24/outline

type Breadcrumb = {
	label: string;
	href: string;
	active?: boolean;
};

export default function Breadcrumbs({
	breadcrumbs,
}: {
	breadcrumbs: Breadcrumb[];
}) {
	return (
		<nav className="flex mb-6" aria-label="Breadcrumb">
			<ol role="list" className="flex items-center space-x-2 sm:space-x-4">
				<li>
					<div>
						<Link
							href="/dashboard"
							className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
						>
							Dashboard
						</Link>
					</div>
				</li>
				{breadcrumbs.map((breadcrumb) => (
					<li key={breadcrumb.href}>
						<div className="flex items-center">
							<ChevronRightIcon
								className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500"
								aria-hidden="true"
							/>
							<Link
								href={breadcrumb.href}
								className={`ml-2 sm:ml-4 text-sm font-medium ${
									breadcrumb.active
										? 'text-green-600 dark:text-green-400 pointer-events-none'
										: 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
								}`}
								aria-current={breadcrumb.active ? 'page' : undefined}
							>
								{breadcrumb.label}
							</Link>
						</div>
					</li>
				))}
			</ol>
		</nav>
	);
}
