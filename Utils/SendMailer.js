const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.firstName = user.name.split(' ')[0];
        this.to = user.email;
        this.url = url;
        this.form = `Natours Inc. <${process.env.EMAIL_FORM}>`;
    }

    mailTransport() {
        if (process.env.NODE_ENV === 'production') {
            return 1;
        }
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../Views/Email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });
        const mailOptions = {
            from: this.form,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };
        await this.mailTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome To Natours Family');
    }
};
