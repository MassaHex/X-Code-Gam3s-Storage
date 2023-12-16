function CAnimationSettings(){
    
    this._init = function(){
        this._initShips();
        this._initBattleCell();
        this._initMissile();
        this._initEnvironment();
        this._initGUI();
    };

    this._initShips = function(){
        s_aShipSpritesheet = new Array();
        for(var i=0; i<6; i++){
            var oSprite = s_oSpriteLibrary.getSprite("ship"+i+"_3d");
            var iWidth = oSprite.width/6;
            var iHeight = oSprite.height/5;
            var oData = {   
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: iWidth, height: iHeight, regX: 0, regY: 0}, 
                            animations: {idle:[0,29], stop:[30,30]}
                       };

            s_aShipSpritesheet[i] = new createjs.SpriteSheet(oData);
        }
        
    };

    this._initBattleCell = function(){
        var oSprite = s_oSpriteLibrary.getSprite("cell_battle");
        var iWidth = oSprite.width/3;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {void:[0], water:[1], hit:[2]}
                   };

        s_oBattleCellSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("cell_control");
        var iWidth = oSprite.width/5;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {void:[0], hit:[1], sunk:[2], water:[3], selection:[4]}
                   };

        s_oControlCellSpritesheet = new createjs.SpriteSheet(oData);
        
    };

    this._initMissile = function(){
        var oSprite = s_oSpriteLibrary.getSprite("missile_reactor");
        var iWidth = oSprite.width/2;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0,1]}
                   };

        s_oMissileReactorSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("missile_smoke");
        var iWidth = oSprite.width/5;
        var iHeight = oSprite.height/10;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2+20, regY: iHeight/2}, 
                        animations: {idle:[0,49, "stop"], stop:[50,50]}
                   };

        s_oMissileSmokeSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("missile_water");
        var iWidth = oSprite.width/7;
        var iHeight = oSprite.height/4;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2 + 40}, 
                        animations: {idle:[0,27, "stop"], stop:[28,28]}
                   };

        s_oMissileWaterSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("missile_explosion");
        var iWidth = oSprite.width/6;
        var iHeight = oSprite.height/5;
        var oData = {   framerate:15,
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0,29, "stop"], stop:[30,30]}
                   };

        s_oMissileExplosionSpritesheet = new createjs.SpriteSheet(oData);

    };

    this._initEnvironment = function(){
        var oSprite = s_oSpriteLibrary.getSprite("fire");
        var iWidth = oSprite.width/5;
        var iHeight = oSprite.height/6;
        var oData = {   framerate:15,
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight - 6}, 
                        animations: {idle:[0,29], stop:[30,30]}
                   };

        s_oFireSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("final_explosion");
        var iWidth = oSprite.width/8;
        var iHeight = oSprite.height/5;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0,39, "stop"], stop:[40,40]}
                   };

        s_oFinalExplosionSpritesheet = new createjs.SpriteSheet(oData);
        
        var oSprite = s_oSpriteLibrary.getSprite("wait_player");
        var iWidth = oSprite.width/9;
        var iHeight = oSprite.height/6;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0,49], stop:[50,50]}
                   };

        s_oWaitPlayerSpritesheet = new createjs.SpriteSheet(oData);
        
    };

    this._initGUI = function(){
        var oSprite = s_oSpriteLibrary.getSprite("but_radar");
        var iWidth = oSprite.width/15;
        var iHeight = oSprite.height/4;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {idle:[0,58], disable:[59,59]}
                   };

        s_oRadarSpritesheet = new createjs.SpriteSheet(oData);
    };

    this._init();

}

var s_aShipSpritesheet;
var s_oBattleCellSpritesheet;
var s_oControlCellSpritesheet;
var s_oMissileReactorSpritesheet;
var s_oMissileSmokeSpritesheet;
var s_oMissileWaterSpritesheet;
var s_oMissileExplosionSpritesheet;
var s_oFireSpritesheet;
var s_oFinalExplosionSpritesheet;
var s_oWaitPlayerSpritesheet;
var s_oRadarSpritesheet;