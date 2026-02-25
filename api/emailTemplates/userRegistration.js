module.exports = (recepient_name, code, link, year) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Account Registration</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #8FF15F;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #8FF15F;
            margin-bottom: 10px;
        }
        .content p {
            margin: 10px 0;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666;
        }
        .footer a {
            color: #8FF15F;
            text-decoration: none;
        }
        .button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            background-color: #8FF15F;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        a.button {
            color: #ffffff;
        }
        .button:hover {
            background-color: #000f09;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Skillovia</h1>
        </div>
        <div class="content">
            <h2>Hello, ${recepient_name}!</h2>
            <p>Thank you for signing up on our website! We're excited to have you on board.</p>
            <p>To complete your registration, please use the following verification code:</p>
            <div style="text-align: center; font-size: 24px; font-weight: bold; color: rgb(1, 4, 77); margin: 20px 0;">
                ${code}
            </div>

            <p>If you didn't sign up for an account on our website, please ignore this email or contact our support team. <a href="${link}">contact us</a>.</p>
        </div>
        <div class="footer">
            <p>© ${year} Skillovia. All rights reserved.</p>
            <p>
                <a href="${link}">Privacy Policy</a> |
                <a href="${link}">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
`;
