# User Service Production Ready

Сервис пользователей без NestJS: Express.js, чистый JavaScript, SQLite, SQL, JWT, bcrypt, HTML/CSS.

## Возможности

- Регистрация пользователя
- Авторизация через JWT
- Получение пользователя по ID
- Получение списка пользователей только для admin
- Блокировка пользователя
- Роли `admin` и `user`
- Уникальный email
- Хеширование паролей через bcrypt
- Валидация входных данных
- Централизованная обработка ошибок
- Request ID для трассировки
- Логирование через Pino + pino-http
- Helmet, CORS, compression, rate limit
- Автоматические тесты Jest + Supertest
- Красивый frontend на HTML/CSS/JS

## Почему SQLite

SQLite выбран для простого локального запуска без установки отдельного сервера БД. Данные хранятся в файле `database.sqlite`. Для production с высокой нагрузкой можно заменить слой `src/config/db.js` и SQL-запросы на PostgreSQL/MySQL.

## Структура

```txt
user-service-production-ready/
├── database/schema.sql
├── public/index.html
├── public/styles.css
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   ├── env.js
│   │   └── logger.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── request-id.middleware.js
│   ├── modules/
│   │   ├── auth/
│   │   └── users/
│   └── utils/
├── tests/auth-users.test.js
├── .env.example
└── package.json
```

## Запуск

```bash
npm install
cp .env.example .env
npm run init-db
npm run dev
```

Открыть frontend:

```txt
http://localhost:3000
```

## Production запуск

В `.env` обязательно задай длинный секрет:

```env
NODE_ENV=production
JWT_SECRET=long_random_secret_value
PORT=3000
DB_PATH=database.sqlite
CORS_ORIGIN=https://your-domain.com
```

Запуск:

```bash
npm start
```

## Тесты

```bash
npm test
```

## API

### Регистрация

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "birthDate": "1990-01-01",
    "email": "admin@test.com",
    "password": "123456",
    "role": "admin"
  }'
```

### Авторизация

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "123456"
  }'
```

### Получить пользователя по ID

```bash
curl http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer TOKEN"
```

### Получить список пользователей

Только admin:

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer TOKEN"
```

### Заблокировать пользователя

```bash
curl -X PATCH http://localhost:3000/api/users/1/block \
  -H "Authorization: Bearer TOKEN"
```
