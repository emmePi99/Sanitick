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

*   **Core Modules Constraint:** Modules located in `src/modules/core/` **MUST NOT** import other modules. They should be purely domain-focused and handle internal logic/entities only. This enforces strict separation of concerns and prevents circular dependencies. If cross-module logic or orchestration is needed, use an API-level module (e.g., `src/modules/api/`) to import the necessary core services and coordinate them.
*   **Shared Interfaces:** A common repository or monorepo library should be used for Data Transfer Objects (DTOs) and TypeScript interfaces to ensure data contracts are synchronized between the frontend and backend.
*   **Database Migrations:** Use TypeORM's migration tool to manage database schema changes. Manual schema alterations should be avoided.
*   **API Security:** Authentication is based on Passport.js with JWTs. API routes are protected using a `RolesGuard` for RBAC.
*   **Data Validation:** Use `class-validator` and `class-transformer` in NestJS DTOs to validate all incoming data.
*   **Concurrency Handling:** The backend must correctly handle `OptimisticLockVersionMismatchError` from TypeORM and return a `409 Conflict` status code, which the frontend will use to notify the user.

# Istruzioni di Sviluppo e Linee Guida per gli Agenti AI

Questo documento contiene regole architetturali e di stile tassative per lo sviluppo del backend di Sanitick (NestJS / TypeScript). Tu, in quanto agente AI, devi rispettare rigorosamente queste direttive in ogni frammento di codice generato o modificato.

---

## 1. Architettura dei Moduli e Dipendenze Circolari

Per prevenire ed evitare problemi di dipendenze circolari (Circular Dependencies), l'architettura segue una regola rigida sull'isolamento del Core:

- **Definizione dei Moduli Core:** I moduli definiti come "Core" sono posizionati all'interno della cartella `src/modules/core/` e contengono la parola `core` nel loro nome (es. `user-core.service.ts`, `mailer.service.ts` dentro la struttura core).
- **Regola di Importazione:** I moduli Core **NON devono MAI importare altri moduli** (né moduli API, né altri moduli esterni all'infuori delle librerie di terze parti strettamente necessarie o di utility pure). 
- **Flusso consentito:** Sono gli altri moduli (come i moduli in `src/modules/api/`) a poter importare ed estendere i moduli Core, mai il contrario.

*Se ti viene richiesto di implementare una feature in un modulo Core che richiede funzionalità di un altro modulo, segnalalo come violazione architetturale invece di procedere con l'import.*

---

## 2. Best Practices di Programmazione e Stile del Codice

Devi seguire SEMPRE le migliori pratiche di programmazione relative a TypeScript, NestJS e al Clean Code. In particolare, sono applicate le seguenti restrizioni tassative sul codice TypeScript:

- **NO `any`:** L'uso del tipo `any` è severamente vietato. Ogni variabile, parametro, valore di ritorno o proprietà deve essere tipizzato esplicitamente. Se un tipo non è noto o è dinamico, valuta l'uso di `unknown`, di una `interface` o di un `type` generico, ma mai `any`.
- **NO Type Assertion (`as`):** È vietato l'uso dell'operatore di type assertion `as` (es. `const user = data as User`). Le asserzioni aggirano il compilatore e nascondono potenziali bug. Utilizza il type-checking nativo, i Type Guard (funzioni `is`), o la validazione dei dati a runtime (es. `class-validator` con i DTO di NestJS).

### Esempi di conformità:

❌ **SBAGLIATO (Non generare MAI codice così):**
```typescript
const data: any = await this.service.getData();
const userId = (data as MyDataType).id;