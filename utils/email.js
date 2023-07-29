// eslint-disable-next-line import/no-extraneous-dependencies
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Hanzla Saadi <${process.env.FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      console.log('in production');
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // 1. Render html based on the pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        subject: subject,
        firstName: this.firstName,
        url: this.url
      }
    );

    // 2. Mail Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      html,
      text: htmlToText.convert(html)
    };

    // 3. Send Mail
    await this.newTransport().sendMail(mailOptions);
  }

  async welcomeMail() {
    await this.send('welcome', 'Welcome to the MFing Natours Family...');
  }

  async forgotPassMail() {
    await this.send(
      'forgotPass',
      'Your Password Reset URL. (Valid for only 10 min)'
    );
  }
};
