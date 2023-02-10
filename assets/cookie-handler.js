// Function to set a cookie
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Function to export cookies
function ExportCookies() {
  var cookieString = "";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    cookieString += ca[i] + "\n";
  }
  var file = new Blob([cookieString], {type: 'text/plain'});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "cookies.txt";
  a.click();
}

// Function to import cookies
function ImportCookies(file) {
  var reader = new FileReader();
  reader.onload = function() {
    var lines = reader.result.split("\n");
    for (var i = 0; i < lines.length; i++) {
      if (lines[i]) {
        var parts = lines[i].split("=");
        setCookie(parts[0], parts[1], 365);
      }
    }
  };
  reader.readAsText(file);
}
