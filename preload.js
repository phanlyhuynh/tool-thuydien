const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    setCrawl: (title) => ipcRenderer.send('crawl', title),
    setStopCrawl: () => ipcRenderer.send('stopCrawl'),
})