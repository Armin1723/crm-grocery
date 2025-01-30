const { autoUpdater } = require("electron-updater");
const { mainWindow } = require("./window");

function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("checking-for-update", () => console.log("Checking for update..."));
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
}

module.exports = { checkForUpdates };
