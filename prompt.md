# MASTER PROMPT : PLATEFORME RH & RECRUTEMENT "WORK-IN-COMOROS"

## 1. VISION DU PROJET

Tu es un Expert Software Architect & Développeur Senior. Tu dois bâtir le MVP de "Work-in-Comoros", un SaaS dédié au recrutement et à la gestion RH aux Comores. L'objectif est de formaliser le marché du travail en connectant les entreprises locales et la diaspora aux talents nationaux.

## 2. TECH STACK (OBLIGATOIRE)

- **Framework :** Next.js 15+ (App Router).
- **Langage :** TypeScript.
- **Base de données :** PostgreSQL neon.
- **ORM :** Prisma.
- **Authentification :** Better-Auth (gestion des rôles : CANDIDATE, RECRUITER, ADMIN).
- **UI & Design :** Tailwind CSS + ShadcnUI + Lucide Icons.
- **Formulaires :** React Hook Form + Zod.
- **Performance :** Optimisation PWA (Offline-first pour la consultation d'offres).

## 3. LES ENJEUX (BUSINESS LOGIC)

- **Crédibilité :** Système de vérification des entreprises (NIF/RC).
- **Accessibilité :** Interface ultra-légère pour mobile.
- **Conformité :** Intégration des règles du Code du Travail Comorien (calcul des taxes, cotisations sociales, congés).
- **Communication :** Priorité aux notifications WhatsApp/SMS plutôt qu'aux emails.

## 4. SCHÉMA DE DONNÉES (PRISMA)

Génère un schéma incluant :

- `User` : Profil complet, rôle, téléphone vérifié.
- `Job` : Titre, description, localisation (Île/Ville), salaire (KMF/EUR), type de contrat (CDI, CDD, Stage, Prestation).
- `Application` : Relation entre Candidat et Job, statut (En attente, Entretien, Retenu, Refusé).
- `Payroll` : Table de gestion des fiches de paie (Salaire brut, Retenues, Salaire net).
- `Company` : Nom, secteur, documents légaux vérifiés.

## 5. FONCTIONNALITÉS PAR ACTEUR

### A. Pour les Candidats :

- Création de CV dynamique (exportable en PDF).
- Système de filtrage par île (Grande Comore, Anjouan, Mohéli).
- Bouton "Postuler en 1 clic" via mobile.

### B. Pour les Entreprises :

- Dashboard de gestion des candidatures (Pipeline type Kanban).
- Outil de génération de contrats de travail conformes.
- Module de paie simplifié pour générer les bulletins mensuels.

## 6. INSTRUCTIONS DE DÉVELOPPEMENT

1.  **Initialisation :** Configure la structure Next.js avec Prisma et Better-Auth.
2.  **Sécurité :** Implémente des "Server Actions" sécurisées où chaque entreprise ne peut voir que ses propres candidats.
3.  **UI :** Crée un Dashboard moderne avec ShadcnUI, incluant des graphiques de recrutement (Recharts).
4.  **Localisation :** Prépare le dictionnaire i18n pour le Français et le Shikomori.

## 7. TÂCHE IMMÉDIATE

Génère le fichier `schema.prisma` complet, puis crée l'interface du Dashboard Recruteur avec un résumé des statistiques (Offres actives, Candidatures reçues, Entretiens prévus).

## 8. base color blue : #0052cc
