const { BrowserWindow, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

// Print a report
const handlePrintReport = ({
  title,
  startDate,
  endDate,
  content,
  tailwindCSS,
  tailwindCSSStyles,
}) => {
  const tailwindPath = `file://${path.join(__dirname, "../assets/index.css")}`;

  const tailwindCSSAlternate = fs.readFileSync(
    path.join(__dirname, "../assets/index.css"),
    "utf-8"
  );

  let printWindow = new BrowserWindow({
    width: 800,
    height: 1000,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Format the report page
  const printHTML = `
      <html>
        <head>
          <title style="text-transform: capitalize;">${title} Report</title>
          <link rel="stylesheet" href="${tailwindCSSStyles}" />
          <link rel="stylesheet" href="${tailwindPath}" />
          <style>
            ${tailwindCSS}
            ${tailwindCSSAlternate}
            /* General print styles */
              @media print {
               
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
  
              body {
                  margin: 0.25in;
                  font-family: 'Outfit', sans-serif;
                  padding-top: 12px;
                  padding-bottom: 12px;
                  font-size: 12px;
                }
  
                  table {
                  page-break-after: auto;
                  page-break-before: auto;
                  page-break-inside: auto !important;
                  width: 100% !important;
                }
  
                tr {
                  page-break-inside: avoid;
                }
  
                tr, th, td {
                  page-break-inside: avoid; /* Prevent rows from breaking in the middle */
                  word-wrap: break-word;
                }
  
                /* For multi-page tables */
                table, thead, tbody {
                  page-break-inside: auto; /* Allows table to span multiple pages */
                }
  
              /* Avoid breaking within certain elements */
              table{
                page-break-inside: avoid;
              }
  
              /* Ensure headers are not cut off */
              h1, h2, h3 {
                page-break-after: avoid;
              }
  
              .chart-grid{
                display: flex;
                flex-direction: row !important;
                flex-wrap: no-wrap !important;
              }
  
              /* Prevent cutting a single list item */
              li {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <header style="text-align: center;">
            <h1 style="text-transform: capitalize;
            font-size: 18px;
            font-weight: 600">${title} Report</h1>
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

  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(printHTML)}`
  );

  printWindow.webContents.once("did-finish-load", () => {
    printWindow.webContents.print(
      {
        silent: false,
        printBackground: true,
      },
      () => {
        printWindow.close();
      }
    );
  });
};

// Print sales receipt
const handlePrintSalesInvoice = (sale) => {
  const formatCurrency = (value) => `₹${value.toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

  const invoiceHTML = `
        <html>
          <head>
          <title>Sales Receipt - ${sale?._id}</title>
            <style>
              body {
              font-family: 'Courier', monospace;
                width: 288px;
                margin: auto;
                padding: 5px;
                font-size: 14px;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .underline { text-decoration: underline; }
              .line { border-bottom: 1px solid #000; margin: 5px 0; }
              table { width: 100%; font-size: 12px; }
              td { padding: 3px 2px; }
              .right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="center bold">YOUR STORE NAME</div>
            <div class="center">123 Market Street, City, State, ZIP</div>
            <div class="center">Phone: (123) 456-7890</div>
            <div class="center">Email: abc@gmail.com</div>
            <div class="center">GSTIN: FS2345454343FRE</div>
            <div class="line"></div>
            <div class="center underline bold">SALE RECEIPT</div>
            <div class="center">Receipt No: ${sale._id}</div>
            <div class="center">Date: ${formatDate(new Date())}</div>
            <div class="line"></div>
    
            <div class="bold underline">Customer Details:</div>
            <div>Name: ${sale.customer?.name || "N/A"}</div>
            <div>Contact: ${sale.customer?.phone || "N/A"}</div>
            ${
              sale.customer?.balance > 0 &&
              `<div>Balance: ₹${sale.customer.balance}</div>`
            }
            <div class="line"></div>
    
            <div class="bold underline">Items:</div>
            <table>
              <tr class="bold">
                <td>S.No</td>
                <td>Product</td>
                <td class="right">Qty</td>
                <td class="right">Rate</td>
                <td class="right">Total</td>
              </tr>
              <tr><td colspan="5" class="line"></td></tr>
              ${sale.products
                .map(
                  (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item?.name || "Unknown"}<br>${
                    item?.mrp ? `MRP: ${formatCurrency(item.mrp)}` : ""
                  }</td>
                    <td class="right">${item.quantity}</td>
                    <td class="right">${formatCurrency(
                      item.sellingRate || 0
                    )}</td>
                    <td class="right">${formatCurrency(
                      item.quantity * item.sellingRate || 0
                    )}</td>
                  </tr>
                `
                )
                .join("")}
              <tr><td colspan="5" class="line"></td></tr>
            </table>
    
            <div class="bold underline">Summary:</div>
            <div>Total Items: ${sale.products.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}</div>
            <div>Sub Total:     ${formatCurrency(sale.subTotal || 0)}</div>
            <div>Other Charges: ${formatCurrency(sale.otherCharges || 0)}</div>
            <div class="bold">Discount:      ${formatCurrency(
              sale.discount || 0
            )}</div>
            <div class="bold">Total Amount:  ${formatCurrency(
              sale.totalAmount || 0
            )}</div>
            <div class="line"></div>
    
            <div class="center bold">You saved ₹${sale.discount?.toFixed(
              2
            )} on this purchase.</div>
            <div class="center">Thank you for shopping with us!</div>
            <div class="center">This is a computer-generated receipt.</div>
            <div class="center">Generated on ${new Date().toLocaleString(
              "en-IN"
            )}</div>
          </body>
        </html>
      `;

  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      plugins: true,
    },
  });

  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(invoiceHTML)}`
  );

  printWindow.webContents.once("did-finish-load", () => {
    const printers = printWindow.webContents.getPrinters();
    const printerList = printers.map((printer) => printer.name);

    // If no printers available, show a message box
    if (printerList.length === 0) {
      dialog.showErrorBox(
        "No printers found",
        "No printers are available to print the invoice."
      );
      printWindow.close();
      return;
    }

    // Show a dialog to select a printer
    const selectedPrinterIndex = dialog.showMessageBoxSync(printWindow, {
      type: "question",
      title: "Print Invoice",
      message: "Select a printer to print the invoice:",
      buttons: printerList,
      defaultId: 0,
      cancelId: -1,
    });

    // If no printer is selected, exit early
    if (selectedPrinterIndex === -1) {
      console.error("No printer selected");
      printWindow.destroy();
      return;
    }

    // Get the selected printer name
    const printerName = printerList[selectedPrinterIndex];

    printWindow.webContents.print(
      {
        silent: true,
        printBackground: true,
        deviceName: printerName,
        margins: { marginType: "none" },
        pageSize: { width: 72 * 3 * 1000, height: 432 * 1000 },
        dpi: { horizontal: 303, vertical: 303 },
      },
      () => {
        printWindow.destroy();
      }
    );
  });
};

// Print PL report
const handlePrintPLReport = (data) => {
  // Create a new BrowserWindow for the report
  let printWindow = new BrowserWindow({
    width: 800,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Convert data into a rich HTML structure
  let htmlContent = `
        <html>
        <head>
            <title>Business Report</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
                
                * { 
                    box-sizing: border-box;
                    font-family: 'Outfit', sans-serif;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                
                body {
                    background: #f4f4f9;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                
                .container {
                    max-width: 850px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    text-align: center;
                    color: #2c3e50;
                    font-weight: 600;
                    font-size: 22px;
                }

                h2 {
                    font-size: 18px;
                    color: #2c3e50;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }

                .date-range{
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                  }
                
                .summary {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                    font-size: 14px;
                }

                th {
                    background: #2c3e50;
                    color: white;
                    font-weight: 600;
                }

                .totals {
                    font-weight: bold;
                    background: #ecf0f1;
                }

                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777;
                }

                .print-button {
                    display: block;
                    width: 100%;
                    text-align: center;
                    background: #2c3e50;
                    color: white;
                    border: none;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 20px;
                }

                .print-button:hover {
                    background: #34495e;
                }

                @media print {
                    .print-button { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📊 Business Financial Report</h1>
                <p style="text-align:center;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

                <div class="date-range">
                    <h2>Date Range</h2>
                    <p><strong>Start Date:</strong> ${data.startDate}</p>
                    <p><strong>End Date:</strong> ${data.endDate}</p>
                </div>
                <div class="summary">
                    
                    <div class="sales">
                        <h2>Sales Summary</h2>
                        <table>
                            <tr><th>Total Sales</th><td>${data.sales.sales.toLocaleString()}₹</td></tr>
                            <tr><th>Returns</th><td>${data.sales.returns.toLocaleString()}₹</td></tr>
                            <tr class="totals"><th>Net Sales</th><td>${data.sales.netSales.toLocaleString()}₹</td></tr>
                        </table>
                    </div>

                    <div class="expenses">
                        <h2>Expenses Summary</h2>
                        <table>
                            <tr><th>Total Expenses</th><td>${data.expenses.expenses.toLocaleString()}₹</td></tr>
                            <tr><th>Returns</th><td>${data.expenses.returns.toLocaleString()}₹</td></tr>
                            <tr class="totals"><th>Net Expenses</th><td>${data.expenses.netExpenses.toLocaleString()}₹</td></tr>
                        </table>
                    </div>
                </div>

                <h2>Profit Calculation</h2>
                <table>
                    <tr><th>Gross Profit</th><td>${data.grossProfit.toLocaleString()}₹</td></tr>
                    <tr class="totals"><th>Net Profit</th><td>${data.netProfit.toLocaleString()}₹</td></tr>
                </table>

                <h2>Sales by Category</h2>
                <table>
                    <tr><th>Category</th><th>Total Sales</th></tr>
                    ${data.charts.salesByCategory
                      .map(
                        (cat) =>
                          `<tr><td>${
                            cat.category
                          }</td><td>${cat.total.toLocaleString()}₹</td></tr>`
                      )
                      .join("")}
                </table>

                <h2>Expenses by Category</h2>
                <table>
                    <tr><th>Category</th><th>Total Expenses</th></tr>
                    ${data.charts.expensesByCategory
                      .map(
                        (exp) =>
                          `<tr><td>${
                            exp.category
                          }</td><td>${exp.total.toLocaleString()}₹</td></tr>`
                      )
                      .join("")}
                </table>

                <div class="footer">
                    <p>Generated by CRM Grocery Store System</p>
                    <button class="print-button" onclick="window.print()">🖨 Print Report</button>
                </div>
            </div>
        </body>
        </html>
    `;

  // Load the HTML content
  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`
  );

  // When the content is fully loaded, trigger print
  printWindow.webContents.once("did-finish-load", () => {
    printWindow.webContents.print(
      {
        silent: false,
        printBackground: true,
      },
      () => {
        printWindow.close();
      }
    );
  });
};

module.exports = {
  handlePrintReport,
  handlePrintPLReport,
  handlePrintSalesInvoice,
};
