const forgotPasswordMailTemplate = (name, email, otp) => {
    return `
        <html>
        <head>
            <style>
                .container {
                    padding: 1rem;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    margin: 1rem auto;
                    max-width: 500px;
                }
                .logo {
                    text-align: center;
                }
                .logo img {
                    width: 100px;
                }
                .content {
                    text-align: center;
                }
                .content h1 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                .content p {
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }
                .content a {
                    background-color: #007bff;
                    color: white;
                    padding: 0.5rem 1rem;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="content">
                    <h1>Forgot Password</h1>
                    <p>Hi ${name},</p>
                    <p>Your OTP to reset password is <strong>${otp}</strong></p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>`
}

module.exports = forgotPasswordMailTemplate;