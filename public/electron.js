const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const ch = require("os");
const fs = require("fs");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  //   win.loadFile('index.html')
  // console.log(
  //   "hariom shah",
  //   __dirname,
  //   `file://${path.join(__dirname, "../build/index.html")}`
  // );
  // win.loadURL(
  //   isDev
  //     ? "http://localhost:3005"
  //     : `file://${path.join(__dirname, "../build/index.html")}`
  // );

  win.loadURL("http://localhost:3005");
  // win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

  // Open the DevTools.
  win.webContents.openDevTools();
}

ipcMain.on("channel1", (e, argn) => {
  // try {
  //   fs.writeFileSync("d:\\myfile.txt", argn, "utf-8");git
  // } catch (e) {
  //   alert("Failed to save the file !");
  // }
  // console.log(argn);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });
  // win.loadURL(argn);

  win.loadURL(argn);
  // win.once("ready-to-show", () => {
  //   win.show();
  // });

  win.once("ready-to-show", () => {
    var pageSettingsSilent = {
      marginsType: 1, //No Margin
      printBackground: true,
      pageSize: {
        height: 297000,
        width: 72000,
      },
      silent: true,
    };

    win.webContents.print(pageSettingsSilent);
  });

  //   switch (process.platform) {
  //       case 'darwin':
  //       case 'linux':
  //           ch.exec(
  //               'lp ' + argn.filename, (e) => {
  //                   if (e) {
  //                       throw e;
  //                   }
  //               });
  //           break;
  //       case 'win32':
  //           ch.exec(
  //               'ptp ' + argn.filename, {
  //                   windowsHide: true
  //               }, (e) => {
  //                   if (e) {
  //                       throw e;
  //                   }
  //               });
  //           break;
  //       default:
  //           throw new Error(
  //               'Platform not supported.'
  //           );
  //   }
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
