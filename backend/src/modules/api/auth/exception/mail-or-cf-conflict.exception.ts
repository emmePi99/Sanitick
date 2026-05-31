import { ConflictException } from "@nestjs/common";

export class MailOrCfConflictException extends ConflictException {
  constructor() {
    super('Esiste già un utente con questa email o questo codice fiscale');
  }
}