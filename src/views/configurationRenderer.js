const electron = require('electron');
const ipc = require('electron').ipcRenderer;
const querystring = require('querystring');
let query = querystring.parse(global.location.search);
let configFile = JSON.parse(query['?configFile']);

document.getElementById('deliveryPath').value =
  configFile.deliveryPath;
document.getElementById('saoDeliveryPath').value =
  configFile.saoDeliveryPath;
document.getElementById('sourceCodePath').value =
  configFile.sourceCodePath;

const cancelBtn = document.getElementById('cancelBtn');
const saveConfigurationBtn = document.getElementById(
  'saveConfigurationBtn',
);

cancelBtn.addEventListener('click', (e) => {
  ipc.send('closeConfigWindow');
});

saveConfigurationBtn.addEventListener('click', (e) => {
  const deliveryPath = document.getElementById('deliveryPath').value;
  const saoDeliveryPath = document.getElementById('saoDeliveryPath')
    .value;
  const sourceCodePath = document.getElementById('sourceCodePath')
    .value;

  const configOptions = {
    deliveryPath: deliveryPath,
    saoDeliveryPath: saoDeliveryPath,
    sourceCodePath: sourceCodePath,
  };

  ipc.send('saveConfigOptions', configOptions);
});
