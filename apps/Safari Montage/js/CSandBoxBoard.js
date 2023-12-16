function CSandBoxBoard(iX, iY, oParentContainer, bSandBoxMode){
    
    var _aCell;
    var _aListShips;

    var _oDraggedShipPos;
    
    this._init = function(iX, iY, oParentContainer, bSandBoxMode){
        
        _aListShips = new Array();
        
        _oDraggedShipPos = null;

        this._initBoard();
        
        new CBoardUtility(_aCell);

    };
    
    this.unload = function(){
        
        oParentContainer.removeChild();
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){ 
                _aCell[i][j].unload();
            }
        }    
    };
    
    this.getSandBoxMode = function(){
        return bSandBoxMode;
    };
    
    this._initBoard = function(){
      
        var iLength = BOARD_LENGTH;
        var iNumCell = NUM_CELL;
        var iGridStart = -iLength/2;
        var iCellLength = CELL_LENGTH;
        var iCellStartPos = iGridStart + iCellLength/2;
        
        var iStartX = - 2;
        var iStartY =  54;
        //Init Cell Position
        _aCell = new Array();
        for(var i=0; i<iNumCell; i++){
            _aCell[i] = new Array();
            for(var j=0; j<iNumCell; j++){                
                var iX = iCellStartPos +j*iCellLength + iStartX;
                var iY = iCellStartPos +i*iCellLength + iStartY;
                _aCell[i][j] = new CSandBoxCell(iX, iY, i, j, oParentContainer);
                _aCell[i][j].setVisible(bSandBoxMode);
            }
        }
    };  
    
    this.snapFromRelease = function(oObject){

        var oShipLogicPos = _oDraggedShipPos;
        
        this.snapShip(oShipLogicPos, oObject);
        
    };
    
    this.snapShip = function(oShipLogicPos, oObject){
        
        var oShip = oObject.getShipContainer();
        
        if(oShipLogicPos !== null){
            var oResult = this._checkFreeCells(oShipLogicPos.row, oShipLogicPos.col, oObject);
            if(oResult.free){
                var oCell = _aCell[oShipLogicPos.row][oShipLogicPos.col];
                var pGlobalPos = oParentContainer.localToGlobal(oCell.getPos().x, oCell.getPos().y);
                oShip.x = pGlobalPos.x/s_iScaleFactor;
                oShip.y = pGlobalPos.y/s_iScaleFactor;


                this.setDeniedArea(oResult.list);
                oObject.setListCellOccupied(oResult.list);
                _aListShips.push(oObject);

                this.hideHighlight();
                
                this.printDebug();

            } else {
                this.resetShip(oObject);
            }
        }else {
            this.resetShip(oObject);
        }

        if(bSandBoxMode){
            s_oSandBoxMenu.checkPlayable();
        };

    };  
    
    this._checkFreeCells = function(iRow, iCol, oObject){
        var aMap = oObject.getMap();
        var aListFreeCells = new Array();

        var bFree = true;
        for(var i=0; i<aMap.length; i++){
            for(var j=0; j<aMap[i].length; j++){
                var iCurRow = iRow + i;
                var iCurCol = iCol +j;
                
                if(iCurRow >= NUM_CELL || iCurCol >= NUM_CELL){
                    bFree = false;
                    return {free: bFree, list:[]};
                }
                
                if(_aCell[iCurRow][iCurCol].isShipOn()){
                    bFree = false;
                    return {free: bFree, list:[]};
                }
                
                aListFreeCells.push({row:iCurRow, col:iCurCol});
            }
        }
        return {free: bFree, list: aListFreeCells};
    };

    this.setShipOnCell = function(aList, bVal){
        for(var i=0; i<aList.length; i++){
            _aCell[aList[i].row][aList[i].col].setShip(bVal);
        };
    };
    
    this.resetShip = function(oObject){
        this.hideHighlight();
        
        var aList = oObject.getListCellOccupied();
        this.setShipOnCell(aList, false);
        
        oObject.returnInStartPos();
    };
    
    this._findShipPos = function(oObject){
        var oShip = oObject.getShipContainer();

        var pPos = {x:oShip.x, y: oShip.y};
        var oLocalPos = s_oStage.localToLocal(pPos.x, pPos.y, oParentContainer);

        var oLogicPos = null;
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                var oCell = _aCell[i][j];
                var pRelativePos = {x: oLocalPos.x - oCell.getPos().x, y:oLocalPos.y - oCell.getPos().y}
                var bHit = oCell.hitTest(pRelativePos.x, pRelativePos.y);
                if(bHit){
                    oLogicPos = {row:i, col:j};
                }
            }
        }
        
        return oLogicPos;
    };

    this._findAllPiecesPos = function(iRow, iCol, aMap){
        var aPiecePos = new Array();
        aPiecePos.push({row:iRow, col:iCol});
        for(var i=0; i<aMap.length; i++){
            for(var j=0; j<aMap[i].length; j++){
                var iCurRow = iRow + i;
                var iCurCol = iCol +j;
                
                if(iCurRow < NUM_CELL && iCurCol < NUM_CELL){
                    aPiecePos.push({row:iCurRow, col:iCurCol});
                }
            }
        }
        
        return aPiecePos;
    };
    
    this.setDeniedArea = function(aList){
        var aDeniedList = new Array();
        
        for(var i=0; i<aList.length; i++){
            _aCell[aList[i].row][aList[i].col].highlightDeniedArea(true);
            aDeniedList.push({row:aList[i].row, col:aList[i].col});
            var aNeighborList = s_oBoardUtility.getAllNeighbor(aList[i].row, aList[i].col);
            for(var j=0; j<aNeighborList.length; j++){
                var iRow = aNeighborList[j].row;
                var iCol = aNeighborList[j].col;
                _aCell[iRow][iCol].highlightDeniedArea(true);
                
                aDeniedList.push({row:iRow, col:iCol});
            };
        }
        
        this.setShipOnCell(aDeniedList, true);
        
    };
    
    this.highlightSnap = function(oObject){
        this.hideHighlight();
        
        var oShipPos = this._findShipPos(oObject);
        if(oShipPos !== null){
            var aPiecePos = this._findAllPiecesPos(oShipPos.row, oShipPos.col, oObject.getMap());
            for(var i=0; i<aPiecePos.length; i++){
                _aCell[aPiecePos[i].row][aPiecePos[i].col].highlight(true);
            }
        }
        _oDraggedShipPos = oShipPos;
    };
    
    this.hideHighlight = function(){
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                _aCell[i][j].highlight(false);
            }
        }
    };
    
    this.removeAllDenied = function(){
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                _aCell[i][j].highlightDeniedArea(false);
                _aCell[i][j].setShip(false);
            }
        }
    };
    
    this.refreshDenied = function(){
        this.removeAllDenied();
        
        for(var i=0; i<_aListShips.length; i++){
            var oShip = _aListShips[i];
            this.setDeniedArea(oShip.getListCellOccupied());
        }
        
    };
    
    this.removeShip = function(oObject){
        for(var i=0; i<_aListShips.length; i++){
            if(_aListShips[i] === oObject){
                _aListShips[i].setListCellOccupied([]);
                _aListShips.splice(i,1);
            }
        };
        
        this.refreshDenied();
        this.highlightSnap(oObject);
        
        this.printDebug();
    };
    
    this.shuffle = function(aShipList){
        
        this.clearAll(aShipList);

        for(var i=0; i<aShipList.length; i++){
            
            var aListOccupied = aShipList[i].getListCellOccupied();
            var iSafeCounter = 100;
            while(aListOccupied.length === 0){
                var iRandomRow = Math.floor(Math.random()*NUM_CELL);
                var iRandomCol = Math.floor(Math.random()*NUM_CELL);
                var iRandomOrientation = Math.random();
                if(iRandomOrientation < 0.5){
                    aShipList[i].rotateMap();
                }

                this.snapShip({row:iRandomRow, col:iRandomCol}, aShipList[i]);
                
                aListOccupied = aShipList[i].getListCellOccupied();
                iSafeCounter--;
                if(iSafeCounter === 0){
                    this.shuffle(aShipList);
                }
            }
        };
    };
    
    this.clearAll = function(aShipList){
        for(var i=0; i<aShipList.length; i++){
            if(aShipList[i].isHorizontal()){
                aShipList[i].rotateMap();
            }
            
            this.removeShip(aShipList[i]);
            this.resetShip(aShipList[i]);
        }; 
    };

    this.printDebug = function(){
        var aMat = new Array()
        for(var i=0; i<_aCell.length; i++){
            aMat[i] = new Array();
            for(var j=0; j<_aCell[i].length; j++){
                if(_aCell[i][j] !== undefined){
                    if(_aCell[i][j].isShipOn()){
                        aMat[i][j] = 1;
                    } else {
                        aMat[i][j] = 0;
                    }
                    
                } 
            }
        }
        
        this.printMat(aMat);
    };
    
    this.printMat = function(oGrid){
            var res = "";

            for (var i = 0; i < oGrid.length; i++) {
                for (var j = 0; j < oGrid[i].length; j++) {
                    res += oGrid[i][j] +"|";
                }
                res += "\n";
            }
        };
    
    this._init(iX, iY, oParentContainer, bSandBoxMode);
}
