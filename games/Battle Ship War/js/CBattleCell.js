function CBattleCell(iX, iY, oParentContainer, iRow, iCol, oParticleContainer){
    
    var _iState;
    
    var _oCell;
    var _oSprite;
    var _oMissileWater;
    var _oMissileExplosion;
    var _oFire;
    var _oFinalExplosion;
    
    this._init = function(iX, iY, oParentContainer, iRow, iCol, oParticleContainer){
        _iState = CELL_STATE_VOID;
        
        _oFire = null;
        _oFinalExplosion = null;
        
        _oCell = new createjs.Container();
        _oCell.x = iX;
        _oCell.y = iY;
        oParentContainer.addChild(_oCell);
        
        _oSprite = new createSprite(s_oBattleCellSpritesheet,"void", 0,0,0,0);
        _oCell.addChild(_oSprite);
        
        _oMissileWater = new createSprite(s_oMissileWaterSpritesheet,"stop", 0,0,0,0);
        _oMissileWater.x = iX + oParentContainer.x;
        _oMissileWater.y = iY + oParentContainer.y;
        oParticleContainer.addChild(_oMissileWater);

        _oMissileExplosion = new createSprite(s_oMissileExplosionSpritesheet,"stop", 0,0,0,0);
        _oMissileExplosion.x = iX + oParentContainer.x;
        _oMissileExplosion.y = iY + oParentContainer.y;
        oParticleContainer.addChild(_oMissileExplosion);

    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oCell);
    };

    this.getPos = function(){
        return {x: iX, y:  iY};
    };
    
    this.debug = function(){
        var _oScoreText = new createjs.Text(iRow +","+ iCol," 14px Arial", "#ffffff");
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "middle";
        _oScoreText.lineWidth = 200;
        _oCell.addChild(_oScoreText);
    };
    
    this.playWater = function(){
        _oMissileWater.gotoAndPlay("idle");
        playSound("missile_water", 1, false);
    };
    
    this.playExplosion = function(){
        _oMissileExplosion.gotoAndPlay("idle");
        playSound("missile_explosion", 1, false);
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.setState = function(iState){
        _iState = iState;
        
        _oSprite.gotoAndStop(iState);
        if(iState === CELL_STATE_SUNK){
            _oSprite.gotoAndStop(CELL_STATE_HIT);
        }
    };
    
    this.setFinalExplosion = function(){
        playSound("missile_sink", 1, false);
        
        _oFinalExplosion = new createSprite(s_oFinalExplosionSpritesheet,"idle", 0,0,0,0);
        _oFinalExplosion.x = iX + oParentContainer.x;
        _oFinalExplosion.y = iY + oParentContainer.y;
        oParticleContainer.addChild(_oFinalExplosion);
    };
    
    this.setFire = function(){
        _oFire = new createSprite(s_oFireSpritesheet,"idle", 0,0,0,0);
        _oFire.x = iX + oParentContainer.x;
        _oFire.y = iY + oParentContainer.y;
        oParticleContainer.addChild(_oFire);
    };
    
    this.removeFire = function(){
        if(_oFire !== null){
            _oFire.gotoAndStop("stop");
        }
    };
    
    this._init(iX, iY, oParentContainer, iRow, iCol, oParticleContainer);
}


