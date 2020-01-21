jarvis.soundFactoryInstance = null;


const BGM = Object.freeze
(
    {
        DEFAULT : "bgm"
    }
);

const STATIC_SOUND = Object.freeze
(
    {
        WATER_BOOM : 0,
        SHOT : 1
    }
);

const SOUND = Object.freeze
(
    {
        CONS_PLEASURE : "cons_pleasure",
        GAME_OVER : "game_over",
        CLEAR : "clear",
        SHOT_LONG : "shot_long",
        TIME_OVER : "time_over",
        TICK : "tick",
    }
);

class SoundFactory extends ComponentCore
{
	static getInstance()
	{
		return jarvis.soundFactoryInstance;
	}

	constructor(body,delegate) 
    {
        super(body,delegate);
        jarvis.soundFactoryInstance = this;
        this.PATH = "./sound/";

        this.staticPlayers = new Array();
        this.isBgmPlay = false;
        this.bgmPlayer = null;
        this.mainPlayer = null;
        this.subPlayer = null;   
        this.thirdPlayer = null;
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
        let elementProvider = new SoundBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.bgmPlayer = elementProvider.getElement("bgmPlayer");
        this.mainPlayer = elementProvider.getElement("mainPlayer");
        this.subPlayer = elementProvider.getElement("subPlayer");
        this.staticPlayers.push(elementProvider.getElement("staticPlayer1"));
        this.staticPlayers.push(elementProvider.getElement("staticPlayer2"));

        this.staticPlayers[STATIC_SOUND.WATER_BOOM].src = this.PATH + "water_boom.mp3";
        this.staticPlayers[STATIC_SOUND.SHOT].src = this.PATH + "shot.mp3";

        for(var i =0;i<this.staticPlayers.length;++i) this.staticPlayers[i].load();


    }

    setupEvent()
    {
        this.attachEvent(window,"blur",this.onPassive.bind(this));
        this.attachEvent(window,"focus",this.onActive.bind(this));
    }

    onPassive()
    {
        this.bgmPlayer.pause();
    }

    onActive()
    {
        if(this.isBgmPlay)this.bgmPlayer.play();
    }

    playBgm(snd)
    {
        this.bgmPlayer.src = this.PATH + snd + ".mp3";
        this.bgmPlayer.load();
        this.bgmPlayer.play();
        this.isBgmPlay = true;
    }

    stopBgm()
    {
        this.bgmPlayer.pause();
        this.isBgmPlay = false;
    }

    play(snd)
    {
        this.staticPlayers[snd].currentTime = 0;
        this.staticPlayers[snd].play();
    }

    playEffect(snd)
    {
        this.mainPlayer.src = this.PATH + snd + ".mp3";
        this.mainPlayer.load();
        this.mainPlayer.play();
    }

    playSideEffect(snd)
    {
        this.subPlayer.src = this.PATH + snd + ".mp3";
        this.subPlayer.load();
        this.subPlayer.play();
    }

    

}


