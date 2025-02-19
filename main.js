const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  Tray,
  Menu,
  Notification,
  nativeImage,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const { handlePrintSalesInvoice, handlePrintReport } = require("./print");
const log = require("electron-log");

let mainWindow;
let isQuitting = false;

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
      devTools: !app.isPackaged,
      enableAutofill: true,
      spellcheck: true,
    },
  });

  const startURL = app.isPackaged
    ? `file://${path.join(__dirname, "./client/dist/index.html")}`
    : `http://localhost:5173`;
  mainWindow.loadURL(startURL);

  // Handle custom window controls
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("minimize-to-tray", () => {
    mainWindow.hide();
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
    if (!isQuitting) {
      let response = dialog.showMessageBoxSync(this, {
        type: "question",
        buttons: ["Yes", "No"],
        title: "Confirm",
        message: "Are you sure you want to quit?",
      });

      if (response == 1) e.preventDefault();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Open in browser
ipcMain.on("open-in-browser", (event, url) => {
  shell.openExternal(url);
});

// Check for updates (triggered from frontend)
ipcMain.on("check-updates", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

// Create tray icon
let tray = null;
const createTray = () => {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "icon.png")
    : path.join(__dirname, "build", "icon.png");
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip("CRM Application");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show App",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Check for Updates",
      click: () => {
        autoUpdater.checkForUpdatesAndNotify();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
};

app.whenReady().then(async () => {
  createWindow();
  createTray();

  // Attach logger to autoUpdater
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = "info";
  log.info("AutoUpdater is starting...");

  // Set up all event listeners
  autoUpdater.on("checking-for-update", () => {
    log.info("Checking for update...");
    console.log("Checking for update...");
  });

  autoUpdater.on("update-available", () => {
    log.info("Update available. Downloading...");
    console.log("Update available. Downloading...");
    mainWindow.webContents.send("update-log", "update-available");
  });

  autoUpdater.on("update-not-available", () => {
    log.info("No updates available.");
    console.log("No updates available.");
    mainWindow.webContents.send("update-log", "update-not-available");
    new Notification({
      title: "CRM Application",
      body: "No updates available",
      icon: path.join(process.resourcesPath, "icon.png"),
    }).show();
  });

  autoUpdater.on("update-downloaded", () => {
    log.info("Update downloaded. Quitting and installing...");
    console.log("Update downloaded. Quitting and installing...");
    mainWindow.webContents.send("update-log", "update-downloaded");
    isQuitting = true;
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on("error", (error) => {
    log.error("Error in auto-updater:", error);
    console.error("Error in auto-updater:", error);
    mainWindow.webContents.send("update-log", error.message);
  });

  autoUpdater.checkForUpdatesAndNotify();

  app.on("activate", async () => {
    if (mainWindow === null) {
      createWindow();
      autoUpdater.checkForUpdatesAndNotify();
    }
  });
});

//print report
ipcMain.on("print-report", (event, report) => handlePrintReport(report));

// Print sales invoice
ipcMain.on("print-sales-invoice", (event, sale) =>
  handlePrintSalesInvoice(sale)
);

// Properly clean up processes when closing
app.on("window-all-closed", async () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
