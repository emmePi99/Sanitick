import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialException extends UnauthorizedException {
  constructor() {
    super('Credenziali non valide');
  }
}
