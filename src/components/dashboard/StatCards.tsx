// src/components/dashboard/StatCards.tsx
import { CardInfo } from '@/lib/data'; // Importer le type CardInfo (anciennement CardData)

// L'iconMap n'est plus nécessaire ici si l'icône est passée directement.
// const iconMap = {
//   paid: BanknotesIcon,
//   pending: ClockIcon,
//   invoices: InboxIcon,
//   customers: UserGroupIcon,
// };

export default function StatCards({ cardsData }: { cardsData: CardInfo[] }) {
	if (!cardsData || cardsData.length === 0) {
		return <p>Données des cartes non disponibles.</p>;
	}
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{/* Passer l'icône directement au composant Card */}
			{cardsData.map(card => (
				<Card
					key={card.label}
					title={card.label}
					value={card.value}
					IconComponent={card.icon} // Passer le composant icône
					type={card.type} // type peut toujours être utile pour des styles spécifiques si besoin
				/>
			))}
		</div>
	);
}

export function Card({
	title,
	value,
	IconComponent, // Accepter le composant icône en prop
	// type, // type peut être gardé pour des styles conditionnels spécifiques au type de carte
}: {
	title: string;
	value: string | number;
	IconComponent: React.ComponentType<{ className?: string }>; // Type pour le composant icône
	type: 'invoices' | 'customers' | 'paid' | 'pending';
}) {
	return (
		<div className="rounded-xl bg-white dark:bg-slate-800 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
			<div className="flex items-center">
				{IconComponent && (
					<IconComponent className="h-6 w-6 text-slate-500 dark:text-slate-400 mr-3" />
				)}{' '}
				{/* Rendre l'icône */}
				<h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
					{title}
				</h3>
			</div>
			<p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
				{value}
			</p>
			{/* Vous pourriez utiliser 'type' ici pour ajouter des couleurs de fond spécifiques ou des bordures
          par exemple :
          type === 'paid' ? 'border-green-500' : type === 'pending' ? 'border-yellow-500' : 'border-transparent'
      */}
		</div>
	);
}
