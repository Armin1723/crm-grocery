const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");

let mainWindow;

// Function to create the main Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Open in browser
ipcMain.on("open-in-browser", (event, url) => {
  shell.openExternal(url);
});

// Initialize app
app.whenReady().then(async () => {
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
  if (backendProcess) {
    console.log("Killing backend process...");
    backendProcess.kill();
    backendProcess = null;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Handle app quit
app.on("quit", async () => {
  if (backendProcess) {
    console.log("Killing backend process on quit...");
    backendProcess.kill();
    backendProcess = null;
  }
});
