# Strategia di Implementazione - Sistema di Prenotazioni CUP

Questo documento delinea la strategia d'implementazione e l'architettura tecnica per lo sviluppo del sistema standalone di prenotazioni CUP (Centro Unico di Prenotazione). Il progetto adotta un approccio **Full-Stack TypeScript** volto a garantire la massima coerenza dei dati, robustezza architetturale e manutenibilità.

---

## 🛠️ Stack Tecnologico & Scelte Architetturali

* **Frontend:** Angular & TypeScript (Single Page Application)
* **Backend:** NestJS & TypeORM (Framework enterprise per Node.js)
* **Database:** PostgreSQL containerizzato tramite Docker
* **Gestione della Concorrenza:** **Optimistic Locking** (Controllo di versione al salvataggio per evitare l'overbooking senza sovraccaricare il database)
* **Perimetro:** Sistema **Standalone** isolato (gestione proprietaria di anagrafiche, medici e disponibilità)
* **Modello di Accesso:** **RBAC (Role-Based Access Control)** a 4 livelli (Paziente, Medico, Admin, Superadmin) con funzionalità di *User Impersonation* per il Superadmin.
* **Flusso Economico:** Solo prenotazione online, pagamento della prestazione o del ticket da effettuare fisicamente in loco.

---

## 🚀 Roadmap delle Operazioni Fondamentali

### 📦 Fase 1: Setup dell'Ambiente e Condivisione dei Modelli
* [ ] **Infrastruttura locale (Docker):** Configurazione del file `docker-compose.yml` per istanziare PostgreSQL e un tool di amministrazione (es. pgAdmin o Adminer).
* [ ] **Inizializzazione Backend:** Setup del boilerplate NestJS, configurazione del modulo config (`@nestjs/config` per la gestione sicura del file `.env`) e integrazione di TypeORM con il driver nativo di Postgres (`pg`).
* [ ] **Inizializzazione Frontend:** Generazione del workspace Angular tramite CLI con configurazione rigorosa di TypeScript. Definizione della struttura a moduli/componenti (`core`, `shared`, `features`).
* [ ] **Repository delle Interfacce Condivise:** Creazione di uno spazio di codice comune (o libreria monorepo) per ospitare i DTO (Data Transfer Objects) e le interfacce TypeScript (es. `BookingStatus`, `UserRoles`), garantendo che frontend e backend condividano gli stessi contratti dati.

### 🗄️ Fase 2: Modellazione DB e Gestione Concorrenza (TypeORM)
* [ ] **Definizione delle Entity:**
  * `User`: Gestione dell'anagrafica, credenziali cifrate (tramite `bcrypt`) e colonna `role` (Enum: `Patient`, `Doctor`, `Admin`, `Superadmin`).
  * `Doctor`: Estensione del profilo utente per i medici, contenente la specializzazione, il numero di iscrizione all'albo e l'ambulatorio di riferimento.
  * `Slot`: Rappresenta la singola disponibilità oraria (data, ora inizio, ora fine, ID medico). **Elemento chiave:** Inclusione della direttiva `@VersionColumn()` di TypeORM per abilitare l'Optimistic Locking.
  * `Booking`: Tabella relazionale che unisce il Paziente allo Slot specifico, tracciando lo stato della prenotazione (es. `Confermata`, `Disdetta`).
* [ ] **Migrazioni Automatizzate:** Configurazione delle CLI di TypeORM per la generazione e l'esecuzione delle migrazioni del database, evitando alterazioni manuali dello schema in ambiente di produzione.

### 🔒 Fase 3: Core Backend & Sicurezza (NestJS)
* [ ] **Autenticazione & RBAC:** Implementazione del modulo di autenticazione basato su Passport.js e strategie JWT (JSON Web Tokens). Sviluppo del custom decorator `@Roles()` e del relativo `RolesGuard` applicato globalmente per proteggere le rotte API.
* [ ] **Feature Impersonation:** Sviluppo di un endpoint protetto ad uso esclusivo del Superadmin per generare un token di sessione per conto di un altro utente. Il payload del JWT dovrà includere sia l'ID dell'utente target che l'ID del Superadmin reale per scopi di tracciamento.
* [ ] **Modulo Slot & Disponibilità:** Realizzazione delle API di lettura per la ricerca degli slot liberi (filtrabili per data e specializzazione) e delle API amministrative per il caricamento massivo dei calendari medici.
* [ ] **Modulo Prenotazioni con Gestione Errori:** Implementazione della logica di business per l'inserimento della prenotazione. Configurazione di un `ExceptionFilter` globale in NestJS per intercettare l'errore di violazione di versione di TypeORM (`OptimisticLockVersionMismatchError`) e tradurlo in un codice di stato HTTP standardizzato `409 Conflict`.

### 💻 Fase 4: Sviluppo Frontend (Angular)
* [ ] **Core Architecture & Interceptors:** Setup di un HTTP Interceptor per allegare automaticamente il token JWT presente nei cookie/sessione a ogni richiesta in uscita, e per centralizzare la gestione dei codici di errore di rete.
* [ ] **Auth Guards & Routing:** Configurazione dei meccanismi di protezione delle rotte Angular (`CanActivateFn`) in base al ruolo estratto dal token, impedendo l'accesso a sezioni non autorizzate (es. pannello `/admin`).
* [ ] **Sviluppo dei Moduli di Interfaccia (Features):**
  * *Area Paziente:* Dashboard con filtri dinamici per la ricerca delle prestazioni e un calendario interattivo per selezionare lo slot desiderato.
  * *Area Medico/Admin:* Visualizzazione tabellare e ad agenda delle prenotazioni registrate e pannello per l'inserimento o la revoca delle disponibilità orarie.
  * *Area Superadmin:* Pannello di gestione utenti con l'opzione "Impersona Utente" che memorizza lo stato corrente e scambia il token di sessione per riflettere l'identità dell'utente selezionato.
* [ ] **Gestione UI della Concorrenza:** Implementazione di una notifica visiva reattiva (es. una modale o un toast di avviso) che scatta non appena l'interceptor cattura l'errore `409 Conflict`. Il sistema informerà il paziente che lo slot è stato occupato da un altro utente un istante prima e forzerà il refresh immediato della lista degli slot disponibili.

### 🧪 Fase 5: Validazione, Tracciamento e Testing
* [ ] **Validazione dei Dati in Ingresso:** Applicazione sistematica dei decorator di `class-validator` e delle pipeline di `class-transformer` sui DTO di NestJS per validare sintatticamente e semanticamente i dati prima di interagire con il database.
* [ ] **Audit Logging (GDPR):** Sviluppo di un servizio di logging interno per registrare in modo permanente e non modificabile tutte le azioni sensibili (creazione/cancellazione prenotazioni, azioni svolte in modalità *Impersonation*), tracciando marca temporale, ID operatore ed operazione eseguita.
* [ ] **Test di Carico e di Concorrenza:** Scrittura di test automatizzati end-to-end (E2E) per inviare simultaneamente richieste di prenotazione concorrenti sullo stesso `Slot ID`, accertandosi che il database assegni correttamente lo slot a una sola richiesta e risponda con un fallimento controllato (409) alla seconda.

---

## 📌 Note di Manutenzione del Piano
*Il presente piano è da considerarsi un documento vivo. Eventuali modifiche strutturali ai requisiti (es. introduzione di pagamenti online o integrazioni con sistemi sanitari regionali) comporteranno una revisione immediata dei task a partire dalla Fase 2.*
