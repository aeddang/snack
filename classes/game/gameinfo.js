class GameInfo
{
    constructor(lv) 
    {
        this.BALL_KEY = "ball_";
        this.BOMB_KEY = "bomb_";
        this.TIME_OFF_SET = 2;
        this.originGameTime = 0;
        this.lv = lv;
        this.score = 0;
        this.isPlay = false;
        this.linkedMax = 5;
        this.age = 0;
        this.gameTime = 0;
        this.ballIdx = 1;
        this.ballNum = 0;
        this.bombID = 0;
        this.bombMin = 3;
        this.bombTimes = 3;
        this.bombInterval = 0;
        this.bombMinInterval = 3;
        this.bombMaxInterval = 6;
        this.stackMax = 7;
        this.stackMin = 5;
        this.stack = 1;
    }

    reset()
    {
        this.age = 0;
        this.gameTime = this.originGameTime;
        this.score = 0;
        this.isFinish = false;
        this.isPlay = true;
        this.ballIdx = Math.floor(Math.random() * this.ballNum);
        this.stack = 1;
    }

    setBallNum(num)
    {
        this.ballNum = num-1;
        this.bombID = this.ballNum;
    }

    getBallIdx()
    {
        return this.ballIdx;
    }

    getBallID(isShot=true, isRandom = false)
    {
        var num = isShot ? this.ballNum + 1 : this.ballNum;
        console.log(isRandom);
        var ballID = (isShot || isRandom) ? Math.floor(Math.random() * num) : this.ballIdx % num;
        this.ballIdx ++;
        if(!isShot) return ballID;
        if(ballID == num) ballID = num - 1;
        if(ballID == this.bombID && this.bombInterval < this.bombMinInterval) ballID = Math.floor(Math.random() * this.ballNum);
        (ballID == this.bombID) ? this.bombInterval = 0 : this.bombInterval++;
        if(this.bombInterval >= this.bombMaxInterval)
        {
            this.bombInterval = 0;
            ballID = this.bombID;
        }
        return ballID;
    }

    getCompleteBallID(id)
    {
        return id + this.ballNum + 1;
    }

    getSuccessBallID(id)
    {
        return id + ((this.ballNum + 1) *2);
    }

    getBombIDString()
    {
        return this.BOMB_KEY + this.bombID;
    }

    getBallIDString(id)
    {
        return this.BALL_KEY + id;
    }
    isBombIdx(idx)
    {
        return (this.bombID == idx) ? true : false;
    }
    isBomb(id)
    {
        return (id.indexOf(this.BOMB_KEY) != -1) ? true : false;
    }

    getMultiply(destoryCount)
    {
        let cnt = this.bombTimes - destoryCount;
        switch(cnt)
        {
            case 1:
            return SCORE_MULTIPLY.STEP1;
            case 2:
            return SCORE_MULTIPLY.STEP2;
            case 3:
            return SCORE_MULTIPLY.STEP3;
            default:
            return 1;
        }
    }

    getStack(kinds)
    {
        var addTime = 0;
        switch(kinds)
        {
            case 1:
                addTime = ADD_TIME.STEP3;
                break;
            case this.ballNum:
                addTime = ADD_TIME.STEP2;
                break;
            default :
                addTime = ADD_TIME.STEP1;
                break;

        }
        return addTime;
    }

    addStack(kinds)
    {
        var addTime = this.getStack(kinds);
        this.gameTime += addTime;
        return addTime;
    }

    isFeverAble(Kinds,num)
    {
        if(num < this.stackMax) return false;
        if(Kinds == 1) return false;
        if(Kinds < this.stackMin) return false;
        return true;
    }

    addScore(score)
    {
        this.score += score;
        return this.score;
    }

    getScore()
    {
        return this.score;
    }
    getTimeData(t)
    {
        var remainTime = this.gameTime - t;
        var originTime = remainTime;
        this.isPlay = (remainTime > 0) ? true : false;
      
        if(remainTime<0)
        {
            if(Math.abs(remainTime) >= this.TIME_OFF_SET) this.isFinish = true;
            this.isPlay = false;
            remainTime = 0;
        }
        let ratio = remainTime/this.gameTime;
        return {remainTime : remainTime,ratio:ratio,originTime:originTime}
    }

    
}

class GamMeta
{
    constructor(ratio = 1.0) 
    {
        this.ratio = ratio;
        this.gravity = 200;       
        this.anchorNum = 2;//Math.floor(Math.random() * 2) +1;
        this.bonusBallNum = 12;
        this.bonusBallTimes = 3;
        this.playTop = 150;
        this.playBottom = 20;
        this.power = 700;
        this.ballDensity = 30;
        this.bombDensity = 60;
        this.ballRadius = 20;
        this.anchorRadius = 30;
        this.gunSpot = null;
        this.nextGunSpot = null;
        this.ballSize = -1;  
        this.limitedBottom = -1;
        this.center = {x:0,y:0};

    }

    init(w,h)
    {
        
        this.center.x = w/2;
        this.center.y = h/2;
        
        console.log(h);
        let spotY = (h>1300) ? 170 : 100;
        this.power = this.power * this.ratio;
        this.gunSpot = {x:w/2,y:h-(spotY * this.ratio)};
        this.limitedBottom = this.gunSpot.y - (50*this.ratio);
        this.nextGunSpot = {x:this.gunSpot.x + (92*this.ratio),y:this.gunSpot.y + (35*this.ratio)};
        this.ballDensity = this.ballDensity* this.ratio;
        this.bombDensity = this.bombDensity * this.ratio;
        this.ballRadius = this.ballRadius * this.ratio;
        this.anchorRadius = this.anchorRadius * this.ratio;
        this.ballSize = this.ballRadius * 2;
        this.playTop = this.playTop * this.ratio; //this.gunSpot.y / 2;
    }
}

class BallData
{
    constructor() 
    {
        this.isSuccess = false;
        this.isLinked = false;
        this.destoryCount = 2;
        this.multiply = 1;
        this.status = BALL_STATUS.NONE;  
        this.value = -1;
    }

    reset()
    {
        this.status = BALL_STATUS.NONE; 
        this.value = -1;
    }

    isDestory(isCheck = false)
    {
        if(!isCheck) this.destoryCount--;
        if(this.destoryCount <= 0) return true;
        return false;
    }
}

const ADD_TIME = Object.freeze
(
    {
        STEP1 : 2,
        STEP2 : 5,
        STEP3 : 10
    }
);
const SCORE_MULTIPLY = Object.freeze
(
    {
        STEP1 : 2,
        STEP2 : 5,
        STEP3 : 10
    }
);
const SCORE_VALUE = Object.freeze
(
    {
        DEFAULT : 10,
        BONUS : 50,
        SUPER_BONUS : 50
    }
);

const BALL_STATUS = Object.freeze
(
    {
        NONE : -1,
        FIXED : 0
    }
);

const GAME_EVENT = Object.freeze
(
    {
        START : "strat",
        FINISH  : "finish",
        UPDATE_TIME  : "updateTime",
        UPDATE_SCORE  : "updateScore"
    }
);




