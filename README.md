# NoteTabs

Application de prise de notes en ligne avec onglets, synchronisation Firebase et export PDF.

## Stack

- React 18 + Vite
- Firebase Auth (Google Sign-In)
- Firebase Firestore (stockage temps réel)
- react-markdown (rendu Markdown)
- CSS Modules

---

## 1. Créer le projet Firebase

1. Aller sur https://console.firebase.google.com
2. Nouveau projet → donner un nom (ex. notetabs)
3. Dans Authentication → Sign-in method → activer Google
4. Dans Firestore Database → Créer une base de données → mode production
5. Dans Règles Firestore, coller :

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/tabs/{tabId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

6. Dans Project settings → Your apps → ajouter une Web app
7. Copier le firebaseConfig fourni

---

## 2. Configurer l'app

Ouvrir src/firebase.js et remplacer les valeurs par celles de ta console Firebase.

---

## 3. Lancer en développement

npm install
npm run dev

---

## 4. Déployer sur Firebase Hosting

npm install -g firebase-tools
npm run build
firebase login
firebase init hosting
  → Public directory : dist
  → Single-page app : Yes
  → Overwrite index.html : No
firebase deploy

---

## Structure Firestore

users/{uid}/tabs/{timestamp}
  - title: string (max 50 caractères)
  - content: string
  - mode: 'text' | 'markdown'
  - createdAt: number

---

## Fonctionnalités

- Onglets multiples (id = timestamp de création)
- Titre éditable par onglet (max 50 caractères)
- Mode Texte ou Markdown par onglet
- Vue split éditeur / prévisualisation en Markdown
- Sauvegarde automatique (debounce 800ms)
- Synchronisation temps réel Firestore
- Export PDF via window.print()
- Authentification Google
- Notes privées par utilisateur
