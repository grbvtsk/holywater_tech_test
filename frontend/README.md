# DevLog Frontend

Next.js 15 (App Router) + **Tailwind CSS v4** client for the DevLog API. UI is English-only.

## Features

- Task CRUD (modal forms)
- Filter by status, sort by priority or date
- AI decomposition with optional subtask creation
- Slack-style status update generator for the selected task

## Run

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

UI: http://localhost:3000

`NEXT_PUBLIC_API_URL` must point to the backend (default `http://localhost:4000`).
