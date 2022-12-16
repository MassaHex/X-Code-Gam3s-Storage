var game, maxMobileAspectRatio = 1.84;

var isMobile = (function() {
  if (/Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Tabvar PC|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
})();

var isInWebAppiOSGlobal = (window.navigator.standalone === true && (new RegExp(/iPhone|iPad|iPod/i).test(navigator.userAgent)));
var isInWebAppChromeGlobal = (window.matchMedia('(display-mode: fullscreen)').matches) && (new RegExp(/Android/i).test(navigator.userAgent));

function isStandalone () {
  if (isInWebAppChromeGlobal) return true;
  return isInWebAppiOSGlobal;
};

var isIphone = (function() {
  if (/iPhone|iPod/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
})();

var isIos = (function() {
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
})();

var catsCanvas = document.getElementById('canvas');
var catsCanvasContainer = document.getElementById('game-container');

/**
 *
 * @returns {boolean}
 */
var isLandscape = function() { return window.innerWidth > window.innerHeight};

/**
 *
 * @param ratio
 * @returns {*[]}
 */
var getScreenSize = function(ratio) {
  var width, height;
  if (isMobile) {
    if (isLandscape() === true) {
      height = window.innerHeight;
      width = (height * ratio);
      if (width > window.innerWidth) {
        width = window.innerWidth;
        height = window.innerWidth / ratio;
      }
    } else {
      width = window.innerWidth;
      height = width / ratio;
      if (height > window.innerHeight) {
        height = window.innerHeight;
      }
    }
  } else {
    if (window.innerWidth > window.innerHeight) {
      height = window.innerHeight;
      width = height * ratio;
      if (width > window.innerWidth) {
        width = window.innerWidth;
        height = width / ratio;
      }
    } else {
      width = window.innerWidth;
      height = width / ratio;
    }
  }

  return [width, height];
}

/**
 *
 */
var onresize = function() {
  var size = getScreenSize(game && game.ratio());
  var width = size[0];
  var height = size[1];

  var marginTopCorrection = isMobile ? 0 : (height / 2) * 0.1;
  var marginLeftCorrection = isMobile ? 0 : (width / 2) * 0.1;

  catsCanvasContainer.style.position = 'relative';

  catsCanvasContainer.style.top = (window.innerHeight / 2) - (marginTopCorrection / 2) + 'px';
  catsCanvasContainer.style.left = (window.innerWidth / 2) - (marginLeftCorrection / 2) + 'px';
  catsCanvasContainer.style.marginTop = (-1) * (height / 2) + marginTopCorrection + 'px';
  catsCanvasContainer.style.marginLeft = (-1) * (width / 2) + marginLeftCorrection + 'px';
  catsCanvasContainer.style.width = width - marginLeftCorrection + 'px';
  catsCanvasContainer.style.height = 1 + height - marginTopCorrection + 'px';

  // mobile adjustment
  if (isMobile) {
    height = window.innerHeight
    width = window.innerWidth;
    if (window.Module && window.Module.aspect >= maxMobileAspectRatio) width = height * maxMobileAspectRatio;
    catsCanvasContainer.style.width = width - marginLeftCorrection + 'px';
    catsCanvasContainer.style.height = 1 + height - marginTopCorrection + 'px';
    catsCanvasContainer.style.top = 0;
    catsCanvasContainer.style.marginTop = 0;
    catsCanvasContainer.style.marginLeft = 0;
    catsCanvasContainer.style.left = (window.innerWidth - width) / 2 + 'px';
  }

};

/**
 *
 * @param playerInfos
 */
var onDocumentLoaded = function(playerInfos) {
  var overall = {};
  var ratioMin = window.innerWidth / window.innerHeight;
  var ratioMax = window.innerWidth / window.innerHeight;
  var ratio = Math.min(Math.max(ratioMin, window.innerWidth / window.innerHeight), ratioMax);
  var aspectRatio = isMobile ? (isLandscape() ? (window.screen.availWidth / window.screen.availHeight) : (window.screen.availHeight / window.screen.availWidth)) : maxMobileAspectRatio;
  if (isIphone) {
    //iphone xs
    aspectRatio = (window.screen.availHeight / window.screen.availWidth);

    // iphone 8
    if (aspectRatio < 1) {
      aspectRatio = (window.screen.availWidth / window.screen.availHeight);
    }
  }
  if (aspectRatio > maxMobileAspectRatio) aspectRatio = maxMobileAspectRatio;
  window.Module = {
    debug: window.testing === true,
    canvas: canvas,
    aspect: aspectRatio,
    onresize: onresize,
    brotli: false,
    //wasm: !isIos,
    wasm: true,
    isFullscreen: false,
    backend: 'https://cat-server-standalone-we.azurewebsites.net:443',
    getProductInfo: function(productId, locale) {
      //console.log('Asking product Info', productId, locale);
      if (typeof Module.products === 'undefined' || typeof Module.products[productId] == 'undefined') {
        return undefined;
      }

      var price = Module.products[productId][window.GamePix.currency];

      return {
        page: Module.backend + "/purchase/" + playerInfos.id + "/" + window.GamePix.currency + "/" + productId,
        price: parseFloat(price),
        currencySign: window.GamePix.currencySymbol,
        currency: window.GamePix.currency,
      };
    },
    ping: window.GamePix.ping,
    hook: window.GamePix.hook,
    localize: function(key, lang) {
      //console.log('localize', key, lang);
      return window.GamePix.localize(key, lang);
    },
    progress: function(stage, current, total, time) {
      var weight = {
        'bin': 0.3,
        'datafile': 0.4,
        'eval.bin': 0.2,
        'module.run': 0.1
      };

      if (total == current || total == 0) {
        overall[stage] = (weight[stage] || 0) * 100;
      } else {
        overall[stage] = (weight[stage] || 0) * current / total * 100;
      }

      overallsumm = 0;
      for (stage in overall) {
        overallsumm += overall[stage];
      }
      GamePix.loading(overallsumm);
    },
    ready: function(run) {
      GamePix.loaded().then(function() {

        // vedi che lingua assegnare
        var langToPass = window.GamePix.lang();
        if (['en', 'fr', 'de', 'ru', 'ja', 'tr', 'it', 'es', 'br', 'nl', 'ko', 'ar', 'zh'].indexOf(langToPass) === -1) {
          langToPass = 'en';
        }

        var clientId = '';
        try {
          clientId = window.GamePix.Tools.getCookie('_ga').split('.')[2] + '.' + window.GamePix.Tools.getCookie('_ga').split('.')[3];
        } catch (e) {
          console.log('cant retrieve clientId from _ga', e.message)
        }

        var qsParamsToPassInCtor = playerInfos.qsParams || window.GamePix.queryStringParams();
        if (qsParamsToPassInCtor) {
          qsParamsToPassInCtor += '&clientId=' + clientId;
        } else {
          qsParamsToPassInCtor = 'clientId=' + clientId;
        }

        var BrowserOrLauncherOrStandalone =
          window.navigator.userAgent.match(/Electron/) === null ?
            (isStandalone() ?
                (isInWebAppChromeGlobal ?
                    'standalonewebviewchrome' : 'standalonewebviewsafari'
                ) : 'Browser'
            ) : 'Launcher';

        qsParamsToPassInCtor += '&browservslauncher=' + BrowserOrLauncherOrStandalone;

        qsParamsToPassInCtor += '&gangs=true';

        //if(isStandalone()) alert(qsParamsToPassInCtor);

        run(playerInfos.name, playerInfos.id, '', langToPass, qsParamsToPassInCtor);
      });
    },
    mainReady: function(timings) {
    }
  };

  //localStorage.setItem('cats.localization_language', GamePix.lang());
  new LoaderXhr(Module.backend + "/prices", {
    success: function(response) {
      Module.products = JSON.parse(response);
    }
  });
  var assetsQuality = isMobile ? 'bin.data.startup.js' : 'bin.hd.data.startup.js';
  game = new Loader('bin-standalone.js', assetsQuality, window.Module);
  window.addEventListener('resize', function() {
    onresize();
    setTimeout(onresize, 1000);
  }, false);
  //window.onresize = onresize;

  onresize();
}

/**
 *
 */

window.addEventListener('startTheGame', function(obj) {
  //console.log('startTheGameEvent', obj.detail);
  onDocumentLoaded(obj.detail);
}, false);

// to remove with an event listener
// but for now I don't have time
var checkIfGamePixIsAvailable = setInterval(function() {
  if (window.GamePix && window.GamePix.init) {
    clearInterval(checkIfGamePixIsAvailable);
    window.GamePix.init();
  }
}, 1000)

onresize();
