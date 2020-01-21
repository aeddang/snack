class StageBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <div id='${this.id}uiBody' class='ui-body'></div>
        <div id='${this.id}uiHeader' class='ui-header'></div>
        <div id='${this.id}uiPopup' class='ui-popup'></div>
        `;  
    }
}

class SoundBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"sound-box screen-out");
        cell.innerHTML =
        `
        <audio preload='metadata' loop id='${this.id}bgmPlayer' width='1' height='1'></audio>
        <audio preload='metadata' id='${this.id}staticPlayer1'></audio>
        <audio preload='metadata' id='${this.id}staticPlayer2'></audio>
        <audio preload='metadata' id='${this.id}mainPlayer'></audio>
        <audio preload='metadata' id='${this.id}subPlayer'></audio>
        `; 
        this.body.appendChild(cell);
    }
}


class InfoBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"info-box");
        cell.innerHTML =
        `
        <div id='${this.id}textScore' class='text-score text-stroke font-amazing'>score</div>
        <div  class='time-box'>
            <div class='bar'>
                
                <div class='bar-progress progress-range '></div>
                <div id='${this.id}barProgress' class='bar-progress progress-default'></div>
                <div id='${this.id}textTime' class='text-time font-middle text-stroke-2'>time</div>
            </div>
        </div>  
        
        `;  
        this.body.appendChild(cell);
    }
}


class IntroBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"intro stage-bg");
        cell.innerHTML =
        `
            <div class='bg0'></div>
            <div class='whale'></div>
            <div class='bg1'></div>
            <div class='logo'></div>
            <div class='bottom'>
                <div class='rank-box'>
                    <div  class='text font-small position-left'>최고 점수 ></div>
                    <div id='${this.id}bestScore' class='text font-small position-right'>-</div>

                    <div  class='text font-tiny position-clear position-left'>2등 ></div>
                    <div id='${this.id}secondScore' class='text font-tiny position-right '>-</div>

                    <div  class='text font-tiny position-clear position-left'>3등 ></div>
                    <div id='${this.id}thirdScore' class='text font-tiny position-right'>-</div>

                    <div  class='text font-small group-margin position-clear position-left'>내 최고 점수 ></div>
                    <div id='${this.id}myScore' class='text font-small group-margin position-right'>-</div>
                    <div  class='text font-small position-clear position-left'>내 랭킹  ></div>
                    <div id='${this.id}myLank' class='text font-small position-right'>-</div>
                </div>
                <button id='${this.id}btnStart' class='btn-default btn-default-bg btn-start'><div class='btn-text-start position-center'></div></button>
            </div>

            <button id='${this.id}btnGuide' class='btn-default btn-guide'></button>
        
        `; 
        this.body.appendChild(cell);
    } 
}

class GuideBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"guide stage-bg");
        cell.innerHTML =
        `
            <div  class='scroll-box'>
                <img class='img' src='./asset/guide.png'/>
            </div>
            <button id='${this.id}btnClose' class='btn-default btn-close'></button>
        `; 
        this.body.appendChild(cell);
    } 
}

class FinishBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"finish stage-bg");
        cell.innerHTML =
        `
        <div class='dimed'></div>
            <div class='box'>
                <div class='alert-body'>
                    <div id='${this.id}title' class='title'></div>
                    <div id='${this.id}score' class='score font-miracle text-stroke'>0점</div>
                </div>
                <button id='${this.id}btnStart' class='btn-default btn-default-bg btn-start'><div class='btn-text-start position-center'></div></button>  
            </div> 
        </div>
        
        `; 
        this.body.appendChild(cell);
    } 
}


class MsgWindowBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"msg-window");
        cell.innerHTML =
        `
        <div class='dimed'></div>
        <div class='box'>
            <div class='alert-body'>
                <div id='${this.id}title' class='title'>[미리보기]</div>
                <div id='${this.id}msg' class='msg font-big'></div>
            </div>
            <div id='${this.id}bottom' class='bottom'>  
            </div> 
        </div>
        `; 
        this.body.appendChild(cell);
    } 
}