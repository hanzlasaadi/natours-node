// eslint-disable-next-line import/no-extraneous-dependencies
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(userMail) {
    this.userMail = userMail;
    this.from = `${process.env.aitMail}`;
  }

  contact(obj) {
    this.name = obj.name ? obj.name : '';
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST_P,
      port: process.env.EMAIL_PORT_P,
      auth: {
        user: process.env.EMAIL_USER_P,
        pass: process.env.EMAIL_PASSWORD_P
      }
    });
  }

  async contactUser() {
    // 1. Render html based on the pug template
    const html = pug.renderFile(`${__dirname}/../views/emails/aitContact.pug`, {
      firstName: this.name
    });

    // 2. Mail Options
    const mailOptions = {
      from: this.from,
      to: this.userMail,
      subject: 'Thank you for contacting AIT Developers!',
      html,
      text: htmlToText.convert(html)
    };

    // 3. Send Mail
    await this.newTransport().sendMail(mailOptions);
  }
};
