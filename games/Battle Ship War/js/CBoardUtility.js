var DIR_TOPRIGHT = "DIR_TOPRIGHT";
var DIR_RIGHT = "DIR_RIGHT";
var DIR_BOTRIGHT = "DIR_BOTRIGHT";
var DIR_TOPLEFT = "DIR_TOPLEFT";
var DIR_LEFT = "DIR_LEFT";
var DIR_BOTLEFT = "DIR_BOTLEFT";
var DIR_TOP = "DIR_TOP";
var DIR_BOT = "DIR_BOT";

function CBoardUtility(aMatrix){
    var _iRow;
    var _iCol;
    
    var _aMatrixMap;
    var _aRadiusMap;
    
    this._init = function(aMatrix){
        _iRow = aMatrix.length;
        _iCol = aMatrix[0].length;
        
        _aRadiusMap = new Array();
        
        _aMatrixMap = new Array();
        for(var i=0; i<_iRow; i++){
            _aMatrixMap[i] = new Array();
            for(var j=0; j<_iCol; j++){
                _aMatrixMap[i][j] = new Array();
            }
        }
        
        this._buildMap();
    };
    
    this._buildMap = function(){
        for(var i=0; i<_iRow; i++){
            for(var j=0; j<_iCol; j++){
                _aMatrixMap[i][j][DIR_TOPRIGHT] = this._setNeighbor(i,j,DIR_TOPRIGHT);
                _aMatrixMap[i][j][DIR_RIGHT] = this._setNeighbor(i,j,DIR_RIGHT);
                _aMatrixMap[i][j][DIR_BOTRIGHT] = this._setNeighbor(i,j,DIR_BOTRIGHT);
                _aMatrixMap[i][j][DIR_TOPLEFT] = this._setNeighbor(i,j,DIR_TOPLEFT);
                _aMatrixMap[i][j][DIR_LEFT] = this._setNeighbor(i,j,DIR_LEFT);
                _aMatrixMap[i][j][DIR_BOTLEFT] = this._setNeighbor(i,j,DIR_BOTLEFT);
                _aMatrixMap[i][j][DIR_TOP] = this._setNeighbor(i,j,DIR_TOP);
                _aMatrixMap[i][j][DIR_BOT] = this._setNeighbor(i,j,DIR_BOT);
            }
        }
    };
    
    this._setNeighbor = function(r, c, iDir){
        var oNextDir = null;
        
        switch(iDir){
            ////r%2 IS USED TO DETECT INDEX COLUMN FOR AN "ODD-ROW" HORIZONTAL LAYOUT HEX GRID. FOR EXAMPLE, IF ROW IS ODD, THE TOPRIGHT NEIGHBOR IS = COL+1. IF ROW IS EVEN, THE TOPRIGHT NEIGHBOR IS = COL. 
            case DIR_TOPRIGHT:{
                    if(r>0 && c<_iCol-1){
                        oNextDir = {row: r-1, col: c+1};
                    }
                    break;
            }
            case DIR_RIGHT:{
                    if(c<_iCol-1){
                        oNextDir = {row: r, col: c+1};
                    }
                    break;
            }
            case DIR_BOTRIGHT:{
                    if(r<_iRow-1 && c<_iCol-1){
                        oNextDir = {row: r+1, col: c+1};
                    }
                    break;
            }
            case DIR_TOPLEFT:{
                    if(r>0 && c > 0){
                        oNextDir = {row: r-1, col: c-1};
                    }
                    break;
            }
            case DIR_LEFT:{
                    if(c>0){
                        oNextDir = {row: r, col: c-1};
                    }
                    break;
            }
            case DIR_BOTLEFT:{
                    
                    if(r<_iRow-1 && c > 0){
                        oNextDir = {row: r+1, col: c-1};
                    }
                    break;
            }
            case DIR_TOP:{
                    if(r>0){
                        oNextDir = {row: r-1, col: c};
                    }
                    break;
            }
            case DIR_BOT:{
                    if(r<_iRow-1){
                        oNextDir = {row: r+1, col: c};
                    }
                    break;
            }
        }
        

        return oNextDir;
    };
    
    this.getNeighborByDir = function(iRow, iCol, iDir){
        return _aMatrixMap[iRow][iCol][iDir];
    };
    
    this.getAllNeighbor = function(iRow, iCol){
        var aNeighborList = new Array();
        
        for (var key in _aMatrixMap[iRow][iCol]) {
            if(_aMatrixMap[iRow][iCol][key]!== null){
                aNeighborList.push(_aMatrixMap[iRow][iCol][key]);
            }
        }
        
        return aNeighborList;
    };
    
    this.getCrossDir = function(iRow, iCol){
        var aNeighborList = new Array();
        
        var aDir = new Array(DIR_TOP, DIR_RIGHT, DIR_BOT, DIR_LEFT);
        
        for(var i=0; i<aDir.length; i++){
            var oNeighbor = this.getNeighborByDir(iRow, iCol, aDir[i])
            if(oNeighbor !== null){
                aNeighborList.push( aDir[i] );
            }
        }

        return aNeighborList;
    };
    
    this.getCrossNeighbor = function(iRow, iCol){
        var aNeighborList = new Array();
        
        var aDir = new Array(DIR_TOP, DIR_RIGHT, DIR_BOT, DIR_LEFT);
        
        for(var i=0; i<aDir.length; i++){
            var oNeighbor = this.getNeighborByDir(iRow, iCol, aDir[i])
            if(oNeighbor !== null){
                aNeighborList.push( oNeighbor );
            }
        }

        return aNeighborList;
    };
    
    this._getMainDiagonal = function(iRow, iCol, aBoard){
        var aList = new Array();

        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTRIGHT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPLEFT, aList, 99, szColor, aBoard);

        return aList;
    };
    
    this._getSecondDiagonal = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_BOTLEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_TOPRIGHT, aList, 99, szColor, aBoard);

        return aList;
    };
    
    this._getRow = function(iRow, iCol, aBoard){
        var aList = new Array();

        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, 99, szColor, aBoard);
        
        return aList;
    };
    
    this._getCol = function(iRow, iCol, aBoard){
        var aList = new Array();
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, DIR_TOP, aList, 99, szColor, aBoard);
        this._findInDirection(iRow, iCol, DIR_BOT, aList, 99, szColor, aBoard);

        
        return aList;
    };
    
    this._getStraightByDirAndRadius = function(iRow, iCol, szDir, iRadius, aBoard){
        var aList = new Array();
        _aRadiusMap = new Array();
        _aRadiusMap.push({radius:iRadius, direction: null});
        
        var szColor = aBoard[iRow][iCol].getColor();
        
        this._findInDirection(iRow, iCol, szDir, aList, iRadius, szColor, aBoard);
        
        return aList;
    };
    
    this._getStraightRowByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        _aRadiusMap = new Array();
        
        _aRadiusMap.push({radius:iRadius, direction: null});
        
        this._findInDirection(iRow, iCol, DIR_LEFT, aList, iRadius);
        this._findInDirection(iRow, iCol, DIR_RIGHT, aList, iRadius);

        return aList;
    };
    
    this._getStraightColByRadius = function(iRow, iCol, iRadius){
        var aList = new Array();
        _aRadiusMap = new Array();

        _aRadiusMap.push({radius:iRadius, direction: null});
        
        this._findInDirection(iRow, iCol, DIR_TOP, aList, iRadius);
        this._findInDirection(iRow, iCol, DIR_BOT, aList, iRadius);
        
        return aList;
    };
    
    this._findInDirection = function(iRow, iCol, iDir, aList, iRadius){
        var iCountRadius = iRadius-1;
        
        if(_aMatrixMap[iRow][iCol][iDir] !== null && iCountRadius>=0){
            var iNextRow = _aMatrixMap[iRow][iCol][iDir].row;
            var iNextCol = _aMatrixMap[iRow][iCol][iDir].col;
            
            aList.push({row: iNextRow, col: iNextCol});
            _aRadiusMap.push({radius:iCountRadius, direction: iDir});
            
            this._findInDirection(iNextRow, iNextCol, iDir, aList, iCountRadius);

        }
    };

    this.getNeighborByShift = function(aList, szDir){
        var aNeighborList = new Array();
        
        for(var i=0; i<aList.length; i++){
            aNeighborList[i] = this.getNeighborByDir(aList[i].row, aList[i].col, szDir);
        };
        
        return aNeighborList;
    };

    this.getReverseDirection = function(szDir){
        var szReverseDir;
        switch(szDir){
            case DIR_RIGHT:{
                    szReverseDir = DIR_LEFT;
                    break;
            }
            case DIR_BOT:{
                    szReverseDir = DIR_TOP;
                    break;
            }
            case DIR_LEFT:{
                    szReverseDir = DIR_RIGHT;
                    break;
            }
            case DIR_TOP:{
                    szReverseDir = DIR_BOT;
                    break;
            }
        }
        
        return szReverseDir;
    };
    
    this._init(aMatrix);
    
    s_oBoardUtility = this;
}

var s_oBoardUtility;
