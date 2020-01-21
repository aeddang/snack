/**
 * lib v1.0: Animation
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();




jarvis.AnimationCSS= function() 
{
	this.elementA=new Array();
	this.animationA=new Array();

}
jarvis.AnimationCSS.prototype =
{
	startAnimation: function(element,aniObj) 
	{
       //jarvis.debuger.log("CSS Animation startAnimation : "+aniObj.id);
	   if(element==undefined){
		   return;
	   }
	  
	   var that=this;
	   
	   this.elementA.push(element);
	   this.animationA.push(aniObj);
	   if(aniObj.listener!=null){
            
			aniObj.listener.aniComplete=function(e){that.animationComlete(aniObj)};
			jarvis.lib.addEventListener(aniObj.listener,"webkitTransitionEnd",aniObj.listener.aniComplete);
			jarvis.lib.addEventListener(aniObj.listener,"transitionend",aniObj.listener.aniComplete);
			jarvis.lib.addEventListener(aniObj.listener,"msTransitionEnd",aniObj.listener.aniComplete);
			jarvis.lib.addEventListener(aniObj.listener,"oTransitionEnd",aniObj.listener.aniComplete);
			
            
       }
       switch(aniObj.ease){
			case "ease out": 
				aniObj.ease="ease-out";
				break;
			case "ease in": 
				aniObj.ease="ease-in";
				break;
			case "ease in out": 
				aniObj.ease="ease-in-out";
				break;
							 
	   }
	   var property;
	   var idx=0;
	   for (var key in aniObj.prop)
	   {
		    if(key!="id"){
			
				if(idx==0){
					property=key;
				}else{
					property=property+","+key; 

				}
				idx++;
			}
			
	   }
       //jarvis.debuger.log("CSS Animation startAnimation : "+aniObj.delay);
	   if(aniObj.staticProp==false){
		    
			
			this.setAnimationProperty(element,"property", property);
			this.setAnimationProperty(element,"fill-mode","both");
			this.setAnimationProperty(element,"duration",aniObj.duration+"s");
			this.setAnimationProperty(element,"timing-function",aniObj.ease);
			this.setAnimationProperty(element,"delay",aniObj.delay+"s");
			
			
	   }
	   
	   for (var key in aniObj.prop)
	   {
		    if(key!="id"){
                if(aniObj.unit=="auto"){
				    element[key]=jarvis.lib.getAutoUnitValue(aniObj.prop[key],key);
				}else{
					if(aniObj.isPx==true){
						
						element[key]=Math.floor(aniObj.prop[key])+aniObj.unit;
					}else{
					    element[key]=aniObj.prop[key]+aniObj.unit;
					}
				    
				}
				
				
			}
	   }
       

    }
	
	,
	setAnimationProperty: function(element,property,value) 
	{
        element["-webkit-transition-"+property]=value;
		element["-moz-transition-"+property]=value;
		element["-ms-transition-"+property]=value;
		element["-o-transition-"+property]=value;
		element["transition-"+property]=value;
       

	},
	animationComlete: function(aniObj) 
	{
        
		if(aniObj==null){
		    return;
		}
		var idx=this.animationA.indexOf(aniObj);
		if(idx==-1){
		    return;
		}
		var element= this.elementA[idx];
	    if(aniObj.staticProp==false){
			this.setAnimationProperty(element,"property","none");
			this.setAnimationProperty(element,"fill-mode","");
			this.setAnimationProperty(element,"duration","");
			this.setAnimationProperty(element,"delay",""); 
			this.setAnimationProperty(element,"timing-function","");
		}
        

        jarvis.lib.removeEventListener(aniObj.listener,"webkitTransitionEnd",aniObj.listener.animationComlete);
		jarvis.lib.removeEventListener(aniObj.listener,"transitionend",aniObj.listener.animationComlete);
		jarvis.lib.removeEventListener(aniObj.listener,"msTransitionEnd",aniObj.listener.animationComlete);
		jarvis.lib.removeEventListener(aniObj.listener,"oTransitionEnd",aniObj.listener.animationComlete);

		delete aniObj.listener.animationComlete;
		delete this.elementA[idx];
		delete this.animationA[idx];
        
		jarvis.lib.excuteDelegate(aniObj.delegate,"complete",[aniObj.id]);
		
		
    }
	,
	stopAllAnimation: function() 
	{
        
    }
	,
    stopAnimation: function(id) 
	{
      
    }
	
	
}






/*

*/