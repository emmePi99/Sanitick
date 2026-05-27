# Project Overview: Sanitick - Medical Booking System

This project, "Sanitick," is a standalone medical appointment booking system (CUP - Centro Unico di Prenotazione). It is developed using a **Full-Stack TypeScript** approach to ensure consistency and robustness.

The primary source of architectural and implementation details is the `piano_implementazione_cup.md` file, which contains a comprehensive 5-phase development roadmap.

## 🛠️ Tech Stack & Architecture

*   **Frontend:** Angular & TypeScript (Single Page Application)
*   **Backend:** NestJS, TypeORM, and Node.js
*   **Database:** PostgreSQL, containerized via Docker.
*   **Core Concepts:**
    *   **Standalone System:** Manages its own user, doctor, and availability records.
    *   **Role-Based Access Control (RBAC):** Implements a 4-level access model (Patient, Doctor, Admin, Superadmin).
    *   **Optimistic Locking:** Used to manage booking concurrency and prevent overbooking.

## 🚀 Building and Running

The project relies on Docker to run the necessary services, primarily the PostgreSQL database. The source code for the frontend and backend has not been initialized yet.

### Database

The PostgreSQL database is defined in `docker-compose.yaml`. To run the database:

```shell
# Start the PostgreSQL container in detached mode
docker-compose up -d
```

*   The database will be available on `localhost:5332`.
*   Credentials and database name are configured via environment variables (e.g., in a `.env` file).

### Backend (NestJS)

*TODO: Add instructions for starting the backend server once it's set up.*

```shell
# Example (once implemented)
# cd backend
# npm install
# npm run start:dev
```

### Frontend (Angular)

*TODO: Add instructions for starting the frontend application once it's set up.*

```shell
# Example (once implemented)
# cd frontend
# npm install
# ng serve
```

## 📝 Development Conventions

*   **Shared Interfaces:** A common repository or monorepo library should be used for Data Transfer Objects (DTOs) and TypeScript interfaces to ensure data contracts are synchronized between the frontend and backend.
*   **Database Migrations:** Use TypeORM's migration tool to manage database schema changes. Manual schema alterations should be avoided.
*   **API Security:** Authentication is based on Passport.js with JWTs. API routes are protected using a `RolesGuard` for RBAC.
*   **Data Validation:** Use `class-validator` and `class-transformer` in NestJS DTOs to validate all incoming data.
*   **Concurrency Handling:** The backend must correctly handle `OptimisticLockVersionMismatchError` from TypeORM and return a `409 Conflict` status code, which the frontend will use to notify the user.
