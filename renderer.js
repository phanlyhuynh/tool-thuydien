const setButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const urlInput = document.getElementById('url');
const machineInput = document.getElementById('machine');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
// const timeSelect = document.getElementById('time');
const urlSaveFile = document.getElementById('url-save-file');
const showPassword = document.getElementById('showPassword');
const selectSaveFile = document.getElementById('select-save-file');

const errorMessage = document.getElementById('error-message');


stopButton.style.display = 'none';
setButton.addEventListener('click', () => {
  setButton.style.display = 'none';
  stopButton.style.display = 'initial';
  errorMessage.innerText = ''

  const data = {
    time: 1,
    username: usernameInput.value,
    password: passwordInput.value,
    url: urlInput.value,
    urlSaveFile: urlSaveFile.value,
    machine: machineInput.value.replace(/\s/g, '').toUpperCase() || 'MAY1'
  }

  window.electronAPI.setCrawl(data);
});
stopButton.addEventListener('click', () => {
  setButton.style.display = 'initial';
  stopButton.style.display = 'none';
  window.electronAPI.setStopCrawl();
});

selectSaveFile.addEventListener('click', (event) => {
  window.electronAPI.selectSaveFile()
})
urlSaveFile.addEventListener('click', (event) => {
  window.electronAPI.selectSaveFile()
})
showPassword.addEventListener('click', (event) => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
})
window.onload = async function () {
  const data = await window.electronAPI.getDataFromMain();
  console.log(data, 'hehe', data && data.type == 'success' && data.input == 'url');
  if (data && data.type == 'success' && data.input == 'url') {
    urlSaveFile.value = data.data
  }
  if (data && data.type == 'error') {
    errorMessage.innerText = data.message
    setButton.style.display = 'initial';
    stopButton.style.display = 'none';
  }
}
// window.electronAPI.getDataFromMain((data) => {
//   console.log('data rerednder', data)
// })