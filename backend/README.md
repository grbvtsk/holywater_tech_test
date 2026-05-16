# DevLog Backend

Express.js (MVC) API з Prisma ORM та PostgreSQL. AI-функції через OpenAI API.

## Структура (MVC)

```
src/
  controllers/   # HTTP-шар
  services/      # бізнес-логіка + OpenAI
  routes/        # маршрути
  middleware/
  lib/prisma.js
prisma/schema.prisma
```

## API

### Tasks

| Method | Path | Опис |
|--------|------|------|
| GET | `/api/tasks` | Список (query: `status`, `sortBy`, `sortOrder`, `parentId`) |
| GET | `/api/tasks/:id` | Одна задача з підзадачами |
| POST | `/api/tasks` | Створити |
| POST | `/api/tasks/decomposed` | Створити parent + subtasks або лише subtasks (транзакція) |
| PATCH | `/api/tasks/:id` | Оновити |
| DELETE | `/api/tasks/:id` | Видалити (каскадно підзадачі) |

### AI

| Method | Path | Body |
|--------|------|------|
| POST | `/api/ai/decompose` | `{ title, description? }` |
| POST | `/api/ai/status-update` | `{ taskId, tone?: casual\|professional\|urgent }` |

## Запуск

```bash
# Потрібен запущений PostgreSQL (локально або хмара). Приклад DATABASE_URL у .env.example.

cd backend
cp .env.example .env
# Вкажіть OPENAI_API_KEY
npm install
npm run db:push
npm run dev
```

API: http://localhost:4000  
Health: http://localhost:4000/health
