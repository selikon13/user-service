# User Service

## Description
A production-ready user management service with authentication, role-based access control, and REST API.

Supports user registration, login, admin management, and user blocking.

## Features

1. User registration and authentication
2. Role-based access control (admin / user)
3. SQLite database
4. Request validation and error handling
5. Rate limiting and security
6. Simple frontend UI for testing

## Installation and configuration

### 1. Clone repository

```bash
git clone https://github.com/selikon13/user-service.git
cd user-service
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create `.env` file:

```env
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
DB_PATH=database.sqlite
```

---

### 4. Initialize database

```bash
npm run init-db
```

---

### 5. Run project

```bash
npm run dev
```

Then open:

http://localhost:3000

## Testing

```bash
npm test
```

## Technologies

- Backend: Node.js
- Database: SQLite
- Frontend: HTML + CSS