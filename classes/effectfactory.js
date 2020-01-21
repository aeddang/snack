jarvis.effectFactoryInstance = null;

const IMAGES = Object.freeze
(
    {
        BALL : 0,
        BALL_YELLOW : 1,
        BALL_BIG : 2,
        BALL_YELLOW_BIG : 3,
        BALL_RAINBOW : 4,
        BALL_RED : 5
        
        
    }
);


const EFFECTS = Object.freeze
(
    {
        CLOUD_S : 0,
        CLOUD_M : 1,
        SEA_BACK : 2,
        SEA_FRONT : 3,
        WHALE : 4,
        SEAGULL_1 : 5,
        SEAGULL_2 : 6,
        SEAGULL : 7,
        WATER_FALL : 8,
        WATER_DROP_BIG : 9,
        WATER_DROP_SMALL : 10,
        WATER_DROP :11,
        WATER_DROP_LIGHT :12,
        GO:13,
        TIME_OVER:14,
        FEVER3:15,
        FEVER2:16,
        FEVER1:17
    }
);


const TUTORIAL = Object.freeze
(
    {
        START : ["발사하고 싶은 방향으로","화면을 터치하세요."],
        SECOND  : ["동일한 프랜즈 3명이상","모아주세요."],
        CON_USE  : ["콘을 프랜즈가 모인곳으로","발사해주세요."],
        CON_USE2 : ["두그룹이상 적중하면","추가점수를 받습니다."],
        GROUP_USE : ["가운데 테두리에","프랜즈를 4종류이상 모아주세요."],
        GROUP_USE1 :["가운데 테두리에","프랜즈를 6명이상 모아주세요."],
        GROUP_USE2 : ["동일거나 모두 다른 종류를","모으면 더 좋아요."],
        GROUP_USE3 : ["6명이상 모은 후","콘을 테두리로 발사해주세요."],
        END : ["사용설명을 더이상 보고 싶지 않으면","화면을 리로드 해주세요."],
        END1 : ["계속하실건가요?."],
        END2 : ["이런식으로해선 기록을 달성할수 없어요."],
        END3 : ["..."],
        END4 : ["그럼 그냥하시던지..."]
    }
);

class EffectFactory
{
	static getInstance()
	{
		if(jarvis.effectFactoryInstance == null) return new EffectFactory();
		return jarvis.effectFactoryInstance;

	}

	constructor() 
	{
		jarvis.effectFactoryInstance = this;
		
		this.ballList = new Array();
		this.ballSize = 0;

		this.resources = new Array();
		this.resources.push("./asset/cloud_0.png");
        this.resources.push("./asset/cloud_1.png");
        this.resources.push("./asset/sea_back.png");
        this.resources.push("./asset/sea_front.png");
        this.resources.push("./asset/icon_whale.png");
        this.resources.push("./asset/icon_seagull_1.png");
        this.resources.push("./asset/icon_seagull_2.png");
        this.resources.push("./asset/icon_seagull.png");
        this.resources.push("./asset/icon_water_fall.png");
        this.resources.push("./asset/icon_water_drop_big.png");
        this.resources.push("./asset/icon_water_drop_small.png");
        this.resources.push("./asset/icon_water_drop.png");
        this.resources.push("./asset/icon_water_drop_light.png");
        this.resources.push("./asset/text_go.png");
        this.resources.push("./asset/text_time_over.png");
        this.resources.push("./asset/star_red.png");
        this.resources.push("./asset/star_rainbow.png");
        this.resources.push("./asset/star_yellow.png");
        
 
	}
	
	setupTexture(artist,ballSize)
	{

		artist.adjustTexture("./asset/icon_water_drop.png");
        artist.adjustTexture("./asset/icon_water_drop_yellow.png");
        artist.adjustTexture("./asset/icon_water_drop_big_white.png");
        artist.adjustTexture("./asset/icon_water_drop_big_yellow.png");
        artist.adjustTexture("./asset/icon_water_drop_big_rainbow.png");
        artist.adjustTexture("./asset/icon_water_drop_big_red.png");
        
        
        artist.adjustEffects(this.resources);
        
        this.ballSize = ballSize;

		this.ballList.push(artist.adjustEffect("./asset/cha_1_default.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_2_default.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_3_default.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_4_default.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_5_default.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_bomb.png"));

        let ballNum = this.ballList.length;

        this.ballList.push(artist.adjustEffect("./asset/cha_1_heart.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_2_heart.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_3_heart.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_4_heart.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_5_heart.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_bomb_heart.png"));


        this.ballList.push(artist.adjustEffect("./asset/cha_1_smile.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_2_smile.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_3_smile.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_4_smile.png"));
        this.ballList.push(artist.adjustEffect("./asset/cha_5_smile.png"));
        return ballNum;
    }

    

