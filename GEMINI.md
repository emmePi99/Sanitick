# Project Overview: Sanitick - Medical Booking System

This project, "Sanitick," is a standalone medical appointment booking system (CUP - Centro Unico di Prenotazione). It is developed using a **Full-Stack TypeScript** approach to ensure consistency and robustness.

The primary source of architectural and implementation details is the `piano_implementazione_cup.md` file, which contains a comprehensive 5-phase development roadmap.

## 🛠️ Tech Stack & Architecture

- **Frontend:** Angular & TypeScript (Single Page Application)
- **Backend:** NestJS, TypeORM, and Node.js
- **Database:** PostgreSQL, containerized via Docker.
- **Shared Library:** Monorepo/Workspace folder `@shared` located at the project root level (peer to `backend` and `frontend`).
- **Core Concepts:**
  - **Standalone System:** Manages its own user, doctor, and availability records.
  - **Role-Based Access Control (RBAC):** Implements a 4-level access model (Patient, Doctor, Admin, Superadmin).
  - **Optimistic Locking:** Used to manage booking concurrency and prevent overbooking via TypeORM's `@VersionColumn`.

---

## 📝 Development Conventions

- **Core Modules Constraint:** Modules located in `src/modules/core/` **MUST NOT** import other modules. They should be purely domain-focused and handle internal logic/entities only. If cross-module logic or orchestration is needed, use an API-level module (e.g., `src/modules/api/`) to import the necessary core services and coordinate them.
- **Shared Alias (`@shared`):** The shared folder is located in the root of the workspace. In the backend, it is mapped via TypeScript paths. NEVER replace `@shared` with relative paths (e.g., `../../../../shared`) inside the source code, as it breaks module mapping during E2E testing environments.
- **Database Migrations:** Use TypeORM's migration tool to manage database schema changes. Manual schema alterations should be avoided.
- **API Security:** Authentication is based on Passport.js with JWTs. API routes are protected using a `RolesGuard` for RBAC.
- **Data Validation:** Use `class-validator` and `class-transformer` in NestJS DTOs to validate all incoming data at the controller level.
- **Concurrency Handling:** The backend must correctly handle `OptimisticLockVersionMismatchError` from TypeORM and return a `409 Conflict` status code, which the frontend will use to notify the user.
- **Case Sensitivity (Linux/CI Compliance):** Filenames and folder names must be strictly lowercase or follow precise camelCase/kebab-case. Remember that GitHub Actions/GitLab CI environments run on Linux (case-sensitive), while development might happen on Windows (case-insensitive). Avoid mismatching casing in imports.

---

# 🤖 Istruzioni di Sviluppo e Linee Guida per gli Agenti AI

Questo documento contiene regole architetturali, di stile e di testing tassative per lo sviluppo di Sanitick. Tu, in quanto agente AI, devi rispettare rigorosamente queste direttive in ogni frammento di codice generato o modified.

## 1. 🧪 Politica di Sviluppo: Test-Driven & Completeness

Non considerare MAI una funzionalità, un metodo o un endpoint como "completato" se non è accompagnato dalla sua suite di test completa. Per ogni nuovo metodo, controller, servizio o utility che implementi o modifichi, devi generare automaticamente i relativi file di test seguendo queste linee guida tassative:

### Requisiti di Copertura dei Test

- **Test Unitari (`.spec.ts`):** Ogni micro-funzionalità o metodo deve avere una copertura totale della logica di business. Copri esplicitamente:
  - **Happy Path:** Il comportamento atteso con input validi e ideali.
  - **Edge Cases:** Input vuoti, stringhe malformate, record non trovati, array vuoti, conflitti di orario.
  - **Error Handling:** Verifica che le eccezioni vengano sollevate correttamente (es. l'intercettazione di un errore di validazione o di un `ConflictException`).
- **Test E2E (`.e2e-spec.ts`):** Se implementi un nuovo endpoint API (Controller), devi creare o aggiornare il relativo test End-to-End dentro la cartella `test/` per verificare l'intero ciclo Request/Response, inclusi i codici di stato HTTP (200, 201, 400, 409, ecc.) e l'effettiva persistenza a database.

### Standard di Scrittura dei Test

- **Isolamento nei Test Unitari:** Usa sempre i Mock e gli Spy (tramite Jest) per isolare il modulo sotto test. Non dipendere mai da istanze reali del database o di altri servizi nei file `.spec.ts`.
- **Iniezione dei Path nei Test E2E:** Quando scrivi o configuri i test E2E, tieni a mente che la `rootDir` di Jest E2E è impostata sulla root del backend (`..`). Gli alias verso il modulo `@shared` globale si risolvono tramite `"^@shared$": "<rootDir>/../shared/index.ts"`. Non usare mai percorsi relativi per forzare la risoluzione degli alias.
- **Struttura AAA:** Organizza ogni test secondo il pattern _Arrange-Act-Assert_ (Prepara, Agisci, Verifica), separando i blocchi logici con una riga vuota per la massima leggibilità.

### Workflow di Risposta dell'IA

Quando ti viene chiesto di scrivere codice, la tua risposta deve **sempre** includere:

1. Il codice sorgente aggiornato e pulito.
2. I relativi file di test unitari/E2E pronti all'uso.

---

## 2. Architettura dei Moduli e Dipendenze Circolari

Per prevenire ed evitare problemi di dipendenze circolari (Circular Dependencies), l'architettura segue una regola rigida sull'isolamento del Core:

- **Definizione dei Moduli Core:** I moduli Core sono posizionati all'interno della cartella `src/modules/core/` (es. `user-core`, `slot-core`).
- **Regola di Importazione:** I moduli Core **NON devono MAI importare altri moduli**. Sono entità isolate che gestiscono solo il proprio dominio.
- **Flusso consentito:** Sono i moduli API (in `src/modules/api/`) a importare ed estendere i moduli Core per orchestrare le funzionalità complesse (es. l'orchestrazione tra `Auth` e `UserCore`).

_Se ti viene richiesto di implementare una feature in un modulo Core che richiede funzionalità di un altro modulo, segnalalo come violazione architetturale invece di procedere con l'import._

---

## 3. Best Practices di Programmazione e Stile del Codice

- **NO `any`:** L'uso del tipo `any` è severamente vietato. Ogni variabile, parametro, valore di ritorno o proprietà deve essere tipizzato esplicitamente. Se un tipo non è noto o è dinamico, utilizza `unknown` o i Generics (`<T>`).
- **NO Type Assertion (`as`):** È vietato l'uso di `as` (es. `data as User`). Utilizza il type-checking nativo, i Type Guard (funzioni `is`), o la validazione dei dati a runtime tramite i DTO.
- **Manipolazione delle Date sicura:** Quando manipoli orari e date (es. per la generazione degli slot medici partendo dalle `doctorSchedule`), evita manipolazioni manuali di stringhe tramite `split(':')` o `parseInt`. Utilizza sempre i metodi nativi di **Day.js** (o simili) sfruttando i formati ISO o i metodi di impostazione oraria dell'oggetto (es. `dayjs(\`${dateStr}T\${schedule.startTime}:00\`)`).

### Esempi di conformità:

❌ **SBAGLIATO (Non generare MAI codice così):**

```typescript
const data: any = await this.service.getData();
const userId = (data as MyDataType).id;
const hour = parseInt(schedule.startTime.split(":")[0]);
```

✔️ CORRETTO (Genera codice seguendo questo standard):

```typescript
const data: MyDataType = await this.service.getData();
const userId = data.id;
const currentTime = targetDate.hour(startHours).minute(startMinutes).second(0);
```
