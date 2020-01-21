const BOX_WORLD_EVENT = Object.freeze
(
    {
        UPDATE_BODY : "updateBody",
        SLEEP_BODY  : "sleepBody"
    }
);

class BoxWorldEvent 
{
    constructor(type,body=null,value=null) 
    {
        this.type = type;
        this.body = body;
        this.value = value;
    }

    toString()
    {
        console.log("BoxWorldEvent  : "+this.type+" | "+this.body);
    }
}

class BoxWorld
{
	constructor(body,delegate = new Rx.Subject(),ratio = 1.0, gravity = 300) 
	{
        this.body = body;
		this.delegate = delegate;
		this.rxTimeMover = null;
        
        this.GAME_TIME = 10;
        this.isPlay = false;
        this.isPlayStatus = false;
        this.age = 0;

        this.canvas = document.createElement("canvas");
        this.body.appendChild(this.canvas); 
        this.space = new Object();
        
        let bounce =  jarvis.lib.getAbsoluteBounce(this.body); 
        this.canvas.width = bounce.width*ratio;
        this.canvas.height = bounce.height*ratio;
        this.canvas.style.width = bounce.width+"px";
        this.canvas.style.height = bounce.height+"px";
        this.world = BoxElementProvider.createWorld(gravity * ratio ,0,this.canvas);

        let artistDelegate = new Rx.Subject()
        artistDelegate.subscribe
        (
            this.onEvent.bind(this)
        ); 
        this.artist = new BoxArtist(this.canvas,this.world,ratio,artistDelegate);
    }
    
    init()
    {
        this.createSpace();
        this.createElements();
        this.setupEvent();
        return this.delegate;
    }

    reset()
    {
        this.age = 0;
        this.artist.reset();
    }

    remove()
    {
        this.finish();
        this.world.CleanBodyList();
        this.artist.remove();
        this.delegate = null;
        this.rxTimeMover = null;
        this.canvas = null;
        this.world = null;
        this.artist = null;
    }

    createElements()
    {

    }

    setupEvent()
    {
        jarvis.lib.addEventListener(window,"blur",this.onPassive.bind(this));
        jarvis.lib.addEventListener(window,"focus",this.onActive.bind(this));
    }

    createSpace(physicalData = new PhysicalData(),userData = new UserData())
    {
    	let spaceWidth = this.canvas.width;
    	let spaceHeight =  this.canvas.height;
    	this.space.top = BoxElementProvider.createGround(this.world,0,0,spaceWidth,1,physicalData,userData); // top
    	this.space.left = BoxElementProvider.createGround(this.world,0,0,1,spaceHeight,physicalData,userData); //left
    	this.space.right = BoxElementProvider.createGround(this.world,spaceWidth,0,1,spaceHeight,physicalData,userData); //right
    	this.space.bottom = BoxElementProvider.createGround(this.world,0,spaceHeight-10,spaceWidth,10,physicalData,userData); // bottom
    }
    onPassive()
    {
        this.isPlayStatus = this.isPlay;
        this.pause();
    }

    onActive()
    {
        if(this.isPlayStatus) this.resume();
    }
    onEvent(e)
    {
        switch(e.type)
        {
            case BOX_WORLD_EVENT.UPDATE_BODY:
                if(e.value!=null) this.doUpdateBody(e.body,e.value);
                break;
            case BOX_WORLD_EVENT.SLEEP_BODY:
                if(e.value!=null) this.doSleepBody(e.body,e.value);
                break;
        }

    }


    start()
    {
        this.resume();
    }

    pause()
    {
        this.isPlay = false;
        if(this.rxTimeMover) this.rxTimeMover.unsubscribe();
    }
    resume()
    {
        this.isPlay = true;
        if(this.rxTimeMover) this.rxTimeMover.unsubscribe();
        this.rxTimeMover = Rx.Observable.interval(this.GAME_TIME).subscribe
        (
            this.onTime.bind(this)
        );
    }

    onTime(t)
    {
        this.age ++;
        this.artist.drawWorld(t);
    }

    finish()
    {
        this.pause();
    }

