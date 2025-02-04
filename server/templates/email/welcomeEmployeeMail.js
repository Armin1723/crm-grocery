require('dotenv').config();

const welcomeEmployeeMail = (employee) => {
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #5d3fd3;">Welcome ${employee.name}!</h2>
        <p>We are excited to have you on board. Your employee ID is <strong>${employee.id}</strong>.</p>
        <p>Your password is your first name followed by <strong>@123</strong>. Please change your password after logging in.</p>
        <p>Log in <a href='${process.env.FRONTEND_URL}/login' target='_blank' style="color: #4CAF50; text-decoration: none;">here</a>.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    </div>`;
}

module.exports = welcomeEmployeeMail;