function CControlCell(iX, iY, oParentContainer, iRow, iCol){
    
    var _iState;
    
    var _oCell;
    var _oHighlight;
    var _oSprite;
    
    this._init = function(iX, iY, oParentContainer, iRow, iCol){
        _iState = CELL_STATE_VOID;
        
        _oCell = new createjs.Container();
        _oCell.x = iX;
        _oCell.y = iY;
        oParentContainer.addChild(_oCell);
        
        _oSprite = new createSprite(s_oControlCellSpritesheet,"void", 0,0,0,0);
        _oCell.addChild(_oSprite);
        
        _oHighlight = new createSprite(s_oControlCellSpritesheet,"hit", 0,0,0,0);
        _oHighlight.alpha = 0;
        _oCell.addChild(_oHighlight);
        
        var oPiece = new createjs.Shape();
        oPiece.graphics.beginFill("rgba(158,0,0,0.01)").drawRect(-CONTROL_CELL_DIM/2, -CONTROL_CELL_DIM/2, CONTROL_CELL_DIM, CONTROL_CELL_DIM);
        _oCell.addChild(oPiece);
        
        _oCell.on("mousedown", this._onCellClick, this);
        _oCell.on("mouseover", this._onCellOver, this);
        _oCell.on("mouseout", this._onCellOut, this);
        
    };
    
    this.unload = function(){
        _oCell.off("mousedown", this._onCellClick);
        _oCell.off("mouseover", this._onCellOver);
        _oCell.off("mouseout", this._onCellOut);
        
        oParentContainer.removeChild(_oCell);
    };
    
    this._onCellClick = function(){
        if(_iState !== CELL_STATE_VOID){
            return;
        }
        s_oGame.onCellClick(iRow, iCol);
    };
    
    this._onCellOver = function(){
        if(_iState === CELL_STATE_VOID){
            _oSprite.gotoAndStop("selection");
        }
    };
    
    this._onCellOut = function(){
        if(_iState === CELL_STATE_VOID){
            _oSprite.gotoAndStop("void");
        }
    };
    
    this.setState = function(iState){
        _iState = iState;
        _oSprite.gotoAndStop(iState);
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.highlight = function(){
        createjs.Tween.get(_oHighlight, {loop:true}).to({alpha:1}, 500, createjs.Ease.cubicOut).to({alpha:0}, 500, createjs.Ease.cubicOut);
    };
    
    this.disableHighlight = function(){
        createjs.Tween.removeTweens(_oHighlight);
        _oHighlight.alpha = 0;
    };
    
    this.getPos = function(){
        return {x: _oCell.x, y: _oCell.y};
    };
    
    this._init(iX, iY, oParentContainer, iRow, iCol);
    
}


