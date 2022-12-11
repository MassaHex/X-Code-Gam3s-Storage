function CTurnWaiter(oParent) {
   
    var _oGroup;
    var _oText;
    var _oRect;
    var _oTextDots;
    var _oImage;

    this._init = function(oParent) {
    	_oGroup = new createjs.Container();
    	_oGroup.x = 0;
    	_oGroup.y = 0;

    	var Width = CANVAS_WIDTH;
    	var Height = CANVAS_HEIGHT;

    	var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.2)").drawRect(0, 0, Width, Height);
    	_oRect = new createjs.Shape(graphics);
    	_oRect.on("click", function() { });

    	_oText = new createjs.Text("", "60px " + PRIMARY_FONT, "#ffffff");
    	_oText.x = 0;
    	_oText.y = -55;
    	_oText.textAlign = "center";
    	_oText.textBaseline = "alphabetic";
    	_oText.lineWidth = 800;

    	_oTextDots = new createjs.Text("","180px "+PRIMARY_FONT, "#ffffff");
    	_oTextDots.x = - 85;
    	_oTextDots.y = 10;
    	_oTextDots.textAlign = "left";
    	_oTextDots.textBaseline = "alphabetic";
    	_oTextDots.lineWidth = 800;

        _oImage = new createSprite(s_oWaitPlayerSpritesheet,"idle", 0,0,0,0);
        _oImage.x = CANVAS_WIDTH/2 - 270;
        _oImage.y = CANVAS_HEIGHT/2 - 200;

    	_oGroup.addChild(_oRect, _oText,_oTextDots, _oImage);
       
    	oParent.addChild(_oGroup);

    	This.hide();
    };
    
    this.show = function(szText) {
    	if (szText == null)
    		szText = "";
    	_oText.text = szText;
    	_oGroup.visible = true;
    };

    this.hide = function() {
    	_oText.text = "";
    	_oGroup.visible = false;
    };
   
    this.unload = function(){
            _oRect.off("click", function(){});
            oParent.removeChild(_oGroup);
    };

    this.update = function() {
            if (_oGroup.visible != true)
                    return;
    };
        
    var This = this;
    this._init(oParent);
    
}; 
