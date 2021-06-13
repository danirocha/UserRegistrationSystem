import * as nodemailer from 'nodemailer';
import mailConfig from '../config/mail';
import * as crypto from 'crypto';

class Mailer {
    constructor() {
      const { host, port, secure, auth } = mailConfig;
  
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth,
      });
    }

    generateVerificationData(currentDate) {
      const expiration = new Date(currentDate.setDate(currentDate.getDate() + 7));

      const verificationData = {
        token: crypto.randomBytes(20).toString('hex'),
        expiresAt: expiration.toISOString().split('T')[0]
      }

      return verificationData;
    }
  
    sendEmail(options) {
      return this.transporter.sendMail({
        ...mailConfig.default,
        ...options,
      });
    }

    sendVerification(email, verificationToken) {
      const options = {
        to: email,
        text: `To confirm your registration use the token below: ${verificationToken}`,
      }

      this.sendEmail(options);
    }
  }
  
  export default new Mailer();