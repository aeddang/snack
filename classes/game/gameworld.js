
class GameWorld extends BoxWorld
{
	constructor(body,info,delegate) 
	{
        let meta = new GamMeta(2.0);
		super(body,delegate,meta.ratio,meta.gravity);
    
        this.info = info;
        this.meta = meta;
        this.meta.init(this.canvas.width,this.canvas.height);
        this.textureList = new Array();
        this.effectList = new Array();
        this.anchors = new Array();
        this.anchorGroups = new Array();
        this.nextGun = null;
        this.gun = null;

        this.isTrigerReset = false;
        this.scenarioIdx = 0;
        this.scenarioPosIdx = 0;
        
        this.isTutorial = DataManager.getInstance().isInitUser;
        (this.isTutorial) ? this.setTutorial() : this.setNormal();
        

    }
    setNormal()
    {
        this.isTutorial = false;
        this.info.originGameTime = 40;
        this.meta.bonusBallNum = 12;
        this.meta.bonusBallTimes = 3;
        this.rxTriger = Rx.Observable.interval(300).take(1);

        this.scenario = new Array();
    }

    

    init()
    {
        this.setupTexture();
        return super.init();
    }


    setupTexture()
    {
        let ballNum = EffectFactory.getInstance().setupTexture(this.artist,this.meta.ballSize);
        this.info.setBallNum(ballNum);
    }

    remove()
    {
        super.remove();
    }

    createElements()
    {
        super.createElements();
    }

    createSpace()
    {
        let userData = new UserData()
        let spacePhysicalData = new PhysicalData(0);
        spacePhysicalData.restitution = 1.0;
        let bottomPhysicalData = new PhysicalData(0);
        bottomPhysicalData.restitution = 0.5;
        let spaceWidth = this.canvas.width;
        let spaceHeight =  this.canvas.height;
        this.space.top = BoxElementProvider.createGround(this.world,0,0,spaceWidth,1,spacePhysicalData,userData); // top
        this.space.left = BoxElementProvider.createGround(this.world,0,0,1,spaceHeight,spacePhysicalData,userData); //left
        this.space.right = BoxElementProvider.createGround(this.world,spaceWidth,0,1,spaceHeight,spacePhysicalData,userData); //right
        this.space.bottom = BoxElementProvider.createGround(this.world,0,spaceHeight-this.meta.playBottom,spaceWidth,1,bottomPhysicalData,userData); // 

        let margin = this.canvas.width/(this.meta.anchorNum+1);
        var tx = margin;
        for(var i=0;i<this.meta.anchorNum;++i)
        {
            let userData = new UserData(this.info.BALL_KEY);
            userData.idx = i;
            userData.image = IMAGES.BALL_YELLOW_BIG;
            userData.text = EffectFactory.getInstance().getAnchorEffect();
            let physicalData = new PhysicalData(0);
            var anchor =BoxElementProvider.createCircle(this.world, tx , this.meta.playTop , this.meta.anchorRadius, physicalData,userData);
            this.anchors.push(anchor);
            this.anchorGroups.push(new Array());
            tx += margin;
        }
    }


    doUpdateBody(body,userData)
    {
        let contactLists = body.GetContactList();
        if(contactLists == null) return;
        if(body == this.space.bottom) this.updateDestory(contactLists);
        if(this.anchors.indexOf(body) != -1) this.updateConnects(contactLists,body);
        if(userData.id == "") return;
        let isBomb = this.info.isBomb(userData.id);
        (isBomb) ? this.updateBomb(body,userData,contactLists) : this.updateJoint(body,userData,contactLists);
    } 

    updateConnects(contactLists,anchor)
    {
        let anchorData = anchor.GetUserData();
        let userData = contactLists.other.GetUserData();
        if(userData)
        {
            userData.value.status = BALL_STATUS.FIXED;
            userData.value.value = anchorData.idx;
            userData.image = IMAGES.BALL_YELLOW;

            let pos = anchor.GetCenterPosition();

            if(!this.info.isBomb(userData.id))
            {
                let id = this.info.getSuccessBallID(userData.effect.id);
                let effect = EffectFactory.getInstance().getBallSuccessEffect(id,{x:pos.x,y:pos.y});
                this.artist.addEffect(effect);
            }
            let group = this.anchorGroups[anchorData.idx];
            if(group.indexOf(contactLists.other) == -1) group.push(contactLists.other);
            this.feverCheck(group,anchor);
        }
    }

