function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oSandBoxMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = true;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(FPS);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        

        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };
    
    this.preloaderReady = function(){
        this._loadImages();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }

        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

        if(_iCurResource === RESOURCE_TO_LOAD){
            this._onPreloaderComplete();
        }
    };
    
    this._initSounds = function(){
    
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'missile_explosion',loop:false,volume:1, ingamename: 'missile_explosion'});
        aSoundsInfo.push({path: './sounds/',filename:'missile_launch',loop:false,volume:1, ingamename: 'missile_launch'});
        aSoundsInfo.push({path: './sounds/',filename:'missile_sink',loop:false,volume:1, ingamename: 'missile_sink'});
        aSoundsInfo.push({path: './sounds/',filename:'missile_torpedo',loop:false,volume:1, ingamename: 'missile_torpedo'});
        aSoundsInfo.push({path: './sounds/',filename:'missile_water',loop:false,volume:1, ingamename: 'missile_water'});
        aSoundsInfo.push({path: './sounds/',filename:'air_strike',loop:false,volume:1, ingamename: 'air_strike'});
        aSoundsInfo.push({path: './sounds/',filename:'sonar',loop:false,volume:1, ingamename: 'sonar'});
        
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded()
                                                        });
        }
        
    };             
       
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_info","./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_not","./sprites/but_not.png");
        s_oSpriteLibrary.addSprite("but_shuffle","./sprites/but_shuffle.png");
        s_oSpriteLibrary.addSprite("but_delete","./sprites/but_delete.png");
        s_oSpriteLibrary.addSprite("but_rotate","./sprites/but_rotate.png");
        s_oSpriteLibrary.addSprite("but_classic","./sprites/but_classic.png");
        s_oSpriteLibrary.addSprite("but_advanced","./sprites/but_advanced.png");
        s_oSpriteLibrary.addSprite("but_help","./sprites/but_help.png");
        
        s_oSpriteLibrary.addSprite("bg_sandbox_menu","./sprites/bg_sandbox_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mode","./sprites/bg_mode.jpg");
        

        s_oSpriteLibrary.addSprite("score_panel","./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("highlight","./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("occupied_area","./sprites/occupied_area.png");
        
        s_oSpriteLibrary.addSprite("control_panel","./sprites/control_panel.png");
        s_oSpriteLibrary.addSprite("cell_control","./sprites/cell_control.png");
        s_oSpriteLibrary.addSprite("cell_battle","./sprites/cell_battle.png");
        
        for(var i=0; i<6; i++){
            s_oSpriteLibrary.addSprite("fill_"+i,"./sprites/ships/fill_"+i+".png");
            s_oSpriteLibrary.addSprite("shape_"+i,"./sprites/ships/shape_"+i+".png");
            s_oSpriteLibrary.addSprite("ship"+i,"./sprites/ships/ship"+i+".png");
            s_oSpriteLibrary.addSprite("ship"+i+"_3d","./sprites/ships/ship"+i+"_3d.png");
        };
        
        s_oSpriteLibrary.addSprite("final_explosion","./sprites/final_explosion.png");
        s_oSpriteLibrary.addSprite("torpedo","./sprites/torpedo.png");
        s_oSpriteLibrary.addSprite("missile","./sprites/missile.png");
        s_oSpriteLibrary.addSprite("missile_reactor","./sprites/missile_reactor.png");
        s_oSpriteLibrary.addSprite("missile_smoke","./sprites/missile_smoke.png");
        s_oSpriteLibrary.addSprite("missile_water","./sprites/missile_water.png");
        s_oSpriteLibrary.addSprite("missile_explosion","./sprites/missile_explosion.png");
        s_oSpriteLibrary.addSprite("fire","./sprites/fire.png");
        
        for(var i=0; i<=37; i++){
            s_oSpriteLibrary.addSprite("surface_"+i,"./sprites/sea_caustics/surface_"+i+".jpg");
        }
        s_oSpriteLibrary.addSprite("bg_rocks","./sprites/bg_rocks.png");
        
        s_oSpriteLibrary.addSprite("enemy_fleet_panel","./sprites/enemy_fleet_panel.png");
        s_oSpriteLibrary.addSprite("your_fleet_panel","./sprites/your_fleet_panel.png");
        
        s_oSpriteLibrary.addSprite("wait_player","./sprites/wait_player.png");
        s_oSpriteLibrary.addSprite("but_air_strike","./sprites/but_air_strike.png");
        s_oSpriteLibrary.addSprite("but_radar","./sprites/but_radar.png");
        s_oSpriteLibrary.addSprite("air","./sprites/air.png");
        s_oSpriteLibrary.addSprite("air_shadow","./sprites/air_shadow.png");
        s_oSpriteLibrary.addSprite("sea_mobile","./sprites/sea_mobile.jpg");
        
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            this._onPreloaderComplete();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onPreloaderComplete = function(){
        _oPreloader.unload();
            
        if (!isIOS()) {
            s_oSoundtrack = playSound('soundtrack', 1, true);
        }

        this.gotoMenu();
        
        new CAnimationSettings();
        
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoModeMenu = function(){
        _oMenu = new CModeMenu();
        _iState = STATE_MENU;
    };

    this.gotoSandBoxMenu = function(){
        _oSandBoxMenu = new CSandBoxMenu();
        _iState = STATE_MENU;
    };
    

    this.gotoGame = function(aShipList){
        _oGame = new CGame(_oData, aShipList);   						
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bFullscreen = false;
var s_iMode;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack;
var s_oCanvas;
var s_aSounds;