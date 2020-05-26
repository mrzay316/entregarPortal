const electron = require('electron');
const ipc = require('electron').ipcRenderer;

const deliverBtn = document.getElementById('deliverBtn');

deliverBtn.addEventListener('click', (e) => {
  const saoNumber = document.getElementById('saoNumber').value;
  const processPortal = document.getElementById('processPortal')
    .checked;
  const processBroadband = document.getElementById('processBroadband')
    .checked;

  const deliverOptions = {
    saoNumber: saoNumber,
    processPortal: processPortal,
    processBroadband: processBroadband,
  };

  ipc.send('startDeliverPreparation', deliverOptions);
});
ipc.on('processStarted', (e, configOptions) => {
  const deliverBtn = document.getElementById('deliverBtn');
  deliverBtn.setAttribute('disabled', 'disabled');

  const progressBar = document.getElementById('progressBar');
  progressBar.classList.remove('hide-element');
  progressBar.classList.add('show-element');

  const iconSuccess = document.getElementById('iconSuccess');
  iconSuccess.classList.remove('show-element');
  iconSuccess.classList.add('hide-element');

  const iconFail = document.getElementById('iconFail');
  iconFail.classList.remove('show-element');
  iconFail.classList.add('hide-element');

  const progressList = document.getElementById('progressList');
  progressList.innerHTML = '';
});
ipc.on('updateProgress', (e, message) => {
  const progressList = document.getElementById('progressList');
  const listElement = document.createElement('li');
  messageString = String.fromCharCode.apply(
    null,
    new Uint8Array(message),
  );
  listElement.innerHTML =
    `<p>
          <span class="icon">
                <i
                  class="fas fa-angle-double-right has-text-primary has-text-weight-light"
                ></i>
              </span>
          <span class="has-text-weight-light">` +
    messageString +
    `</span> </p>`;
  progressList.append(listElement);
});

ipc.on('finishedOK', (e) => {
  const deliverBtn = document.getElementById('deliverBtn');
  deliverBtn.removeAttribute('disabled');

  const progressBar = document.getElementById('progressBar');
  progressBar.classList.remove('show-element');
  progressBar.classList.add('hide-element');

  const iconSuccess = document.getElementById('iconSuccess');
  iconSuccess.classList.remove('hide-element');
  iconSuccess.classList.add('show-element');

  const iconFail = document.getElementById('iconFail');
  iconFail.classList.remove('show-element');
  iconFail.classList.add('hide-element');
});
ipc.on('finishedError', (e) => {
  const deliverBtn = document.getElementById('deliverBtn');
  deliverBtn.removeAttribute('disabled');

  const progressBar = document.getElementById('progressBar');
  progressBar.classList.remove('show-element');
  progressBar.classList.add('hide-element');

  const iconSuccess = document.getElementById('iconSuccess');
  iconSuccess.classList.remove('show-element');
  iconSuccess.classList.add('hide-element');

  const iconFail = document.getElementById('iconFail');
  iconFail.classList.remove('hide-element');
  iconFail.classList.add('show-element');
});
