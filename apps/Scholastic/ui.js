var loadstart,
    // Security fixes
    isLocal,
    // References
    elemapp,
    app,
    body,
    elemSelect;

function start() {
  // Don't double start
  if(window.loadstart) return;
  window.loadstart = true;
  
  // Know whether this is being run locally
  setLocalStatus();
  
  // Quick UI references
  setReferences();
  
  // Map selection
  setMapSelector();
  
  // Level editor
  setLevelEditor();
  
  // Make lots of friends
  setCheats();
}

function setLocalStatus() {
  window.isLocal = window.location.origin == "file://";
}

function setReferences() {
  // Set the app references (elemapp is not the same as the content window)
  window.elemapp = document.getElementById("app");
  window.app = window.elemapp.contentWindow;
  // Local apps may not allow contentWindow shenanigans
  if(!isLocal)
    window.app.parentwindow = window;
  
  window.body = document.body;
  window.elemSelect = document.getElementById("in_mapselect");
}

function setMapSelector(timed) {
  // If this isn't ready and hasn't tried before, try it again
  if(!window.elemSelect && !timed)
    setTimeout(function() {
      setMapSelector(true);
    }, 350);
  
  // Get HTML each of the 32 levels' blocks in order
  var innerHTML = "",
      i, j;
  for(i = 1; i <= 8; ++i)
    for(j = 1; j <= 4; ++j)
      innerHTML += createAdderMap(i, j);
  
  // Add that HTML to #in_mapselect, along with a big one for random maps
  elemSelect.innerHTML += innerHTML + createAdderBigMap("Map Generator!", "setappMapRandom");
  
  // If this isn't local, actually responding to the app loading maps is doable
  // See load.js
  if(!isLocal) {
    // This will allow for onMapLoad
    app.parentwindow = window;
    
    // If the app already has a map, set the class to be loaded
    var elem;
    for(i = 1; i <= 8; ++i)
      for(j = 1; j <= 4; ++j) {
        console.log("World" + i + String(j), app["World" + i + String(j)]);
        if(app["World" + i + String(j)] && (elem = document.getElementById("maprect" + i + "," + j)))
          elem.className = "maprect";
      }
  }
}

function createAdderMap(i, j) {
  var adder = "";
  adder += "<div class='maprectout'>";
  adder += "<div id='maprect" + i + "," + j;
  adder += "' class='maprect" +  (isLocal ? "" : " off") + "' onclick='setappMap(" + i + "," + j + ")'>";
  adder += i + "-" + j;
  adder += "</div></div>";
  return adder;
}

function createAdderBigMap(name, onclick, giant) {
  var adder = "";
  adder += "<div class='maprectout'>";
  adder += "<div class='maprect big " + (giant ? "giant" : "" ) + "' onclick='" + onclick + "()'>";
  adder += name;
  adder += "</div></div>";
  return adder;
}

function setappMap(one, two) {
  // If it hasn't been loaded yet, don't do anything
  if(document.getElementById("maprect" + one + "," + two).className != "maprect")
    return;
  
  // Otherwise go to the map
  app.postMessage({
    type: "setMap",
    map: [one, two]
  }, "*");
  app.focus();
}

// See load.js
function onMapLoad(one, two) {
  var elem = document.getElementById("maprect" + one + "," + two);
  if(elem)
    elem.className = "maprect";
}

function setappMapRandom() {
  app.postMessage({
    type: "setMap",
    map: ["Random", "Overworld"]
  }, "*");
  app.focus();
}

function setLevelEditor() {
  var out = document.getElementById("in_editor"),
      blurb = "Why use Nintendo's?<br />";
  button = createAdderBigMap("Make your<br />own levels!", "startEditor", true);
  out.innerHTML += blurb + button + "<br />You can save these as text files when you're done.";
}

function startEditor() {
  app.postMessage({
    type: "startEditor"
  }, "*");
  app.focus();
}


function setCheats() {
  var i;
  console.log("Hi, thanks for playing Full Screen Mario! I see you're using the console.");
  console.log("There's not really any way to stop you from messing around so if you'd like to know the common cheats, enter \"displayCheats()\" here.");
  console.log("If you'd like, go ahead and look around the source code. There are a few surprises you might have fun with... ;)");
  console.log("http://www.github.com/DiogenesTheCynic/FullScreenMario");
  window.cheats = {
    Change_Map: "app.setMap([#,#] or #,#);",
    Change_Map_Location: "app.shiftToLocation(#);",
    Fast_Forward: "app.fastforward(amount; 1 by default);",
    Life: "app.gainLife(# amount or Infinity)",
    Low_Gravity: "app.mario.gravity = app.gravity /= 2;",
    Lulz: "app.lulz();",
    Random_Map: "app.setMapRandom();",
    Shroom: "app.marioShroom(app.mario)",
    Star_Power: "app.marioStar(app.mario)",
    Unlimited_Time: "app.data.time.amount = Infinity;"
  }
  cheatsize = 0;
  for(var i in cheats)
    cheatsize = Math.max(cheatsize, i.length);
}

function displayCheats() {
  console.log("These are stored in the global 'cheats' object, by the way.");
  for(i in cheats)
    printCheat(i, cheats[i]);
  return "Have fun!";
}

function printCheat(name, text) {
  for (i = cheatsize - name.length; i > 0; --i)
    name += ".";
  console.log(name.replace("_", " ") + "...... " + text);
}
