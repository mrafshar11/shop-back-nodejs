const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transportDetails = smtpTransport({
    host: '',
    port: 465,
    secure: true,
    auth: {
        user: '',
        pass: process.env.mailer_pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.sendEmail = (email, fullname, subject, message) => {
    const transporter = nodemailer.createTransport(transportDetails);
    transporter.sendMail({
        from: '',
        to: email,
        subject: subject,
        html: `<h1>Hello dear ${fullname}</h1>
                <p>${message}</p>`
    });
};
