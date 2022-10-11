import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: process.env.BACK_MAILER_HOST,
          //   service: 'gmail',
          port: +process.env.BACK_MAILER_PORT,
          //   ignoreTLS: MAILER.ignoreTLS,
          secure: process.env.BACK_MAILER_SECURE == 'true',
          auth: { user: process.env.BACK_MAILER_USER, pass: process.env.BACK_MAILER_PASSWORD },
        },
        preview: process.env.BACK_MAILER_PREVIEW == 'true',
        defaults: { from: `${process.env.BACK_MAILER_NO_REPLY_MENNSAGE} <${process.env.BACK_MAILER_FROM}>` },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
