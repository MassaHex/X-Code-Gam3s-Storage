javascript: (function() {
  var popup = document.createElement('div');
  popup.style = 'display: flex; flex-direction: column; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background-color: white; border: 2px solid black; z-index: 9999; font: 13px/1.4 sans-serif;';

  var title = document.createElement('h1')
  title.textContent = 'Coal';
  
  var importDropdown = document.createElement('select');
  var defaultOption = document.createElement('option');
  defaultOption.text = 'Select Hack';
  defaultOption.disabled = true;
  defaultOption.selected = true;
  importDropdown.add(defaultOption);
  importDropdown.style.cssText = 'width: 200px !important; height: 30px !important; border-radius: 60px !important; border: 2px solid #ccc !important; color: white !important; background-color: black !important;'
  title.style.cssText = 'color: rgb(78,98,114) !important; font-weight: bold !important; border-bottom: 1px solid #ddd !important; text-align: center !important; font-size: 2em !important; margin-block-start: 0.67em !important; margin-block-end: 0.67em !important; margin-inline-start: 0.67em !important; margin-inline-end: 0.67em !important;';


  var presetOptions = [    {      name: 'Monkey Mart',      url: 'https://xcdedev.pages.dev/json/hacks/MonkeyMart.json'    },    {      name: 'Endless Truck',      url: 'https://xcdedev.pages.dev/json/hacks/EndlessTruck.json'    }, {      name: 'Crossy Road',      url: 'https://xcdedev.pages.dev/json/hacks/CrossyRoad.json'    }, {      name: 'Dig2China',      url: 'https://xcdedev.pages.dev/json/hacks/Dig2China.json'    }, {      name: 'Awesome Tanks 2',      url: 'https://xcdedev.pages.dev/json/hacks/AwesomeTanks2.json'    }, {      name: 'Merge Cyber Racers',      url: 'https://xcdedev.pages.dev/json/hacks/MergeCyberRacers.json'    }, {      name: 'Jetpack Joyride',      url: 'https://xcdedev.pages.dev/json/hacks/JetpackJoyride.json'    }];

  for (var i = 0; i < presetOptions.length; i++) {
    var option = document.createElement('option');
    option.text = presetOptions[i].name;
    option.value = presetOptions[i].url;
    importDropdown.add(option);
  }

  popup.appendChild(title);
  popup.appendChild(importDropdown);

  var importButton = document.createElement('button');
  importButton.textContent = 'Inject';
  importButton.style.cssText = 'margin: 20px !important;';
  importButton.onclick = function() {
    var importData = importDropdown.options[importDropdown.selectedIndex].value;
    if (importData) {
      try {
        fetch(importData)
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            document.cookie = data.cookies;
            for (var key in data.localStorage) {
              localStorage.setItem(key, data.localStorage[key]);
            }
            for (var key in data.sessionStorage) {
              sessionStorage.setItem(key, data.sessionStorage[key]);
            }
            alert('Hack Injected! Please reload. >=)');
          })
          .catch(function() {
            alert('Inject failed. Please report this error to my discord. =(');
          });
      } catch (e) {
        alert('Inject failed. Please report this error to my discord. =(');
      }
    }
  };
  popup.appendChild(importButton);

  var closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = 'margin: 25px !important;';
  closeButton.onclick = function() {
    popup.remove();
  };
  popup.appendChild(closeButton);

  document.body.appendChild(popup);
})();
