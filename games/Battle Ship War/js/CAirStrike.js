function CAirStrike(oParentContainer){
    
    var _oAirStrike;
    var _oParent;
    
    var _pAnimPos = {start:{x:CANVAS_WIDTH + 200, y: CANVAS_HEIGHT - 400}, end:{x:-250, y:-300}};
    
    this._init = function(oParentContainer){
        _oAirStrike = new createjs.Container();
        _oAirStrike.x = _pAnimPos.start.x;
        _oAirStrike.y = _pAnimPos.start.y;
        _oAirStrike.scaleX = _oAirStrike.scaleY = 0.6;
        oParentContainer.addChild(_oAirStrike);
        
        var oSprite = s_oSpriteLibrary.getSprite('air');
        var oStriker = createBitmap(oSprite);
        oStriker.regX = oSprite.width/2;
        oStriker.regY = oSprite.height/2;
        _oAirStrike.addChild(oStriker);
        
        var oSprite = s_oSpriteLibrary.getSprite('air_shadow');
        var oShadow = createBitmap(oSprite);
        oShadow.x = 50;
        oShadow.y = 500;
        oShadow.scaleX = oShadow.scaleY = 0.75;
        oShadow.regX = oSprite.width/2;
        oShadow.regY = oSprite.height/2;
        _oAirStrike.addChild(oShadow);

    };

    this.unload = function(){
        oParentContainer.removeChild(_oAirStrike);
    };

    this.endAnim = function(oStart, oEnd, iSpeed){
        playSound("air_strike", 1, false);
        
        _oAirStrike.x = oStart.x;
        _oAirStrike.y = oStart.y;

        createjs.Tween.get(_oAirStrike).to({x:oEnd.x, y:oEnd.y}, iSpeed).call(function(){
            _oParent.unload();
        });
    };

    this.launch = function(){
        playSound("air_strike", 1, false);
        
        _oAirStrike.x = _pAnimPos.start.x;
        _oAirStrike.y = _pAnimPos.start.y;

        s_oGame.setNumMissileShot(NUM_BOMB_AIRSTRIKE);
        
        createjs.Tween.get(_oAirStrike).to({x:_pAnimPos.end.x, y:_pAnimPos.end.y}, 2000, createjs.Ease.cubicIn);
        
        
        
        var aList = this._getCellToHit();
        setTimeout(function(){
            for(var i=0; i<NUM_BOMB_AIRSTRIKE; i++){
                var oMissile = new CMissile(oParentContainer);
                var oStartPos = {x:_oAirStrike.x, y:_oAirStrike.y};
                var oEndCell = {row: aList[i].row, col: aList[i].col};
                var iTime = 0.8 + Math.random()*0.4;
                oMissile.launchAirMissile(oStartPos, oEndCell, iTime);
            }
            
        }, 1100);
    };


    this._getCellToHit = function(){
        var oBoard = s_oGame.getBoard(OPPONENT);
        
        var aFreeCell = new Array();
        for(var i=0; i<NUM_CELL; i++){
            for(var j=0; j<NUM_CELL; j++){
                if(oBoard.getCellState(i,j) === CELL_STATE_VOID){
                    var aNeighborList = s_oBoardUtility.getCrossNeighbor(i,j);
                    var bCellPermitted = true;
                    for(var k=0; k<aNeighborList.length; k++){
                        var oNeighbor = aNeighborList[k];
                        if(oBoard.getCellState(oNeighbor.row,oNeighbor.col) === CELL_STATE_HIT){
                            bCellPermitted = false;
                        }
                    }
                    
                    if(bCellPermitted){
                        aFreeCell.push({row: i, col: j});
                    }
                }
            }
        }

        do{
            var aList = new Array();
            for(var i=0; i<NUM_BOMB_AIRSTRIKE; i++){
                var iRandomIndex = Math.floor( Math.random()*aFreeCell.length );
                aList.push( aFreeCell[iRandomIndex] );
            }                   
        } while (this._checkNearCell(aList));
        
        return aList;
        
    };
    
    this._checkNearCell = function(aList){
        for(var i=0; i<aList.length-1; i++){
            var oCurCell = aList[i];
            var aNeighborList = s_oBoardUtility.getCrossNeighbor(oCurCell.row, oCurCell.col);
            for(var j=0; j<aNeighborList.length; j++){
                for(var k=i+1; k<aList.length; k++){
                    if(this._isEqual(aList[i], aList[k])){
                        return true;
                    }
                    if(this._isEqual(aNeighborList[j], aList[k])){
                        return true;
                    }
                }
            }
        }
        
        return false;
    };
    
    this._isEqual = function(oCell1, oCell2){
        if(oCell1.row === oCell2.row && oCell1.col === oCell2.col){
            return true;
        } else {
            return false;
        }
    };
    
    _oParent = this;
    this._init(oParentContainer);
}


