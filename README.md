# Traveling Assistant

Vue 3 AI travel planning workspace for portfolio and interview demos. Users can create trips, add candidate places manually, run a mock AI planner, adjust itinerary timing, and invite collaborators.

## Features

- Vue 3 + Composition API
- Vite + TypeScript
- Pinia state management
- Vue Router route guards and lazy loaded pages
- Axios service layer for RESTful APIs
- Tailwind CSS Morandi-style responsive UI
- Manual candidate spot pool
- Mock AI itinerary planning with transportation notes
- Manual itinerary editing, deletion, and ordering
- Shared trip editing by collaborator email
- Vitest utility tests and Playwright E2E smoke test

## Setup

```bash
npm install
```

Create `.env` if needed:

```bash
JWT_SECRET=json-server-auth-123456
```

Start the backend:

```bash
npm run start
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:8080`.

Demo account:

- `user1@example.com`
- `123123123`

## Checks

```bash
npm run build
npm run test:unit
npm run test:e2e
```
