function CSummaryPanel(iX, iY, oParentContainer){
    
    var _aFillsMask;
    var _aSunkText;
    var _aEnemySunkText;
    
    var _oPanelContainer;
    var _oYourFleetPanel;
    var _oEnemyFleetPanel;
    var _oYourFleetText;
    var _oEnemyFleetPanel;
    var _oScorePanel;
    var _oScoreText;
    
    this._init = function(iX, iY, oParentContainer){
        
        _oPanelContainer = new createjs.Container();
        this.setPos(iX, iY);
        oParentContainer.addChild(_oPanelContainer);

        var oSpriteYour = s_oSpriteLibrary.getSprite('your_fleet_panel');
        _oYourFleetPanel = createBitmap(oSpriteYour);
        _oYourFleetPanel.regY = oSpriteYour.height;
        _oPanelContainer.addChild(_oYourFleetPanel);
        
        _oYourFleetText = new createjs.Text(TEXT_YOUR_FLEET, " 30px " + SECONDARY_FONT, "#04b700");
        _oYourFleetText.x = oSpriteYour.width/2;
        _oYourFleetText.y = -oSpriteYour.height + 28;
        _oYourFleetText.textAlign = "center";
        _oYourFleetText.textBaseline = "alphabetic";
        _oYourFleetText.lineWidth = 600;
        _oYourFleetText.lineHeight = 40;
        _oPanelContainer.addChild(_oYourFleetText);
       
        var oSpriteEnemy = s_oSpriteLibrary.getSprite('enemy_fleet_panel');
        _oEnemyFleetPanel = createBitmap(oSpriteEnemy);
        _oEnemyFleetPanel.x = oSpriteYour.width;
        _oEnemyFleetPanel.regY = oSpriteEnemy.height;
        _oPanelContainer.addChild(_oEnemyFleetPanel);

        _oEnemyFleetPanel = new createjs.Text(TEXT_ENEMY_FLEET, " 30px " + SECONDARY_FONT, "#b81e00");
        _oEnemyFleetPanel.x = oSpriteYour.width + 130;
        _oEnemyFleetPanel.y = -oSpriteEnemy.height + 28;
        _oEnemyFleetPanel.textAlign = "center";
        _oEnemyFleetPanel.textBaseline = "alphabetic";
        _oEnemyFleetPanel.lineWidth = 600;
        _oEnemyFleetPanel.lineHeight = 40;
        _oPanelContainer.addChild(_oEnemyFleetPanel);

        var oSprite = s_oSpriteLibrary.getSprite('score_panel');
        _oScorePanel = createBitmap(oSprite);
        _oScorePanel.x = oSpriteYour.width*2 - 50;
        _oScorePanel.y = -oSpriteEnemy.height;
        //_oScorePanel.regY = oSpriteEnemy.height;
        _oPanelContainer.addChild(_oScorePanel);
        
        _oScoreText = new createjs.Text(TEXT_SCORE + ": 0"," 30px " + SECONDARY_FONT, "#04b700");
        _oScoreText.x = _oScorePanel.x + 20;
        _oScoreText.y = _oScorePanel.y + 18;
        _oScoreText.textAlign = "left";
        _oScoreText.textBaseline = "middle";
        _oScoreText.lineWidth = 600;
        _oPanelContainer.addChild(_oScoreText);

        this.setYourFill();
        this.setText();
        
    };
    
    this.setYourFill = function(){
        _aFillsMask = new Array();
        for(var i=0; i<6; i++){
            var oSprite = s_oSpriteLibrary.getSprite("fill_"+i);
            var oFills = createBitmap(oSprite);
            oFills.regX = oSprite.width/2;
            oFills.regY = oSprite.height/2;

            oFills.x = SHIPS_TYPE[i].fill_pos.x;
            oFills.y = SHIPS_TYPE[i].fill_pos.y;
            _oPanelContainer.addChild(oFills);
            
            _aFillsMask[i] = new createjs.Shape();
            _aFillsMask[i].graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, oSprite.width, oSprite.height);
            _aFillsMask[i].x = SHIPS_TYPE[i].fill_pos.x - oSprite.width/2;
            _aFillsMask[i].y = SHIPS_TYPE[i].fill_pos.y - oSprite.height/2;
            _oPanelContainer.addChild(_aFillsMask[i]);  
            
            oFills.mask = _aFillsMask[i];
            _aFillsMask[i].scaleX = 0;
        }
    };
    
    this.setText = function(){
        _aSunkText = new Array();
        for(var i=0; i<6; i++){
            _aSunkText[i] = new createjs.Text(TEXT_SUNK," 30px " + SECONDARY_FONT, "#ff7200");
            _aSunkText[i].x = SHIPS_TYPE[i].fill_pos.x;
            _aSunkText[i].y = SHIPS_TYPE[i].fill_pos.y + 10;
            _aSunkText[i].textAlign = "center";
            _aSunkText[i].textBaseline = "middle";
            _aSunkText[i].lineWidth = 200;
            _aSunkText[i].visible = false;
            _aSunkText[i].rotation = 15;
            _oPanelContainer.addChild(_aSunkText[i]);
        }
        
        _aEnemySunkText = new Array();
        for(var i=0; i<6; i++){
            _aEnemySunkText[i] = new createjs.Text(TEXT_SUNK," 30px " + SECONDARY_FONT, "#ff7200");
            _aEnemySunkText[i].x = SHIPS_TYPE[i].enemy_sunk_pos.x;
            _aEnemySunkText[i].y = SHIPS_TYPE[i].enemy_sunk_pos.y;
            _aEnemySunkText[i].textAlign = "center";
            _aEnemySunkText[i].textBaseline = "middle";
            _aEnemySunkText[i].lineWidth = 200;
            _aEnemySunkText[i].rotation = 15;
            _aEnemySunkText[i].visible = false;
            _oPanelContainer.addChild(_aEnemySunkText[i]);
        }
        
    };
    
    this.setDamage = function(aListShip){
        for(var i=0; i<aListShip.length; i++){
            var oType = aListShip[i].getType();
            
            var aListPiecesState = aListShip[i].getListCellOccupied();
            var iNumPiece = aListPiecesState.length;
            var iNumDamagedPiece = 0;
            for(var j=0; j<iNumPiece; j++){
                if(aListPiecesState[j].hit){
                    iNumDamagedPiece++;
                }
            };
            _aFillsMask[oType.battle_spritesheet].scaleX = iNumDamagedPiece/iNumPiece;
            if(iNumDamagedPiece === iNumPiece){
                _aSunkText[oType.battle_spritesheet].visible = true;
            }
        };
    };
    
    this.setEnemySunk = function(aListShip){
        for(var i=0; i<aListShip.length; i++){
            var oType = aListShip[i].getType();
            
            var aListPiecesState = aListShip[i].getListCellOccupied();
            var iNumPiece = aListPiecesState.length;
            var iNumDamagedPiece = 0;
            for(var j=0; j<iNumPiece; j++){
                if(aListPiecesState[j].hit){
                    iNumDamagedPiece++;
                }
            };
            
            if(iNumDamagedPiece === iNumPiece){
                _aEnemySunkText[oType.battle_spritesheet].visible = true;
            }
        }
    };
    
    this.setScore = function(iScore){
        _oScoreText.text = TEXT_SCORE + ": "+iScore;
    };
    
    this.setPos = function(iNewX, iNewY){
        _oPanelContainer.x = iNewX;
        _oPanelContainer.y = iNewY;
    };
    
    this._init(iX, iY, oParentContainer);
}


