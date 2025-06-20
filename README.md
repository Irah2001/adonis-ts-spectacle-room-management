# 🎭 Spectacle Room Management

Gestion de salles de spectacles réalisée avec [AdonisJS](https://adonisjs.com/) (TypeScript). Ce projet permet de gérer les spectacles, les salles, les artistes et les réservations.

## 🚀 Fonctionnalités principales

- Gestion des **salles** de spectacles (création, modification, suppression)
- Gestion des **spectacles** (programmation, affichage, mise à jour)
- Gestion des **artistes** liés à un spectacle
- Réservation de places pour un spectacle donné
- Interface API RESTful structurée
- Authentification avec JWT

## 🛠️ Technologies utilisées

- [AdonisJS v5](https://docs.adonisjs.com/)
- TypeScript
- PostgreSQL
- Lucid ORM
- JWT Auth
- Dotenv
- Prettier + ESLint
- Node v18

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Irah2001/adonis-ts-spectacle-room-management.git
cd adonis-ts-spectacle-room-management
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l’environnement

Copier .env.example en .env puis configurer les variables (notamment la base de données)

### 4. Créer la base de données

```bash
docker compose up -d
node ace migration:run
```

### 5. Lancer le serveur

En mode dev

```bash
npm run dev --watch
```