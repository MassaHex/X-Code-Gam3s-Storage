function CMissile(oParentContainer, oUnderWaterContainer){
    var _bMissileArrived;
    
    var _iRowDest;
    var _iColDest;
    var _iMissileType;
    
    var m_iCntFrames;
    var m_iMaxFrames;
    
    var m_pPrev;
    var m_pCurPos;
    var m_pDir;
    var m_pSub;
    var m_iAngle;
    var m_iDir;
    
    var m_aMissilePoints;
    
    var _oMissile;
    var _oMissileImage;
    var _oMissileReactor;
    var _oMissileSmoke;
    
    this._init = function(oParentContainer, oUnderWaterContainer){
        
        _bMissileArrived = true;
        
        _iMissileType = MISSILE_TYPE_NORMAL;
        
        m_iCntFrames = 0;
        m_iMaxFrames = 50;
        
        m_pPrev = new CVector2(0, 0);
        m_pDir = new CVector2(0, -1);
        m_pCurPos = new CVector2(0, 0);
        m_iAngle = 0;
        
        _oMissile = new createjs.Container();
        oParentContainer.addChild(_oMissile);
        
        _oMissileReactor = new createSprite(s_oMissileReactorSpritesheet,"idle", 0,0,0,0);
        _oMissileReactor.x = -1;
        _oMissileReactor.y = 28;
        _oMissileReactor.visible = false;
        _oMissile.addChild(_oMissileReactor);
        
        var oSprite = s_oSpriteLibrary.getSprite("missile");
        _oMissileImage = createBitmap(oSprite);
        _oMissileImage.regX = oSprite.width/2;
        _oMissileImage.regY = oSprite.height/2;
        _oMissile.addChild(_oMissileImage);

        _oMissileSmoke = new createSprite(s_oMissileSmokeSpritesheet,"stop", 0,0,0,0);
        oParentContainer.addChild(_oMissileSmoke);

        

    };
    
    this.reset = function(iX, iY, iDir){
        m_pCurPos.x = iX;
        m_pCurPos.y = iY;
        m_iDir = iDir;
        
        m_pPrev = new CVector2(iX, iY);
        m_pDir = new CVector2(0, -1);
        m_pCurPos = new CVector2(iX, iY);
        m_iAngle = 0;
    };
    
    this._findMiddlePoint = function(p0, p1, iPlayerType){
        var t0; 
        var fFactorK = 0.2;
        var iHeightMissile = 200;
        
        if(iPlayerType === PLAYER){
            if (p0.y > p1.y) {
                    if ( p0.x > p1.x ){
                            t0 = new createjs.Point(p0.x-((p0.x-p1.x)*fFactorK), p1.y - iHeightMissile);
                    }else {
                            t0 = new createjs.Point(p1.x+((p1.x-p0.x)*fFactorK), p1.y - iHeightMissile);
                    }

            }else {
                    if ( p0.x > p1.x ){
                            t0 = new createjs.Point(p0.x-((p0.x-p1.x)*fFactorK), p0.y - iHeightMissile);
                    }else {
                            t0 = new createjs.Point(p1.x+((p1.x-p0.x)*fFactorK), p0.y - iHeightMissile);
                    }
            }
        } else {
            
            if (p0.y > p1.y) {
                    if ( p0.x > p1.x ){
                            t0 = new createjs.Point(p0.x + ((p0.x - p1.x) * fFactorK), p1.y - iHeightMissile);
                    }else {

                            t0 = new createjs.Point(p1.x-((p1.x-p0.x)*fFactorK), p1.y - iHeightMissile);
                    }

            }else {
                    if ( p0.x > p1.x ){
                            t0 = new createjs.Point(p1.x + ((p1.x - p0.x) * fFactorK), p0.y - iHeightMissile);
                    }else {

                            t0 = new createjs.Point(p0.x-((p0.x-p1.x)*fFactorK), p0.y - iHeightMissile);
                    }
            }
        }

        return t0;
    };

    this.launchMissileForPlayer = function(iRow, iCol){
        
        _oMissile.visible = true;

        var oPos = this.getLaunchCoordinate(iRow, iCol, PLAYER);
        
        var oStartPos = oPos.start;
        oStartPos.y -= 17;
        var oEndPos = oPos.end;


        var p0 = new createjs.Point(oStartPos.x, oStartPos.y);      
        var p1 = new createjs.Point(oEndPos.x, oEndPos.y);

        if (oPos.ship !== null && oPos.ship.getType().battle_spritesheet === 4) {
                _iMissileType = MISSILE_TYPE_TORPEDO;
                var oSprite = s_oSpriteLibrary.getSprite("torpedo");
                _oMissileImage.image = oSprite;
                oUnderWaterContainer.addChild(_oMissile);
                
                playSound("missile_torpedo", 1, false);
                
                _bMissileArrived = false;

                m_aMissilePoints = new Array(new createjs.Point(p0.x,p0.y+17),p1);

               var iDir = (Math.atan2(p1.y - p0.y, p1.x - p0.x)) * (180 / Math.PI);
                _oMissile.rotation = iDir + 90;
                _oMissile.x = p0.x;
                _oMissile.y = p0.y+17;
                
        }else {
                _iMissileType = MISSILE_TYPE_NORMAL;
                var oSprite = s_oSpriteLibrary.getSprite("missile");
                _oMissileImage.image = oSprite;
                oParentContainer.addChild(_oMissile);
                
                playSound("missile_launch", 1, false);
                
                _bMissileArrived = false;
                
                var t0 = this._findMiddlePoint(p0, p1, PLAYER);
            
                m_aMissilePoints = new Array(p0,t0,p1);

                _oMissileSmoke.gotoAndPlay("idle");
                _oMissileSmoke.x = oStartPos.x;
                _oMissileSmoke.y = oStartPos.y;

                _oMissileReactor.visible = true;
                
                this.reset(p0.x, p0.y,1);
        }

        return true;
    };
    
    this.launchMissileForOpponent = function(iRow, iCol){
        _iMissileType = MISSILE_TYPE_NORMAL;
        var oSprite = s_oSpriteLibrary.getSprite("missile");
        _oMissileImage.image = oSprite;
        oParentContainer.addChild(_oMissile);
        
        playSound("missile_launch", 1, false);
        
        _bMissileArrived = false;
        _oMissile.visible = true;

        var oPos = this.getLaunchCoordinate(iRow, iCol, OPPONENT);
        
        var oStartPos = oPos.start;
        oStartPos.y -= 17;
        var oEndPos = oPos.end;


        var p0 = new createjs.Point(oStartPos.x, oStartPos.y);      
        var p1 = new createjs.Point(oEndPos.x, oEndPos.y);

        var t0 = this._findMiddlePoint(p0, p1, OPPONENT);

        m_aMissilePoints = new Array(p0,t0,p1);

        _oMissileSmoke.gotoAndPlay("idle");
        _oMissileSmoke.x = oStartPos.x;
        _oMissileSmoke.y = oStartPos.y;

        this.reset(p0.x, p0.y,1);
    };
    
    this.getLaunchCoordinate = function(iRow, iCol, iPlayer){
        _iRowDest = iRow;
        _iColDest = iCol;

        var oShipSelected = null;
        if(iPlayer === PLAYER){
            oShipSelected = s_oGame.getRandomAvailableShip(PLAYER);
        
            var aListCellOccupied = oShipSelected.getListCellOccupied();
            var aTempList = new Array();
            for(var i=0; i<aListCellOccupied.length; i++){
                aTempList.push(aListCellOccupied[i]);
            }
            
            for(var i=aTempList.length-1; i>=0; i--){
                if(aTempList[i].hit){
                    aTempList.splice(i,1);
                }
            }
            var oRandomCell = aTempList[ Math.floor(Math.random()*aTempList.length) ];
            var oStartPos = s_oGame.getCellPos(oRandomCell.row, oRandomCell.col, PLAYER);
            var oEndPos = s_oGame.getCellPos(iRow, iCol, OPPONENT);
        } else {
            
            var oStartPos = s_oGame.getBoardPos(OPPONENT);
            var oEndPos = s_oGame.getCellPos(iRow, iCol, PLAYER);
        }
        
        
        return {start : oStartPos, end: oEndPos, ship: oShipSelected};
    };
    
    this.setPos = function(iX, iY){
        m_pPrev = new CVector2(m_pCurPos.x, m_pCurPos.y);

        m_pCurPos.x = iX;
        m_pCurPos.y = iY;

        m_pSub = new CVector2(iX, iY);
        m_pSub.subV(m_pPrev);
        m_pSub.normalize();
        m_iAngle = angleBetweenVector2D(m_pDir, m_pSub);
        if(m_pPrev.getX() < iX){
            m_iAngle = radiansToDegree(m_iAngle);
        } else {
            m_iAngle = -radiansToDegree(m_iAngle);
        }
    };
    
    this.launchAirMissile = function(oStartPos, oEndCell, iSpeedFactor){
        var oEndPos = s_oGame.getCellPos(oEndCell.row, oEndCell.col, OPPONENT);
        
        _oMissile.x = oStartPos.x;
        _oMissile.y = oStartPos.y;
        _oMissile.alpha = 0;
        _oMissile.rotation = -70;

        var iSpeedFactor = iSpeedFactor;

        _oMissileSmoke.gotoAndPlay("idle");
        _oMissileSmoke.x = oStartPos.x;
        _oMissileSmoke.y = oStartPos.y;

        createjs.Tween.get(_oMissile).to({alpha:1}, 300*iSpeedFactor).call(function(){
            _oMissileReactor.visible = true;
            new CTremble(_oMissileImage, 300, 10, 1);
            
            playSound("missile_launch", 1, false);
            
        });

        createjs.Tween.get(_oMissile).to({x:oEndPos.x}, 1400*iSpeedFactor, createjs.Ease.quartIn);

        var iHeight = 50 + Math.random()*50;
        createjs.Tween.get(_oMissile).to({y:oStartPos.y + iHeight}, 700*iSpeedFactor, createjs.Ease.cubicOut).to({y: oEndPos.y}, 700*iSpeedFactor, createjs.Ease.cubicIn).call(function(){
            s_oGame.onMissileArrived(oEndCell.row, oEndCell.col);
            _oMissile.visible = false;
        });
    };
    

    this.updateTorpedo = function(){
        if(_bMissileArrived){
            return;
        }
        
        m_iCntFrames++;
        if (m_iCntFrames > m_iMaxFrames) {
                m_iCntFrames = 0;	
        }
        var fLerp = easeInQuart( m_iCntFrames, 0, 1, m_iMaxFrames);

        var pPos = new createjs.Point( m_aMissilePoints[0].x + fLerp * ( m_aMissilePoints[1].x - m_aMissilePoints[0].x ), 
                                                                                                                m_aMissilePoints[0].y + fLerp * ( m_aMissilePoints[1].y - m_aMissilePoints[0].y ));	
        _oMissile.x = pPos.x;
        _oMissile.y = pPos.y;
        if (fLerp===1) {

                m_iCntFrames = 0;
                _bMissileArrived = true;
                _oMissile.visible = false;
                
                s_oGame.onMissileArrived(_iRowDest, _iColDest);

        }
    };
    
    this.updateMissile = function(){
        if(_bMissileArrived){
            return;
        }
        
        m_iCntFrames++;
        if (m_iCntFrames > m_iMaxFrames) {
                m_iCntFrames = 0;	
        }
        var fLerp = easeInQuart( m_iCntFrames, 0, 1, m_iMaxFrames);

        var pPos = this.quad(fLerp, m_aMissilePoints);

        this.setPos(pPos.x, pPos.y);
        this.updateGfx();
        if (fLerp===1) {
                m_iCntFrames = 0;
                _bMissileArrived = true;
                _oMissile.visible = false;
                
                s_oGame.onMissileArrived(_iRowDest, _iColDest);
        }
    };
    
    this.quad = function(t,p){
        var result = new createjs.Point();
        var oneMinusTSq = (1-t) * (1-t);
        var TSq = t*t;
        result.x = oneMinusTSq*p[0].x+2*(1-t)*t*p[1].x+TSq*p[2].x;
        result.y = oneMinusTSq*p[0].y+2*(1-t)*t*p[1].y+TSq*p[2].y;
        return result;
    };
    
    this.updateGfx = function(){
        _oMissile.x = m_pCurPos.x;
        _oMissile.y = m_pCurPos.y;

        _oMissile.rotation = m_iAngle * m_iDir;
    };
    
    this.update = function(){
        switch(_iMissileType){
            case MISSILE_TYPE_NORMAL:{
                    this.updateMissile();
                    break;
            }
            case MISSILE_TYPE_TORPEDO:{
                    this.updateTorpedo();
                    break;
            }
            case MISSILE_TYPE_AIRSTRIKE:{
                    //this.updateAirStrike();
                    break;
            }
        }
    };
    
    this._init(oParentContainer, oUnderWaterContainer);
}


