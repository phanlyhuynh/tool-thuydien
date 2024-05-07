const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const fs = require("fs");
const path = require("node:path");
const axios = require('axios');
const dayjs = require('dayjs');

require('dotenv').config();

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    const dataSavePath = path.join(app.getAppPath(), 'data.txt')
    if (fs.existsSync(dataSavePath)) {
      fs.readFile(dataSavePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Lỗi khi đọc file:', err);
          return;
        }
        console.log(JSON.parse(data), 'haha')
        mainWindow.webContents.send('data-from-main', {
          type: 'startup',
          message: JSON.parse(data)
        })
      });
    }
  });

  let setIntervalID;
  ipcMain.on("crawl", (event, data) => {
    const options = {
      auth: {
        username: data.username,
        password: data.password
      }
    }

    if (data.urlSaveFile == '' || data.username == '' || data.password == '' || data.url == '') {
      mainWindow.webContents.send('data-from-main', {
        type: 'error',
        message: 'Có lỗi xảy ra. Kiểm tra thông tin đã nhập!'
      })

      return
    }

    const dataSavePath = path.join(app.getAppPath(), 'data.txt')
    if (!fs.existsSync(dataSavePath)) {
      fs.unlink(dataSavePath, (err) => {
        if (err) {
          console.error('Lỗi khi xóa file:', err);
          return;
        }
        console.log('File đã được xóa thành công.');
      });
      
    }

    fs.writeFile(dataSavePath, JSON.stringify(data), "utf-8", (err) => {
      if (err) {
        console.error("Error saving data:", err);
      } else {
        console.log("Data saved successfully");
      }
    });

    console.log(dataSavePath, 'dataSavePath')
    setIntervalID = setInterval(async function () {
      try {
        const response = await axios.post(`${process.env.API_URL}/quantrac`, data, options);
        let text = '';
        await response.data.forEach(async (item) => {
          console.log(item, 'item')
          let row = '';
          await item.noi_dung.forEach(async noidung => {
            row += dayjs(noidung.thoi_gian, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm') + ',';
            row += noidung.noi_dung.thuong_luu ? noidung.noi_dung.thuong_luu[2] : 0;
            row += ',';
            row += noidung.noi_dung.ha_luu ? noidung.noi_dung.ha_luu[2] : 0;
            row += ',';

            await noidung.noi_dung.to_may.forEach(tomay => {
              tomay.forEach(tm => {
                if (tm[1] == 'CONGSUAT') {
                  row += tm[2] ? tm[2] : 0;
                  row += ',';
                }
                if (tm[1] == 'LUULUONG') {
                  row += tm[2] ? tm[2] : 0;
                  row += ',';
                }
              })
            })

            row += noidung.noi_dung.qua_tran ? noidung.noi_dung.qua_tran[2] : 0;
            row += '\n'
          })
          text += row;
        });
        if (!fs.existsSync(data.urlSaveFile)) {
          fs.writeFile(data.urlSaveFile, text, "utf-8", (err) => {
            if (err) {
              console.error("Error saving data:", err);
            } else {
              console.log("Data saved successfully");
            }
          });
        } else {
          fs.appendFile(data.urlSaveFile, text, (err) => {
            if (err) {
              console.error('Error saving data:', err);
            } else {
              console.log('Data saved successfully!');
            }
          });
        }
      } catch (error) {
        console.log(error)
      }
    }, data.time * 1000 * 60); // (phut)
  });

  ipcMain.on("stopCrawl", (event) => {
    console.log("stop crawl");
    clearInterval(setIntervalID);
  });

  ipcMain.on("selectSaveFile", (event) => {
    console.log("selectSaveFile");
    dialog.showSaveDialog({ defaultPath: 'example.txt' }).then(result => {
      if (!result.canceled && result.filePath) {
        // Lưu file
        console.log('File đã được lưu tại:', result.filePath);
        mainWindow.webContents.send('data-from-main', {
          type: 'success',
          input: 'url',
          data: result.filePath
        })
      }
    }).catch(err => {
      console.log(err);
    });
  });

  mainWindow.loadFile("index.html");
}

app.setLoginItemSettings({
  openAtLogin: true,
})

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
