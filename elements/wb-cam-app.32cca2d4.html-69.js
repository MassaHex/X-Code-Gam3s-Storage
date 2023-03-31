define("components/w69b-es6/audio-context-pool.js",["exports"],function(e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=[],o={};o.acquire=function(){return n.length?n.pop():new window.AudioContext},o.release=function(e){n.push(e)},e.default=o});
//# sourceURL=https://www.cam-recorder.com/elements/wb-cam-app.32cca2d4.html-69.js
