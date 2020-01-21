/**
 * lib v1.0: Animation
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();




jarvis.AnimationJS= function() 
{
	this.fps=30;
	this.mdp=0.86;
	this.loofTimer=null;
	this.elementA=new Array();
	this.animationA=new Array();
	jarvis.animationJS=this;

}
jarvis.AnimationJS.prototype =
{
	startAnimation: function(element,aniObj) 
	{
       if(element==undefined){
		   return;
	   }
	  
	   aniObj.duration=Math.ceil(aniObj.duration*this.fps);
	   aniObj.delay=Math.ceil(aniObj.delay*this.fps);
	   
	   var idx=this.elementA.indexOf(element);
	   if(idx!=-1){
          this.elementA[idx]=element;
	      this.animationA[idx]=aniObj;
	   }else{
	      this.elementA.push(element);
	      this.animationA.push(aniObj);
	   }
         

	   if( this.loofTimer==null){
	      this.addLoofTimer();
	   }
    }
	
	,
	stopAllAnimation: function() 
	{
        this.animationA=new Array();
	    this.elementA=new Array();
		this.removeLoofTimer();
    }
	,
    stopAnimation: function(id) 
	{
       var idx=-1;
       for(var i=0;i<this.animationA.length;++i){
	        if(id==this.animationA[i].id){
			   idx=i;
			   break;
			}
	   
	   }
	   
	   if(idx!=-1){
	      delete this.elementA[idx]; 
	      delete this.animationA[idx];
	   }
    }
	,
    loof: function() 
	{
           
			var remainA=new Array();
			var remainEA=new Array();
		   // jarvis.debuger.trace("ani"+Math.random());
			var aniObj;
			var element;
			for(var i=0;i<this.animationA.length;++i){
				aniObj=this.animationA[i];
				element=this.elementA[i];
				if(aniObj==null){
					aniObj=this.animationA[i];   
				}
				aniObj.delay--;
			    
				if(aniObj.delay<=0){
				 
					var r=0;
					var ev=0;
					aniObj.t++;
					
					if(aniObj.t<=aniObj.duration){
						
						for (var key in aniObj.prop)
						{					        
							
							if(element[key]!=undefined && key!="id")
							{
								var cpk=aniObj.copyProp[key];
								
								if(cpk===undefined)
								{
									aniObj.copyProp[key]=new Object(); 
									cpk=aniObj.copyProp[key];
									ev=jarvis.lib.getNumber(element[key],aniObj.unit,key);
									cpk.diff=(ev-aniObj.prop[key]);
									
								}
								var d;
								var tg=jarvis.lib.getNumber(element[key],aniObj.unit,key);
								var lg=jarvis.lib.getNumber(aniObj.prop[key],aniObj.unit,key);
								
								switch(aniObj.ease)
								{
									case "linear": 
										d=(cpk.diff/aniObj.duration);
										break;
									case "ease-out": 
									case "ease out": 
										d= (cpk.diff/(aniObj.duration)*2)*Math.sin(aniObj.t/aniObj.duration*Math.PI/2)*this.mdp;
										break;
									case "ease-in": 
									case "ease in": 
										d= (cpk.diff/(aniObj.duration)*2)*Math.cos(aniObj.t/aniObj.duration*Math.PI/2)*this.mdp;
										break;
									case "ease in out": 
									case "ease-in-out": 
										d= (cpk.diff/(aniObj.duration)*2)*Math.sin(aniObj.t/aniObj.duration*Math.PI)*this.mdp;
										break;
							 
								}
								
								tg-=d;
							    if(tg>lg && d<0){
								   tg=lg;
								}else if(tg<lg && d>0){
								   tg=lg;
								}
								if(aniObj.t>=aniObj.duration)
								{
								    if(aniObj.unit=="auto"){
										element[key]=jarvis.lib.getAutoUnitValue(aniObj.prop[key],key);
									}else{
										
										element[key]=aniObj.prop[key]+aniObj.unit;
									}
									
									delete aniObj.prop[key];
								 
								}else{
										if(aniObj.unit=="auto"){
											element[key]=jarvis.lib.getAutoUnitValue(tg,key);
										}else{
											
											element[key]=tg+aniObj.unit;
											
										}
										
										r++;
								
								}
							}else{
								delete aniObj.prop[key];  
							}
						}
				}
				  
					if(r>0){
						jarvis.lib.excuteDelegate(aniObj.delegate,"update",[aniObj.id]);
						remainA.push(aniObj);
						remainEA.push(element)
					}else{
						jarvis.lib.excuteDelegate(aniObj.delegate,"complete",[aniObj.id]);
					}
				}else{
					remainA.push(aniObj);
					remainEA.push(element)
				}
            }
			
			if(remainA.length>0){
				this.animationA=remainA;
				this.elementA=remainEA;
				this.addLoofTimer();
			}else{//remove all
				this.stopAllAnimation();
			}

	}
	,
    addLoofTimer: function() 
	{
        this.removeLoofTimer();
		var t=1000/this.fps;
        
		//jarvis.debuger.log("addLoof "+t+" : "+Math.random()); 
		this.loofTimer=setTimeout("jarvis.animationJS.loof()",t);
		
    }
	,
	removeLoofTimer: function() 
	{
        if( this.loofTimer!=null){
		  
		   clearTimeout( this.loofTimer );
           this.loofTimer=null;
		}
    }
	
}







/*

*/