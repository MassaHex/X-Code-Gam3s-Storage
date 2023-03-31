let apps = document.querySelector('.apps');
let appsTwo = document.querySelector('#pageTwo');
let pageThree = document.querySelector('#pageThree');
let sliderOne = document.querySelector('#sliderOne');
let sliderTwo = document.querySelector('#sliderTwo');

fetch('json/default.json').then(response => response.json()).then(games => {
    let counter = 0;
    games.forEach(game => {
        if (counter < 22) {
            counter++;
            document.getElementById('apps').innerHTML += `<div class="item" style="background: url('${game[2]}') 0% 0% / cover;" onclick="play('${game[3]}')"></div>`;
        } else {
            appsTwo.innerHTML += `<div class="item" style="background: url('${game[2]}') 0% 0% / cover;" onclick="play('${game[3]}')"></div>`;
        }
    });
});

if (localStorage.getItem('apps') === '[]') {
    localStorage.removeItem('apps');
}

function downloads() {
    if (localStorage.getItem('apps')) {
        var downloads = JSON.parse(localStorage.getItem("apps"));
        downloads.forEach(game => {
            let existingHTML = document.getElementById("pageTwo").innerHTML;
            let newItem = `<div class="item" style="background: url('${game[2]}') 0% 0% / cover;" onclick="play('${game[3]}')"></div>`;
            if (existingHTML.includes(newItem)) {
                console.log('This item already exists');
            } else {
                document.getElementById("pageTwo").innerHTML += newItem;
            }
        });
    }
}

downloads();

function play(game) {
    var play = document.getElementById('play');
    var screen = document.querySelector('iframe');
    if (play.style.display == "block") {
        play.style.display = "none";
        screen.src = "";
    } else {
        play.style.display = "block";
        screen.src = game;
    }
}

document.querySelector('.dot.one').addEventListener('click', function() {
    sliderTwo.style.display = "flex";
    sliderOne.style.display = "none";
    apps.style.animation = "slideInLeft 0.5s ease-in-out";
    apps.style.display = "grid";
    appsTwo.style.animation = "slideOutRight 0.5s ease-in-out";
    setTimeout(function() {
        appsTwo.style.display = "none";
    }, 300);
    document.querySelector('.dot.one').classList.add('active');
    document.querySelector('.dot.two').classList.remove('active');
});

document.querySelector('.dot.two').addEventListener('click', function() {
    sliderTwo.style.display = "none";
    sliderOne.style.display = "flex";
    appsTwo.style.animation = "slideInRight 0.5s ease-in-out";
    appsTwo.style.display = "grid";
    apps.style.animation = "slideOutLeft 0.5s ease-in-out";
    setTimeout(function() {
        apps.style.display = "none";
    }, 300);
    document.querySelector('.dot.one').classList.remove('active');
    document.querySelector('.dot.two').classList.add('active');
});


var currentPage = 1;
var totalPages = 3;

document.addEventListener("mousemove", function(event) {
    setTimeout(function() {
        var windowWidth = window.innerWidth;
        var threshold = 220;

        if (event.pageX > windowWidth - threshold) {
            if (currentPage < totalPages) {
                currentPage++;

                sliderTwo.style.display = "none";
                sliderOne.style.display = "flex";
                apps.style.animation = "slideOutRight 0.5s ease-in-out";
                appsTwo.style.animation = "slideInRight 0.5s ease-in-out";
                appsTwo.style.display = "grid";
                setTimeout(function() {
                    apps.style.display = "none";
                }, 300);
                document.querySelector('.dot.one').classList.remove('active');
                document.querySelector('.dot.two').classList.add('active');
            }
        } else if (event.pageX < threshold) {
            if (currentPage > 1) {
                currentPage--;

                sliderTwo.style.display = "flex";
                sliderOne.style.display = "none";
                appsTwo.style.animation = "slideOutLeft 0.5s ease-in-out";
                apps.style.animation = "slideInLeft 0.5s ease-in-out";
                apps.style.display = "grid";
                setTimeout(function() {
                    appsTwo.style.display = "none";
                }, 300);
                document.querySelector('.dot.one').classList.add('active');
                document.querySelector('.dot.two').classList.remove('active');
            }
        }
    }, 100);
});

function updateLocalStorage(key, newValue) {
    let savedata = localStorage.getItem("RetroBowl.0.savedata.ini");
    let lines = savedata.split("\n");
  
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.startsWith(`${key}=`)) {
        lines[i] = `${key}="${newValue}"`;
        break;
      }
    }
  
    savedata = lines.join("\n");
    localStorage.setItem("RetroBowl.0.savedata.ini", savedata);
}
  
function graham() {
    let tokens = prompt("Enter your coach credit token amount:");
    updateLocalStorage("coach_credit", tokens);
}
  
function salary() {
    let tokens = prompt("Enter salary cap amount:");
    updateLocalStorage("salary_cap", tokens);
}

/*if (!localStorage.getItem("intro")) {
    document.querySelector('#popup').style.display = "block";
    document.getElementById('clickbox').style.display = "block";

    document.querySelector('.close').addEventListener('click', function() {
        document.querySelector('#popup').style.display = "none";
        document.getElementById('clickbox').style.display = "none";
    });

    document.querySelector('.go').addEventListener('click', function() {
        document.querySelector('#popup').style.display = "none";
        document.getElementById('clickbox').style.display = "none";
    });

    document.getElementById('clickbox').addEventListener('click', function() {
        document.querySelector('#popup').style.display = "none";
        document.getElementById('clickbox').style.display = "none";
    });
    localStorage.setItem("intro", "true");
} else {
    document.querySelector('#popup').style.display = "none";
    document.getElementById('clickbox').style.display = "none";
}*/
if (!localStorage.getItem("youtube")) {
    document.querySelector('#popup').style.display = "block";
    document.getElementById('clickbox').style.display = "block";
  
    document.querySelector('.go').addEventListener('click', function() {
        document.querySelector('#popup').style.display = "none";
        document.getElementById('clickbox').style.display = "none";
        localStorage.setItem("youtube", "true");
    });
  } else {
    document.querySelector('#popup').style.display = "none";
    document.getElementById('clickbox').style.display = "none";
}