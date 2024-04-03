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
          });
    }
})