    updateDestory(contactLists)
    {
        while (contactLists)
        {
            var returns = new Array();
            var userData = contactLists.other.GetUserData();
            if(userData != null && userData.id != "")
            {
                userData.active = false;
                this.getJointLists(contactLists.other,returns,"",this.anchors);
            }
            contactLists = contactLists.next;
            (returns.length < 2) ? this.updateDestoryCount(returns[0]) : this.destroyJoints(returns);
        }  
    }

    updateDestoryCount(body)
    {

        let userData = body.GetUserData();
        if(this.info.isBomb(userData.id))
        {
            this.destroyBody(body);
            return;
        }
        if(userData == null || userData.value == null) return;
        if(userData.value.isDestory() == true ) this.destroyBody(body);
    }

    updateBomb(body,userData,contactLists)
    {
        let returns = new Array();
        let effects = new Array();
        var id = "";

        var nextList = contactLists;
        while (nextList)
        {
            var data = nextList.other.GetUserData();
            if(data != null);
            {
                if(id == "") id = data.id;
                if(data.id == id) this.getJointLists(nextList.other,returns,id,this.anchors);
            }
            nextList = nextList.next;
        }

        if(returns.length < this.info.bombMin) return;

        let multiply = this.info.getMultiply(userData.value.destoryCount);
        for(var i=0;i<returns.length;++i) returns[i].GetUserData().value.multiply = multiply;       
        userData.value.multiply = multiply;
        if(multiply > 1)
        {
            let pos = body.GetCenterPosition();
            let effect = EffectFactory.getInstance().getComboEffect(multiply,{x:pos.x/this.meta.ratio,y:pos.y/this.meta.ratio});
            this.artist.addText(effect);
            if(multiply >= SCORE_MULTIPLY.STEP2) SoundFactory.getInstance().playSideEffect(SOUND.CONS_PLEASURE);
        }

        SoundFactory.getInstance().play(STATIC_SOUND.WATER_BOOM);
        if(userData.value.isDestory() == true ) this.destroyBody(body);
        this.destroyBodys(returns); 
        
    }

    updateJoint(body,userData,contactLists)
    {
        if(!userData.active) return;
        this.joinBodys(this.getContactedLists(body,contactLists,null,"",this.info.BALL_KEY)); //this.meta.ballRadius*2
    }

    doJoinBody(body0,body1)
    {
        let userData = body0.GetUserData();
        if(!this.checkLimitedLine(body0))
        {
            this.destroyBody(body0);
            return;
        }
        if(userData.value != null ) userData.value.isLinked = true;
    }

    checkLimitedLine(body)
    {
        let p = body.GetCenterPosition();
        let isAble = (p.y > this.meta.limitedBottom) ?  false :  true;
        //console.log(p.y+" - "+this.meta.limitedBottom + " isAble : " + isAble);
        return isAble;
    }
    
    doDestroyJoint(body)
    {
        body.GetUserData().active = false;
    }

    doDestroyBody(body)
    {
        let userData = body.GetUserData();
        if(userData == null || userData.value == null || userData.effect == null) return;

        if(userData.value.status == BALL_STATUS.FIXED)
        {
            let group = this.anchorGroups[userData.value.value];
            let idx = group.indexOf(body);
            if(idx != -1) group.splice(idx, 1); 
            this.feverCheck(group,this.anchors[userData.value.value]);
        }

        (this.info.isBomb(userData.id)) ?  this.destoryBomb(body,userData) : this.destoryBall(body,userData);
    }

    destoryBomb(body,userData)
    {
        if(userData.value.isDestory(true))
        {
            //SoundFactory.getInstance().playSideEffect(SOUND.SHOT_LONG);
            this.addScore(SCORE_VALUE.BONUS ,body);
        }
        let effectIdx = this.info.getCompleteBallID(userData.effect.id);
        let effect = EffectFactory.getInstance().getBallEffect(effectIdx,false,true);
        this.addBodyEffect(body,effect);
        
    }

    destoryBall(body,userData)
    {
        if(userData.value.isLinked ==true && userData.active==false)
        {
            let effectIdx = this.info.getCompleteBallID(userData.effect.id);
            let effect = EffectFactory.getInstance().getBallEffect(effectIdx,false,true,false,userData.value.isSuccess);
            this.addBodyEffect(body,effect);
            this.addScore(SCORE_VALUE.SUPER_BONUS * userData.value.multiply,body);
        }
        else
        {
            this.playBodyEffect(body);
            if(userData.value.isLinked ==true) this.addScore(SCORE_VALUE.DEFAULT * userData.value.multiply,body);
        }
    }

