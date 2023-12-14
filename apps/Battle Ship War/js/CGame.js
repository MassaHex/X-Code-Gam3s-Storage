function CGame(oData, aShipList){
    var _bStartGame;
    
    var _iScore;
    var _iMultiplier;
    var _iCurPlayer;
    var _iAdCounter = 0;
    var _iNumMissileShot;

    var _aEnemyShipList;
    var _aPlayerShipList;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oControlPanel;
    var _oPlayerBoard;
    var _oEnemyBoard;
    var _oMissile;
    var _oThinkingTimer;
    
    var _oBackground;
    var _oUnderWaterContainer;
    var _oShipContainer;
    var _oParticleContainer;
    var _oAI;
    var _oFade;
    var _oTurnWaiter;
    var _oAirStrike;
    
    var _pMousePos;
    
    this._init = function(){

        setVolume("soundtrack", 0.4);
        $(s_oMain).trigger("start_level",1);
        
        
        
        _bStartGame=true;
        
        _iScore = 0;               
        _iCurPlayer = PLAYER;
        _iNumMissileShot = 0;
        _iMultiplier = 1;
        
        _oBackground = new CBackground(s_oStage);

        _oUnderWaterContainer = new createjs.Container();
        s_oStage.addChild(_oUnderWaterContainer);

        _aPlayerShipList = aShipList;
        this._initEnemyBoard();

        _oShipContainer = new createjs.Container();
        s_oStage.addChild(_oShipContainer);

        _oParticleContainer = new createjs.Container();
        s_oStage.addChild(_oParticleContainer);

        _oPlayerBoard = new CPlayerBoard(CANVAS_WIDTH/2-150, CANVAS_HEIGHT/2+100, _oShipContainer, _aPlayerShipList, PLAYER, _oParticleContainer);
        _oEnemyBoard = new CPlayerBoard(CANVAS_WIDTH/2+150, CANVAS_HEIGHT/2-200, _oShipContainer, _aEnemyShipList, OPPONENT, _oParticleContainer);
        
        _oMissile = new CMissile(_oParticleContainer, _oUnderWaterContainer);

        _oTurnWaiter = new CTurnWaiter(s_oStage);
        _oThinkingTimer = null;

        _oAirStrike = new CAirStrike(_oShipContainer);

        _oInterface = new CInterface();
        _oInterface.refreshScore(_iScore);      

        if(!s_bMobile){
            s_oStage.on("stagemousemove", this.setMouseCoordinate);
        }  

        _oControlPanel = new CControlPanel();
        _oControlPanel.show();

        
        _oAI = new CAI(_oPlayerBoard);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;}); 
          
    };

    this._initEnemyBoard = function(){
        
        var bSandBoxMode = false;
        var oAttachBoard = new CSandBoxBoard(0, 0, s_oStage, bSandBoxMode);
        
        _aEnemyShipList = new Array();
        _aEnemyShipList[0] = new CShip(400, 200, SHIP_SMALL, s_oStage, oAttachBoard);        
        _aEnemyShipList[1] = new CShip(400, 300, SHIP_SUB, s_oStage, oAttachBoard);
        _aEnemyShipList[2] = new CShip(400, 400, SHIP_MEDIUM, s_oStage, oAttachBoard);
        _aEnemyShipList[3] = new CShip(400, 500, SHIP_LONG, s_oStage, oAttachBoard);
        _aEnemyShipList[4] = new CShip(400, 600, SHIP_BATTLE, s_oStage, oAttachBoard);
        _aEnemyShipList[5] = new CShip(400, 700, SHIP_CARRIER, s_oStage, oAttachBoard);
        
        
        oAttachBoard.shuffle(_aEnemyShipList);
        
        for(var i=0; i<_aEnemyShipList.length; i++){
            _aEnemyShipList[i].unload();
        }
        
        oAttachBoard.unload();
        
    };

    this.tryShowAd = function(){
        _iAdCounter++;
        if(_iAdCounter === AD_SHOW_COUNTER){
            _iAdCounter = 0;
            $(s_oMain).trigger("show_interlevel_ad");
        }
    };

    this.onCellClick = function(iRow, iCol){
        _oControlPanel.hide();
        
        _iNumMissileShot = 1;
        _oMissile.launchMissileForPlayer(iRow, iCol);

    };
    
    this.onMissileArrived = function(iRow, iCol){
        
        var aBoard = new Array(_oEnemyBoard, _oPlayerBoard);
        
        var oShip = aBoard[_iCurPlayer].isShipOn(iRow, iCol);
        if(oShip !== null){
            oShip.hitShip(iRow, iCol);

            aBoard[_iCurPlayer].setCellState(iRow, iCol, CELL_STATE_HIT);
            if(_iCurPlayer === OPPONENT){
                aBoard[_iCurPlayer].setFire(iRow, iCol);
                s_oGame.addScore(-POINTS_TO_LOSE);
            } else {
                s_oGame.addScore(_iMultiplier*POINTS_EARNED);
                _iMultiplier++;
            }
            aBoard[_iCurPlayer].playExplosion(iRow, iCol);
            
            if(oShip.isSunk()){
                var aList = oShip.getListCellOccupied();
                
                //// SET WATER IN THE NEIGHBOR CELLS IN CASE OF SUNK
                for(var i=0; i<aList.length; i++){
                    var aNeighbor = s_oBoardUtility.getAllNeighbor(aList[i].row, aList[i].col);
                    for(var j=0; j<aNeighbor.length; j++){
                        aBoard[_iCurPlayer].setCellState(aNeighbor[j].row, aNeighbor[j].col, CELL_STATE_WATER)
                    };
                };
                
                for(var i=0; i<aList.length; i++){
                    aBoard[_iCurPlayer].setCellState(aList[i].row, aList[i].col, CELL_STATE_SUNK);
                };
                
                if(_iCurPlayer === OPPONENT){
                    _oAI.resetToStartState();
                }
                
                aBoard[_iCurPlayer].sunkAnimation(oShip);
                
            }
        } else {
            aBoard[_iCurPlayer].setCellState(iRow, iCol, CELL_STATE_WATER);
            aBoard[_iCurPlayer].playWater(iRow, iCol);
            if(_iCurPlayer === PLAYER){
                _iMultiplier = 1;
            }
        }
        
        _oControlPanel.refresh(_oEnemyBoard.getCells());
        
        if(_iCurPlayer === OPPONENT){
            _oInterface.setShipDamage(_aPlayerShipList);
        } else {
            _oInterface.setEnemySunk(_aEnemyShipList);
        }

        _iNumMissileShot--;
        if(_iNumMissileShot === 0){
            this.tryShowAd();
            this.changeTurn();
        }
    };
    
    this.changeTurn = function(){
        
        var bEndGame = this.checkEndGame();
        if(bEndGame){
            return;
        }
        
        if(_iCurPlayer === PLAYER){
            _iCurPlayer = OPPONENT;
            
            this._wakeUpAI();
            
        } else {
            _iCurPlayer = PLAYER;
            setTimeout(function(){
                _oControlPanel.show();
            },1000)
            
        }
    };
    
    this._wakeUpAI = function(){
        
        _oTurnWaiter.show();
        
        _iNumMissileShot = 1;
        var iTimeThinking = randomFloatBetween(MIN_AI_THINKING, MAX_AI_THINKING);

        var oCoordinate;
        _oThinkingTimer = new Timer(function() {
            oCoordinate = _oAI.getCoordinate(_aPlayerShipList);
            _oMissile.launchMissileForOpponent(oCoordinate.row, oCoordinate.col);
            _oTurnWaiter.hide();
            _oThinkingTimer = null;
        }, iTimeThinking);
        
    };
    
    this.checkEndGame = function(){
        var bPlayerWin = true;
        for(var i=0; i<_aEnemyShipList.length; i++){
            if(!_aEnemyShipList[i].isSunk()){
                bPlayerWin = false;
                break;
            }
        }
        
        var bOpponentWin = true;
        for(var i=0; i<_aPlayerShipList.length; i++){
            if(!_aPlayerShipList[i].isSunk()){
                bOpponentWin = false;
                break;
            }
        }

        if(bPlayerWin){
            this.gameOver(PLAYER);
        } else if(bOpponentWin){
            this.gameOver(OPPONENT);
        }
        
        return bPlayerWin || bOpponentWin;

    };
    
    this.setNumMissileShot = function(iNum){
        _iNumMissileShot = iNum;
    };
    
    this.getRandomAvailableShip = function(iPlayer){
        var aPlayers = new Array(_aPlayerShipList, _aEnemyShipList);
        
        var aAvailableShips = new Array();
        for(var i=0; i<aPlayers[iPlayer].length; i++){
            if( !aPlayers[iPlayer][i].isSunk()){
                aAvailableShips.push(aPlayers[iPlayer][i]);
            }
        }
        return aAvailableShips[ Math.floor(Math.random()*aAvailableShips.length) ];
    };  
    
    this.getCellPos = function(iRow, iCol, iPlayer){
        var oPos;
        if(iPlayer === OPPONENT){
            oPos = _oEnemyBoard.getCellPos(iRow, iCol);
        } else {
            oPos =_oPlayerBoard.getCellPos(iRow, iCol);
        }
        return oPos;
    };
    
    this.getBoardPos = function(iPlayer){
        if(iPlayer === PLAYER){
            return _oPlayerBoard.getPos();
        } else {
            var oBounds = _oEnemyBoard.getBounds();
            var oPos = _oEnemyBoard.getPos();

            return {x: oPos.x - oBounds.width/2, y: oPos.y};
        }
    };
    
    this.getBoard = function(iPlayer){
        var oBoard;
        if(iPlayer === PLAYER){
            oBoard = _oPlayerBoard;
        }else {
            oBoard = _oEnemyBoard;
        }
        
        return oBoard;
    };
    
    this.launchAirStrike = function(){
        _oAirStrike.launch();
    };
    
    this.addScore = function(iQty){
        _iScore += iQty;
        if(_iScore <=0){
            _iScore = 0;
        }
        _oInterface.refreshScore(_iScore);
    };
    
    this.getScore = function(){
        return _iScore;
    };
    
    this.restartGame = function () {
        $(s_oMain).trigger("show_interlevel_ad");
        this.unload();
        this._init();
    };        
    
    this.pauseGame = function(bVal){
        _bStartGame = !bVal;
        if(_oThinkingTimer !== null){
            if(_bStartGame){
                _oThinkingTimer.resume();
            } else {
                _oThinkingTimer.pause();
            }
        }
    };
    
    this.unload = function(){
        _bStartGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

           
    };
 
    this.onExit = function(){
        $(s_oMain).trigger("end_session");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
         $(s_oMain).trigger("start_level",1);
    };
    
    this.gameOver = function(iWinnerType){  
        
        _oEndPanel = CEndPanel(iWinnerType);
        _oEndPanel.show(_iScore);
    };

    this.setMouseCoordinate = function(evt){
        _pMousePos = {x:evt.stageX, y:evt.stageY};
    };
    
    this.getMouseCoordinate = function(){
        return _pMousePos;
    };
    
    this.update = function(){
        if(_bStartGame){
            if(_oTurnWaiter !== null){
                _oTurnWaiter.update();
            }
            
            _oMissile.update();
            _oBackground.update();

            _oControlPanel.update(_pMousePos);

        }
        
    };

    s_oGame=this;
    
    POINTS_TO_LOSE = oData.points_to_lose;
    POINTS_EARNED = oData.points_earned;
    AD_SHOW_COUNTER = oData.ad_show_counter;

    
    _oParent=this;
    this._init();
}

var s_oGame;
