import transport from "../configs/mailer.config";
import { ErrorHandler } from "../errors/errors";

class MailerService {
  confirmationEmail = (mailOptions: object) => {
    transport.sendMail(mailOptions, (err) => {
      if (err) {
        throw new ErrorHandler(424, "Email could not be sent.");
      }
    });
  };
}

export default new MailerService();
