Ecco il contenuto completo del piano aggiornato. Puoi copiarlo e incollarlo direttamente nel tuo file `piano_implementazione_frontend.md`.

```markdown
# 🏥 Piano di Implementazione Frontend - Sanitick

Questo documento definisce l'architettura dettagliata, le linee guida di design UI/UX e la roadmap di sviluppo passo-passo per l'applicazione frontend di Sanitick (CUP - Centro Unico di Prenotazione). 

L'applicazione è sviluppata come Single Page Application (SPA) utilizzando **Angular (Standalone Components)**, **Angular Material** per i componenti di interfaccia e **Tailwind CSS** per la gestione flessibile dei layout.

---

## 🎨 1. Design System e UI/UX (Angular Material)

Il sistema deve trasmettere affidabilità, pulizia e professionalità, caratteristiche fondamentali per un'applicazione in ambito sanitario.

* **Tema Colori (Custom Material Theme):**
    * **Primary:** Blu Medico / Teal (`#005b9f` o `#00897b`). Usato per la navbar, le intestazioni dei cruscotti, i bottoni principali e i link di navigazione.
    * **Accent:** Arancione / Corallo (`#ff7043`). Usato esclusivamente per le "Call to Action" cruciali (es. "Prenota Ora", "Registrati", "Conferma Prenotazione").
    * **Warn:** Rosso. Usato per azioni distruttive (Cancellazione appuntamento) e messaggi di errore (Validazione form, blocchi di sicurezza).
* **Tipografia:** `Roboto` (standard Material) o `Inter` impostata globalmente per garantire una leggibilità ottimale delle griglie dati e dei form complessi.
* **Feedback Visivo e Dialoghi:**
    * `mat-snackbar`: Per notifiche asincrone non bloccanti (es. "Profilo aggiornato con successo", "Email di reset inviata").
    * `mat-dialog`: Per conferme esplicite di azioni distruttive o per blocchi informativi (es. avviso di Optimistic Locking).

---

## 🏗️ 2. Architettura delle Directory (Core vs Features vs Shared)

Per garantire la massima scalabilità del codice ed evitare l'effetto "monolito disordinato", l'applicazione adotta una netta separazione delle responsabilità strutturata in tre macro-aree: **Core**, **Features** e **Shared**.

```text
frontend/src/app/
├── core/                   # Il "Motore" dell'applicazione (Singleton globali)
│   ├── auth/               # AuthService, Token Storage, RolesGuard (RBAC)
│   └── interceptors/       # Iniezione JWT, HttpErrorInterceptor (Gestione 409 Conflict)
├── shared/                 # La "Cassetta degli Attrezzi" (Componenti UI stupidi e riutilizzabili)
│   ├── components/         # confirmation-dialog, loading-spinner, error-card
│   ├── pipes/              # format-date.pipe.ts, codice-fiscale.pipe.ts
│   └── directives/         # uppercase.directive.ts
├── features/               # I "Moduli di Business" (Pagine ed endpoint logici dell'utente)
│   ├── auth/               # Flussi di Onboarding, Login, Registrazione e Reset Password
│   ├── patient/            # Funnel di ricerca e prenotazione visite, storico appuntamenti
│   ├── doctor/             # Dashboard medica, gestione dell'agenda (doctorSchedule)
│   └── admin/              # Dashboard di configurazione, CRUD medici/pazienti e override
└── app.routes.ts           # Definizione delle route principali associate ai Guard di ruolo

```

### 🧠 Dettaglio delle macro-aree:

