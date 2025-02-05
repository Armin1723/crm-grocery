const emailFooter = (company) => {
  try {

    return `
      <div style="background-color: #f8f9fa; padding: 12px; align-items: center; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ddd;">
        <p>&copy; ${new Date().getFullYear()} ${
      company.name
    }. All rights reserved.</p>
        ${company.address ? `<p>${company.address}</p>` : ""}
        ${company.phone ? `<p>Phone: ${company.phone}</p>` : ""}
        ${company.email ? `<p>Email: ${company.email}</p>` : ""}
        ${
          company.website
            ? `<p><a href="${company.website}" style="color: #5d3fd3; text-decoration: none;">${company.website}</a></p>`
            : ""
        }
        <p style="margin-top: 6px;">This is an automated email. Please do not reply directly to this message.</p>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching company details:", error);
    return "";
  }
};

module.exports = emailFooter;
