function CRuler(oParentContainer){
    
    var _oRuler;
    var _oHorizontalRuler;
    var _oVerticalRuler;
    var _oMask;
    var _oCoordinatePanel;
    var _oCoordinateText;
    var _oCoordinateTextOutline;
    
    this._init = function(oParentContainer){
        
        _oRuler = new createjs.Container();
        _oRuler.x = -CANVAS_WIDTH/2;
        _oRuler.y = -CANVAS_HEIGHT/2;
        oParentContainer.addChild(_oRuler);
        
        var iWidth = 3;
        _oHorizontalRuler = new createjs.Shape();
        _oHorizontalRuler.graphics.beginFill("rgba(255,255,255,0.6)").drawRect(0, -iWidth/2, CANVAS_WIDTH, iWidth);
        _oRuler.addChild(_oHorizontalRuler);
        
        _oVerticalRuler = new createjs.Shape();
        _oVerticalRuler.graphics.beginFill("rgba(255,255,255,0.6)").drawRect(-iWidth/2, 0, iWidth, CANVAS_HEIGHT);
        _oRuler.addChild(_oVerticalRuler);
        
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(356, 118, 1208, 844);
        _oRuler.addChild(_oMask);
        
        //_oRuler.mask = _oMask;
        _oHorizontalRuler.mask = _oMask;
        _oVerticalRuler.mask = _oMask;
        
        _oCoordinatePanel = new createjs.Container();
        _oCoordinatePanel.mask = _oMask;
        _oRuler.addChild(_oCoordinatePanel);
        
        _oCoordinateTextOutline = new createjs.Text("0", " 34px " + SECONDARY_FONT, "#000000");
        _oCoordinateTextOutline.x = 54;
        _oCoordinateTextOutline.y = -46;
        _oCoordinateTextOutline.textAlign = "left";
        _oCoordinateTextOutline.textBaseline = "middle";
        _oCoordinatePanel.addChild(_oCoordinateTextOutline);
        
        _oCoordinateText = new createjs.Text("0", " 34px " + SECONDARY_FONT, "#ffffff");
        _oCoordinateText.x = 50;
        _oCoordinateText.y = -50;
        _oCoordinateText.textAlign = "left";
        _oCoordinateText.textBaseline = "middle";
        _oCoordinatePanel.addChild(_oCoordinateText);
        
        
    };
    
    this.updatePos = function(iX, iY){
        _oVerticalRuler.x = iX/s_iScaleFactor;
        _oHorizontalRuler.y = iY/s_iScaleFactor;
        
        _oCoordinatePanel.x = iX/s_iScaleFactor;
        _oCoordinatePanel.y = iY/s_iScaleFactor;
        
        var iXCoord = parseInt(iX);
        var iYCoord = parseInt(iY);
        _oCoordinateText.text = "(" +iXCoord + "," + iYCoord + ")";
        _oCoordinateTextOutline.text = "(" +iXCoord + "," + iYCoord + ")";
        
    };
    
    this.show = function(bVal){
        _oRuler.visible = bVal;
    };
    
    this._init(oParentContainer);
    
}


