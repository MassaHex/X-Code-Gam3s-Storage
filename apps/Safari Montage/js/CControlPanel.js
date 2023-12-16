function CControlPanel(){
    
    var _aCell;
    
    var _oFade;
    var _oPanelContainer;
    var _oCellContainer;
    var _oSprite;
    var _oRuler = null;
    var _oButAirStrike;
    var _oButRadar;
    var _oTextAirStrike;
    var _oTextRadar;
    var _oParent;
    
    var _pStartPanelPos;
    
    this._init = function(){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);

        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);

        _oSprite = s_oSpriteLibrary.getSprite('control_panel');
        var oPanel = createBitmap(_oSprite);        
        oPanel.regX = _oSprite.width/2;
        oPanel.regY = _oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + _oSprite.height/2;
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};

        _oCellContainer = new createjs.Container();
        _oPanelContainer.addChild(_oCellContainer);

        this._initControlCells();

        this._setAlphabeticCoordinate();
        this._setNumCoordinate();
        
        _oTextAirStrike = new createjs.Text(TEXT_COST + ": " +COST_AIRSTRIKE, " 30px " + SECONDARY_FONT, "#1ef400");
        _oTextAirStrike.textAlign = "left";
        _oTextAirStrike.textBaseline = "middle";
        _oTextAirStrike.x = 390;
        _oTextAirStrike.y = -352;
        _oPanelContainer.addChild(_oTextAirStrike);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_air_strike');
        _oButAirStrike = new CToggle(450,-274,oSprite,false, _oPanelContainer);
        _oButAirStrike.addEventListener(ON_MOUSE_UP, this._onAirStrike, this);
        _oButAirStrike.addEventListener(ON_MOUSE_OVER, this._hideRuler, this);
        _oButAirStrike.addEventListener(ON_MOUSE_OUT, this._showRuler, this);
        _oButAirStrike.enable(false);
        if(s_iMode === MODE_CLASSIC){
            _oButAirStrike.setVisible(false);
            _oTextAirStrike.visible = false;
        };
        
        
        _oTextRadar = new createjs.Text(TEXT_COST + ": " +COST_RADAR, " 30px " + SECONDARY_FONT, "#1ef400");
        _oTextRadar.textAlign = "left";
        _oTextRadar.textBaseline = "middle";
        _oTextRadar.x = 390;
        _oTextRadar.y = -144;
        _oPanelContainer.addChild(_oTextRadar);
        
        _oButRadar = new CAnimatedButton(450,-62,s_oRadarSpritesheet, _oPanelContainer);
        _oButRadar.addEventListener(ON_MOUSE_UP, this._onRadar, this);
        _oButRadar.addEventListener(ON_MOUSE_OVER, this._hideRuler, this);
        _oButRadar.addEventListener(ON_MOUSE_OUT, this._showRuler, this);
        _oButRadar.enable(false);
        if(s_iMode === MODE_CLASSIC){
            _oButRadar.setVisible(false);
            _oTextRadar.visible = false;
        };
        
        _oRuler = new CRuler(_oPanelContainer);
        
    };
    
    this.unload = function(){
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);
       
        _oButAirStrike.unload();
        _oButRadar.unload();
       
        _oFade.off("mousedown",function(){});
    };
    
    this._initControlCells = function(){
        var iNumCell = NUM_CELL;
        var iCellLength = CONTROL_CELL_DIM;
        var iGridStart = NUM_CELL/2 * CONTROL_CELL_DIM;
        
        var iCellStartPos = iGridStart - iCellLength/2;
        
        //Init Cell Position
        _aCell = new Array();
        for(var i=0; i<iNumCell; i++){
            _aCell[i] = new Array();
            for(var j=0; j<iNumCell; j++){                
                var iX = iCellStartPos -j*iCellLength;
                var iY = iCellStartPos -i*iCellLength;
                _aCell[i][j] = new CControlCell(iX, iY, _oCellContainer, i, j);
            }
        }
    };
    
    this._setAlphabeticCoordinate = function(){
        for(var i=NUM_CELL-1; i>=0; i--){
            var oText = new createjs.Text(String.fromCharCode(65 + NUM_CELL -i-1), " 50px " + SECONDARY_FONT, "#60ff00");
            oText.x = _aCell[i][NUM_CELL-1].getPos().x - 60;
            oText.y = _aCell[i][NUM_CELL-1].getPos().y;
            oText.textAlign = "center";
            oText.textBaseline = "middle";
            _oCellContainer.addChild(oText);
        }
        
    };
    
    this._setNumCoordinate = function(){
        for(var i=NUM_CELL-1; i>=0; i--){
            var oText = new createjs.Text(NUM_CELL -i, " 34px " + SECONDARY_FONT, "#60ff00");
            oText.x = _aCell[0][i].getPos().x;
            oText.y = _aCell[0][i].getPos().y + 50;
            oText.textAlign = "center";
            oText.textBaseline = "middle";
            _oCellContainer.addChild(oText);
        }
    };
    
    this.show = function(){
        _oPanelContainer.visible = true;
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2},500, createjs.Ease.quartIn);
    };
    
    this.hide = function(){
        createjs.Tween.removeTweens(_oFade);
        
        _oPanelContainer.visible = false;
        _oPanelContainer.y = CANVAS_HEIGHT + _oSprite.height/2;  
        _oFade.alpha = 0;
    };
    
    this._showRuler = function(){
        _oRuler.show(true);
    };
    
    this._hideRuler = function(){
        _oRuler.show(false);
    };
    
    this.refresh = function(aStateCell){
        for(var i=0; i<_aCell.length; i++){
            for(var j=0; j<_aCell[i].length; j++){
                var iState = aStateCell[i][j].getState();
                _aCell[i][j].setState(iState);
                _aCell[i][j].disableHighlight();
            }
        }
        
        var iCurScore = s_oGame.getScore();
        if(iCurScore > COST_AIRSTRIKE){
            _oButAirStrike.enable(true);
        }
        if(iCurScore > COST_RADAR){
            _oButRadar.enable(true);
        }

    };
    
    this._onAirStrike = function(){
        this._showRuler();
        _oButAirStrike.enable(false);
        s_oGame.addScore(-COST_AIRSTRIKE);
        _oParent.hide();
        
        s_oGame.launchAirStrike();
    };
    
    this._onRadar = function(){
        playSound("sonar", 1, false);
        this._showRuler();
        
        _oButRadar.enable(false);
        s_oGame.addScore(-COST_RADAR);
        
        var oShip = s_oGame.getRandomAvailableShip(OPPONENT);
        var aList = oShip.getListCellOccupied();
        var aFreeCell = new Array();
        for(var i=0; i<aList.length; i++){
            if(!aList[i].hit){
                aFreeCell.push(aList[i]);
            }
        };
        
        var aRandomCell = aFreeCell[Math.floor(Math.random()*aFreeCell.length)];
        
        _aCell[aRandomCell.row][aRandomCell.col].highlight();
    };
    
    this.update = function(pMousePos){
        if(pMousePos){
            _oRuler.updatePos(pMousePos.x, pMousePos.y);
        }
    };
    
    _oParent = this;
    this._init();
    
};