1. **`core/` (Logica Globale Esterna alla Vista):** Contiene tutto ciò che deve essere istanziato una sola volta nell'intero ciclo di vita dell'app. Gestisce la sicurezza (Guard) e la comunicazione di basso livello con le API (Interceptor). I componenti non parlano mai direttamente con il server per logiche di autenticazione; interrogano sempre i servizi centralizzati del `core`.
2. **`features/` (Isolamento del Dominio e Lazy Loading):** Ogni cartella qui dentro rappresenta un "mondo" utente. Sfruttando i moduli pigri (Lazy Loading) di Angular, il codice associato alla dashboard del medico (`features/doctor`) non verrà mai scaricato sul browser di un paziente, riducendo drasticamente il tempo di caricamento iniziale dell'applicazione.
3. **`shared/` (Zero Logica di Business, Solo Presentazione):** Contiene componenti puramente visivi (Dumb Components). Ricevono dati dall'esterno tramite `@Input` ed emettono eventi tramite `@Output`. Sono riutilizzabili all'interno di qualsiasi feature senza creare accoppiamenti di codice.

> ⚠️ **Contratto Dati Rigido (Monorepo Workspace):** È severamente vietato ridefinire le interfacce o i DTO nel frontend. Tutti i modelli di dati, le risposte API e le validazioni strutturali devono essere importati direttamente dall'alias globale `@shared` (`import { BookingDto } from '@shared'`).

---

## 🚀 3. Roadmap di Sviluppo (Fasi di Implementazione)

### 🔹 Fase 1: Infrastruttura e Sicurezza HTTP (Core)