	drawGameStage(artist,meta,bounce)
	{
        // under css size ratio *2
        let cloud = new EffectData("cl0",{x:-100,y:100,width:57,height:32},EFFECTS.CLOUD_S);
        cloud.transform.addAnimation(TRANS_VALUE.X,(bounce.width+200)*meta.ratio);
        cloud.transform.start(1000,EASY.NONE,TRANS_TYPE.REPEAT);
        cloud.alpha = 0.5;
        let cloudB = new EffectData("cl1",{x:-100,y:41,width:77,height:43},EFFECTS.CLOUD_M);
        cloudB.transform.addAnimation(TRANS_VALUE.X,(bounce.width+200)*meta.ratio);
        cloudB.transform.start(800,EASY.NONE,TRANS_TYPE.REPEAT,300);
        cloudB.alpha = 0.7;
		artist.addEffect(cloud,EFFECT_TYPE.BG);
        artist.addEffect(cloudB,EFFECT_TYPE.BG);


        let seagull = new EffectData("sea",{x:bounce.width+100,y:meta.center.y/meta.ratio,width:40,height:40},EFFECTS.SEAGULL,4);
        seagull.transform.addAnimation(TRANS_VALUE.X,-(bounce.width+200)*meta.ratio);
        seagull.transform.start(1000,EASY.NONE,TRANS_TYPE.REPEAT);
        seagull.alpha = 0.8;
        artist.addEffect(seagull,EFFECT_TYPE.BG);

        artist.addEffect(new EffectData("sea",{x:bounce.width/2,y:bounce.height-101,width:bounce.width,height:202},EFFECTS.SEA_BACK),EFFECT_TYPE.BG);
        artist.addEffect(new EffectData("whale",{x:bounce.width/2 +20,y:meta.gunSpot.y/meta.ratio+87,width:187,height:122},EFFECTS.WHALE),EFFECT_TYPE.BG);
        artist.addEffect(new EffectData("wdrop",{x:bounce.width/2,y:meta.gunSpot.y/meta.ratio,width:102,height:133},EFFECTS.WATER_DROP_BIG,3),EFFECT_TYPE.COVER);
        artist.addEffect(new EffectData("wdrop",{x:meta.nextGunSpot.x/meta.ratio ,y:meta.nextGunSpot.y/meta.ratio ,width:60,height:75},EFFECTS.WATER_DROP_SMALL,3),EFFECT_TYPE.COVER);
        artist.addEffect(new EffectData("sea",{x:bounce.width/2,y:bounce.height-27,width:bounce.width,height:94},EFFECTS.SEA_FRONT),EFFECT_TYPE.COVER);

        let seagull0 = new EffectData("sea",{x:bounce.width*1/3,y:meta.playTop/meta.ratio +20,width:66,height:35},EFFECTS.SEAGULL_1);
        seagull0.transform.addAnimation(TRANS_VALUE.Y,-10);
        let seagull1 = new EffectData("sea",{x:bounce.width*5/10,y:meta.playTop/meta.ratio +15,width:66,height:35},EFFECTS.SEAGULL_2);
        seagull1.transform.addAnimation(TRANS_VALUE.Y,-20);
        let seagull2 = new EffectData("sea",{x:bounce.width*2/3,y:meta.playTop/meta.ratio +16,width:66,height:35},EFFECTS.SEAGULL_1);
        seagull2.transform.addAnimation(TRANS_VALUE.Y,-15);

        seagull0.rotate = Math.PI * 30/ 180 ;
        seagull0.rotate = Math.PI * 10/ 180 ;
        seagull2.rotate = Math.PI * 0/ 180 ;
        seagull0.transform.start(100,EASY.OUT,TRANS_TYPE.PATROL);
        seagull1.transform.start(100,EASY.IN,TRANS_TYPE.PATROL);
        seagull2.transform.start(100,EASY.IN_OUT,TRANS_TYPE.PATROL);
       
        artist.addEffect(seagull0);
        artist.addEffect(seagull1);
        artist.addEffect(seagull2);
       

        artist.setAllEffectsRation(meta.ratio);

        // under canvas size
        let gunA = new EffectData("gunA",{x:meta.gunSpot.x,y:meta.gunSpot.y,width:106,height:106},EFFECTS.WATER_DROP_LIGHT);
        let gunB = new EffectData("gunB",{x:meta.nextGunSpot.x,y:meta.nextGunSpot.y,width:this.ballSize,height:this.ballSize},EFFECTS.WATER_DROP);
        gunA.transform.addAnimation(TRANS_VALUE.Y,5);
        gunB.transform.addAnimation(TRANS_VALUE.Y,5);
        gunA.transform.start(50,EASY.OUT,TRANS_TYPE.PATROL);
        gunB.transform.start(50,EASY.OUT,TRANS_TYPE.PATROL,100);
        artist.addEffect(gunA,EFFECT_TYPE.BG);
        artist.addEffect(gunB,EFFECT_TYPE.BG);
	}


