Polymer({is:"opaque-animation",behaviors:[Polymer.NeonAnimationBehavior],configure:function(e){var i=e.node;return this._effect=new KeyframeEffect(i,[{opacity:"1"},{opacity:"1"}],this.timingFromConfig(e)),i.style.opacity="0",this._effect},complete:function(e){e.node.style.opacity=""}});
//# sourceURL=https://www.cam-recorder.com/elements/wb-cam-app.32cca2d4.html-74.js
