function CSandBoxCell(iX, iY, iRow, iCol, oParentContainer){

    var _bShipExist;

    var _iRow;
    var _iCol;
    
    var _oCellContainer;
    var _oParent;
    var _oPiece;
    var _oClickArea;
    var _oOccupiedArea;
    var _oHighlight;
    
    this._init = function(iX, iY, iRow, iCol, oParentContainer){
        
        _bShipExist = false;
        
        _iRow = iRow;
        _iCol = iCol;
        
        _oCellContainer = new createjs.Container();
        _oCellContainer.x = iX;
        _oCellContainer.y = iY;
        oParentContainer.addChild(_oCellContainer);

        _oPiece = null;

        
        var oSprite = s_oSpriteLibrary.getSprite('highlight');
        _oHighlight = createBitmap(oSprite);
        _oHighlight.regX = oSprite.width/2;
        _oHighlight.regY = oSprite.height/2;
        _oHighlight.alpha = 0.8;
        _oHighlight.visible = false;
        _oCellContainer.addChild(_oHighlight);
        
        var oSprite = s_oSpriteLibrary.getSprite('occupied_area');
        _oOccupiedArea = createBitmap(oSprite);
        _oOccupiedArea.regX = oSprite.width/2;
        _oOccupiedArea.regY = oSprite.height/2;
        _oOccupiedArea.visible = false;
        _oCellContainer.addChild(_oOccupiedArea);
        
        
        _oClickArea = new createjs.Shape();
        _oClickArea.graphics.beginFill("rgba(158,0,0,0.01)").drawRect(-CELL_LENGTH/2, -CELL_LENGTH/2, CELL_LENGTH, CELL_LENGTH);
        _oCellContainer.addChild(_oClickArea);
        
       
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oCellContainer);
    };  
    
    this.setClickableArea = function(bVal){  
        _oClickArea.visible = bVal;       
    }; 

    this.highlightDeniedArea = function(bVal){
        _oOccupiedArea.visible = bVal;
    };
    
    this.highlight = function(bVal){
        _oHighlight.visible = bVal;
    };

    this.isHighlight = function(){
        return _oHighlight.visible;
    };

    this._onCellClick = function(){
        
    };
    
    this.setActive = function(bVal){
        if(_oPiece !== null){
            _oPiece.setActive(bVal);
        };
    };
    
    this.setVisible = function(bVal){
        _oCellContainer.visible = bVal;
    };
    
    this.setShip = function(bVal){
        _bShipExist = bVal;
    };
    
    this.isShipOn = function(){
        return _bShipExist;
    };
    
    this.getPos = function(){
        return {x: iX, y:iY};
    };

    this.getLogicPos = function(){
        return {row: iRow, col: iCol};
    };
    
    this.hitTest = function(iX, iY){
        return _oCellContainer.hitTest(iX, iY);
    };
    
    _oParent = this;
    this._init(iX, iY, iRow, iCol, oParentContainer);
}