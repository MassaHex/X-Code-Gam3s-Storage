(function showChristmasTheme() {
    var css = '.winter-theme-snowman {position: fixed;left: -20px;bottom: -10px;z-index: 201;cursor: pointer;transition: transform .2s ease-in-out;transform-origin: bottom;}.body img{width: 120px;}.hat {position: absolute;top: -19px;left: -13px;}.hat img {width: 90px !important;}.head img {width: 56px;}.winter-theme-snowman:hover{transform:scale(1.1)}.winter-theme-snowman:hover .head{transform:rotate(8deg)}.winter-theme-snowman.active .hat{animation:1s hatUp}.winter-theme-snowman>g{transform:translateY(12px);transform-origin:center}.winter-theme-snowman .head {position: absolute;left: 45px;top: -28px;transition: transform .2s ease-in-out;}@keyframes hatUp{0%{transform:translate(0,0)}50%{transform:translate(-2px,-5px)}100%{transform:translate(0,0)}}@supports ((-webkit-marquee-repetition:infinite) and (object-fit:fill)) or (-webkit-overflow-scrolling:touch){circle,g,path,svg{filter:none!important}.winter-theme-snowman .eye-circle{fill:#373737}.winter-theme-snowman .body-circle{fill:#626262}.winter-theme-snowman .nose{fill:#ffa620}}.snow-bg{position:relative}.snow-bg:after{content:\'\';display:block;position:absolute;z-index:1001;top:0;left:0;right:0;bottom:0;pointer-events:none;background-image:url(https://cdn.classlink.com/production/framework/assets/images/snow-1.png),url(https://cdn.classlink.com/production/framework/assets/images/snow-2.png),url(https://cdn.classlink.com/production/framework/assets/images/snow-3.png);animation:snow 10s linear infinite}@keyframes snow{0%{background-position:0 0,0 0,0 0}50%{background-position:500px 500px,100px 200px,-100px 150px}100%{background-position:500px 1000px,200px 400px,-100px 300px}}';
    var htmlStr = '<div class="winter-theme-snowman"><div class="head"><img src="https://cdn.classlink.com/production/framework/assets/images/seasonal-vectors/christmas/snowman-head.svg"><div class="hat"><img src="https://cdn.classlink.com/production/framework/assets/images/seasonal-vectors/christmas/snowman-hat.svg"></div></div><div class="body"><img src="https://cdn.classlink.com/beta/framework/assets/images/seasonal-vectors/christmas/snowman-body.svg"></div></div>';
    var html = createElementFromString(htmlStr);

    html.onclick = function() {
        document.body.classList.toggle('snow-bg');
        html.classList.toggle('active');
        setTimeout(function() {
            html.classList.toggle('active');
        }, 1000);
    };

    addCss(css);
    addHtml(html);
})();