    reset()
    {
        super.reset();
        if (this.isTutorial && this.scenarioIdx>0)  this.setNormal();
        this.isTrigerReset = false;
        this.anchorsReset();
        
    }
    
    anchorsReset()
    {
        for(var i=0;i<this.anchorGroups.length;++i) this.anchorGroups[i] = new Array();
        for(var i=0;i<this.anchors.length;++i)
        {
            let userData = this.anchors[i].GetUserData();
            userData.image = IMAGES.BALL_YELLOW_BIG;
            userData.effect = null;
            userData.text.str = "";
            
        }
    }

    start()
    {
        this.reset();
        super.start();
        this.setupEffects();
        this.addBonusBalls();
        
        SoundFactory.getInstance().playBgm(BGM.DEFAULT);
        this.artist.addEffect(EffectFactory.getInstance().getEffect(EFFECTS.GO,this.meta.center,1));

        if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.START));
        
        this.rxTriger.subscribe
        (
            this.createShotgun.bind(this)
        );
    }

    feverCheck(group,anchor)
    {
        var ids = new Array();
        var able = false;
        var bomb = null;
        for(var i=0;i<group.length;++i)
        {
            var id = group[i].GetUserData().id;
            if(this.info.isBomb(id))
            {
                bomb = group[i];
                able = true;
            }
            if(ids.indexOf(id) == -1) ids.push(id);
        }
        
        let kinds = ids.length;
        let num = group.length;
        let userData = anchor.GetUserData();
        userData.text.setText(kinds);
        let feverAble = (able) ? this.info.isFeverAble(kinds,num) : this.info.isFeverAble(kinds + 1,num +1);
        if(!feverAble)
        {
            userData.effect = null;
            userData.image = IMAGES.BALL_YELLOW_BIG;
            return;
        };

        if(able)
        {
            let addTime = this.info.addStack(ids.length - 1);
            this.destroyBody(bomb); 
            this.feverInit(group,addTime);
        }
        else
        {
            let id = this.info.getStack(ids.length);
            let effect = EffectFactory.getInstance().getFeverEffect(id);
            userData.effect = effect;
            userData.image = (id == 1) ? IMAGES.BALL_RED : ((id<=4) ? IMAGES.BALL_YELLOW_BIG : IMAGES.BALL_RAINBOW);
        }
    }

    feverInit(group,addTime)
    {
        this.anchorGroups = new Array();
        for(var i=0;i<this.meta.anchorNum;++i) this.anchorGroups.push(new Array());
        let returns = this.getAllBodys(this.info.BALL_KEY,this.anchors);
        for(var i = 0 ; i< returns.length; ++i)
        {
            returns[i].GetUserData().active = false;
            returns[i].GetUserData().value.isSuccess = true;
        }
        this.destroyBodys(returns); 
        this.addBonusBalls();
        this.addTimeEffect(addTime);
        
    }


    setupEffects()
    { 
        let bounce =  jarvis.lib.getAbsoluteBounce(this.body); 
        EffectFactory.getInstance().drawGameStage(this.artist,this.meta,bounce);
    }

    addBonusBalls()
    {

        Rx.Observable.interval(600).take(this.meta.bonusBallTimes).subscribe
        (
            this.addCrossBalls.bind(this,this.meta.bonusBallNum)
        );
    }
    addCrossBalls(num,idx)
    {
        let isBottom = (idx %2 == 0) ? true : false;
        let isRandom = (idx %3 == 2) ? true : false;
        this.addBalls(num,isBottom,isRandom);
    }

    addBalls(num,isBottom=false,isRandom=false)
    {
        let w = this.meta.ballSize-15;
        let lineNum = this.meta.bonusBallNum;
        let spotX = (this.canvas.width - (w*lineNum))/2;
        let layer = 2;
        for(var i=0;i<num;++i)
        {
            var ballID = this.info.getBallID(false,isRandom);
            var tx = spotX +  (w  * ((i %lineNum)+1));
            var ty = (w * 2) * ((Math.floor(i/lineNum)*layer )+(i%layer));
            if(isBottom) ty = ty + this.meta.playTop + 300;
            var ball = this.getBall(ballID,tx,ty);
            if(isBottom) ball.SetLinearVelocity(new b2Vec2(0,-600));
        }
    }

    shot(pos)
    {
        if(!this.isTrigerReset) return;
        this.isTrigerReset = false;
        let bounce = jarvis.lib.getAbsoluteBounce(this.body);
        let x = (pos.x*this.meta.ratio) - this.meta.gunSpot.x - (bounce.x*this.meta.ratio);
        let y = (pos.y*this.meta.ratio) - this.meta.gunSpot.y - (bounce.y*this.meta.ratio);
        let r = -Math.atan2(x,y) + (Math.PI/2);
        this.createCurrentBall(r);
        SoundFactory.getInstance().play(STATIC_SOUND.SHOT);
        this.rxTriger.subscribe
        (
            this.createNextBall.bind(this)
        );
    }

    createShotgun()
    {
        let ballID = this.info.getBallID(false);
        let nextBallID = this.info.getBallID(false);

        this.gun = EffectFactory.getInstance().getBallEffect(ballID,false,false,true);
        this.nextGun = EffectFactory.getInstance().getBallEffect(nextBallID,this.info.isBombIdx(nextBallID),false,true);
        this.gun.bounce.x = this.meta.gunSpot.x;
        this.gun.bounce.y = this.meta.gunSpot.y;
        this.nextGun.bounce.x = this.meta.nextGunSpot.x;
        this.nextGun.bounce.y = this.meta.nextGunSpot.y

        this.artist.addEffect(this.gun);
        this.artist.addEffect(this.nextGun);
        this.isTrigerReset = true;

        this.addTutorialEffect();
    }


    createCurrentBall(r)
    {
        this.gun.image = -1;
        let center = this.meta.gunSpot;
        let id = this.gun.id;
        let tx = center.x + (Math.cos(r) * this.meta.ballSize);
        let ty = center.y + (Math.sin(r) * this.meta.ballSize);
        let ball = this.getBall(id,tx,ty);
        let px = (Math.cos(r) * this.meta.power);
        let py = (Math.sin(r) * this.meta.power);
        
        ball.SetLinearVelocity(new b2Vec2(px,py));
        this.artist.addEffect(EffectFactory.getInstance().getEffect(EFFECTS.WATER_DROP_BIG,center,1));
    }

    createNextBall()
    {
        let ballID = this.nextGun.id;
        let nextBallID = this.info.getBallID();

        this.gun.id = ballID;
        this.nextGun.id = nextBallID;
        this.gun.image = EffectFactory.getInstance().ballList[ballID];
        this.nextGun.image = EffectFactory.getInstance().ballList[nextBallID];

        let isBomb = this.info.isBombIdx(ballID);
        this.gun.totalFrame = (isBomb) ? 3 : 5;
        this.nextGun.totalFrame = (this.info.isBombIdx(nextBallID)) ? 3 : 5;
        this.isTrigerReset = true;
        if(this.isTutorial==false) return;

        if(this.scenarioIdx <= this.scenarioStep[0]) 
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx == this.scenarioStep[1] && isBomb == true)
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx == this.scenarioStep[2] && isBomb == true)
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx > this.scenarioStep[2] && this.scenarioIdx <= this.scenarioStep[3])
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx > this.scenarioStep[3] && this.scenarioIdx <= this.scenarioStep[4])
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx > this.scenarioStep[4] && this.scenarioIdx <= this.scenarioStep[5])
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx == this.scenarioStep[5] && isBomb == true)
        {
            this.addTutorialEffect();
        }
        else if(this.scenarioIdx > this.scenarioStep[5])
        {
            this.addTutorialEffect();
        }
        


    }

    setTutorial()
    {

        this.isTutorial = true;
        this.info.originGameTime = 120;
        this.meta.bonusBallNum = 4;
        this.meta.bonusBallTimes = 1;
        this.rxTriger = Rx.Observable.interval(1000).take(1);

        this.scenarioStep = new Array();
        this.scenario = new Array();
        this.scenario.push(TUTORIAL.START);
        this.scenario.push("");

        this.scenarioStep[0] = this.scenario.length;
        this.scenario.push(TUTORIAL.SECOND);
        
        this.scenarioStep[1] = this.scenario.length;
        this.scenario.push(TUTORIAL.CON_USE);
        
        this.scenarioStep[2] = this.scenario.length;
        this.scenario.push(TUTORIAL.CON_USE2);
        
        this.scenario.push("");
        this.scenarioStep[3] = this.scenario.length;
        this.scenario.push(TUTORIAL.GROUP_USE);
        this.scenario.push("");
        this.scenarioStep[4] = this.scenario.length;
        this.scenario.push(TUTORIAL.GROUP_USE2);
        this.scenario.push("");
        this.scenarioStep[5] = this.scenario.length;
        this.scenario.push(TUTORIAL.GROUP_USE3);
        
        this.scenario.push("");
        this.scenario.push(TUTORIAL.END);
        this.scenario.push(TUTORIAL.END2);
        this.scenario.push("");
        this.scenario.push("");
      
        this.scenario.push(TUTORIAL.END3);
        this.scenario.push("");
        this.scenario.push("");
      
        this.scenario.push(TUTORIAL.END4);
  

        this.scenarioIdx = 0;
        this.scenarioPosIdx = 0;
    }

    playBodyEffect(body)
    {
        let pos = body.GetCenterPosition();
        let userData = body.GetUserData();
        if(userData.effect == null || userData.effect.duration == -1) return;
        userData.effect.bounce.x = pos.x;
        userData.effect.bounce.y = pos.y;
        userData.effect.play();
        this.artist.addEffect(userData.effect);
    }

    addBodyEffect(body,effect)
    {
        let pos = body.GetCenterPosition();
        effect.bounce.x = pos.x;
        effect.bounce.y = pos.y;
        this.artist.addEffect(effect);
    }

    addTutorialEffect()
    {
        if(this.scenarioIdx >= this.scenario.length) return;
        let str = this.scenario[this.scenarioIdx];
        if(str != "")
        {
            var ty = this.meta.center.y/this.meta.ratio + 50;
            ty += (this.scenarioPosIdx%3) * 30;
            let effect = EffectFactory.getInstance().getTutorialText(this.scenario[this.scenarioIdx],{x:this.meta.center.x/this.meta.ratio,y:ty});
            this.artist.addText(effect);
            this.scenarioPosIdx++;
        }
        this.scenarioIdx ++;
    }

    addTimeEffect(t)
    {
        let effect = EffectFactory.getInstance().getTimeEffect(t,{x:this.meta.center.x * 2 /this.meta.ratio -60 ,y:50});
        this.artist.addText(effect);
    }

    addScore(score,body)
    {
        let pos = body.GetCenterPosition();
        score = score * this.info.stack;

        let resultScore = this.info.addScore(score);
        if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.UPDATE_SCORE,null,resultScore));
        SoundFactory.getInstance().playEffect(SOUND.CLEAR);

        let effect = EffectFactory.getInstance().getScoreEffect(score,{x:pos.x/this.meta.ratio,y:pos.y/this.meta.ratio});
        this.artist.addText(effect);
    }

    getBall(ballID,tx,ty)
    {
        let isBomb = this.info.isBombIdx(ballID);
        let id = isBomb  ? this.info.getBombIDString(ballID) : this.info.getBallIDString(ballID);
        let userData = new UserData(id);
        userData.image = IMAGES.BALL;
        userData.idx = this.info.getBallIdx();
        userData.effect = EffectFactory.getInstance().getBallEffect(ballID,isBomb);
        userData.value = new BallData();
        if(isBomb) userData.value.destoryCount = this.info.bombTimes;
        let physicalData = new PhysicalData(this.meta.ballDensity);
        if(isBomb)
        {
            physicalData.restitution = 0.5;
            physicalData.density = this.meta.bombDensity;
        }
        return BoxElementProvider.createCircle(this.world, tx , ty ,this.meta.ballRadius, physicalData,userData);
    }

    onTime(t)
    {
        if((this.GAME_TIME * this.age)%1000 == 0)
        {
            let sec = this.GAME_TIME * this.age / 1000;
            let data = this.info.getTimeData(sec);
            //if(this.info.stack > 1) this.addFeverEffect();
            if(data.remainTime<=5 && data.remainTime>0) SoundFactory.getInstance().playSideEffect(SOUND.TICK);
            if(data.originTime == 0)
            {
                SoundFactory.getInstance().playEffect(SOUND.TIME_OVER);
                this.artist.addEffect(EffectFactory.getInstance().getEffect(EFFECTS.TIME_OVER,this.meta.center,1));
            }
            if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.UPDATE_TIME,null,data));
        }
        super.onTime(t);
    }

    finish(isForce = false)
    {
        this.cleanWorld(this.anchors,this.info.BALL_KEY);
        super.finish();
        if(isForce) return;
        if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.FINISH));
        SoundFactory.getInstance().stopBgm(BGM.DEFAULT);
        
    }
}



