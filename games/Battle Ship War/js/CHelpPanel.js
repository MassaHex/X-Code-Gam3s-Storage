function CHelpPanel(){
    
    var _iIdListener;
    
    var _oFade;
    var _oPanelContainer;
    var _oLogo;
    var _oButAirStrike;
    var _oButRadar;
    
    var _pStartPanelPos;
    
    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _iIdListener = _oFade.on("mousedown",this.unload);
        s_oStage.addChild(_oFade);
        
        new createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('control_panel');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        new createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},500, createjs.Ease.quartIn);

        var oTitle = new createjs.Text(TEXT_HELP," 120px "+SECONDARY_FONT, "#1ef400");
        oTitle.y = -oSprite.height/2 + 100;
        oTitle.textAlign = "center";
        oTitle.textBaseline = "middle";
        oTitle.lineWidth = 300;
        _oPanelContainer.addChild(oTitle);

        
        var iXOffset = 10;
        var oClassic = new createjs.Text(TEXT_CLASSIC + ":"," 40px "+SECONDARY_FONT, "#1ef400");
        oClassic.x = -550;
        oClassic.y = -200;
        oClassic.textAlign = "left";
        oClassic.textBaseline = "alphabetic";
        oClassic.lineWidth = 1200;
        _oPanelContainer.addChild(oClassic);

        var oClassicText = new createjs.Text(TEXT_HELP_CLASSIC," 34px "+PRIMARY_FONT, "#ffffff");
        oClassicText.x = oClassic.x + oClassic.getBounds().width + iXOffset;
        oClassicText.y = oClassic.y;
        oClassicText.textAlign = "left";
        oClassicText.textBaseline = "alphabetic";
        oClassicText.lineWidth = 1000;
        _oPanelContainer.addChild(oClassicText);

        var oAdvanced = new createjs.Text(TEXT_ADVANCED + ":"," 40px "+SECONDARY_FONT, "#1ef400");
        oAdvanced.x = -550;
        oAdvanced.y = 0;
        oAdvanced.textAlign = "left";
        oAdvanced.textBaseline = "alphabetic";
        oAdvanced.lineWidth = 1200;
        _oPanelContainer.addChild(oAdvanced);

        var oAdvancedText = new createjs.Text(TEXT_HELP_ADVANCED," 34px "+PRIMARY_FONT, "#ffffff");
        oAdvancedText.x = oAdvanced.x + oAdvanced.getBounds().width + iXOffset;
        oAdvancedText.y = oAdvanced.y;
        oAdvancedText.textAlign = "left";
        oAdvancedText.textBaseline = "alphabetic";
        oAdvancedText.lineWidth = 1000;
        _oPanelContainer.addChild(oAdvancedText);

        var oSprite = s_oSpriteLibrary.getSprite('but_air_strike');
        _oButAirStrike = new CToggle(oAdvancedText.x + oSprite.width/4,oAdvanced.y + 100,oSprite,true, _oPanelContainer);
        _oButAirStrike.setClickable(false);
        
        var oAirStrikeText = new createjs.Text(TEXT_HELP_AIRSTRIKE," 34px "+PRIMARY_FONT, "#ffffff");
        oAirStrikeText.x = _oButAirStrike.getPos().x + oSprite.width/4 + iXOffset;
        oAirStrikeText.y = _oButAirStrike.getPos().y;
        oAirStrikeText.textAlign = "left";
        oAirStrikeText.textBaseline = "middle";
        oAirStrikeText.lineWidth = 800;
        _oPanelContainer.addChild(oAirStrikeText);
        
        _oButRadar = new CAnimatedButton(_oButAirStrike.getPos().x,_oButAirStrike.getPos().y + 150,s_oRadarSpritesheet, _oPanelContainer);
        _oButRadar.enable(true);
        _oButRadar.setClickable(false);
        
        var oRadarText = new createjs.Text(TEXT_HELP_RADAR," 34px "+PRIMARY_FONT, "#ffffff");
        oRadarText.x = _oButAirStrike.getPos().x + oSprite.width/4 + iXOffset;
        oRadarText.y = _oButAirStrike.getPos().y + 134;
        oRadarText.textAlign = "left";
        oRadarText.textBaseline = "middle";
        oRadarText.lineWidth = 800;
        _oPanelContainer.addChild(oRadarText);
        
    };
    
    this.unload = function(){

        
        new createjs.Tween.get(_oFade).to({alpha:0},500);
        new createjs.Tween.get(_oPanelContainer).to({y:_pStartPanelPos.y},400, createjs.Ease.backIn).call(function(){
            s_oStage.removeChild(_oFade);
            s_oStage.removeChild(_oPanelContainer);
            
            _oButAirStrike.unload();
            _oButRadar.unload();

        }); 
        
        _oFade.off("mousedown", _iIdListener);
        
    };
    
    
    this._init();
    
    
};


