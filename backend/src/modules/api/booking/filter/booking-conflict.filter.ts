import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class BookingConflictFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Codice 23P01 è Exclusion Violation in PostgreSQL
    if ((exception as any).code === '23P01') {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message:
          "L'orario selezionato non è disponibile (conflitto di prenotazione).",
        error: 'Conflict',
      });
    } else {
      // Se non è il nostro errore, lasciamo che NestJS gestisca l'errore normalmente
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Errore interno del server.',
      });
    }
  }
}
