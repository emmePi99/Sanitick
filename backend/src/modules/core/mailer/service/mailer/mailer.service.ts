import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      tls: {
        rejectUnauthorized: false,
      },
      ...(smtpUser && smtpPass
        ? { auth: { user: smtpUser, pass: smtpPass } }
        : {}),
    });
  }

  async sendActivationEmail(email: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const activationLink = `${frontendUrl}/set-password/${token}`;

    const fromSender = this.configService.get<string>('SMTP_FROM');

    await this.transporter.sendMail({
      from: fromSender,
      to: email,
      subject: 'Attiva il tuo account',
      html: `
        <h3>Benvenuto nel portale!</h3>
        <p>Clicca sul link sottostante per impostare la tua password e attivare l'account:</p>
        <a href="${activationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">Imposta Password</a>
        <p>Se il bottone non funziona, copia e incolla questo URL nel browser:</p>
        <p>${activationLink}</p>
      `,
    });
  }

  async sendDoctorInvitation(
    email: string,
    firstName: string,
    lastName: string,
    token: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const setupPasswordLink = `${frontendUrl}/set-password/${token}`;

    const fromSender = this.configService.get<string>('SMTP_FROM');

    await this.transporter.sendMail({
      from: fromSender,
      to: email,
      subject: 'Benvenuto nel Team del CUP - Attivazione Account Medico',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2>Gentile Dott. ${lastName}, benvenuto!</h2>
          <p>Il suo profilo professionale è stato creato con successo all'interno del sistema CUP (Centro Unico di Prenotazione).</p>
          <p>Per poter accedere alla sua area riservata, gestire i suoi turni e visualizzare le prenotazioni dei pazienti, è necessario attivare l'account scegliendo una password sicura.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupPasswordLink}" 
               style="background-color: #2b6cb0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
               Imposta la tua Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">
            Se il pulsante non funziona, copi e incolli il seguente link nel suo browser:<br>
            <a href="${setupPasswordLink}">${setupPasswordLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            Questa è un'email automatica, si prega di non rispondere. Il link di attivazione scadrà tra 48 ore per motivi di sicurezza.
          </p>
        </div>
      `,
    });
  }
}
