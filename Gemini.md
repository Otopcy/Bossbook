# 🚀 BOSSBOOK — Documentation de Projet & Système de Design

Ce fichier sert de mémoire technique et esthétique pour le projet BOSSBOOK. Il doit être consulté par tout modèle IA intervenant sur le projet pour garantir la cohérence des développements.

## 📝 Présentation de l'Application
BOSSBOOK est un SaaS de facturation haut de gamme conçu spécifiquement pour les entrepreneurs africains et internationaux. L'application met l'accent sur une gestion rigoureuse des finances, une interface premium ("Liquid Glass") et une expérience utilisateur fluide sur tous les supports (Mobile First).

## ✨ Fonctionnalités Implémentées

### 1. Tableau de Bord (Dashboard)
- **Statistiques en Temps Réel** : Cartes dynamiques pour le total encaissé, les factures en attente, les retards et le nombre de clients.
- **Graphiques d'Évolution** : Visualisation de la trésorerie et de la dette via Recharts (Area, Bar, Circular).
- **Activité Récente** : Historique des transactions (factures, devis, récurrences) avec filtrage intelligent.
- **Top Clients** : Classement des clients par chiffre d'affaires avec barres de progression visuelles.

### 2. Gestion des Devises (Multi-Currency)
- **Système Global** : Gestion centralisée via `CurrencyContext`.
- **Conversion Automatique** : Support du **XAF**, **USD** et **EUR** avec taux de conversion dynamiques.
- **Propagation en Temps Réel** : Tout changement de devise dans les paramètres met à jour instantanément les montants sur toute l'application.

### 3. Abonnements (Subscriptions)
- **Plans Flexibles** : Gratuit, Pro, Entreprise.
- **Facturation** : Cycle mensuel et annuel (avec calcul d'économies automatique).
- **Réassurance** : Badges de confiance (Paiement sécurisé, Garantie, Résiliation facile).

### 4. Paramètres (Settings)
- **Profil Entreprise** : Gestion des informations légales, logo et contacts.
- **Personnalisation** : Thèmes (Clair/Sombre) et langues.
- **Sécurité** : Gestion du mot de passe et accès.

---

## 🏗️ Structure des Fichiers

```text
src/
├── app/                  # App Router Next.js
│   ├── (dashboard)/      # Routes protégées (Layout avec Sidebar/Topbar)
│   │   ├── dashboard/    # Page d'accueil statistique
│   │   ├── settings/     # Configuration globale
│   │   └── subscriptions/# Gestion des forfaits
│   └── layout.tsx        # Provider de thèmes et de devises
├── components/
│   ├── dashboard/        # Composants spécifiques au dashboard (Charts, Tables)
│   ├── layout/           # Sidebar, Topbar, Navigation
│   └── ui/               # Composants atomiques (Button, FormattedAmount, etc.)
├── context/
│   └── currency-context.tsx # Cœur de la gestion monétaire globale
├── lib/
│   ├── utils.ts          # Utilitaires de formatage (Currency, CN, Dates)
│   └── store.ts          # Mock store pour le prototypage
└── types/                # Définitions TypeScript
```

---

## 🛠️ Technologies Utilisées
- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Animations** : Tailwind Animate (`animate-in`)
- **Gestion d'État** : Context API (React) & `localStorage` pour la persistence.

---

## 🎨 Décisions de Design & Standards

### 1. Standard Financier Premium (CRITIQUE)
Toute valeur monétaire DOIT passer par le composant `<FormattedAmount />` ou l'utilitaire `formatCurrency` :
- **Séparateurs** : Points pour les milliers, millions et milliards (`1.000.000`).
- **Décimales** : Virgule pour les centimes (`1.000.000,00`).
- **Typographie** : Les centimes et la devise doivent avoir une taille réduite (`text-[0.6em]`).
- **Logique** : Masquer les centimes s'ils sont égaux à `00`.

### 2. Système "Liquid Glass"
- **Conteneurs** : Utiliser la classe `.glass-card` pour les cartes principales.
- **Bords** : `rounded-[32px]` pour les grandes sections, `rounded-2xl` pour les boutons et petits éléments.
- **Couleurs** : Fonds `bg-[#1c2537]` en mode sombre (jamais de noir pur).
- **Animations** : Entrée en cascade systématique (`staggered reveal`) pour chaque nouvelle vue.

### 3. Typographie des Libellés
- **Labels** : Toujours en `font-bold uppercase` avec un espacement `tracking-[0.15em]` pour un aspect professionnel et aéré.

---

## 🤖 Instructions pour les futurs modèles IA
1. **Cohérence Monétaire** : Ne JAMAIS hardcoder une devise. Utiliser `useCurrency` et `convert(amount)`.
2. **Mobile First** : Toujours tester le responsive. Les grilles doivent s'empiler sur mobile (`grid-cols-1`).
3. **Esthétique** : Si un nouveau composant est ajouté, il doit utiliser des gradients subtils, du flou de fond (`backdrop-blur`) et des micro-interactions au survol (`hover:scale-[1.02]`).
4. **Fidélité** : Toujours respecter le fichier `Gemini.md` comme source de vérité pour l'architecture et le design.
