# DevLog

Трекер задач для інженерних команд з AI-шаром: декомпозиція задач і генерація статус-апдейтів.

## Структура проєкту

```
backend/    Express.js (MVC) + Prisma + PostgreSQL + OpenAI
frontend/   Next.js 15 + Tailwind CSS
```

## Швидкий старт

### 1. Backend

```bash
cd backend
cp .env.example .env
# DATABASE_URL та OPENAI_API_KEY
npm install
npm run db:push
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

- Frontend: http://localhost:3000  
- API: http://localhost:4000  

## Зберігання даних

Задачі зберігаються в **PostgreSQL** через Prisma. Детальне пояснення вибору та обмежень альтернатив — у [backend/README.md](./backend/README.md).

## AI-функції

1. **Декомпозиція** — за назвою/описом генерує підзадачі; при нечіткій задачі повертає питання для уточнення. Опція «одразу створити підзадачі» зберігає їх у БД.
2. **Статус-апдейт** — коротке повідомлення на основі задачі, підзадач і поля `notes` (тон: casual / professional / urgent).

Потрібен валідний `OPENAI_API_KEY` у `backend/.env`.

## Авторизація

Не реалізована (за вимогою ТЗ).
