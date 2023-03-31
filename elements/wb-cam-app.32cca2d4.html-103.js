Polymer({is:"google-js-api",behaviors:[Polymer.IronJsonpLibraryBehavior],properties:{libraryUrl:{type:String,value:"https://apis.google.com/js/api.js?onload=%%callback%%"},notifyEvent:{type:String,value:"js-api-load"}},get api(){return gapi}});
//# sourceURL=https://www.cam-recorder.com/elements/wb-cam-app.32cca2d4.html-103.js
