# 🎭 Spectacle Room Management

Gestion de salles de spectacles réalisée avec [AdonisJS](https://adonisjs.com/) (TypeScript). Ce projet permet de gérer les spectacles, les salles, les artistes et les réservations.

## 🚀 Fonctionnalités principales

- Gestion des **salles** de spectacles (création, modification, suppression)
- Gestion des **spectacles** (programmation, affichage, mise à jour)
- Gestion des **artistes** liés à un spectacle
- Réservation de places pour un spectacle donné
- Interface API RESTful structurée

## 🛠️ Technologies utilisées

- [AdonisJS](https://docs.adonisjs.com/)
- TypeScript
- PostgreSQL
- Lucid ORM
- Prettier + ESLint

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Irah2001/adonis-ts-spectacle-room-management.git
cd adonis-ts-spectacle-room-management
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configurer l’environnement

Copier .env.example en .env puis configurer les variables (notamment la base de données)

### 4. Créer la base de données

```bash
docker compose up -d
pnpm ace migration:run
pnpm ace db:seed
```

### 5. Lancer le serveur

En mode dev

```bash
pnpm dev
```
