
class UserData
{
    constructor(id = "") 
    {
        this.id = id;
        this.idx = 0;
        this.isCamera = false;
        this.visible = true;
        this.pattern = -1;
        this.image = -1;
        this.value = null;
        this.active = true;
        this.age = 0;
        this.alpha = 1;
        this.effect = null;
        this.text = null;
    }

}

class PhysicalData
{
    constructor(density = 0) 
    {
        this.restitution = 0.1; 
        this.friction = 20; 
        this.angularDamping = 0.05;
        this.linearDamping = 0.0;
        this.density = density;
    }
}

class KineticData
{
    constructor(motorSpeed = 0) 
    {
        this.motorSpeed = motorSpeed;
        this.motorTorque = 0;
        this.lowerAngle = 0;
		this.upperAngle = 0;
    }
}

class TextData
{
    constructor(id,bounce,str, duration = -1,font = "small-caps bold 30px arial",color = '#fff',isStroke = false, strokeColor="#000", lineWidth = 2) 
    {
        this.id = id;
        this.age = 0;
        this.alpha = 1;
        this.rotate = 0;
        this.str = str;
        this.strs = null;
        this.lineHeight = 50;
        this.active = true;
        this.bounce = bounce;
        this.duration = duration;
        this.font = font;
        this.isStroke = isStroke;
        this.lineWidth = lineWidth;
        this.color = color;
        this.strokeColor = strokeColor;
        this.transform = new TransformData();
    }

    setText(str)
    {
        this.str = str;
    }

    next()
    {
    	if(this.duration != -1)
    	{
    		this.age++;
        	if(this.age >= this.duration) this.active = false;
        }
        return this.transform.next();
    }
}

class EffectData
{
    constructor(id,bounce,image,totalFrame=1, duration = -1, fps = 10) 
    {
        this.id = id;
        this.age = 0;
        this.ratio =1;
        this.alpha = 1;
        this.rotate = 0;
        this.image = image;
        this.frame = this.age;
        this.totalFrame = totalFrame;
        this.bounce = bounce;
        this.active = true;
        this.duration = duration;
        this.fps = fps;
        this.delay = 0;
        this.isReplay = true;
        this.isPlay = (totalFrame>1) ? true : false;
        this.transform = new TransformData();
    }

    setRatio(ratio)
    {
    	this.ratio = ratio;
    	this.bounce.x = this.bounce.x*ratio;
    	this.bounce.y = this.bounce.y*ratio;
    	this.bounce.width = this.bounce.width*ratio;
    	this.bounce.height = this.bounce.height*ratio;
    }

    play(isReplay = true)
    {
    	this.isPlay = true;
    	this.isReplay = isReplay;
    }
    stop()
    {
    	this.isPlay = false;
    }

    next()
    {
    	if(this.delay>0)
    	{
    		this.delay --;
    		return;
    	}
    	if(this.isPlay) this.age++;
        let f =  Math.floor(this.age/this.fps);
        this.frame = (this.isReplay) ? f % this.totalFrame : ((f >= this.totalFrame-1) ? this.totalFrame-1 : f);
        if(this.duration != -1 && this.age >= this.duration) this.active = false;
        return this.transform.next();
    }
}

class BoxElementProvider
{
	constructor() 
	{  
    }

    static createWorld (gravity = 300,wind = 0,size) 
    {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(0, 0);
		worldAABB.maxVertex.Set(size.width, size.height);
		var world = new b2World(worldAABB, new b2Vec2(wind, gravity), true);

		return world;
	}

	static createGround(world,x,y,width,height, physicalData = new PhysicalData(),userData = new UserData())
	{
		var groundSd = new b2BoxDef();
		groundSd.extents.Set(width, height);
		groundSd.restitution = physicalData.restitution;
		groundSd.friction = physicalData.friction;
		var groundBd = new b2BodyDef();
		groundBd.AddShape(groundSd);
		groundBd.position.Set(x, y);
		groundBd.userData = userData;
		//groundBd.userData.visible = false;
		return world.CreateBody(groundBd);
	}

	static createCircle(world, x, y,radius, physicalData = new PhysicalData(), userData = null) 
	{
		var ballSd = new b2CircleDef();
		ballSd.radius = radius;
		
		if (physicalData.density != 0) ballSd.density = physicalData.density;
		ballSd.restitution = physicalData.restitution;
		ballSd.friction = physicalData.friction;
		var ballBd = new b2BodyDef();
		ballBd.AddShape(ballSd);

		ballBd.position.Set(x,y);
		ballBd.linearDamping = physicalData.linearDamping;
		ballBd.angularDamping = physicalData.angularDamping;
		ballBd.userData = userData;
		return world.CreateBody(ballBd);
	}

