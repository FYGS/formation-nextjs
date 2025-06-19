import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos de Nous", // Le template de layout.tsx ajoutera "| Acorn Finance"
  description:
    "Découvrez la mission et la vision d'Acorn Finance, votre partenaire pour une gestion financière simplifiée.",
};

export default function AboutPage() {
  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-heading font-bold text-slate-800 dark:text-white mb-8 text-center">
        À Propos d&apos;Acorn Finance
      </h1>
      <div className="max-w-3xl mx-auto space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          Chez Acorn Finance, nous croyons que la gestion financière ne devrait
          pas être une corvée. Notre mission est de fournir aux PME, freelances
          et particuliers des outils simples, intuitifs et puissants pour suivre
          leurs factures, contrôler leurs dépenses et visualiser clairement leur
          santé financière.
        </p>
        <p>
          Née de la frustration face à des logiciels financiers complexes et
          coûteux, Acorn Finance a été conçue avec une approche centrée sur
          l&apos;utilisateur. Nous nous concentrons sur l&apos;essentiel, en
          éliminant le superflu pour vous offrir une expérience fluide et
          efficace.
        </p>
        <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white pt-4">
          Notre Vision
        </h2>
        <p>
          Nous aspirons à devenir la plateforme de référence pour une gestion
          financière sereine et éclairée, permettant à chacun de prendre des
          décisions financières avisées et de se concentrer sur ce qui compte
          vraiment : la croissance de son activité ou la réalisation de ses
          projets personnels.
        </p>
        <h2 className="text-2xl font-heading font-semibold text-slate-800 dark:text-white pt-4">
          L&apos;Équipe
        </h2>
        <p>
          Acorn Finance est développée par une équipe passionnée de développeurs
          et d&apos;experts financiers dédiés à la création de solutions
          innovantes. (Ce projet est un exemple de formation Next.js !)
        </p>
      </div>
    </div>
  );
}
