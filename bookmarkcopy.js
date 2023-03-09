javascript:(function() {
  var popup = document.createElement('div');
  popup.style = 'display: flex; flex-direction: column; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background-color: white; border: 2px solid black; z-index: 9999;';

  var exportButton = document.createElement('button');
  exportButton.textContent = 'Export';
  exportButton.style = 'margin-bottom: 10px;';
  exportButton.onclick = function() {
    var exportData = JSON.stringify({
      cookies: document.cookie,
      localStorage: localStorage,
      sessionStorage: sessionStorage
    });
    var exportLink = document.createElement('a');
    exportLink.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportData);
    exportLink.download = 'data.json';
    exportLink.click();
  };
  popup.appendChild(exportButton);

  var importButton = document.createElement('button');
  importButton.textContent = 'Import';
  importButton.onclick = function() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = function(event) {
      var reader = new FileReader();
      reader.onload = function(event) {
        try {
          var data = JSON.parse(event.target.result);
          document.cookie = data.cookies;
          for (var key in data.localStorage) {
            localStorage.setItem(key, data.localStorage[key]);
          }
          for (var key in data.sessionStorage) {
            sessionStorage.setItem(key, data.sessionStorage[key]);
          }
          alert("Import successful!");
        } catch (e) {
          alert("Import failed. Please make sure you are using valid import data.");
        }
      };
      reader.readAsText(event.target.files[0]);
    };
    fileInput.click();
  };
  popup.appendChild(importButton);

  var closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.style = 'position: absolute; top: 5px; right: 5px;';
  closeButton.onclick = function() {
    popup.remove();
  };
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
})();