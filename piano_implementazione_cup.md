# Strategia di Implementazione - Sistema di Prenotazioni CUP

Questo documento delinea la strategia d'implementazione e l'architettura tecnica per lo sviluppo del sistema standalone di prenotazioni CUP (Centro Unico di Prenotazione). Il progetto adotta un approccio **Full-Stack TypeScript** volto a garantire la massima coerenza dei dati, robustezza architetturale, manutenibilità e scalabilità del codice.

---

## 🛠️ Stack Tecnologico & Scelte Architetturali

- **Frontend:** Angular & TypeScript (Single Page Application), Angular Material (UI Components)
- **Backend:** NestJS & TypeORM (Framework enterprise per Node.js)
- **Database:** PostgreSQL containerizzato tramite Docker
- **Gestione Disponibilità:** **Dynamic Availability (Event-Driven)** basata sul calcolo in tempo reale degli spazi liberi incrociando i template orari dei medici con le prenotazioni già esistenti.
- **Gestione della Concorrenza:** **PostgreSQL EXCLUDE Constraint (GiST)** per prevenire matematicamente la sovrapposizione temporale degli appuntamenti (Overbooking) direttamente a livello di motore di database.
- **Perimetro:** Sistema **Standalone** isolato (gestione proprietaria di anagrafiche, medici e disponibilità).
- **Modello di Accesso:** **RBAC (Role-Based Access Control)** a 4 livelli (Paziente, Medico, Admin, Superadmin) con funzionalità di _User Impersonation_ per il Superadmin.
- **Flussi di Onboarding:** Registrazione autonoma con doppia opt-in (link di verifica email) per i Pazienti; onboarding su invito (creazione profilo dall'Admin + email asincrona per impostazione password) per i profili Medico ed Admin.
- **Flusso Economico:** Solo prenotazione online; pagamento della prestazione o del ticket da effettuare fisicamente in loco presso la struttura.

---

## 🧪 Approccio al Testing

Il testing è inteso come parte integrante e continua del ciclo di sviluppo (CI/CD), non come fase isolata finale. Ogni nuova funzionalità deve essere coperta da test adeguati.

- **Test Unitari (Unit Tests):** Ogni servizio, controller o componente deve essere accompagnato da test unitari (es. tramite Jest in NestJS) che ne verifichino la logica in isolamento, con particolare focus sulle funzioni matematiche di calcolo e sottrazione degli intervalli temporali.
- **Test di Integrazione (Integration Tests):** Verificheranno l'interazione tra i moduli del backend e il database, accertando nello specifico che i vincoli EXCLUDE di PostgreSQL blocchino rigidamente i tentativi di sovrapposizione.
- **Test End-to-End (E2E):** Simuleranno il percorso completo dell'utente (es. tramite Cypress o Playwright), garantendo la fluidità dei flussi critici dall'interfaccia Angular fino alla persistenza su DB.

---

## 🚀 Roadmap delle Operazioni Fondamentali

### 📦 Fase 1: Setup dell'Ambiente e Condivisione dei Modelli

- [x] **Infrastruttura locale (Docker):** Configurazione del file `docker-compose.yml` per istanziare PostgreSQL e un tool di amministrazione (es. pgAdmin o Adminer). Configurazione dello script di inizializzazione del database per abilitare l'estensione `btree_gist`, indispensabile per i vincoli di esclusione temporale.
- [x] **Inizializzazione Backend:** Setup del boilerplate NestJS, configurazione del modulo config (`@nestjs/config` per la gestione sicura delle variabili d'ambiente nel file `.env`) e integrazione di TypeORM con il driver nativo di Postgres (`pg`).
- [x] **Inizializzazione Frontend:** Generazione del workspace Angular tramite CLI con configurazione rigorosa di TypeScript. Definizione della struttura a moduli/componenti (`core`, `shared`, `features`).
- [x] **Repository delle Interfacce Condivise:** Creazione di uno spazio di codice comune (es. tramite workspace monorepo o pacchetto locale) per ospitare i DTO (Data Transfer Objects), gli Enum di sistema e le interfacce TypeScript, assicurando che frontend e backend condividano gli stessi identici contratti dati.

### 🗄️ Fase 2: Modellazione DB e Gestione Concorrenza Dinamica

- [X] **Definizione dettagliata delle Entity (TypeORM):**
  - **`User`**: Tabella centrale degli account. Colonne: `id` (UUID), `email` (unique), `password` (select: false, cifrata con bcrypt), `firstName`, `lastName`, `fiscalCode` (string, 16 caratteri, unique), `role` (Enum: Patient, Doctor, Admin, Superadmin), `isActive` (boolean, default false), `activationToken` (string, nullable), `activationTokenExpires` (datetime, nullable), `createdAt`, `updatedAt`.
  - **`Doctor`**: Estensione del profilo utente per i medici. Colonne: `id` (UUID), `specialization` (Enum dedicato), `registrationNumber` (Numero iscrizione albo, unique), `clinicAddress` (Ambulatorio di riferimento), `user` (OneToOne con User, cascade e onDelete CASCADE).
  - **`DoctorSchedule`**: Gestione dei **Template Settimanali** di disponibilità (es. Lunedì dalle 09:00 alle 13:00). Colonne: `id`, `doctorId`, `dayOfWeek` (0-6), `startTime` (time), `endTime` (time). Non contiene slot fisici pre-generati ma definisce le regole orarie di lavoro.
  - **`Booking`**: Tabella delle prenotazioni effettive dei pazienti. Colonne: `id` (UUID), `doctorId` (FK), `patientId` (FK), `startTime` (timestamp), `endTime` (timestamp), `status` (Enum: Confermato, Disdetto).
- [X] **Configurazione Vincolo EXCLUDE:** Applicazione del decoratore `@Exclusion()` (o configurazione tramite migration nativa) sulla tabella `Booking` usando l'operatore di overlap `&&` di PostgreSQL per escludere l'inserimento di prenotazioni sovrapposte sullo stesso medico (`USING gist ("doctorId" WITH =, tsrange("startTime", "endTime") WITH &&)`).
- [X] **Migrazioni Automatizzate:** Configurazione delle CLI di TypeORM per la generazione e l'esecuzione delle migrazioni del database, vietando alterazioni manuali dello schema.

### 🔒 Guardie, Core Backend & Calcolo Dinamico (NestJS)

- [X] **Autenticazione, RBAC & Flussi di Attivazione:** Implementazione del modulo Auth basato su Passport.js e strategie JWT. Sviluppo del custom decorator `@Roles()` e del relativo `RolesGuard` globale. Sviluppo della logica di validazione dei token fisici di attivazione (con scadenza standard a 72 ore) per l'attivazione degli account e l'impostazione/reset della password. Gestione dello stato di errore HTTP 400 in caso di token scaduto.
- [X] **Modulo Eventi & Notifiche Email:** Configurazione del pacchetto `@nestjs/event-emitter` per disaccoppiare la logica core dalle notifiche. Implementazione dei listener per intercettare gli eventi `user.registered` (pazienti) e `doctor.created` (medici) per l'invio asincrono delle email tramite provider SMTP (es. Nodemailer / Mailpit in locale).
- [X] **Feature Impersonation:** Sviluppo di un endpoint protetto ad uso esclusivo del Superadmin per generare un token di sessione valido per conto di un altro utente della piattaforma, inserendo nel payload JWT i metadati di tracciamento dell'operatore reale.
- [X] **Motore di Calcolo delle Disponibilità Dinamiche:** Realizzazione del servizio NestJS che riceve una richiesta di ricerca (es. Medico X, Data Y, Tipo Prestazione Z). Il servizio estrae il template orario da `DoctorSchedule`, calcola la durata in minuti in base alla prestazione/specializzazione e recupera le `Booking` già esistenti per quel giorno. Tramite un algoritmo di sottrazione di intervalli temporali, calcola i blocchi liberi residui e restituisce una lista di orari di inizio validi e selezionabili.
- [X] **Exception Filter per Overbooking:** Sviluppo di un `ExceptionFilter` globale in NestJS progettato per catturare l'errore nativo di PostgreSQL associato alla violazione del vincolo EXCLUDE (codice errore standard di Postgres per violazione di esclusione), traducendolo immediatamente in una risposta HTTP standardizzata `409 Conflict`.

### 💻 Fase 4: Sviluppo Frontend Reattivo (Angular)

- [x] **Core Architecture & Interceptors:** Setup di un HTTP Interceptor per allegare in modo trasparente il token JWT memorizzato a ogni richiesta in uscita, e per intercettare centralmente gli errori di rete e di business.
- [x] **Auth Guards, Routing & Viste di Attivazione:** Meccanismi di protezione delle rotte Angular (`CanActivateFn`) basati sul ruolo estratto dal token. Sviluppo dei componenti dedicati alla risoluzione dei token: pagina di "Conferma Account / Email" per i pazienti e pagina di "Imposta la tua Password" per i medici invitati, complete di form di gestione e messaggistica di errore in caso di link scaduto con opzione di richiesta di un nuovo invio.
- [ ] **Sviluppo dei Moduli di Interfaccia (Features):**
  - _Area Paziente:_ Dashboard intuitiva con filtri di ricerca per data e specializzazione medica. Calendario interattivo che mostra esclusivamente gli orari di inizio effettivamente liberi e calcolati al volo dal backend.
  - _Area Medico/Admin:_ Interfaccia per la gestione del `DoctorSchedule` (configurazione e aggiornamento del proprio template orario settimanale) e visualizzazione dell'agenda degli appuntamenti. Pannello Admin dedicato alla compilazione del form di onboarding dei medici (generazione combinata dei dati User + Doctor).
  - _Area Superadmin:_ Pannello di amministrazione utenti complessivo con pulsante "Impersona" per avviare la sessione simulata.
- [x] **Gestione UI della Concorrenza:** Implementazione di un sistema di notifica visiva reattiva (es. modale di avviso o toast bloccante) che scatta non appena l'interceptor cattura l'errore `409 Conflict`. Se un paziente prova a confermare uno spazio temporale occupato da un altro utente un istante prima, il sistema lo informerà in modo chiaro, annullerà l'operazione e forzerà il refresh immediato della lista degli orari disponibili.

### 🧪 Fase 5: Validazione, Tracciamento e Testing Avanzato

- [ ] **Validazione Rigorosa dei Dati:** Applicazione sistematica dei decorator di `class-validator` e delle pipeline di `class-transformer` sui DTO di NestJS. Configurazione di controlli ad hoc sui DTO delle prenotazioni per assicurarsi che i timestamp di inizio e fine inviati dal frontend rispettino gli intervalli discreti previsti e non contengano minuti arbitrari (es. forzatura ad arrotondamenti di 15/30 minuti).
- [ ] **Audit Logging (GDPR & Tracciabilità):** Sviluppo di un servizio di logging interno centralizzato per registrare in modo permanente e non modificabile tutte le azioni ad alto impatto e sensibili sul sistema (creazione/cancellazione prenotazioni, login falliti, attivazioni account, azioni svolte sotto *Impersonation*), tracciando in modo preciso timestamp, ID dell'operatore reale, indirizzo IP ed operazione eseguita.
- [ ] **Test di Overbooking Estremo (Concorrenza):** Scrittura di script di test end-to-end (E2E) automatici scritti appositamente per inviare pacchetti di richieste HTTP POST simultanee (concorrenza reale) per la creazione di una `Booking` sullo stesso medico con intervalli di tempo sovrapposti. Il test si considererà superato solo se il database permetterà il salvataggio di una singola prenotazione, rispondendo con codice `409 Conflict` a tutte le altre richieste concorrenti.

---

## 📌 Note di Manutenzione del Piano

_Il presente piano è da considerarsi un documento vivo. L'attuale architettura basata sul modello **Dynamic Availability** azzera completamente lo spreco di spazio sul database (evitando la pre-generazione di milioni di righe di slot vuoti) ma sposta il carico computazionale sul backend al momento della lettura delle disponibilità. Qualora il volume di traffico della piattaforma o il numero di medici dovesse crescere in modo significativo nel tempo, sarà valutata l'introduzione di una strategia di caching (es. tramite Redis) per memorizzare temporaneamente le matrici delle disponibilità giornaliere calcolate, invalidandole tempestivamente ad ogni nuova prenotazione o disdetta._
