 function getCookies() {
    var mainSave = {};
  
    localStorageSave = Object.entries(localStorage);
  
    for (let entry in localStorageSave) {
      if (localStorageDontSave.includes(localStorageSave[entry][0])) {
        localStorageSave.splice(entry, 1);
      }
    }
  
    localStorageSave = btoa(JSON.stringify(localStorageSave));
  
    mainSave.localStorage = localStorageSave;
  
    cookiesSave = document.cookie;
  
    cookiesSave = btoa(cookiesSave);
  
    mainSave.cookies = cookiesSave;
  
    mainSave = btoa(JSON.stringify(mainSave));
  
    mainSave = CryptoJS.AES.encrypt(mainSave, "save").toString();
  
    return mainSave;
  }
  
  function ExportCookies() {
    var data = new Blob([getCookies()]);
    var dataURL = URL.createObjectURL(data);
  
    var fakeElement = document.createElement("a");
    fakeElement.href = dataURL;
    fakeElement.download = "games.save";
    fakeElement.click();
    URL.revokeObjectURL(dataURL);
  }
  
  function getMainSaveFromUpload(data) {
    data = CryptoJS.AES.decrypt(data, "save").toString(CryptoJS.enc.Utf8);
  
    var mainSave = JSON.parse(atob(data));
    var mainLocalStorageSave = JSON.parse(atob(mainSave.localStorage));
    var cookiesSave = atob(mainSave.cookies);
  
    for (let item in mainLocalStorageSave) {
      localStorage.setItem(mainLocalStorageSave[item][0], mainLocalStorageSave[item][1]);
    }
  
    document.cookie = cookiesSave;
  }
  
  function ImportCookies() {
    var hiddenUpload = document.querySelector(".hiddenUpload");
    hiddenUpload.click();
  
    hiddenUpload.addEventListener("change", function (e) {
      var files = e.target.files;
      var file = files[0];
  
      if (!file) {
        return;
      }
  
      var reader = new FileReader();
  
      reader.onload = function (e) {
        getMainSaveFromUpload(e.target.result);
  
        var uploadResult = document.querySelector(".uploadResult");
        uploadResult.innerText = "Uploaded save!";
        uploadResult.style.display = "initial";
        setTimeout(function () {
          uploadResult.style.display = "none";
        }, 3000);
      };
  
      reader.readAsText(file);
    });
  }
