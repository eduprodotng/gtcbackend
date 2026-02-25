// // const nodemailer = require("nodemailer");

// // class MailerConfig {
// //   constructor() {
// //     this.transporter = nodemailer.createTransport({
// //       host: "testapi.humanserve.net",
// //       port: 465,
// //       secure: true,
// //       auth: {
// //         user: "noreply@testapi.humanserve.net",
// //         pass: "[PH1G{]L4kAb",
// //       },
// //       tls: {
// //         rejectUnauthorized: false, // Allow self-signed certificates
// //       },
// //     });

// //     // Verify transporter connection on startup
// //     this.transporter.verify((error, success) => {
// //       if (error) {
// //         console.error("Error initializing mail transporter:", error);
// //       } else {
// //         console.log("Mail transporter is ready to send emails");
// //       }
// //     });
// //   }

// //   async sendMail(mailOptions) {
// //     try {
// //       const info = await this.transporter.sendMail(mailOptions);
// //       console.log(`Email sent successfully: ${info.messageId}`);
// //       return info;
// //     } catch (error) {
// //       console.error("Error sending email:", error.message || error);
// //       throw new Error("Failed to send email");
// //     }
// //   }
// // }

// // module.exports = new MailerConfig();
// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// class MailerConfig {
//   constructor() {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   }

//   async sendMail(mailOptions) {
//     try {
//       const msg = {
//         to: mailOptions.to,
//         from: {
//           email: "skilloviaapp@gmail.com",
//           name: "Skillovia",
//         },
//         subject: mailOptions.subject,
//         html: mailOptions.html,
//       };

//       const response = await sgMail.send(msg);
//       console.log(`Email sent successfully: ${response[0].statusCode}`);
//       return response;
//     } catch (error) {
//       console.error(
//         "Error sending email:",
//         error.response ? error.response.body : error.message
//       );
//       throw new Error("Failed to send email");
//     }
//   }
// }

// module.exports = new MailerConfig();
