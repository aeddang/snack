
if(ROOT_SRC == null) var ROOT_SRC="./";

var UPDATE_VS = "20180808";
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/datamanager.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/effectfactory.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/soundfactory.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/game/game.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/stageui.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/stage.elements.js?updateVS="+UPDATE_VS+"'></script>");


class Stage extends ComponentCore
{
	constructor(divID,delegate=null) 
	{
        let bd=document.getElementById(divID);
        super(bd,delegate);
        this.uiHeader = null;
        this.uiBody = null;
        this.uiPopup = null;
        this.game = null;
        this.infoBox = null;
        this.popups = new Array();
    }

    init()
    {
    	this.createElements();
    	this.createObservable();
        this.setupEvent();
        this.startGame()
    
        //if(DataManager.getInstance().isInitUser) this.openGuide();
        return super.init();
    }

    remove()
    { 
    	this.game.remove();
    	this.uiHeader = null;
        this.uiBody = null;
        this.game = null;
   		super.remove();

    }

    createElements()
    {   
    	let elementProvider = new StageBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);
        this.uiHeader = elementProvider.getElement("uiHeader");
        this.uiBody = elementProvider.getElement("uiBody");
        this.uiPopup = elementProvider.getElement("uiPopup");
        
        this.game = new Game(this.uiBody);
        this.infoBox = new InfoBox(this.uiHeader);
        this.infoBox.init();
        
        this.game.init().subscribe
        (
            this.onEvent.bind(this)
        );

        let sf = new SoundFactory(this.uiHeader);
        sf.init();
    }

    setupEvent()
    {
       //jarvis.lib.addEventListener(window,"hashchange",this.onHashChange.bind(this));  
    }


    openGuide()
    {
        let pop = new GuideBox(this.uiPopup);
        this.addPopup(pop,null);
    }

    startGame()
    {

        let pop = new IntroBox(this.uiPopup);
        this.addPopup(pop,[
                            ()=> this.game.start(),
                            ()=> this.openGuide()
                            ]);
    }

    finishGame(score)
    {
        
        let pop = new FinishBox(this.uiPopup,score);
        this.addPopup(pop,[
                            ()=> this.game.start(),
                            ()=> this.startGame()
                          ]);
    }

    gameStart()
    {
        this.game.start();
    }

    onEvent(e)
    {
    
        switch(e.type)
        {
             case GAME_EVENT.START:
                this.infoBox.gameStart();
                break;
            case GAME_EVENT.FINISH:
                this.infoBox.gameFinish();
                this.finishGame(e.value); 
                break;
            case GAME_EVENT.UPDATE_TIME:
                this.infoBox.updateTime(e.value);
                break;
            case GAME_EVENT.UPDATE_SCORE:
                this.infoBox.updateScore(e.value);
                break;
        }

    }


    addPopup(pop,callbacks)
    {
        let that = this;
        this.popups.push(pop);
        pop.init().subscribe
        (
            {
                next(e)
                {
                    if(!callbacks) return;
                    callbacks[e.value]();
                },
                complete()
                {
                    let idx = that.popups.indexOf(pop);
                    if(idx == -1) return;
                    that.popups.splice(idx,1);
                    that.updatePopup();
                }
            }
        ); 
        this.updatePopup();
    }

    updatePopup()
    {
        this.uiPopup.style.display = (this.popups.length < 1) ? "none" : "block";
    }

    createObservable()
    {
    }
  
}



