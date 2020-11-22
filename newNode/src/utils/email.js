import { createTransport } from 'nodemailer';
// const Mailgen = require("mailgen");

const mailConfig = {
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "shubhamvyas@jsonfactory.com",
    pass: "$#ub#@mEmailPassword",
  },
}


export async function sendEmail (htmlData, emailaddress) {
  let transporter = createTransport(mailConfig);
  let mailOptions = {
    from: mailConfig.auth.user,
    to: emailaddress,
    subject: 'Verify your email address',
    html: htmlData
  };
  
  try {
    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        throw error;
      } else {
        return 'Email send successfully'
      }
    });
  } catch (error) {
    throw error
  }
}
