function CToggle(iXPos,iYPos,oSprite,bActive, oParentContainer){
    var _bActive;
    var _bDisabled;
    
    var _iListenerIDMouseDown;
    var _iListenerIDPressUp;
    var _iListenerIDMouseOver;
    var _iListenerIDMouseOut;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    
    this._init = function(iXPos,iYPos,oSprite,bActive, oParentContainer){
        _bDisabled = false;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
         _bActive = bActive;
		_oButton = createSprite(oSpriteSheet, "state_"+_bActive,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.stop();
        
        oParentContainer.addChild(_oButton);
        
        this._initListener();
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.unload = function(){
        if(s_bMobile){
            _oButton.off("mousedown", _iListenerIDMouseDown);
            _oButton.off("pressup" , _iListenerIDPressUp);
        } else {
            _oButton.off("mousedown", _iListenerIDMouseDown);
            _oButton.off("mouseover", _iListenerIDMouseOver);
            _oButton.off("mouseout", _iListenerIDMouseOut);
            _oButton.off("pressup" , _iListenerIDPressUp);
        }
        
       oParentContainer.removeChild(_oButton);
    };
    
    this._initListener = function(){
        if(s_bMobile){
            _iListenerIDMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _iListenerIDPressUp     = _oButton.on("pressup" , this.buttonRelease);
        } else {
            _iListenerIDMouseDown   = _oButton.on("mousedown", this.buttonDown);
            _iListenerIDMouseOver   = _oButton.on("mouseover", this.buttonOver);
            _iListenerIDMouseOut   = _oButton.on("mouseout", this.buttonOut);
            _iListenerIDPressUp     = _oButton.on("pressup" , this.buttonRelease);
        }      
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.setActive = function(bActive){
        _bActive = bActive;
        _oButton.gotoAndStop("state_"+_bActive);
    };
    
    this.buttonRelease = function(){
        if(_bDisabled){
            return;
        }
        
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        
        playSound("click",1,false);
        
        _bActive = !_bActive;
        _oButton.gotoAndStop("state_"+_bActive);

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_bActive);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisabled){
            return;
        }
        
        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.buttonOver = function(evt){
        if(!s_bMobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
            
            if(_aCbCompleted[ON_MOUSE_OVER]){
                _aCbCompleted[ON_MOUSE_OVER].call(_aCbOwner[ON_MOUSE_OVER]);
            }
        }   
    };
    
    this.buttonOut = function(evt){
        if(!s_bMobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
            
            if(_aCbCompleted[ON_MOUSE_OUT]){
                _aCbCompleted[ON_MOUSE_OUT].call(_aCbOwner[ON_MOUSE_OUT]);
            }
        } 
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.getPos = function(){
        return {x: _oButton.x, y: _oButton.y};
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
    };
    
    this.enable = function(bVal){
        if(bVal){
            _oButton.gotoAndPlay("state_true");
            this.setClickable(true);
        } else {
            _oButton.gotoAndPlay("state_false");
            this.setClickable(false);
        }
    };
    
    this._init(iXPos,iYPos,oSprite,bActive, oParentContainer);
}