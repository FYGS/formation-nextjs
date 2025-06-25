// src/components/dashboard/Skeletons.tsx

export function CardSkeleton() {
	return (
		<div className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-lg animate-pulse">
			<div className="flex items-center">
				<div className="h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full mr-3"></div>
				<div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
			</div>
			<div className="mt-3 h-8 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
		</div>
	);
}
export function CardsSkeleton() {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
		</div>
	);
}

export function LatestInvoicesSkeleton() {
	const SkeletonRow = () => (
		<div className="flex flex-row items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700 animate-pulse first:border-t-0">
			<div className="flex items-center">
				<div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full mr-3"></div>
				<div className="min-w-0 space-y-1">
					<div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
					<div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded hidden sm:block"></div>
				</div>
			</div>
			<div className="flex flex-col items-end space-y-1">
				<div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
				<div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
			</div>
		</div>
	);
	return (
		<div className="flex w-full flex-col">
			<div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
			<div className="flex-grow rounded-xl bg-white dark:bg-slate-800 p-4 shadow-lg">
				<SkeletonRow />
				<SkeletonRow />
				<SkeletonRow />
				<SkeletonRow />
				<SkeletonRow />
			</div>
		</div>
	);
}
// Vous pouvez ajouter RevenueChartSkeleton, etc.
