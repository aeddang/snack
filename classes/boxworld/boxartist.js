class BoxArtist
{
	constructor(canvas,world,ratio,delegate) 
	{
        this.delegate = delegate;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingQuality = "high";
        this.ctx.textAlign = "center";
        this.timeStep = 1.0/60;
        this.world = world;
        this.ctxWidth = canvas.width;
        this.ctxHeight = canvas.height;
        this.dx = 0;
        this.dy = 0;
        this.textures = new Array();
        this.effectTextures = new Array();
        this.isDebugMode = false;
        this.effects = new Array();
        this.texts = new Array();
        this.bgEffects = new Array();
        this.coverEffects = new Array();
        this.ratio = ratio;
    }

    reset()
    {
        this.texts = new Array();
        this.effects = new Array();
        this.bgEffects = new Array();
        this.coverEffects = new Array();
    }

    remove()
    {
        if(this.delegate) this.delegate.unsubscribe();
        this.ctx = null;
        this.world = null;
        this.camera = null;
        this.delegate = null;
    }

    adjustTexture(path)
    {
        let img = new Image();
        img.src = path;
        this.textures.push(img);
        return (this.textures.length - 1);
    }

    adjustEffects(paths)
    {
        for(var i=0;i<paths.length;++i) this.adjustEffect(paths[i]);
    }

    adjustEffect(path)
    {
        let img = new Image();
        img.src = path;
        this.effectTextures.push(img);
        return (this.effectTextures.length - 1);
    }

    addText(text)
    {
        this.texts.push(text);
    }

    addEffect(effect,type = EFFECT_TYPE.DEFAULT)
    {
        switch(type)
        {
            case EFFECT_TYPE.BG :
                this.bgEffects.push(effect)
                break;
            case EFFECT_TYPE.COVER :
                this.coverEffects.push(effect);
                break;
            default:
                this.effects.push(effect);
                break;
        }
    }

    setAllEffectsRation(ratio)
    {
        for (var e = 0; e < this.bgEffects.length ; ++ e ) var effect = this.bgEffects[e].setRatio(ratio);
        for (var e = 0; e < this.effects.length ; ++ e ) var effect = this.effects[e].setRatio(ratio);
        for (var e = 0; e < this.coverEffects.length ; ++ e ) var effect = this.coverEffects[e].setRatio(ratio);
    }

    drawWorld(t) 
    {
        
        this.world.Step(this.timeStep,1);
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
        this.ctx.restore();

        for (var e = 0; e < this.bgEffects.length ; ++ e )
        {
            var effect = this.bgEffects[e];
            if(effect.active) this.drawEffect(effect);
        }

        for (var b = this.world.m_bodyList; b; b = b.m_next)
        {
            var userData = b.GetUserData();
            if(userData != null) 
            {
                if(!userData.visible) break;
                
                userData.age ++;
                for (var s = b.GetShapeList(); s != null; s = s.GetNext()) this.drawShape(s,userData);
                if(b.IsSleeping()) this.delegate.next(new BoxWorldEvent(BOX_WORLD_EVENT.SLEEP_BODY,b,userData));
                this.delegate.next(new BoxWorldEvent(BOX_WORLD_EVENT.UPDATE_BODY,b,userData));
            }
        }
        
        var removes = new Array();
        for (var e = 0; e < this.effects.length ; ++ e )
        {
            var effect = this.effects[e];
            (effect.active) ? this.drawEffect(effect) : removes.unshift(e);
        }
        for (var r = 0; r < removes.length ; ++ r) this.effects.splice(removes[r], 1);
        
        for (var e = 0; e < this.coverEffects.length ; ++ e )
        {
            var effect = this.coverEffects[e];
            if(effect.active) this.drawEffect(effect);
        }

        for (var t = 0; t < this.texts.length ; ++t )
        {
            var text = this.texts[t];
            (text.active) ? this.drawText(text) : removes.unshift(t);
        }
        for (var r = 0; r < removes.length ; ++ r) this.texts.splice(removes[r], 1);



        if(this.isDebugMode == true) for (var j = this.world.m_jointList; j; j = j.m_next) this.drawJoint(j);
        
    }

    drawJoint(joint) 
    {
        var b1 = joint.m_body1;
        var b2 = joint.m_body2;
        var x1 = b1.m_position;
        var x2 = b2.m_position;
        var p1 = joint.GetAnchor1();
        var p2 = joint.GetAnchor2();
        this.ctx.strokeStyle = '#00eeee';
        this.ctx.beginPath();
        switch (joint.m_type) 
        {
            case b2Joint.e_distanceJoint:
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                break;

            case b2Joint.e_pulleyJoint:
                // TODO
                break;

            default:
                if (b1 == this.world.m_groundBody) 
                {
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(x2.x, x2.y);
                }
                else if (b2 == this.world.m_groundBody) 
                {
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(x1.x, x1.y);
                }
                else 
                {
                    this.ctx.moveTo(x1.x, x1.y);
                    this.ctx.lineTo(p1.x, p1.y);
                    this.ctx.lineTo(x2.x, x2.y);
                    this.ctx.lineTo(p2.x, p2.y);
                }
                break;
        }
        this.ctx.stroke();
    }

    drawShape(shape,userData=null) //debug
    {
        if(userData != null)
        {
            if(userData.pattern != -1) this.drawPattern(shape,userData); 
            if(userData.image != -1) this.drawImage(shape,userData);
        }
        
        if(this.isDebugMode || userData == null) this.drawDebug(shape,userData);
    }

    drawEffect(effect)
    {

        if(effect.image == -1) return;
        if(effect.active == false) return;
        let img = this.effectTextures[effect.image];
        
        let tx = effect.bounce.width/2;
        let ty = effect.bounce.height/2;
        let w = effect.bounce.width;
        let h = effect.bounce.height;
        let frame = effect.frame;

        var mx = effect.bounce.x;
        var my = effect.bounce.y;
        var malpha = effect.alpha;
        var mrotate = effect.rotate;
        if(effect.transform.isPlaying)
        {
            mx += effect.transform.x;
            my += effect.transform.y;
            malpha += (effect.transform.alpha/100);
            mrotate += (effect.transform.rotate*Math.PI/180);
        }

        this.ctx.save();
        this.ctx.globalAlpha = malpha;
        this.ctx.translate(mx, my); 
        this.ctx.rotate(mrotate);
        var iw = img.width/effect.totalFrame;
        this.ctx.drawImage(img,iw*frame,0,iw,img.height,-tx,-ty,w,h);
        this.ctx.restore();
        effect.next();
    }

    drawText(text)
    {
        if(text.active == false) return;
        
        var mx = text.bounce.x;
        var my = text.bounce.y;
        var malpha = text.alpha;
        var mrotate = text.rotate;
        if(text.transform.isPlaying)
        {
            mx += text.transform.x;
            my += text.transform.y;
            malpha += (text.transform.alpha/100);
            mrotate += (text.transform.rotate*Math.PI/180);
        }
        this.ctx.save();
        this.ctx.globalAlpha = malpha;
        this.ctx.translate(mx, my); 
        this.ctx.rotate(mrotate);
        this.ctx.font = text.font;
        this.ctx.fillStyle = text.color;
        this.ctx.lineWidth = text.lineWidth;
        this.ctx.strokeStyle = text.strokeColor;
        if(text.strs)
        {
            let h = text.lineHeight;
            let isStroke = text.isStroke;
            var ty = my - Math.floor(text.strs.length * h/2);
            text.strs.forEach((str)=>
            {
                this.ctx.fillText(str,mx,ty);
                if(isStroke) this.ctx.strokeText(str,mx,ty); 
                ty += h;
            });
        }
        else
        {
            this.ctx.fillText(text.str,mx,my);
            if(text.isStroke) this.ctx.strokeText(text.str,mx,my); 
        }
        
        this.ctx.restore();

        text.next();
    }
    
    drawDebug(shape) 
    {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.beginPath();
        switch (shape.m_type) 
        {
            case b2Shape.e_circleShape:
                var circle = shape;
                var pos = circle.m_position;
                var r = circle.m_radius;
                
                var segments = 16.0;
                var theta = 0.0;
                var dtheta = 2.0 * Math.PI / segments;
                // draw circle
                this.ctx.moveTo(pos.x + r, pos.y);
                for (var i = 0; i < segments; ++i) 
                {
                    var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                    var v = b2Math.AddVV(pos, d);
                    this.ctx.lineTo(v.x, v.y);
                    theta += dtheta;
                }
                this.ctx.lineTo(pos.x + r, pos.y);
                // draw radius
                this.ctx.moveTo(pos.x, pos.y);
                var ax = circle.m_R.col1;
                var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                this.ctx.lineTo(pos2.x, pos2.y);
                break;

            case b2Shape.e_polyShape:
                var poly = shape;
                var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                this.ctx.moveTo(tV.x, tV.y);
                for (var i = 0; i < poly.m_vertexCount; ++i) 
                {
                    var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                    this.ctx.lineTo(v.x, v.y);
                }
                this.ctx.lineTo(tV.x, tV.y);
                break;
        }
        this.ctx.stroke();
    }

    drawPattern(shape,userData) 
    {
        let img = this.textures[userData.pattern];
        let pat= this.ctx.createPattern(img,"repeat");

        this.ctx.beginPath();
        switch (shape.m_type) 
        {
            case b2Shape.e_circleShape:
                var circle = shape;
                var pos = circle.m_position;
                var r = circle.m_radius;
                
                var segments = 16.0;
                var theta = 0.0;
                var dtheta = 2.0 * Math.PI / segments;
                // draw circle
                this.ctx.moveTo(pos.x + r, pos.y);
                for (var i = 0; i < segments; ++i) 
                {
                    var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
                    var v = b2Math.AddVV(pos, d);
                    this.ctx.lineTo(v.x, v.y);
                    theta += dtheta;
                }
                this.ctx.lineTo(pos.x + r, pos.y);
                // draw radius
                this.ctx.moveTo(pos.x, pos.y);
                var ax = circle.m_R.col1;
                var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                this.ctx.lineTo(pos2.x, pos2.y);
                break;

            case b2Shape.e_polyShape:
                var poly = shape;
                var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                this.ctx.moveTo(tV.x, tV.y);
                for (var i = 0; i < poly.m_vertexCount; ++i) 
                {
                    var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                    this.ctx.lineTo(v.x, v.y);
                }
                this.ctx.lineTo(tV.x, tV.y);
                break;
        }
        this.ctx.fillStyle=pat;
        this.ctx.fill();
        
    }

    drawImage(shape,userData) 
    {
        let img = this.textures[userData.image];

        let pos = shape.m_position;
        let rt = shape.m_body.m_rotation;
        var tx = 0;
        var ty = 0;
        
        switch (shape.m_type) 
        {
            case b2Shape.e_circleShape:
                let r = shape.m_radius;
                tx = r;
                ty = r;
                break;

            case b2Shape.e_polyShape:

                tx = shape.m_localOBB.extents.x;
                ty = shape.m_localOBB.extents.y;

                break;
        }
        let w = 2*tx;
        let h = 2*ty;
        this.ctx.save();
        this.ctx.globalAlpha = userData.alpha;
        this.ctx.translate(pos.x, pos.y); 
        this.ctx.rotate(rt); 
        this.ctx.drawImage(img,-tx,-ty,w,h);
        this.ctx.restore();

        if(userData.effect != null)
        {
            userData.effect.bounce.x = pos.x;
            userData.effect.bounce.y = pos.y;
            userData.effect.rotate = rt;

            this.drawEffect(userData.effect);
        }

        if(userData.text != null)
        {
            userData.text.bounce.x = pos.x/this.ratio;
            userData.text.bounce.y = pos.y/this.ratio;
            userData.text.rotate = rt;
            this.drawText(userData.text);
        }
        
    }


}