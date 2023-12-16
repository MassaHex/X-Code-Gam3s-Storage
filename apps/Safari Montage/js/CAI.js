function CAI(oBoard){

    var _iState;
    var _iSeekingState;
    var _iCurDirIndex;

    var _aFreeCell;
    var _aDirections;
    var _aListCellHit;
    var _aCarrierCell;
    var _aCarrierDir;
    var _aCurCarrierCellHit;
    
    var _oLastDirection;
    
    
    this._init = function(oBoard){
        _iState = AI_STATE_NEW_COORDINATE;
        _iSeekingState = AI_FIND_DIRECTION;
        _iCurDirIndex = 0;
        
        _aFreeCell = new Array();
        _aDirections = new Array(DIR_RIGHT, DIR_BOT, DIR_LEFT, DIR_TOP); 
        _aCarrierCell = new Array();
        _aCarrierDir = new Array();

        _oLastDirection = null;
        
    };
    
    this.getCoordinate = function(aPlayerList){
        ///// CHECK BOARD STATE
        switch(_iState){
            case AI_STATE_NEW_COORDINATE:{
                    return this._getRandomCoordinate(aPlayerList);
                    break;
            }
            case AI_STATE_FIND_SHIP_NEIGHBOR:{
                    return this._getLastDirectionCoordinate();
                    break;
            }
        }

    };
    
    this._getRandomCoordinate = function(aPlayerList){
        _aFreeCell = new Array();
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                if(oBoard.getCellState(i,j) === CELL_STATE_VOID){
                    _aFreeCell.push({row: i, col: j});
                }
            }
        }
        
        
        var oCoordinate = _aFreeCell[Math.floor(Math.random()*_aFreeCell.length)];
        
        if(this._predictHit(oCoordinate.row, oCoordinate.col) === PREDICT_HIT){
            _iSeekingState = AI_FIND_DIRECTION;
            _iState = AI_STATE_FIND_SHIP_NEIGHBOR;
            _aListCellHit = new Array();
            _aListCellHit.push(oCoordinate);
            
            this._setViableDirection(_aListCellHit[0]);
        }

        return oCoordinate;
        
    };
    
    this._getLastDirectionCoordinate = function(){
        var oCoordinate;
        
        switch(_iSeekingState){
            case AI_FIND_DIRECTION:{
                    _oLastDirection = _aDirections[ Math.floor(Math.random()*_aDirections.length) ];
                    oCoordinate = s_oBoardUtility.getNeighborByDir(_aListCellHit[0].row, _aListCellHit[0].col, _oLastDirection); 

                    var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
                    if(iPrediction === PREDICT_HIT){
                        _iSeekingState = AI_FOLLOW_DIRECTION;
                        _aListCellHit.push(oCoordinate);
                    } else {
                        this._removeDirection();
                    }

                    break;
            }
            case AI_FOLLOW_DIRECTION:{
                    var oLastCellHit = _aListCellHit[_aListCellHit.length-1];
                    oCoordinate = s_oBoardUtility.getNeighborByDir(oLastCellHit.row, oLastCellHit.col, _oLastDirection); 
                    if(oCoordinate === null || oBoard.getCellState(oCoordinate.row, oCoordinate.col) === CELL_STATE_WATER){  
                        _iSeekingState = AI_REVERSE_DIRECTION;
                        return this._getLastDirectionCoordinate();
                        
                    }
                    _aListCellHit.push(oCoordinate);
                    var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
                    if(iPrediction === PREDICT_WATER){
                        _iSeekingState = AI_REVERSE_DIRECTION;
                    }
                    
                    break;
            }
            case AI_REVERSE_DIRECTION:{
                    var oTempDirection = _oLastDirection;
                    this._removeDirection();
                    _oLastDirection = s_oBoardUtility.getReverseDirection(oTempDirection);
                    oCoordinate = s_oBoardUtility.getNeighborByDir(_aListCellHit[0].row, _aListCellHit[0].col, _oLastDirection);
                    if(oCoordinate === null || oBoard.getCellState(oCoordinate.row, oCoordinate.col) === CELL_STATE_WATER){  
                        this._setCarrierFound();
                        return this._getLastDirectionCoordinate();
                        
                    }
                    var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
                    if(iPrediction === PREDICT_WATER){
                        this._setCarrierFound();
                    }else {
                        _iSeekingState = AI_FOLLOW_REVERSE;
                    }
                    _aListCellHit.push(oCoordinate);
                    break;
            }
            case AI_FOLLOW_REVERSE:{
                    var oLastCellHit = _aListCellHit[_aListCellHit.length-1];
                    oCoordinate = s_oBoardUtility.getNeighborByDir(oLastCellHit.row, oLastCellHit.col, _oLastDirection); 
                    if(oCoordinate === null || oBoard.getCellState(oCoordinate.row, oCoordinate.col) === CELL_STATE_WATER){
                        this._setCarrierFound();
                        return this._getLastDirectionCoordinate();
                    }
                    _aListCellHit.push(oCoordinate);
                    var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
                    if(iPrediction === PREDICT_WATER){
                        this._setCarrierFound();
                    }
                    
                    break;
            }
            case AI_FOLLOW_CARRIER:{
                    oCoordinate = this._findCarrierCell();
                    break;
            }
            
        }

        return oCoordinate;
    };
    
    this._findCarrierCell = function(){
        var oCoordinate;
        
        if(_aCarrierCell.length > 0){
            oCoordinate = _aCarrierCell[0];
            _aCarrierCell.splice(0,1);
            
            if(_aCarrierCell.length === 0){
                _aCarrierCell = s_oBoardUtility.getNeighborByShift(_aCurCarrierCellHit, _aCarrierDir[0]);
                _aCurCarrierCellHit = s_oBoardUtility.getNeighborByShift(_aCurCarrierCellHit, _aCarrierDir[0]);
                if(_aCarrierCell[0] === null || oBoard.getCellState(_aCarrierCell[0].row, _aCarrierCell[0].col) === CELL_STATE_WATER){
                    if(_aCarrierDir.length > 0){
                        ///CHANGE DIR
                        _aCarrierDir.splice(0,1);
                        _aCarrierCell = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
                        _aCurCarrierCellHit = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
                    } else {
                        /// EXIT
                        _iState = AI_STATE_NEW_COORDINATE;
                        _oLastDirection = null;
                        _aListCellHit = new Array();
                    }
                }
            };
            
            var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
            if(iPrediction === PREDICT_WATER){
                if(_aCarrierDir.length > 0){
                    _aListCellHit.push(oCoordinate);
                    _aCarrierCell = new Array();
                    //CHANGE CUR DIRECTION
                    _aCarrierDir.splice(0,1);
                }
            }    
            
        } else {

            this._removeWaterCell();

            _aCarrierCell = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
            _aCurCarrierCellHit = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
            if(_aCarrierCell[0] === null || oBoard.getCellState(_aCarrierCell[0].row, _aCarrierCell[0].col) === CELL_STATE_WATER){
                _aCarrierDir.splice(0,1);
                _aCarrierCell = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
                _aCurCarrierCellHit = s_oBoardUtility.getNeighborByShift(_aListCellHit, _aCarrierDir[0]);
            }

            oCoordinate = _aCarrierCell[0];
            _aCarrierCell.splice(0,1);

            var iPrediction = this._predictHit(oCoordinate.row, oCoordinate.col);
            if(iPrediction === PREDICT_WATER){
                _aListCellHit.push(oCoordinate);
                _aCarrierCell = new Array();
                //CHANGE CUR DIRECTION
                _aCarrierDir.splice(0,1);
            }
        }
        
        return oCoordinate;
    };
    
    this._predictHit = function(iRow, iCol){
        var iPrediction;
        
        //// PREDICT SHIP HIT
        var oShip = oBoard.isShipOn(iRow, iCol);
        if( oShip !== null ){
            var aShipCell = oShip.getListCellOccupied();
            var aTempList = new Array();
            for(var i=0; i<aShipCell.length; i++){
                if(aShipCell[i].row !== iRow || aShipCell[i].col !== iCol){
                    aTempList.push(aShipCell[i]);
                }
            }
            
            if( this._checkSunk(aTempList) ){
                iPrediction = PREDICT_SUNK;
            } else {
                iPrediction = PREDICT_HIT;
            }
            
        } else {
            iPrediction = PREDICT_WATER; 
        }

        return iPrediction;
    };
    
    
    this._checkSunk = function(aList){
        var bSunk = true;
        
        for(var i=0; i<aList.length; i++){
            if(!aList[i].hit){
                bSunk = false;
            };
        };
        
        return bSunk;
    };
    
    this._setCarrierFound = function(){
        _iSeekingState = AI_FOLLOW_CARRIER;
        
        if(_aListCellHit[0].row === _aListCellHit[1].row){
            _aCarrierDir = new Array(DIR_TOP, DIR_BOT);
        }else {
            _aCarrierDir = new Array(DIR_LEFT, DIR_RIGHT);
        }
        shuffle(_aCarrierDir);
    };
    
    this.resetToStartState = function(){
        _iSeekingState = AI_FIND_DIRECTION;
        _iState = AI_STATE_NEW_COORDINATE;
        _oLastDirection = null;
        _aListCellHit = new Array();
    };
    
    this._setViableDirection = function(oPos){
        _aDirections = new Array();
        _aDirections = s_oBoardUtility.getCrossDir(oPos.row, oPos.col);

        for(var i=_aDirections.length-1; i>=0; i--){
            var oNeighbor = s_oBoardUtility.getNeighborByDir(oPos.row, oPos.col, _aDirections[i]);
            if(oBoard.getCellState(oNeighbor.row, oNeighbor.col) === CELL_STATE_WATER){
                _aDirections.splice(i,1);
            }
        }
    };
    
    this._removeDirection = function(){
        var iIndex = _aDirections.indexOf(_oLastDirection);
        _aDirections.splice(iIndex,1);
        
        _oLastDirection = null;
    };
    
    this._removeWaterCell = function(){
        for(var i=_aListCellHit.length-1; i>=0; i--){
            if(oBoard.getCellState(_aListCellHit[i].row, _aListCellHit[i].col) === CELL_STATE_WATER){
                _aListCellHit.splice(i,1);
            }
        }
    };
    
    this._init(oBoard);
}


