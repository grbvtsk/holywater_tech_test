# DevLog Backend

Express.js (MVC) API з Prisma ORM та PostgreSQL. AI-функції через OpenAI API.

## Зберігання даних: PostgreSQL

**Чому PostgreSQL, а не SQLite / JSON / in-memory:**

| Варіант | Плюси | Обмеження |
|---------|-------|-----------|
| **PostgreSQL** ✅ | Дані зберігаються між перезавантаженнями; підтримка звʼязків (підзадачі); масштабування; типізовані enum через Prisma | Потрібен окремий сервер БД (Docker або хостинг) |
| SQLite | Простий локальний файл, без окремого сервісу | Гірше для паралельних записів у команді; на serverless/hosting часто read-only FS |
| JSON-файл | Нульова інфраструктура | Немає транзакцій, race conditions, складні запити |
| In-memory | Швидко для демо | **Усі дані губляться** після рестарту процесу |

Для DevLog обрано **PostgreSQL**: задачі та підзадачі мають жити між сесіями, а ієрархія parent/subtask надійно моделюється через FK і cascade delete.

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
| PATCH | `/api/tasks/:id` | Оновити |
| DELETE | `/api/tasks/:id` | Видалити (каскадно підзадачі) |

### AI

| Method | Path | Body |
|--------|------|------|
| POST | `/api/ai/decompose` | `{ title, description?, createSubtasks?, parentTaskId? }` |
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
