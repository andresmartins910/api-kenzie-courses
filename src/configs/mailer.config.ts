import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "babdbd6f89caaf",
    pass: "b2543d78aefe5a",
  },
});

export default transport;
