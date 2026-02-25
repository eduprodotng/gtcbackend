import nodemailer from "nodemailer";

// Create a transporter object using SMTP transport (Mailgun settings)
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org", // Mailgun SMTP server
  port: 465, // Use 587 for TLS (recommended) or 465 for SSL
  secure: true, // Set to true if using port 465 (SSL)
  auth: {
    user: "postmaster@sandbox0b24a2abb9e640c5a9e8ce5fc2dc3df0.mailgun.org", // Mailgun SMTP username
    pass: "Obiora100%", // Mailgun SMTP password
  },
});

console.log("SMTP Configuration:", {
  host: "smtp.mailgun.org",
  port: 465,
  secure: true,
  user: "postmaster@sandbox0b24a2abb9e640c5a9e8ce5fc2dc3df0.mailgun.org",
});

// Function to send a welcome email
export const sendWelcomeEmail = async (to, defaultPassword, resetLink) => {
  try {
    const mailOptions = {
      from: '"Dream Simu" <postmaster@mail.praiseafk.tech>', // Sender address
      to, // Recipient email
      subject: "Welcome to Dream Simu", // Email subject
      text: `Hello,\n\nWelcome to DreamSimu! Your account has been created successfully. 


If you have any questions, feel free to reach out to us.\n\n
Thank you,\nDream Simu Team`, // Plain text content
      html: `<p>Hello,</p>
<p>Welcome to Dream Simu! Your account has been created successfully.</p>

<p>If you have any questions, feel free to reach out to us.</p>
<p>Thank you,<br/>Dream Simu Team</p>`, // HTML content
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Email sending failed");
  }
};
