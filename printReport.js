const { ipcMain, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

ipcMain.on("print-report", (
  event,
  { title, content, startDate, endDate, tailwindCSSStyles, tailwindCSS }
) => {
  const tailwindPath = `file://${path.join(__dirname, "../index.css")}`;
  const tailwindCSSAlternate = fs.readFileSync(path.join(__dirname, '../index.css'), 'utf-8');

  let printWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    show: false,
    webPreferences: { nodeIntegration: true },
  });

  const printHTML = `
    <html>
      <head>
        <title style="text-transform: capitalize;">${title} Report</title>
        <link rel="stylesheet" href="${tailwindCSSStyles}" />
        <link rel="stylesheet" href="${tailwindPath}" />
        <style>
          ${tailwindCSS}
          ${tailwindCSSAlternate}
          @media print { /* General print styles here */ }
        </style>
      </head>
      <body>
        <header style="text-align: center;">
          <h1>${title} Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p style="text-transform: italic;">Date Range: ${startDate} to ${endDate}</p>
        </header>
        ${content}
        <footer style="text-align: center; margin-top: 20px;">
          <p><i>End of Report</i></p>
        </footer>
      </body>
    </html>
  `;

  printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(printHTML)}`);
  printWindow.webContents.once("did-finish-load", () => {
    printWindow.webContents.print({ silent: false, printBackground: true }, () => {
      printWindow.close();
    });
  });
});
