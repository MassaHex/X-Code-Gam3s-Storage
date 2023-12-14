function CSeaAnimation(iX, iY, oParentContainer){
    
    
    var _iCurFrame;
    var _iMaxFrame;
    
    var _aPieces;
    
    var _oSea;
    
    this._init = function(iX, iY, oParentContainer){
        _oSea = new createjs.Container();
        _oSea.x = iX;
        _oSea.y = iY;
        _oSea.scaleX = _oSea.scaleY = 0.5;
        oParentContainer.addChild(_oSea);


        _iMaxFrame = 37;
        _iCurFrame = Math.floor( Math.random()*_iMaxFrame);
        
        _aPieces = new Array();
        for(var i=0; i<=_iMaxFrame; i++){
            var oSprite = s_oSpriteLibrary.getSprite('surface_'+i);
            _aPieces[i] = createBitmap(oSprite);
            _aPieces[i].visible = false;
            _oSea.addChild(_aPieces[i]);
        }
        _aPieces[0].visible = true;
    };
    
    this._idle = function(){
        if(_iCurFrame===0){
            _aPieces[_iMaxFrame].visible=false;
            _aPieces[0].visible=true;                
        } else {
            _aPieces[_iCurFrame-1].visible=false;
            _aPieces[_iCurFrame].visible=true;
        }       

        _iCurFrame++;

        if(_iCurFrame>_iMaxFrame){
            _iCurFrame=0;
        }
    };
    
    this.update = function(){
        
            this._idle();
    };
    
    this._init(iX, iY, oParentContainer);
}


