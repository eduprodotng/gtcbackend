// import nodemailer from "nodemailer";

// async function main() {
//   // Async function enables allows handling of promises with await

//   // First, define send settings by creating a new transporter:
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
//     port: 465, // Port for SMTP (usually 465)
//     secure: true, // Usually true if connecting to port 465
//     auth: {
//       user: "***-example-person@gmail.com", // Your email address
//       pass: "your-password", // Password (for gmail, your app password)
//       // ⚠️ For better security, use environment variables set on the server for these values when deploying
//     },
//   });

//   // Define and send message inside transporter.sendEmail() and await info about send from promise:
//   let info = await transporter.sendMail({
//     from: '"You" <***-example-person@gmail.com>',
//     to: "****.bram@****.com",
//     subject: "Testing, testing, 123",
//     html: `
//      <h1>Hello there</h1>
//      <p>Isn't NodeMailer useful?</p>
//      `,
//   });

//   console.log(info.messageId); // Random ID generated after successful send (optional)
// }

// main().catch((err) => console.log(err));

// const maillist = [
//   "****.bram@****.com",
//   "****.shah@****.com",
//   "****.styles@****.com",
// ];
// // Defines recipients

// async function main() {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "***-example-person@gmail.com",
//       pass: "your-password",
//       // ⚠️ Use environment variables set on the server for these values when deploying
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"You" <***-example-person@gmail.com>',
//     to: maillist, // Mails to array of recipients
//     subject: "Testing, testing, 123",
//     html: `
//    <h1>Hello there</h1>
//    <p>Isn't NodeMailer useful?</p>
//    `,
//   });

//   console.log(info.messageId);
//   console.log(info.accepted); // Array of emails that were successful
//   console.log(info.rejected); // Array of unsuccessful emails
// }

// main().catch((err) => console.log(err));

// async function main() {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: "***-example-person@gmail.com",
//       pass: "your-password",
//       // ⚠️ Use environment variables set on the server for these values when deploying
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"You" <***-example-person@gmail.com>',
//     to: "****.bram@****.com",
//     subject: "Image test",
//     html: `
//    <h1>Hello world</h1>
//    <p>Here's an image for you</p>
//    <img src="cid:unique@gmail.com>"/>'
//    `, // Embedded image links to content ID
//     attachments: [
//       {
//         filename: "image.png",
//         path: "./img1.jpg",
//         cid: "unique@gmail.com", // Sets content ID
//       },
//     ],
//   });

//   console.log(info.messageId);
// }

// main().catch((err) => console.log(err));
