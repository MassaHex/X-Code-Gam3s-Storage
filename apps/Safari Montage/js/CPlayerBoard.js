function CPlayerBoard(iX, iY, oParentContainer, aShipList, iPlayer, oParticleContainer){
    var _iExplosionInterval;
    
    var _aCell;
    var _aDrawShip;
    
    var _oBoard;
    
    this._init = function(iX, iY, oParentContainer, aShipList, iPlayer, oParticleContainer){
        
        _oBoard = new createjs.Container();
        _oBoard.x = iX;
        _oBoard.y = iY;
        oParentContainer.addChild(_oBoard);
        
        this._initBoard();
        if(iPlayer === PLAYER){
            this._setShips();
        }
    };
    
    this._initBoard = function(){
        _aCell = new Array();
        var iXSpacing = 32;
        var iYSpacing = 18;
        var iXOffset = 0;
        var iYOffset =  0;
        _aCell = new Array();
        for (var i = 0; i < NUM_CELL; i++) {
                _aCell[i] = new Array();
                for (var j = 0; j < NUM_CELL; j++) {
                        var oCell = new CBattleCell(iXOffset,iYOffset,_oBoard, i, j, oParticleContainer);
                        
                        if(iPlayer === PLAYER){
                            iXOffset += iXSpacing;
                            iYOffset -= iYSpacing;
                        } else {
                            iXOffset -= iXSpacing;
                            iYOffset += iYSpacing;
                        }

                        _aCell[i][j] = oCell;
                }
                
                if(iPlayer === PLAYER){
                    iXOffset = (i + 1) * iXSpacing;
                    iYOffset =  (i + 1) * iYSpacing;
                } else {
                    iXOffset = -(i + 1) * iXSpacing;
                    iYOffset =  -(i + 1) * iYSpacing;
                }
                
        }
    };
    
    this._setShips = function(){
        _aDrawShip = new Array();
        for(var i=0; i<aShipList.length; i++){
            var oType = aShipList[i].getType();
            var aListPos = aShipList[i].getListCellOccupied();
            var iRow = aListPos[0].row;
            var iCol = aListPos[0].col;
            var oShip = new createSprite(s_aShipSpritesheet[oType.battle_spritesheet],"idle", 0,0,0,0);
            oShip.x = _aCell[iRow][iCol].getPos().x;
            oShip.y = _aCell[iRow][iCol].getPos().y;
            oShip.regX = oType.reg_points.x;
            oShip.regY = oType.reg_points.y;

            
            if(iPlayer === OPPONENT){
                oShip.rotation = 180;
            }
            
            
            if(aShipList[i].isHorizontal()){
                oShip.scaleX = -1;
                oShip.regX = oType.reg_points.inverseX;
                oShip.regY = oType.reg_points.inverseY;
            }

            _aDrawShip.push(oShip);
            
            _oBoard.addChild(oShip);
        };
    };
    
    this.isShipOn = function(iRow, iCol){
        
        for(var i=0; i<aShipList.length; i++){
            var aListCell = aShipList[i].getListCellOccupied();
            for(var j=0; j<aListCell.length; j++){
                if(aListCell[j].row === iRow && aListCell[j].col === iCol){
                    return aShipList[i];
                }
            }
        };
        return null;
    };
    
    this.sunkAnimation = function(oShip){
        
        this.hideShip(oShip.getType().index_type);
        
        var aListPos = oShip.getListCellOccupied();
        
        var aList = new Array();
        for(var i=0; i<aListPos.length; i++){
            aList.push(aListPos[i]);
        }
        
        shuffle(aList);
        
        var iDelay = 200;
        var iCounter = 0;
        _iExplosionInterval = setInterval(function(){
            _aCell[aList[iCounter].row][aList[iCounter].col].removeFire();
            _aCell[aList[iCounter].row][aList[iCounter].col].setFinalExplosion();

            iCounter++;
            if(iCounter === aList.length){
                clearInterval(_iExplosionInterval);
            }
        }, iDelay);
        
    };
    
    this.setFire = function(iRow, iCol){
        _aCell[iRow][iCol].setFire();
    };
    
    this.setCellState = function(iRow, iCol, iState){
        _aCell[iRow][iCol].setState(iState);
    };
    
    this.getCellState = function(iRow, iCol){
        return _aCell[iRow][iCol].getState();
    };
    
    this.getCells = function(){
        return _aCell;
    };
    
    this.getCellPos = function(iRow, iCol){
        var oPos = _aCell[iRow][iCol].getPos();
        return {x: oPos.x +iX, y: oPos.y + iY};
    };
    
    this.getBounds = function(){
        return _oBoard.getBounds();
    };
    
    this.getPos = function(){
        return {x:iX, y:iY};
    };
    
    this.playExplosion = function(iRow, iCol){
        _aCell[iRow][iCol].playExplosion();
    };
    
    this.playWater = function(iRow, iCol){
        _aCell[iRow][iCol].playWater();
    };
    
    this.hideShip = function(iIndex){
        if(iPlayer === PLAYER){
            _aDrawShip[iIndex].visible = false;
        }
        
    };
    
    this._init(iX, iY, oParentContainer, aShipList, iPlayer, oParticleContainer);
}


