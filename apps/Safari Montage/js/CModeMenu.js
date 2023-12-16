function CModeMenu(){
    
    var _oFade;
    var _oButClassic;
    var _oButAdvanced;
    var _oParent;
    var _oButExit;
    var _oAudioToggle;
    var _oHelpBut;
    
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosHelp;
    
    this._init = function(){
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_mode'));
        s_oStage.addChild(oBg);
        
        var oText = new createjs.Text(TEXT_GAME_MODE, " 160px " + SECONDARY_FONT, "#1ef400"); //1ef400
        oText.textAlign = "center";
        oText.textBaseline = "middle";
        oText.x = CANVAS_WIDTH/2;
        oText.y = 260;
        s_oStage.addChild(oText);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_classic');
        _oButClassic = new CGfxButton((CANVAS_WIDTH/2) - 220,CANVAS_HEIGHT/2 + 100,oSprite, s_oStage);
        _oButClassic.addEventListener(ON_MOUSE_UP, this._onClassicBut, this);
        _oButClassic.setText(TEXT_CLASSIC, 0, 76);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_advanced');
        _oButAdvanced = new CGfxButton((CANVAS_WIDTH/2) + 220,CANVAS_HEIGHT/2 + 100,oSprite, s_oStage);
        _oButAdvanced.addEventListener(ON_MOUSE_UP, this._onAdvancedBut, this);
        _oButAdvanced.setText(TEXT_ADVANCED, 0, 76);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_help');
        _pStartPosHelp = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10};            
        _oHelpBut = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -240,oSprite, s_oStage);
        _oHelpBut.addEventListener(ON_MOUSE_UP, this._onHelpBut, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 110;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;}); 

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };
    
    this.unload = function(){
        s_oStage.removeAllChildren();
        _oButAdvanced.unload();
        _oButClassic.unload();
        
        _oButExit.unload();
        _oAudioToggle.unload();
        _oHelpBut.unload();
        
        s_oModeMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oHelpBut.setPosition(_pStartPosHelp.x + iNewX,iNewY + _pStartPosHelp.y);
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        
    };
    
    this._onHelpBut = function(){
        new CHelpPanel()
    };
    
    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onClassicBut = function(){
        _oParent.unload();
        s_iMode = MODE_CLASSIC;
        s_oMain.gotoSandBoxMenu();
    };
    
    this._onAdvancedBut = function(){
        _oParent.unload();
        s_iMode = MODE_ADVANCED;
        s_oMain.gotoSandBoxMenu();
    };
    
    s_oModeMenu = this;
    _oParent = this;
    this._init();
}

var s_oModeMenu = null;
