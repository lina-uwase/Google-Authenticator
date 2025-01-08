# Google-Authenticator# Google Authenticator 2FA Node.js Backend

This project implements a backend for enabling Google Authenticator-based Two-Factor Authentication (2FA) using Node.js, Express, and Prisma.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

---

## Features

- User signup and login with password validation.
- Enable Two-Factor Authentication using Google Authenticator.
- Generate QR codes for 2FA setup.
- Verify TOTP codes.
- Swagger API documentation for seamless testing and integration.

---

## Prerequisites

1. **Node.js** (>= 14.x): Download and install from [Node.js official site](https://nodejs.org/).
2. **Prisma** CLI: Install globally using:
   ```bash
   npm install -g prisma
   ```
3. **PostgreSQL/MySQL/SQLite**: Choose a database supported by Prisma.

---

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Prisma

1. Initialize Prisma:
   ```bash
   npx prisma init
   ```
2. Update `prisma/schema.prisma` with your database configuration.
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### 4. Set Up Environment Variables

Create a `.env` file in the root directory with the following:

```env
DATABASE_URL="<your-database-url>"
PORT=3001
```

Replace `<your-database-url>` with your database connection string.

---

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will run at `http://localhost:3001`.



