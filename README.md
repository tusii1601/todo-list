# Firebase Todo App

A React + Firebase todo app with authentication, protected routes, and per-user Firestore authorization.

## Features

- Email/password login and signup
- Protected dashboard route
- Realtime todo CRUD with user scoping (`userId`)
- Dark/light theme toggle
- Toast notifications and delete confirmation modal
- Firestore security rules included in `firestore.rules`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template and update keys:
   ```bash
   cp .env.example .env
   ```
3. Run app:
   ```bash
   npm run dev
   ```

## Firebase Rules

Deploy `firestore.rules` with Firebase CLI:

```bash
firebase deploy --only firestore:rules
```