    getEffect(id,pos=null,times = -1,fps = 10)
    {
    	var bounce = null;
    	var frm = 0;
    	var duration = -1;
    	var ratio = 1.0; //default canvas size
        var transform = null;
    	switch(id)
    	{
            case EFFECTS.WATER_DROP_BIG: 
        
            bounce = {x:pos.x,y:pos.y-250 ,width:204,height:266};
            frm = 3;
            break;
            
    		case EFFECTS.WATER_FALL: 
    		bounce = {x:pos.x-50,y:pos.y-148 ,width:398,height:296};
    		frm = 5;
    		break;

            case EFFECTS.GO: 
            case EFFECTS.TIME_OVER:

            bounce = (id==EFFECTS.GO) ? {x:pos.x ,y:pos.y,width:314,height:145} : {x:pos.x ,y:pos.y,width:606,height:98};
            duration = 100;
            let delay = 60;
            transform = new TransformData();
            transform.addAnimation(TRANS_VALUE.Y,-200);
            transform.addAnimation(TRANS_VALUE.ALPHA,-100);
            transform.start(duration - delay,EASY.OUT,TRANS_TYPE.MOVE,delay);
            frm = 1;
            break;

    	}
    	if(duration == -1) duration = (times == -1) ? -1 : frm * fps  * times;
        let effect = new EffectData(id,bounce,id,frm,duration,fps);
        effect.setRatio(ratio);
        effect.play();
        if(transform) effect.transform = transform;
        return effect;
    }

    getBallEffect(ballID,isBomb,isComplete = false,isPatrol = false,isSuccess = false)
    {
        let bounce = {x:0,y:0,width:this.ballSize,height:this.ballSize};
        let fps = 5;
        var frm = (isBomb) ? 3 : 5;
        var duration = (isBomb) ? -1 : (frm * fps);
        var isPlay = (isBomb || isComplete) ? true : false;
        let effect = new EffectData(ballID,bounce,this.ballList[ballID],frm,duration,fps);
        effect.isPlay = isPlay;
        if(isComplete)
        {
            var ty = isSuccess ? 100 : -70;
            if(isSuccess) effect.transform.addAnimation(TRANS_VALUE.ALPHA,-80);
            effect.transform.addAnimation(TRANS_VALUE.Y,ty);
            effect.transform.start(50,EASY.IN,TRANS_TYPE.MOVE);
            effect.duration = isSuccess ? (30 + Math.floor(Math.random()*100)) : 50;
            effect.isReplay = false;
        }
        if(isPatrol)
        {
            effect.transform.addAnimation(TRANS_VALUE.Y,-5);
            effect.transform.start(50,EASY.IN,TRANS_TYPE.PATROL);
        }
        return effect;
    }


    getBallSuccessEffect(ballID,bounce)
    {
        bounce.width = 80;
        bounce.height = 80;
        var duration = 30;
        let effect = new EffectData(ballID,bounce,this.ballList[ballID]);
        effect.transform.addAnimation(TRANS_VALUE.Y,-50);
        effect.transform.addAnimation(TRANS_VALUE.ALPHA,-80);
        effect.transform.start(50,EASY.IN);
        effect.duration = duration;
        effect.play();
        return effect;
    }

