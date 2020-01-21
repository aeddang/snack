if(ROOT_SRC == null) var ROOT_SRC="./";
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/boxworld/boxelementprovider.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/boxworld/boxartist.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/boxworld/boxworld.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/game/gameworld.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/game/gameinfo.js?updateVS="+UPDATE_VS+"'></script>");
//document.write("<script type='text/javascript' src='"+ROOT_SRC+"classes/game/kakao.js?updateVS="+UPDATE_VS+"'></script>");

class Game extends ComponentCore
{
	constructor(body,delegate=null) 
	{
        super(body);

        this.info = new GameInfo(1);
        this.world = new GameWorld(body,this.info);
        this.world.init().subscribe
        (
            this.onEvent.bind(this)
        );
    }

    init()
    {
    	this.createObservable();
        this.setupEvent();
    	return super.init();
    }

    start()
    {
        this.info.reset();
        this.world.start();
    }

    remove()
    { 
    	this.world.remove();
    	this.world = null;
   		super.remove();
    }

    createObservable()
    {
    }

    onEvent(e)
    {
        switch(e.type)
        {
            case GAME_EVENT.START:
                this.updateTime(0);
                if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.UPDATE_SCORE,null,this.info.getScore()));
                break
            case GAME_EVENT.FINISH:
                if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.FINISH,null,this.info.getScore()));
                return;
            case GAME_EVENT.UPDATE_TIME:
                this.updateTime(e.value);
                return;
            case GAME_EVENT.UPDATE_SCORE:

                if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.UPDATE_SCORE,null,e.value));
                return;
        }
        if(this.delegate) this.delegate.next(e);
    }

    updateTime(data)
    {
        if(this.delegate) this.delegate.next(new BoxWorldEvent(GAME_EVENT.UPDATE_TIME,null,data));
        if(this.info.isFinish) this.world.finish();
    }

    setupEvent()
    {
    	jarvis.lib.addEventListener(this.body,"click",this.onClick.bind(this));
    }

    onClick(e)
    {
        if(this.info.isPlay == false) return; 
    	var posX= jarvis.lib.getMouseX(e);
        var posY= jarvis.lib.getMouseY(e);
        this.world.shot({x:posX,y:posY});
    }

  
}