require('dotenv').config();

const registerMailTemplate = (name) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #5d3fd3;">Welcome ${name}!</h2>
        <p>We are excited to have you on board.</p>
        <p>Your password is your first name and then '@' followed by last four digist of your mobile number. Please change your password after logging in.</p>
        <p>Log in to continue.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    </div>`;
}

module.exports = registerMailTemplate;