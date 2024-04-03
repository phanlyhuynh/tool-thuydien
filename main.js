const { app, BrowserWindow, ipcMain } = require("electron/main");
const fs = require("fs");
const path = require("node:path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  let setIntervalID;
  ipcMain.on("crawl", (event, time) => {
    console.log(app.getPath("documents"));
    setIntervalID = setInterval(function () {
      console.log("setInterval", time);

      const folderPath = path.join(app.getPath("documents"), "tool-thuydien");
      if (!fs.existsSync(folderPath)) {
        fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating folder:", err);
          } else {
            console.log("folderCreated");
          }
        });
      } else {
        console.log(folderPath);
        const filePath = path.join(folderPath, new Date() + ".txt");
        fs.writeFile(filePath, "data", "utf-8", (err) => {
          if (err) {
            console.error("Error saving data:", err);
          } else {
            console.log("Data saved successfully");
          }
        });
      }
    }, time * 1000);
  });

  ipcMain.on("stopCrawl", (event) => {
    console.log("stop crawl");
    clearInterval(setIntervalID);
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
