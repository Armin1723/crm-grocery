const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const { spawn } = require("child_process");
const tcpPortUsed = require("tcp-port-used");
const path = require("path");
const fs = require("fs");

let mainWindow;
let backendProcess;
let PORT = 8000;

// Function to create the main Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 600,
    minHeight: 600,
    titleBarStyle: "hiddenInset",
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      nativeWindowOpen: false,
    },
  });

  // const startURL = `file://${path.join(__dirname, "./client/dist/index.html")}`;
  const startURL = `http://localhost:5173`;
  mainWindow.loadURL(startURL);

  // Handle custom window controls
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  // Send app version to frontend
  ipcMain.on("get-app-version", (event) => {
    event.returnValue = app.getVersion();
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });

  // Add a custom confirmation dialog before quitting
  mainWindow.on("close", function (e) {
    let response = dialog.showMessageBoxSync(this, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "Are you sure you want to quit?",
    });

    if (response == 1) e.preventDefault();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Open in browser
ipcMain.on("open-in-browser", (event, url) => {
  shell.openExternal(url);
});

// Function to start your backend server
async function startBackend() {
  // Check if the backend process is already running
  const isPortInUse = await tcpPortUsed.check(PORT);
  if (isPortInUse) {
    console.log("Backend is already running on port", PORT);
    return;
  }

  // Use process.platform to determine the correct node command
  const backendCommand = process.platform === "win32" ? "node.exe" : "node";
  const backendArgs = ["index.js"];
  const backendPath = path.join(__dirname, "./server");

  console.log("Starting backend with command:", backendCommand);
  console.log("Backend args:", backendArgs);
  console.log("Backend working directory:", backendPath);

  try {
    backendProcess = spawn(backendCommand, backendArgs, {
      cwd: backendPath,
      stdio: ["inherit", "pipe", "pipe"],
      shell: true,
    });

    // Handle stdout
    backendProcess.stdout.on("data", (data) => {
      console.log(`Backend stdout: ${data}`);
    });

    // Handle stderr
    backendProcess.stderr.on("data", (data) => {
      console.error(`Backend stderr: ${data}`);
    });

    backendProcess.on("error", (err) => {
      console.error("Failed to start backend server:", err);
    });

    backendProcess.on("close", (code) => {
      console.log(`Backend process exited with code ${code}`);
      if (code !== 0) {
        // Restart the backend process if it exits with a non-zero code
        console.log("Attempting to restart backend...");
        startBackend();
      }
    });
  } catch (error) {
    console.error("Error starting backend:", error);
  }
}

// Initialize app
app.whenReady().then(async () => {
  await startBackend();
  createWindow();

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("checking-for-update", () => {
    console.log("Checking for update...");
  });

  autoUpdater.on("update-available", () => {
    console.log("Update available. Downloading...");
    mainWindow.webContents.send("update-log", "update-available");
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("Update downloaded. Quitting and installing...");
    mainWindow.webContents.send("update-log", "update-downloaded");
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("error", (error) => {
    console.error("Error in auto-updater:", error);
    mainWindow.webContents.send("update-log", error.message);
  });

  app.on("activate", async () => {
    if (mainWindow === null) {
      await startBackend();
      createWindow();
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
});

// Print content
ipcMain.on("print-content", async (event, printHTML) => {
  try {
    let printWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      nativeWindowOpen: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Load the content into the print window
    // await printWindow.loadURL(
    //   `data:text/html;charset=utf-8,${encodeURIComponent(printHTML)}`
    // );

    // Make sure the directory exists
    const dirPath = path.join(__dirname, "./tmp");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath); // Create the tmp folder if it doesn't exist
    }

    // Create the file path
    const filePath = path.join(dirPath, "file.html");

    // Write the content to the file
    fs.writeFileSync(filePath, printHTML);
    await printWindow.loadFile(filePath);

    // Wait for the content to load before printing
    printWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        printWindow.webContents.print({ silent: false, printBackground: true });
      }, 1000);
    });
  } catch (err) {
    console.error("Error printing content:", err.message);
  }
});

ipcMain.on(
  "print-report",
  (
    event,
    { title, content, startDate, endDate, tailwindCSSStyles, tailwindCSS }
  ) => {
    let printWindow = new BrowserWindow({
      width: 800,
      height: 1000,
      show: false, // Hide until ready
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
        <style>
          ${tailwindCSS}
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
  }
);

// Properly clean up processes when closing
app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