	static createRect(world, x, y, width, height, physicalData = new PhysicalData(), userData = null) 
	{
		var boxSd = new b2BoxDef();
		if (physicalData.density != 0) boxSd.density = physicalData.density;
		boxSd.restitution = physicalData.restitution;
		boxSd.friction = physicalData.friction;
		boxSd.extents.Set(width, height);
		var boxBd = new b2BodyDef();
		boxBd.AddShape(boxSd);
		boxBd.position.Set(x,y);
		boxBd.userData = userData;
		boxBd.linearDamping = physicalData.linearDamping;
		boxBd.angularDamping = physicalData.angularDamping;
		return world.CreateBody(boxBd);
	}

	static createPolygon(world, x, y, points, physicalData = new PhysicalData(), userData = null) 
	{
		var polySd = new b2PolyDef();
		polySd.vertexCount = points.length;
		for(var i = 0; i < points.length; ++i) polySd.vertices[i].Set(points[i][0], points[i][1]);
		if (physicalData.density != 0) polySd.density = physicalData.density;
		polySd.friction = physicalData.friction;
		polySd.restitution = physicalData.restitution;
		var polyBd = new b2BodyDef();
		polyBd.AddShape(polySd);
		polyBd.position.Set(x,y);
		polyBd.userData = userData;
		polyBd.linearDamping = physicalData.linearDamping;
		polyBd.angularDamping = physicalData.angularDamping;
		return world.CreateBody(polyBd);
	}

	static createAnchor(world, x, y, body0, body1,kineticData = new KineticData()) 
	{
		var rjd = new b2RevoluteJointDef();
		rjd.anchorPoint.Set(x, y);
		rjd.body1 = body0;
		rjd.body2 = body1;
		rjd.motorSpeed = kineticData.motorSpeed;
		rjd.motorTorque = kineticData.motorTorque;
		rjd.lowerAngle = kineticData.lowerAngle;
		rjd.upperAngle = kineticData.upperAngle;
		//rjd.collideConnected = true;
		rjd.enableLimit = (rjd.lowerAngle == 0) ? false : true;
		rjd.enableMotor = (kineticData.motorSpeed == 0) ? false : true;
		return world.CreateJoint(rjd);;
	}

	static createJoint(world,body0, body1,distance = null) 
	{
		var rjd = new b2DistanceJointDef();
		var p1 = body0.GetCenterPosition();
        var p2 = body1.GetCenterPosition();
 
        var tx = p2.x;
        var ty = p2.y;
        if(distance)
        {
        	let dx = p1.x - p2.x;
        	let dy = p1.y - p2.y;
        	let r = - Math.atan2(dx,dy) - (1*Math.PI/2);
        	tx = p1.x + (Math.cos(r) * distance);
        	ty = p1.y + (Math.sin(r) * distance);

        }
      	rjd.anchorPoint1.Set(p1.x, p1.y);
		rjd.anchorPoint2.Set(tx, ty);
		rjd.body1 = body0;
		rjd.body2 = body1;
		return world.CreateJoint(rjd);;
	}
}


const EFFECT_TYPE = Object.freeze
(
    {
        DEFAULT : 0,
        BG : -1,
        COVER : 1
    }
);
const TRANS_VALUE = Object.freeze
(
    {
        X : "x",
        Y : "y",
        ALPHA : "alpha",
        ROTATE : "rotate"
    }
);

const TRANS_TYPE = Object.freeze
(
    {
        ONCE : -1,
        REPEAT : 0,
        PATROL : 1,
        MOVE : 2
    }
);

const EASY = Object.freeze
(
    {
        NONE : -1,
        IN : 0,
        OUT : 1,
        IN_OUT : 2
    }
);


const TRANS_EVENT = Object.freeze
(
    {
    	NONE : "none",
        START : "start",
        RESTART : "restart",
        COMPLETE : "complete"
    }
);

class TransformData
{
    constructor() 
    {
    	this.x = 0;
        this.tx = 0;
        this.ox = 0;

        this.y = 0;
        this.ty = 0;
        this.oy = 0;

        this.alpha = 0;
        this.talpha = 0;
        this.oalpha = 0;

        this.rotate = 0;
        this.trotate = 0;
        this.orotate = 0;

        this.t=0;
        this.duration = -1;
        this.delay = -1;
        this.easy = EASY.NONE;
        this.isPlay = false;
        this.isPlaying = false;
        this.type = TRANS_TYPE.MOVE;
    }

