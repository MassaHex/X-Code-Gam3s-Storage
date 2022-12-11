function CBackground(oParentContainer){
    
    var _iAnimOffset;
    
    var _aSeaPieces;
    
    var _oSeaContainer;
    
    this._init = function(oParentContainer){
        
        _oSeaContainer = new createjs.Container();
        oParentContainer.addChild(_oSeaContainer);

        if(s_bMobile){
            var oSprite = s_oSpriteLibrary.getSprite('sea_mobile');
            var oBg = createBitmap(oSprite);
            _oSeaContainer.addChild(oBg);
        } else {
            _iAnimOffset = 0;
        
            var iXOffset = 0;
            var iYOffset = 0;
            _aSeaPieces = new Array();
            for(var i=0; i<=32; i++){
                _aSeaPieces.push(new CSeaAnimation(iXOffset,iYOffset,_oSeaContainer));
                iXOffset += SEA_PIECE_DIM/2;
                if(i%8 === 0 && i>0){
                    iYOffset += SEA_PIECE_DIM/2;
                    iXOffset = 0;
                }
            };

        }
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_rocks');
        var oBg = createBitmap(oSprite);
        _oSeaContainer.addChild(oBg);

    };
    
    this.update = function(){
        _iAnimOffset++;
        if(_iAnimOffset>1){
            _iAnimOffset = 0;
            for(var i=0; i<_aSeaPieces.length; i++){
                _aSeaPieces[i].update();
            }
        }    
        
    };
    
    this._init(oParentContainer);
}


