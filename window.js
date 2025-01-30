const { BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");

let mainWindow;

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

  const startURL = `file://${path.join(__dirname, "./client/dist/index.html")}`;
  mainWindow.loadURL(startURL);

  // Handle custom window controls
  ipcMain.on("minimize-window", () => mainWindow.minimize());
  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => mainWindow.close());

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

module.exports = { createWindow, mainWindow };
