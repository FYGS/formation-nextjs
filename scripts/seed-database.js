// scripts/seed-database.js
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') }); // Charger .env.local

async function main() {
	console.log('Starting database seeding...');

	// Vérifier si les variables d'environnement nécessaires sont présentes
	if (!process.env.POSTGRES_URL) {
		console.error('ERROR: POSTGRES_URL environment variable is not set.');
		console.error(
			'Please ensure your .env.local file is correctly set up with Vercel Postgres credentials.',
		);
		process.exit(1); // Quitter avec un code d'erreur
	}

	const schemaPath = path.join(process.cwd(), 'scripts', 'schema.sql');
	const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

	// Diviser le script SQL en instructions individuelles
	// Ceci est une approche simple ; pour des scripts complexes, un vrai parseur SQL serait mieux.
	// Cette approche suppose que les instructions sont séparées par ';' et une nouvelle ligne.
	// Elle ne gère pas les ';' à l'intérieur des chaînes de caractères ou des commentaires multilignes.
	const statements = schemaSql
		.split(/;\s*$/m) // Sépare par ';' à la fin d'une ligne (multiligne)
		.map(statement => statement.trim())
		.filter(statement => statement.length > 0);

	if (statements.length === 0) {
		console.log('No SQL statements found in schema.sql.');
		return;
	}

	console.log(`Found ${statements.length} SQL statements to execute.`);

	try {
		// Exécuter chaque instruction
		// Note: @vercel/postgres ne supporte pas nativement l'exécution de multiples instructions séparées par ';' en une seule requête sql``.
		// Il faut donc les exécuter une par une.
		for (const statement of statements) {
			console.log(
				`\nExecuting: \n${statement.substring(0, 100)}${
					statement.length > 100 ? '...' : ''
				}`,
			); // Affiche le début de la requête
			await sql.query(statement); // Utiliser sql.query() pour exécuter des chaînes SQL brutes
			console.log('✅ Statement executed successfully.');
		}

		console.log('\nDatabase seeded successfully! 🎉');
	} catch (error) {
		console.error('\n❌ Error seeding database:', error);
		// Si une instruction échoue, les précédentes ont pu réussir.
		// Vous pourriez vouloir implémenter une logique de transaction ici pour des opérations critiques.
		// Cependant, pour un script de seed simple, c'est souvent acceptable.
		process.exit(1);
	}
}

main().catch(err => {
	console.error(
		'An unexpected error occurred while attempting to seed the database:',
		err,
	);
	process.exit(1);
});
