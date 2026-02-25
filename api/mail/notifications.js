// const mailer = require("../config/mailerConfig");
// const userRegistration = require("../emailTemplates/userRegistration");
// const passwordResetEmail = require("../emailTemplates/passwordResetEmail");

// class Notifications {
//     #siteUrl;
//     #dates;
//     #currrentYear;

//     constructor() {
//         this.#siteUrl = 'https://example.com';
//         this.#dates = new Date();
//         this.#currrentYear = this.#dates.getFullYear();
//     }


//     async whenUserRegister(send_to, data ) {
//         const {recepient_name, code} = data
//         const link = `${this.#siteUrl}/dashboard`

//         const mailOptions = {
//             from: '"Skillovia" <noreply@testapi.humanserve.net>',
//             to: send_to,
//             subject: "Welcome to Skillovia",
//             html: userRegistration(recepient_name, code, link, this.#currrentYear),
//         };
        
//         await mailer.sendMail(mailOptions);

//         return true
//     }


//     async whenPasswordReset(send_to, data ) {
//         const {recepient_name, link, token} = data

//         const mailOptions = {
//             from: '"Skillovia" <noreply@testapi.humanserve.net>',
//             to: send_to,
//             subject: "Change Password Request",
//             html: passwordResetEmail(recepient_name, token, link, this.#currrentYear),
//         };
        
//         await mailer.sendMail(mailOptions);

//         return true
//     }
// }

// module.exports = new Notifications();