    getFeverEffect(id)
    {
        let bounce = {x:0,y:0,width:300,height:300};
        let frm = 7;
        let duration = -1;
        let fID = "";
        switch(id)
        {
            case ADD_TIME.STEP1 : 
                fID = EFFECTS.FEVER1;
                break;
            case ADD_TIME.STEP2 : 
                fID = EFFECTS.FEVER2;
                break;
            case ADD_TIME.STEP3 : 
                fID = EFFECTS.FEVER3;
                break;
            default :
                return null;
        }
        let effect = new EffectData(fID,bounce,fID,frm,duration);
        effect.play();
        return effect;
    }

    getAnchorEffect()
    {
        let bounce = {x:0,y:0};
        let font = "Lucida Grande";
        var str = "";
        var style = "bold 40px " + font;
        var color = "#f3617b";
        var isStroke = true;
        var strokeColor = "#fff";
        let effect = new TextData("",bounce,str,-1,style,color,isStroke,strokeColor);
        return effect;
    }


    getScoreEffect(score,bounce)
    {
        let font = "Lucida Grande";
        var style = "bold 25px " + font;
        var color = "#000";
        var isStroke = true;
        var strokeColor = "#fff";
        if(score >= 50)
        {
            color = "#f3617b";
            style = "bold 40px " + font;
        }
        else if(score >= 20)
        {
            color = "#0749a3";
            style = "bold 35px " + font;
        }
        let duration = 30;
               
        let transform = new TransformData();
        transform.addAnimation(TRANS_VALUE.Y,-30);
        transform.addAnimation(TRANS_VALUE.ALPHA,-80);
        transform.start(duration,EASY.OUT,TRANS_TYPE.MOVE,0);

        let effect = new TextData("",bounce,String(score),duration,style,color,isStroke,strokeColor);
        effect.transform = transform;
        return effect;
    }

    getComboEffect(step,bounce)
    {
        let font = "Lucida Grande";
        var str = "COMBO!";
        var style = "bold 30px " + font;
        var color = "#f3617b";
        var isStroke = true;
        var strokeColor = "#fff";
        
        if(step >= 5)
        {
            style = "bold 40px " + font;
            color = "#f3617b";
            str = "COMBO!!";
        }
        else if(step >= 10)
        {
            style = "bold 50px " + font;
            str = "COMBO!!!";
            color = "#f3617b";
        }
       
        let duration = 80;
        let transform = new TransformData();
        transform.addAnimation(TRANS_VALUE.Y,-60);
        transform.addAnimation(TRANS_VALUE.ALPHA,-80);
        //transform.addAnimation(TRANS_VALUE.ROTATE,30);
        transform.start(duration,EASY.OUT,TRANS_TYPE.MOVE,50);

        let effect = new TextData("",bounce,str,duration,style,color,isStroke,strokeColor);
        effect.transform = transform;
        return effect;
    }

    getTimeEffect(t,bounce)
    {
        let font = "Lucida Grande";
        var str = "+" + t +"";
        var style = "bold 50px " + font;
        var color = "#0749a3";
        var isStroke = true;
        var strokeColor = "#fff";
        let duration = 30;
        let transform = new TransformData();
        transform.addAnimation(TRANS_VALUE.Y,-30);
        transform.addAnimation(TRANS_VALUE.ALPHA,-80);
        transform.start(duration,EASY.OUT,TRANS_TYPE.MOVE);
        let effect = new TextData("",bounce,str,duration,style,color,isStroke,strokeColor);
        effect.transform = transform;
        return effect;
    }

    getTutorialText(strs,bounce,delay = 200)
    {
        let font = "Lucida Grande";
        let style = "bold 45px " + font;
        let color = "#fff";
        let isStroke = true;
        let strokeColor = "#000";
        let duration = 30 + delay;
        let transform = new TransformData();
        transform.addAnimation(TRANS_VALUE.Y,-30);
        transform.addAnimation(TRANS_VALUE.ALPHA,-80);
        transform.start(30,EASY.OUT,TRANS_TYPE.MOVE,delay);
        let effect = new TextData("",bounce,"",duration,style,color,isStroke,strokeColor);
        effect.transform = transform;
        effect.strs = strs;
        return effect;
    }

	


	

}


