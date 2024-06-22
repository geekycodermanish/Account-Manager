// services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendAccountCreationEmail = (firstName, lastName) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'notification-email@gmail.com',
    subject: 'New Account Created',
    text: `A new account for ${firstName} ${lastName} has been created.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
