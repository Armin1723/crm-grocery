
const emailHeader = (company) => {
  try {

    return `
      <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
        ${
          company.logo
            ? `<img src="${company.logo}" alt="${company.name}" style="max-height: 60px; margin-bottom: 10px;">`
            : ""
        }
        <h1 style="color: #5d3fd3; margin: 0; font-size: 24px;">${
          company.name
        }</h1>
        ${
          company.address
            ? `<p style="margin: 5px 0; color: #666;">${company.address}</p>`
            : ""
        }
        ${
          company.phone
            ? `<p style="margin: 5px 0; color: #666;">Phone: ${company.phone}</p>`
            : ""
        }
        ${
          company.email
            ? `<p style="margin: 5px 0; color: #666;">Email: ${company.email}</p>`
            : ""
        }
        ${
          company.website
            ? `<p style="margin: 5px 0;"><a href="${company.website}" style="color: #5d3fd3; text-decoration: none;">${company.website}</a></p>`
            : ""
        }
      </div>
    `;
  } catch (error) {
    console.error("Error fetching company details:", error);
    return ""; // Return an empty string or a default header in case of an error
  }
};

module.exports = emailHeader;