* **Setup Workspace:** Inizializzazione del progetto Angular, integrazione di Tailwind CSS nel flusso di compilazione e configurazione del tema personalizzato di Angular Material (`styles.scss`).
* **Routing e RBAC:** Implementazione del `RolesGuard`. Il Guard intercetta i cambi di rotta, legge il JWT decodificato e verifica se il ruolo dell'utente (Patient, Doctor, Admin, Superadmin) possiede i privilegi necessari per accedere al percorso.
* **Interceptors:** * *AuthInterceptor:* Inietta l'header `Authorization: Bearer <token>` in ogni richiesta HTTP in uscita verso il backend.
* *ErrorInterceptor:* Intercetta gli errori centralizzati. In caso di errore HTTP `409 Conflict` (scattato dall'Optimistic Locking di TypeORM sul backend), l'interceptor blocca l'interfaccia e l'esecuzione del codice aprendo una `mat-dialog` standardizzata: *"Siamo spiacenti, lo slot orario selezionato è appena stato prenotato da un altro utente. La pagina verrà aggiornata."*



### 🔹 Fase 2: Gestione Accessi e Onboarding (`features/auth`)

Sviluppo guidato dai **Reactive Forms** per la validazione robusta a runtime prima dell'invio dei dati al backend:

* **Registrazione Paziente (`/register`):** Form diviso in blocchi anagrafici (Nome, Cognome, Data di Nascita, Codice Fiscale) e credenziali. Implementazione di un *Custom Validator* per il controllo formale del Codice Fiscale italiano tramite Regex e un validatore per la complessità della password.
* **Attivazione Account (`/activate/:token`):** Componente transizionale. Mostra un `mat-spinner` centrale mentre esegue la chiamata HTTP GET per validare il token ricevuto via email. Fornisce feedback visivi chiari in caso di successo (redirect a login) o di token scaduto (bottone per richiedere un nuovo invio).
* **Login (`/login`):** `mat-card` con controlli reattivi di email e password. Inserimento del pulsante di visibilità della password (icona occhietto) e gestione degli errori tramite `mat-error`.
* **Recupero Password (`/forgot-password` & `/reset-password/:token`):** Flusso asincrono a due step. Il form di impostazione della nuova password implementa un *Cross-Field Validator* che verifica in tempo reale la perfetta corrispondenza tra i campi "Nuova Password" e "Conferma Password", disabilitando il bottone di submit in caso di discrepanza.

### 🔹 Fase 3: Il Funnel di Prenotazione del Paziente (`features/patient`)

* **Ricerca e Filtri:** Form di ricerca medici basato su filtri combinati (Specialità, Nome Medico, Range di Date) con completamento automatico tramite `mat-autocomplete`.
* **Visualizzazione Griglia Slot:** Componente che mappa l'array degli `slots` disponibili ricevuti dal backend. La UI mostra una timeline oraria o una griglia basata su CSS Grid in cui gli slot selezionabili sono bottoni Material (`mat-stroked-button`).
* **Wizard di Checkout (`mat-stepper`):** Un flusso guidato che riduce l'ansia da prenotazione:
1. *Fase 1: Scelta:* Visualizzazione del medico e dell'orario scelto.
2. *Fase 2: Riepilogo:* Dati anagrafici del paziente e dell'eventuale esenzione.
3. *Fase 3: Conferma:* Invio della richiesta POST. Al successo, disattivazione dello stepper e visualizzazione della ricevuta.


* **Area Personale:** Tabella riassuntiva (`mat-table`) degli appuntamenti futuri e passati, dotata di opzione per la cancellazione (Soft Delete) che invia una richiesta DELETE al backend previa conferma tramite dialog.

### 🔹 Fase 4: Il Portale Medico e la Gestione dell'Agenda (`features/doctor`)

* **Cruscotto Giornaliero:** Vista focalizzata sugli appuntamenti odierni ordinati per orario cronologico, ottimizzata per un caricamento rapido tramite `ChangeDetectionStrategy.OnPush`.
* **Pianificazione Orari (`doctorSchedule`):** Form reattivo avanzato (basato su `FormArray`) che permette al medico di definire il proprio orario di lavoro ricorrente della settimana (es. Lunedì dalle 08:00 alle 12:00 con slot da 20 minuti). All'invio, il backend utilizzerà questa regola per generare massivamente gli slot reali sul database.
* **Gestione Eccezioni Calendario:** Interfaccia stile calendario in cui il medico può cliccare su singoli slot pre-generati e modificarne lo stato in `blocked` (es. per ferie improvvise o malattie), invalidando temporaneamente la regola generale della schedule.

### 🔹 Fase 5: Admin Dashboard e Superadmin (`features/admin`)

* **Pannello di Monitoraggio Globale:** Tabelle ad alte prestazioni strutturate con `mat-table`, `mat-paginator` e `mat-sort` collegate a paginazione remota sul database.
* **Anagrafiche Medici e Staff (CRUD):** Form interni per la creazione di nuovi profili medici, con assegnazione delle specialità mediche e configurazione iniziale del profilo.
* **Override Amministrativo:** Strumenti di sicurezza avanzati per permettere all'amministratore di sistema di spostare o cancellare appuntamenti d'ufficio in caso di emergenze strutturali della clinica.

### 🔹 Fase 6: Testing e Ottimizzazione delle Performance

* **Unit & Component Testing (Vitest):** Configurazione dei file `.spec.ts` per testare isolatamente i Custom Validators dei form, la logica dei servizi core e il corretto comportamento delle funzioni di trasformazione delle date (Day.js).
* **Ottimizzazione Rendering:** Implementazione sistematica della strategia `ChangeDetectionStrategy.OnPush` su tutti i componenti di presentazione e utilizzo delle nuove direttive di controllo flusso nativo di Angular (`@for`, `@if`, `@switch`) per massimizzare la velocità di rendering del DOM.

---

## 🛠️ 4. Standard di Sviluppo Obbligatori (Best Practices)

1. **Reactive Forms Mandatori:** È vietato l'uso dei form guidati dai template (`[(ngModel)]`). Qualsiasi interazione di input deve essere tracciata tramite istanze esplicite di `FormControl`, `FormGroup` o `FormArray`.
2. **Gestione della Memoria (RxJS):** Per prevenire pericolosi Memory Leak dovuti a sottoscrizioni HTTP rimaste aperte, ogni `subscribe()` nei componenti deve essere gestita tramite la pipe `async` direttamente nel template HTML, oppure racchiusa nel ciclo di vita nativo tramite l'operatore `takeUntilDestroyed()`.
3. **Layout Mobile-First:** L'interfaccia deve adattarsi perfettamente ai dispositivi mobili. Le tabelle complesse (`mat-table`) devono nascondersi sugli schermi inferiori a 768px ed essere sostituite da un layout a schede verticali (`mat-card`) facilmente consultabili da smartphone.

```

```