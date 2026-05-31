import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '../../service/mailer/mailer.service';
import { DoctorCreatedEvent } from 'src/modules/core/doctor/events/doctor-created.event';
import { UserCreatedEvent } from 'src/modules/core/user/event/user-created.event';

@Injectable()
export class MailerListener {
  private logger = new Logger(MailerListener.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnEvent(UserCreatedEvent.KEY, { async: true })
  handleUserCreatedEvent(event: UserCreatedEvent) {
    if (!event.token) {
        this.logger.error("token mancante nel payload dell'evento UserCreatedEvent. Mail non inviata", event);
        return;
    }
    try {
      this.mailerService.sendActivationEmail(event.email, event.token);
      this.logger.log(
        `Inviata email di attivazione a ${event.email}`,
      );
    } catch (error) {
      this.logger.error(`Errore invio a ${event.email}:`, error);
    }
  }

  @OnEvent(DoctorCreatedEvent.KEY, { async: true })
  async handleDoctorCreatedEvent(event: DoctorCreatedEvent) {
    this.logger.log(
      `Ricevuto evento creazione per il Dott. ${event.lastName} (${event.email})`,
    );

    if (!event.token) {
        this.logger.error("token mancante nel payload dell'evento DoctorCreatedEvent. Mail non inviata", event);
        return;
    }

    try {
      await this.mailerService.sendDoctorInvitation(
        event.email,
        event.firstName,
        event.lastName,
        event.token,
      );
      this.logger.log(`Email di invito inviata con successo a ${event.email}`);
    } catch (error) {
      // Gestiamo l'errore qui per evitare che un guasto SMTP faccia crashare l'app
      this.logger.error(
        `Errore durante l'invio dell'email a ${event.email}`,
        error instanceof Error ? error.stack : 'Errore sconosciuto',
      );
    }
  }
}
