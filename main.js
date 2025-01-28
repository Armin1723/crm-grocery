const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const { spawn } = require("child_process");
const tcpPortUsed = require("tcp-port-used");
const path = require("path");

let mainWindow;
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
  const startURL = "http://localhost:5173";

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
  mainWindow.on('close', function (e) {
    let response = dialog.showMessageBoxSync(this, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Are you sure you want to quit?'
    });

    if(response == 1) e.preventDefault();
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
  const backendCommand = process.platform === "win32" ? "node" : "node";
  const backendArgs = ["index.js"];
  const backendPath = path.join(__dirname, "server");

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
    backendProcess.stdout?.on("data", (data) => {
      console.log(`Backend stdout: ${data}`);
    });

    // Handle stderr
    backendProcess.stderr?.on("data", (data) => {
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

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
});

ipcMain.handle("print-content", async (event, printHTML) => {
  const printWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the print content into the new window
  printWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(printHTML)}`
  );

  // Wait for the content to load, then print
  printWindow.webContents.on("did-finish-load", () => {
    printWindow.webContents.print({
      silent: false,
      printBackground: true,
    });
  });

  // Optionally close the window after printing
  printWindow.on("closed", () => {
    printWindow = null;
  });
});

// Properly clean up processes when closing
app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
