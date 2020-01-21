class GuideBox extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnClose = null;  
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new GuideBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.btnClose = elementProvider.getElement("btnClose");
    } 

    setupEvent()
    {
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));
    }

    onClose(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn,0);
        this.delegate.next(evt);
        this.remove();
    }
}


class IntroBox extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.bestScore = null;
        this.secondScore = null;
        this.thirdScore = null;
        this.myScore = null;
        this.myLank = null;
        this.btnStart = null;
        this.subscribe = null;
        this.btnGuide = null;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();

        this.subscribe = DataManager.getInstance().notifier.subscribe
        (
            this.onScoreLoaded.bind(this)
        ); 
        DataManager.getInstance().loadScore();
        return super.init();
    }

    remove()
    {   
        if(this.subscribe) this.subscribe.unsubscribe();
        this.subscribe = null;
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new IntroBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.bestScore = elementProvider.getElement("bestScore");
        this.secondScore = elementProvider.getElement("secondScore");
        this.thirdScore = elementProvider.getElement("thirdScore");
        this.myScore= elementProvider.getElement("myScore");
        this.myLank = elementProvider.getElement("myLank");
        this.btnStart = elementProvider.getElement("btnStart");
        this.btnGuide = elementProvider.getElement("btnGuide");
    } 

    setupEvent()
    {
        jarvis.lib.addEventListener(this.btnStart,"click",this.onStart.bind(this));
        jarvis.lib.addEventListener(this.btnGuide,"click",this.onGuide.bind(this));
       
    }

    onScoreLoaded(notifyData)
    {
        if(notifyData.id != NOTIFY_ID.LOADED_SCORE) return;
        if(!notifyData.value) return;
        if(!notifyData.value.value) return;
        let data = notifyData.value.value;
        if(data.list && data.list.length>=2)
        {
            this.secondScore.innerHTML =(Number(data.list[1]) == 0) ? "-" :  jarvis.lib.getPriceStr(data.list[1]) + "점";
        }
        if(data.list && data.list.length>=3)
        {
            this.thirdScore.innerHTML =(Number(data.list[2]) == 0) ? "-" :  jarvis.lib.getPriceStr(data.list[2]) + "점";    
        }
        this.bestScore.innerHTML = (Number(data.bestScore) == 0) ? "-" :  jarvis.lib.getPriceStr(data.bestScore) + "점";
        this.myScore.innerHTML = (Number(data.myScore) == 0) ? "-" :  jarvis.lib.getPriceStr(data.myScore) + "점";
        this.myLank.innerHTML = (Number(data.myRank) == 0) ? "-" : data.myRank + "위";
    }

    onClose()
    {
        this.remove();
    }
    onGuide(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn,1);
        this.delegate.next(evt);
    }

    onStart(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn,0);
        this.delegate.next(evt);
        this.onClose();
    }
}


class FinishBox extends ComponentCore
{
    constructor(body,score,delegate) 
    {
        super(body,delegate);
        this.currentScore = score;
        this.score = null;
        this.title = null;
        this.btnStart = null;
        this.subscribe = null;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();

        this.subscribe = DataManager.getInstance().notifier.subscribe
        (
            this.onScoreInsert.bind(this)
        ); 
        DataManager.getInstance().insertScore(this.currentScore);
        return super.init();
    }

    remove()
    {   
        if(this.subscribe) this.subscribe.unsubscribe();
        this.subscribe = null;
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new FinishBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 

        this.score= elementProvider.getElement("score");
        this.title = elementProvider.getElement("title");
        this.btnStart = elementProvider.getElement("btnStart");
        this.score.innerHTML = jarvis.lib.getPriceStr(this.currentScore);
    } 

    onScoreInsert(notifyData)
    {
        if(notifyData.id != NOTIFY_ID.INSERT_SCORE) return;
        if(!notifyData.value) return;
        let data = notifyData.value;

        if(data.resultCode == "1")
        {
            if(data.originTime == 0) SoundFactory.getInstance().playSideEffect(SOUND.CONS_PLEASURE);
            jarvis.lib.addAttribute(this.title,"title-best");
        }  
        else
        {
            if(data.originTime == 0) SoundFactory.getInstance().playSideEffect(SOUND.GAME_OVER);
            jarvis.lib.addAttribute(this.title,"title-gameover");
        } 
    }


    setupEvent()
    {
        jarvis.lib.addEventListener(this.btnStart,"click",this.onStart.bind(this));
    }

    onClose()
    {
        this.remove();
    }

    onStart(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn,1);
        this.delegate.next(evt);
        this.onClose();
    }
}


class InfoBox extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.textScore = null;
        this.textTime = null;
        this.barProgress = null;   
        
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();

    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new InfoBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.textScore = elementProvider.getElement("textScore");
        this.textTime = elementProvider.getElement("textTime");
        this.barProgress = elementProvider.getElement("barProgress");
    }

    updateScore(score)
    {   
        this.textScore.innerHTML = String(score);
    }


    updateTime(data)
    {   
        this.textTime.innerHTML = data.remainTime;
        this.barProgress.style.width = (data.ratio*100) + "%";
    }

    gameStart()
    {
        this.getBody().style.display = "block";
    }

    gameFinish()
    {
        this.getBody().style.display ="none";
    }
}


class MsgWindow extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.title = null;
        this.msg = null;
        this.bottom = null;   
        this.rxAutoCloser = null;
        
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();

    }

    setMsg(title,msg,btns=null)
    {
       
        this.title.innerHTML = "["+title+"]";
        this.msg.innerHTML = msg;
        if(btns==null)
        {
            this.setDefaultBtns();
        }
        else
        {
            this.createBtns(btns);
        }
        
    }

    remove()
    {   
        if(this.rxAutoCloser) this.rxAutoCloser.unsubscribe();
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new MsgWindowBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.bottom = elementProvider.getElement("bottom");
        this.title = elementProvider.getElement("title");
        this.msg = elementProvider.getElement("msg");
    }

    createBtns(btns)
    {   
        for(var i=0;i<btns.length;++i)
        {
            var btn = document.createElement("button");
            jarvis.lib.addAttribute(btn,"btn-default btn-line font-middle");
            var key = btns[i];
            btn.key = key;
            btn.idx = i;
            btn.innerHTML = key;
            this.bottom.appendChild(btn);
            jarvis.lib.addEventListener(btn,"click",this.onBtnSelected.bind(this,btn));
        }
    }


    onClose()
    {
        if(this.rxAutoCloser) this.rxAutoCloser.unsubscribe();
        this.removeAni();
    }

    onBtnSelected(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn,btn.idx);
        this.delegate.next(evt);
        this.onClose();
    }

}
