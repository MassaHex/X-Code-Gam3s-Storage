Polymer({is:"iron-pages",behaviors:[Polymer.IronResizableBehavior,Polymer.IronSelectableBehavior],properties:{activateEvent:{type:String,value:null}},observers:["_selectedPageChanged(selected)"],_selectedPageChanged:function(e,a){this.async(this.notifyResize)}});
//# sourceURL=https://www.cam-recorder.com/elements/wb-cam-app.32cca2d4.html-9.js
