const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  setCrawl: (data) => ipcRenderer.send('crawl', data),
  setStopCrawl: () => ipcRenderer.send('stopCrawl'),
  selectSaveFile: () => ipcRenderer.send('selectSaveFile'),
  getDataFromMain: () => {
    ipcRenderer.on('data-from-main', (event, data) => {
      const urlSaveFile = document.getElementById('url-save-file');
      const setButton = document.getElementById('startButton');
      const stopButton = document.getElementById('stopButton');
      const errorMessage = document.getElementById('error-message');
      console.log(data, 'aaaaaaaaaaaaaaaaaaaaaaaa')

      if (data && data.type == 'success' && data.input == 'url') {
        urlSaveFile.value = data.data
      }
      if (data && data.type == 'error') {
        errorMessage.innerText = data.message
        setButton.style.display = 'initial';
        stopButton.style.display = 'none';
      }
      if (data && data.type == 'startup') {
        const urlInput = document.getElementById('url');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const urlSaveFile = document.getElementById('url-save-file');
        const startButton = document.getElementById('startButton');

        urlInput.value = data.message.url
        usernameInput.value = data.message.username
        passwordInput.value = data.message.password
        urlSaveFile.value = data.message.urlSaveFile

        startButton.click()
      }
    });
  }
})