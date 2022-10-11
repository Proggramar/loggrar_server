import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

// import { forgotPassword } from '../modules/safety/auth/auth.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendForgotPassword(account: any) {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: account.email,
      from: `"Equipo de soporte" <${process.env.BACK_MAILER_FROM}@${process.env.BACK_MAILER_FROM_URL}>`, // override default from
      subject: `Recuperación de contraseña (${process.env.BACK_MAILER_FROM_URL})`,
      template: './changePassword', // `.hbs` extension is appended automatically
      context: { name: account.name, pin: account.pin, expire: account.expire },
    });
  }
}
