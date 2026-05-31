import { Module } from '@nestjs/common';
import { MailerService } from './service/mailer/mailer.service';
import { MailerListener } from './listener/mailer/mailer.listener';

@Module({
  providers: [
    MailerService,
    MailerListener
  ]
})
export class MailerModule {}
