function CEndPanel(iWinner){
    var _iIdInterval;
    
    var _oParent;
    var _oBg;
    var _oGroup;
    var _oFade;
    
    var _oMsgTextBack;
    var _oMsgText;
    var _oScoreTextBack;
    var _oScoreText;
    
    this._init = function(iWinner){
        _iIdInterval = null;
        
        setVolume("soundtrack", 1);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.7;
        
        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSpriteBg);
        _oBg.regX = oSpriteBg.width/2;
        _oBg.regY = oSpriteBg.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        
	_oMsgTextBack = new createjs.Text(""," 100px " +SECONDARY_FONT, "#000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +1;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2)-50;
        _oMsgTextBack.textAlign = "center";
        _oMsgTextBack.textBaseline = "alphabetic";
        _oMsgTextBack.lineWidth = 500;

        _oMsgText = new createjs.Text(""," 100px " +SECONDARY_FONT, "#1ef400");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-52;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 500;
        
        _oScoreTextBack = new createjs.Text(""," 40px " +SECONDARY_FONT, "#000");
        _oScoreTextBack.x = CANVAS_WIDTH/2 +1;
        _oScoreTextBack.y = (CANVAS_HEIGHT/2) + 50;
        _oScoreTextBack.textAlign = "center";
        _oScoreTextBack.textBaseline = "alphabetic";
        _oScoreTextBack.lineWidth = 500;
        
        _oScoreText = new createjs.Text(""," 40px  " +SECONDARY_FONT, "#1ef400");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 52;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 500;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        _oGroup.addChild(_oFade, _oBg, _oScoreTextBack,_oScoreText,_oMsgTextBack,_oMsgText);

        s_oStage.addChild(_oGroup);
    };
    
    this.unload = function(){
        if(_iIdInterval !== null){
            clearTimeout(_iIdInterval);
        }
        _oGroup.off("mousedown",this._onExit);
    };
    
    this._initListener = function(){
        _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iScore){
	playSound("game_over",1,false);
        
        if(iWinner === PLAYER){
            _oMsgTextBack.text = TEXT_WIN;
            _oMsgText.text = TEXT_WIN;
            
            this._winnerAnim();
        } else {
            _oMsgTextBack.text = TEXT_LOSE;
            _oMsgText.text = TEXT_LOSE;
            
            this._loseAnim();
        }
        
        _oScoreTextBack.text = TEXT_SCORE +": "+iScore;
        _oScoreText.text = TEXT_SCORE +": "+iScore;
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
        $(s_oMain).trigger("save_score",iScore, s_iMode);        
        $(s_oMain).trigger("end_level",1);
        
        var szImg = "200x200.jpg";
        var szTitle = "Congratulations!";
        var szMsg = "You collected <strong>" + iScore + " points</strong>!<br><br>Share your score with your friends!";
        var szMsgShare = "My score is " + iScore + " points! Can you do better?";        
        $(s_oMain).trigger("share_event",iScore, szImg, szTitle, szMsg, szMsgShare);
    };
    
    this._winnerAnim = function(){
        var iTimeInterval = 1000 + Math.random()*1000;
        _iIdInterval = setTimeout(function(){
            var oAirStrike = new CAirStrike(_oGroup);
            var iOffsetX = 200 + Math.random()*200;
            var iOffsetY = - 400 - Math.random()*200;
            var iEndOffsetX = -250 - Math.random()*250;
            var iEndOffsetY = -300 - Math.random()*300;
            var pAnimPos = {start:{x:CANVAS_WIDTH + iOffsetX, y: CANVAS_HEIGHT +iOffsetY }, end:{x:iEndOffsetX, y:iEndOffsetY}};
            oAirStrike.endAnim(pAnimPos.start, pAnimPos.end, 2000 + Math.random()*2000);
            _oParent._winnerAnim();
        }, iTimeInterval);
    };
    
    this._loseAnim = function(){
        var iTimeInterval = 400 + Math.random()*400;
        _iIdInterval = setTimeout(function(){
            var oMissileExplosion = new createSprite(s_oMissileExplosionSpritesheet,"idle", 0,0,0,0);
            oMissileExplosion.on("animationend", this._endExplosion, this, false, {missile: oMissileExplosion});

            playSound("missile_explosion", 1, false);

            oMissileExplosion.x = CANVAS_WIDTH*Math.random();
            oMissileExplosion.y = CANVAS_HEIGHT*Math.random();
            _oGroup.addChild(oMissileExplosion);
            _oParent._loseAnim();
        }, iTimeInterval);
    };
    
    this._endExplosion = function(evt, data){
        evt.remove();
        
        _oGroup.removeChild(data.missile);
    };
    
    this._onExit = function(){
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        
        s_oGame.onExit();
    };
    
    this._init(iWinner);
    
    _oParent = this;
    return this;
}
