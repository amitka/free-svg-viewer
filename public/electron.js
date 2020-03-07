// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = require("electron-is-dev");
const appMenu = require("./appMenu");
const hiTree = require("./hiTree");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  // Show chrome developer tools when in dev environment.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // APP MENU
  const template = appMenu.template;
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// ------------------//
//      EVENTS      //
// -----------------//

//Renderer Process Events (from React)
ipcMain.on("rendererEvent", (event, data) => {
  console.log("rendererEvent..", data);
  if (data.appIsReady) {
    //LOAD ICONS FOLDER PATH FROM FILE
    getDefaultPathFromFile();
  }
});

// App Menu Events
appMenu.events.on("openDirEvent", function() {
  // OPEN FOLDER DIALOG
  dialog
    .showOpenDialog(mainWindow, {
      title: "Select your icons root directory...",
      defaultPath: "",
      properties: ["openDirectory"]
    })
    .then(result => {
      if (result.filePaths[0]) {
        const path = result.filePaths[0];
        buildFileTreeFromPath(path);
        writeDefaultPathToFile(path);
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// ------------------//
//      METHODS     //
// -----------------//

const buildFileTreeFromPath = path => {
  // ONLY SVG
  const onlySvgFilter = /\.(svg)$/i;
  //
  const fileTree = hiTree.build(path, [], onlySvgFilter);
  //
  const json = JSON.stringify(fileTree);
  fs.writeFile("tree.json", json, "utf8", () => {
    console.log("file tree was changed..");
  });
  //
  const fileTreeData = { path: path, tree: fileTree };
  console.log("fire event iconsFolderEvent..", fileTreeData);
  mainWindow.webContents.send("iconsFolderEvent", fileTreeData);
};

const getDefaultPathFromFile = () => {
  fs.readFile("./path.txt", "utf8", (err, data) => {
    if (err) {
      console.log("path.txt was not found...", err);
      mainWindow.webContents.send("iconsFolderEvent", {});
    }
    if (data !== undefined) {
      console.log("path.txt= ", data);
      buildFileTreeFromPath(data);
    }
  });
};

const writeDefaultPathToFile = str => {
  fs.writeFile("./path.txt", str, "utf8", function() {
    console.log("path.txt was changed...");
  });
};