    reset()
    {
    	this.isPlaying = false;
    	this.isPlay = false;
        this.tx = 0;
        this.ox = 0;
		this.ty = 0;
        this.oy = 0;
        this.talpha = 0;
        this.oalpha = 0;
        this.trotate = 0;
        this.orotate = 0;

        this.t=0;
        this.duration = -1;
        this.delay = -1;
        this.resetData();
    }
    resetData()
    {
    	this.x = 0;
    	this.y = 0;
    	this.alpha = 0;
    	this.rotate = 0;
		this.t=0;
    }

    start(duration,easy = EASY.NONE,type=TRANS_TYPE.MOVE,delay = -1)
    {
    	this.duration = duration;
    	this.delay = delay;
        this.easy = easy;
        this.type = type;
    	this.x = 0;
    	this.y = 0;
    	this.alpha = 0;
    	this.rotate = 0;
    	this.isPlay = true;

    }

    play()
    {
    	this.isPlay = true;
    }

    stop()
    {
    	this.isPlay = false;
    }

    addAnimation(v,amount)
    {
    	switch(v)
		{
			case TRANS_VALUE.X:
				this.tx=amount;
				this.ox=this.x;
				break;
			case TRANS_VALUE.Y:
				this.ty=amount;
				this.oy=this.y;
				break;
			case TRANS_VALUE.ALPHA:
				this.talpha=amount;
				this.oalpha=this.alpha;
				break;
			case TRANS_VALUE.ROTATE:
				this.trotate=amount;
				this.orotate=this.rotate;
				break;
		}
    }

    next()
    {
    	if(this.isPlay == false) return TRANS_EVENT.NONE;
    	if(this.duration == -1) return TRANS_EVENT.NONE;
    	if(this.delay>0)
		{
		    this.delay--;
			return TRANS_EVENT.NONE;
		}

		if(this.tx != 0) this.x = this.animating(this.ox,this.tx);
		if(this.ty != 0) this.y = this.animating(this.oy,this.ty);
		if(this.trotate != 0) this.rotate = this.animating(this.orotate,this.trotate);
		if(this.talpha != 0) this.alpha = this.animating(this.oalpha,this.talpha);
		this.t ++;
		
		if(this.t >= this.duration)
		{
			return this.complete();
		}
		else if(this.isPlaying == false)
		{
			this.isPlaying = true;
			return TRANS_EVENT.START;
		}
		return TRANS_EVENT.NONE;
    }

    complete()
    {

    	switch(this.type)
		{
			case TRANS_TYPE.ONCE:
				this.reset();
				return TRANS_EVENT.COMPLETE;
			case TRANS_TYPE.MOVE:
				this.stop();
				return TRANS_EVENT.COMPLETE;
			case TRANS_TYPE.REPEAT:
				this.resetData();
				return TRANS_EVENT.RESTART;
				break;
			case TRANS_TYPE.PATROL:
				break;
		}
		return TRANS_EVENT.NONE;
    }

    animating(ov,tv)
	{
		
		if(tv==-1) return -1;
		var diff = tv-ov;
		var offsetR=0;
		var rangeR=0;
		var offsetV=0;
		var mt=1;
		var r=0;
		
		var type="n";
		
		switch(this.easy)
		{
			case EASY.IN:
				offsetR=0;
				rangeR=90;
				offsetV=0;
				mt=1;
				type="s";
				break;
			case EASY.OUT:
				offsetR=270;
				rangeR=90;
				offsetV=1;
				mt=1;
				type="s";
				break;
			case EASY.IN_OUT:
				offsetR=180;
				rangeR=180;
				offsetV=1;
				mt=2;
				type="c";
				break;
		    default:
		    	
		    	break;
		}
		var pct=this.t/this.duration;
		
		if(type=="n")
		{
			r=diff*pct;
		}
		else
		{
			var cr=(rangeR!=0) ? offsetR + Math.floor(rangeR*pct) : 0;
			var rd= Math.PI*cr/180;
			r = (type=="s") ? Math.sin(rd) : Math.cos(rd);
			r = offsetV+r;
			r = r/mt;
			r = diff*r;
		}
		r=ov+r;
		return r;
	}
	




}

