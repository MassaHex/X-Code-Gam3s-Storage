function CShip(iX, iY, oType, oParentContainer, oAttachBoard){
    
    var _bSandBoxMode;
    var _bHorizontal;
    
    var _iRegXOffset;
    var _iRegYOffset;
    
    var _aMap;
    var _aListCellOccupied;
    var _aDrawPiece;
    
    var _pStartPos;
    var _pStartClickPos;
    var _pTestClickPos;
    
    var _oParent;
    var _oShip;
    var _oSprite;
    var _oShipImage;
    var _oStartShape;
    
    this._init = function(iX, iY, oType, oParentContainer, oAttachBoard){

        _bSandBoxMode = oAttachBoard.getSandBoxMode();
        _bHorizontal = false;

        _iRegXOffset = -4;
        _iRegYOffset = 40;

        _pStartPos = {x: iX, y: iY};
        
        _aMap = oType.map;
        _aListCellOccupied = new Array();
        _aDrawPiece = new Array();
        
        _oShip = new createjs.Container();
        _oShip.x = iX;
        _oShip.y = iY;
        if(_bSandBoxMode){
            _oShip.on("mousedown", this._onShipClick);
            _oShip.on("pressmove", this._onShipMove);
            _oShip.on("dblclick", this._onShipRotate);
            _oShip.on("pressup", this._onShipRelease);
            oParentContainer.addChild(_oShip);
        }

        this.drawMap();
        
        this.drawShip();
        
    };
    
    this.drawMap = function(){
        
        for(var i=0; i<_aDrawPiece.length; i++){
            for(var j=0; j<_aDrawPiece[i].length; j++){
                _oShip.removeChild(_aDrawPiece[i][j]);
            }
        }    
        
        var iStartX = 0;
        var iStartY = 0;
        _aDrawPiece = new Array;
        for(var i=0; i<_aMap.length; i++){
            _aDrawPiece[i] = new Array();
            for(var j=0; j<_aMap[i].length; j++){
                if(_aMap[i][j]){
                    var oPiece = new createjs.Shape();
                    oPiece.graphics.beginFill("rgba(158,158,158,0.01)").drawRect(-CELL_LENGTH/2, -CELL_LENGTH/2, CELL_LENGTH, CELL_LENGTH);
                    oPiece.x = iStartX;
                    oPiece.y = iStartY;
                    _oShip.addChild(oPiece);
                    iStartX += CELL_LENGTH;
                    _aDrawPiece[i][j] = oPiece;
                }
            }
            iStartX = 0;
            iStartY += CELL_LENGTH;
        }    
    };
    
    this.drawShip = function(){
        _oSprite = s_oSpriteLibrary.getSprite(oType.sandbox_sprite);
        _oShipImage = createBitmap(_oSprite);
        _oShipImage.regX = _oSprite.width/2 + _iRegXOffset;
        _oShipImage.regY = _iRegYOffset;
        if(oType === SHIP_CARRIER){
            _oShipImage.regX = _oSprite.width/4;
        };
        _oShip.addChild(_oShipImage);
        
        if(_bSandBoxMode){
            var oSprite = s_oSpriteLibrary.getSprite("shape_"+oType.battle_spritesheet);
            _oStartShape = createBitmap(oSprite);
            _oStartShape.x = iX;
            _oStartShape.y = iY;
            _oStartShape.regX = _oSprite.width/2 + _iRegXOffset - 8;
            _oStartShape.regY = _iRegYOffset - 10;
            if(oType === SHIP_CARRIER){
                _oStartShape.regX = _oSprite.width/4 - 8;
            };
            oParentContainer.addChild(_oStartShape);
        }
        
        
    };
    
    this.unload = function(){
        if(_bSandBoxMode){
            _oShip.off("mousedown", this._onShipClick);
            _oShip.off("pressmove", this._onShipMove);
            _oShip.off("dblclick", this._onShipRotate);
            _oShip.off("pressup", this._onShipRelease);

            oParentContainer.removeChild(_oShip);
        }    
    };  
    
    this._onShipClick = function(evt){
        oAttachBoard.removeShip(_oParent);
        
        _pStartClickPos = {x: evt.localX, y: evt.localY};
        
        if(_bSandBoxMode){
            s_oSandBoxMenu.setActiveShip(_oParent);
        }
        
        _pTestClickPos = {x: evt.localX, y: evt.localY};
    };
    
    this._onShipMove = function(evt){

/*
        _oShip.x = s_oSandBoxMenu.getMousePos().x - _pStartClickPos.x;
        _oShip.y = s_oSandBoxMenu.getMousePos().y - _pStartClickPos.y;
  */
 
        _oShip.x -= _pTestClickPos.x - evt.localX;
        _oShip.y -= _pTestClickPos.y - evt.localY;        
        _pTestClickPos = {x: evt.localX, y: evt.localY};        
                
        oAttachBoard.highlightSnap(_oParent);
        
        //_pStartClickPos = {x: evt.stageX, y: evt.stageY};
    };

    this._onShipRelease = function(){
        oAttachBoard.snapFromRelease(_oParent);
    };
    
    this._onShipRotate = function(){
        _oParent.rotateMap();
        
        oAttachBoard.removeShip(_oParent);
        oAttachBoard.snapFromRelease(_oParent);
    };
    
    this.rotateMap = function(){
        _bHorizontal = !_bHorizontal;
        if(_bHorizontal){
            _oShipImage.rotation = -90;
            
            _oShipImage.scaleY=-1;
            _oShipImage.regY = _oSprite.height -_iRegYOffset;
            
            if(oType === SHIP_CARRIER){
                _oShipImage.regX = _oSprite.width*3/4 - 2;
            };
        } else {
            _oShipImage.rotation = 0;
            
            _oShipImage.scaleY=1;
            _oShipImage.regY = _iRegYOffset;
            
            if(oType === SHIP_CARRIER){
                _oShipImage.regX = _oSprite.width/4;
            };
        }
        

        var aTransposedMap = _aMap[0].map(function(col, i) { 
            return _aMap.map(function(row) { 
                return row[i]; 
            });
        });
        
        _aMap = aTransposedMap;
        _oParent.drawMap();
        _aListCellOccupied = new Array();
    };
    
    this.getShipContainer = function (){
        return _oShip;
    };
    
    this.getMap = function(){
        return _aMap;
    };
    
    this.returnInStartPos = function(){
        _oShip.x = _pStartPos.x;
        _oShip.y = _pStartPos.y;
        _aListCellOccupied = new Array();
        
        if(_bHorizontal){
            this._onShipRotate();
        }
        
        if(_bSandBoxMode){
            s_oSandBoxMenu.setActiveShip(null);
        }
        
        
    };
    
    this.setListCellOccupied = function(aList){
        _aListCellOccupied = new Array();
        for(var i=0; i<aList.length; i++){
            _aListCellOccupied.push(aList[i]);
        };
    };
    
    this.getListCellOccupied = function(){
        return _aListCellOccupied;
    };
    
    this.getPos = function(){
        return {x: _oShip.x, y:_oShip.y};
    };
    
    this.getType = function(){
        return oType;
    };
    
    this.isHorizontal = function(){
        return _bHorizontal;
    };
    
    this.hitShip = function(iRow, iCol){
        for(var i=0; i<_aListCellOccupied.length; i++){
            if(_aListCellOccupied[i].row === iRow && _aListCellOccupied[i].col === iCol){
                _aListCellOccupied[i].hit = true;
            };
        };
    };
    
    this.isPartiallyDamaged = function(){
        var bDamaged = false;
        for(var i=0; i<_aListCellOccupied.length; i++){
            if(_aListCellOccupied[i].hit){
                bDamaged =  true;
            };
        };
        
        return bDamaged;
    };
    
    this.isSunk = function(){
        var bSunk = true;
        for(var i=0; i<_aListCellOccupied.length; i++){
            if(!_aListCellOccupied[i].hit){
                bSunk = false;
            };
        };
        
        return bSunk;
    };
    
    this.debugShips = function(){
        oParentContainer.addChild(_oShip);
    };
    
    this._init(iX, iY, oType, oParentContainer, oAttachBoard);
    _oParent = this;
}


