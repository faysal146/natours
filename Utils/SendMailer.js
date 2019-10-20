const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create transport
    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
    //2) define email options
    const { to, subject, message } = options;
    const mailOptions = {
        from: 'Faysal Ahmed <fahadfaysal146@gmail.com>',
        to,
        subject,
        text: message
    };
    // send mail to the client
    try {
        await transport.sendMail(mailOptions);
    } catch (err) {
        console.log('send mailer ======> ', err);
    }
};
module.exports = sendEmail;
