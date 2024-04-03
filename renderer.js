const setButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const timeSelect = document.getElementById('time');
stopButton.style.display = 'none';
setButton.addEventListener('click', () => {
  const time = timeSelect.value;
  setButton.style.display = 'none';
  stopButton.style.display = 'initial';
  window.electronAPI.setCrawl(time);
});
stopButton.addEventListener('click', () => {
  setButton.style.display = 'initial';
  stopButton.style.display = 'none';
  window.electronAPI.setStopCrawl();
});