    getContactedLists(body,lists,excepts = null,id="",groupKey="")
    {   
        let jointLists = body.GetJointList();
        
        let prevJoints = new Array();
        let nextJoints = new Array();
        if(jointLists != null)
        {
            if(jointLists.prev != null) prevJoints.push(jointLists.prev.other);
            if(jointLists.next != null) nextJoints.push(jointLists.next.other);
        }
        let returns = new Array();
        returns.push(body);

        if(this.isContactedAble(lists,excepts,id,groupKey)) returns.push(lists.other);
        if(this.isContactedAble(lists.prev,excepts,id,groupKey)) returns.push(lists.prev.other);
        if(this.isContactedAble(lists.next,excepts,id,groupKey)) returns.push(lists.next.other);
        return returns;
    }

    isContactedAble(bdList,excepts = null ,id="",groupKey="")
    {
        if(bdList == null) return false;
        if(excepts) if(excepts.indexOf(bdList.other) != -1) return false;
        let data = bdList.other.GetUserData();
        if(data == null && data.active == false) return false;
        if(data.id.indexOf(groupKey) == -1) return false;
        if(id == "") return true;
        if(id == data.id) return true;
        return false;
    }


    getJointLists(body, returns, id = "", excepts = null)
    {   
        if(body == null) return returns;
        var data = body.GetUserData();
        if(data == null || data.id == "" || (data.id != id && id != "")) return returns;
        if(excepts)  if(excepts.indexOf(body) != -1) return returns;
        if(returns.indexOf(body) != -1) return returns;
        returns.push(body);
        var lists = body.GetJointList();
        if(lists == null) return returns;
        var joint = lists.joint.GetNext(); 
        while(joint)
        {
            var b0 = joint.GetBody1();
            var b1 = joint.GetBody2();
            if(returns.indexOf(b0) != -1 || returns.indexOf(b1) != -1)
            {
                this.getJointLists(joint.GetBody1(),returns, id, excepts);
                this.getJointLists(joint.GetBody2(),returns, id, excepts);
            }
            joint = joint.GetNext();
        }
        return returns;
    }

    joinBodys(bodys,distance = null)
    {     
        if(bodys == null) return;  
        if(bodys.length < 2) return;  
        for(var i =1; i<bodys.length; ++i)
        {
            var b0 = bodys[i-1];
            var lists = b0.GetJointList();
            var b1 = bodys[i];
            //if(lists != null  && lists.other == b1) return; 
            BoxElementProvider.createJoint(this.world,bodys[i-1], bodys[i],distance);
            this.doJoinBody(b0,b1);
        }
        this.doJoinBodys(bodys);
    }

    getAllBodys(groupKey = "",excepts = null)
    {
        let bodys = new Array();
        for (var b = this.world.GetBodyList(); b; b = b.m_next)
        {
            var userData = b.GetUserData();
            if(userData != null && userData.id.indexOf(groupKey) != -1) 
            {
                if(excepts!= null && excepts.indexOf(b) == -1) bodys.push(b);
            }
        }
        return bodys;
    }

    destroyBodys(bodys)
    {
        if(bodys == null) return;  
        for(var i =0; i<bodys.length; ++i)
        {
            var bd = bodys[i];
            this.world.DestroyBody(bd); 
            this.doDestroyBody(bd);
        }
        this.doDestroyBodys(bodys);
    }

    destroyBody(body)
    {
        this.world.DestroyBody(body); 
        this.doDestroyBody(body);
    }

    destroyJoints(bodys)
    {
        if(bodys == null) return;  
        for(var i =0; i<bodys.length; ++i)
        {
            var bd = bodys[i];
            var lists = bd.GetJointList();
           
            if(lists!=null && lists.joint.GetNext()) 
            {
                this.world.DestroyJoint(lists.joint.GetNext())
                this.doDestroyJoint(bd);
            }
        }
        this.doDestroyJoints(bodys);
    }

    cleanWorld(excepts,groupKey="")
    {
        let cleans = new Array();
        for (var b = this.world.m_bodyList; b; b = b.m_next)
        {
            var userData = b.GetUserData();
            if(userData != null) 
            {   
                if(excepts==null || excepts.indexOf(b) == -1)
                {
                    if(groupKey == "" || userData.id.indexOf(groupKey) != -1)
                    {
                        cleans.push(b);
                    } 
                }
                
            }
        }
        for(var i =0; i<cleans.length; ++i) this.world.DestroyBody(cleans[i]); 
        this.world.CleanBodyList();
    }

    doJoinBody(body0,body1){}
    doJoinBodys(bodys){}
    doDestroyJoint(body){}
    doDestroyJoints(bodys){}
    doDestroyBody(body){}
    doDestroyBodys(bodys){}
    doSleepBody(body,userData){}
    doUpdateBody(body,userData){}


}