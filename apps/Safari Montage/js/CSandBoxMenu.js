function CSandBoxMenu(oData){
    
    var _aShipList;
    
    var _oParent;
    var _oBoardContainer;
    var _oButAuto;
    var _oButClear;
    var _oButPlay;
    var _oButRotate;
    var _oAttachBoard;
    var _oCurActiveShip;
    var _oText;
    var _oFade;
    var _oButExit;
    var _oAudioToggle;

    var _pStartPosExit;
    var _pStartPosAudio;

    this._init = function(){
        
        _oCurActiveShip = null;
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_sandbox_menu'));
        s_oStage.addChild(oBg);

        _oBoardContainer = new createjs.Container();
        _oBoardContainer.x = CANVAS_WIDTH/2;
        _oBoardContainer.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oBoardContainer);
        
        _oText = new createjs.Text(TEXT_STRATEGY_PANEL, " 80px " + SECONDARY_FONT, "#1ef400");
        _oText.textAlign = "center";
        _oText.textBaseline = "middle";
        _oText.x = CANVAS_WIDTH/2;
        _oText.y = 160;
        s_oStage.addChild(_oText);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_shuffle');
        _oButAuto = new CGfxButton(1450, 220, oSprite,s_oStage);
        _oButAuto.addEventListener(ON_MOUSE_UP, this._onAuto, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_delete');
        _oButClear = new CGfxButton(1450, 425, oSprite,s_oStage);
        _oButClear.addEventListener(ON_MOUSE_UP, this._onButClear, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_rotate');
        _oButRotate = new CGfxButton(1450, 630, oSprite,s_oStage);
        _oButRotate.setVisible(false);
        _oButRotate.addEventListener(ON_MOUSE_UP, this._onButRotate, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(1472,CANVAS_HEIGHT -226,oSprite,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.setVisible(false);
        
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
        
        var bSandBoxMode = true;
        _oAttachBoard = new CSandBoxBoard(0, 0, _oBoardContainer, bSandBoxMode);


        var oShipContainer = new createjs.Container();
        s_oStage.addChild(oShipContainer);

        _aShipList = new Array();
        _aShipList[0] = new CShip(300, 200, SHIP_SMALL, oShipContainer, _oAttachBoard);
        _aShipList[1] = new CShip(400, 156, SHIP_SUB, oShipContainer, _oAttachBoard);
        _aShipList[2] = new CShip(300, 440, SHIP_MEDIUM, oShipContainer, _oAttachBoard);
        _aShipList[3] = new CShip(400, 390, SHIP_LONG, oShipContainer, _oAttachBoard);
        _aShipList[4] = new CShip(300, 700, SHIP_BATTLE, oShipContainer, _oAttachBoard);
        _aShipList[5] = new CShip(400, 750, SHIP_CARRIER, oShipContainer, _oAttachBoard);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;}); 

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.refreshButtonPos = function(iNewX,iNewY){
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        
    };

    this.unload = function(){
        s_oSandBoxMenu = null;

        _oButAuto.unload();
        _oButClear.unload();
        _oButPlay.unload();

        s_oStage.removeAllChildren();
        
        _oAttachBoard.unload();
        
        for(var i=0; i<_aShipList.length; i++){
            _aShipList[i].unload();
        }
    };

    this.setActiveShip = function(oShip){
        _oCurActiveShip = oShip;
        if(_oCurActiveShip === null){
            _oButRotate.setVisible(false);
        } else {
            _oButRotate.setVisible(true);
        }
    };

    this.getShipList = function(){
        return _aShipList;
    };
    
    this._onAuto = function(){
        _oAttachBoard.shuffle(_aShipList);
    };
    
    this._onButClear = function(){
        _oAttachBoard.clearAll(_aShipList);
        
        this.checkPlayable();
    };     

    this._onButRotate = function(){
        if(_oCurActiveShip !== null){
            _oCurActiveShip._onShipRotate();
        }
    };     

    this.onExit = function(){
        $(s_oMain).trigger("end_session");

        s_oMain.gotoMenu();
    };

    this.checkPlayable = function(){
        var bPlayable = true;
        var aListCellOccupied = new Array();
        for(var i=0; i<_aShipList.length; i++){
            aListCellOccupied = _aShipList[i].getListCellOccupied();
            if(aListCellOccupied.length === 0){
                bPlayable = false;
            }
        };
        
        if(bPlayable){
            _oButPlay.setVisible(true);
        }else {
            _oButPlay.setVisible(false);
        }
    };

    this._onButPlayRelease = function(){
        this.unload();
        s_oMain.gotoGame(_aShipList);

    };

    this._onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    s_oSandBoxMenu = this;
    
    _oParent=this;
    this._init();
}

var s_oSandBoxMenu = null;
