/**
 * lib v1.0: Animation
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();




jarvis.Animation= function() 
{
	this.animationJS=null;
	this.animationCSS=null;
	

}
jarvis.AnimationObject= function() 
{
	this.id="";
	this.duration=10;
	this.t=0;
	this.delay=0;
	this.isPx=false;
	this.unit="";
	this.ease="ease in";   //ease out ease in ease in out
	this.prop=null;
	this.copyProp=new Object();
    this.listener=null; //css ani used
	this.diff=0;
	this.delegate=null;//update/complete
    this.staticProp=false;
}
jarvis.Animation.prototype =
{
	startAnimation: function(element,prop,delegate) 
	{
       if(this.animationJS==null){
	      this.animationJS=new jarvis.AnimationJS();
		  this.animationCSS=new jarvis.AnimationCSS();
	   }
	   
	   if(element==undefined){
		   return;
	   }
	   if(prop==undefined){
		   return;
	   }
	   if(delegate==undefined){
		   delegate=null;
	   }

       

       var aniObj=new jarvis.AnimationObject();
       if(prop.isPx!=undefined){
	      aniObj.isPx=prop.isPx;
		  if(prop.isPx==true){
		     aniObj.unit="px";
		  }else if(prop.isPx=="auto"){
		     aniObj.unit="auto";
		  }else{
		     if(prop.unit!=undefined){
			     aniObj.unit=prop.unit;
				 delete prop.unit;
			 }else{
			     aniObj.unit="";
			 }
		  }
		  
          delete prop.isPx;
	   } 
	   if(prop.listener!=undefined){
		
		   aniObj.listener=prop.listener;
		   delete prop.listener;
	   }
	   if(prop.staticProp!=undefined){
		
		   aniObj.staticProp=prop.staticProp;
		   delete prop.staticProp;
	   }
	   
       aniObj.delegate=delegate;
	  
       if(prop.relativeDuration!=undefined && prop.relativeKey!=undefined){
	       if(element[prop.relativeKey]!=undefined){
		       var v = jarvis.lib.getNumber(element[prop.relativeKey],aniObj.unit);
			    
			   var diff=Math.abs(v - prop[prop.relativeKey]);
               var spdA=String(prop.relativeDuration).split(";");
			   var len=spdA.length;
			   var d=Number(spdA[0]);
			   var min=-1;
			   var max=-1;
			   if(len>=2){
                  min=Number(spdA[1]);
			      if(len>=3){
			          max=Number(spdA[2]);
			      }
			   }
			   prop.duration=d*Math.ceil(diff/100);
			   if(min!=-1 && prop.duration<min){
			       prop.duration=min;
			   }
			   if(max!=-1 && prop.duration>max){
			       prop.duration=max;
			   }
		   }
           delete prop.relativeKey;
		   delete prop.relativeDuration;
	   }
       
	   if(prop.duration!=undefined){
	      aniObj.duration=prop.duration;
          delete prop.duration;
	   }
       	

     
      
	   if(prop.delay!=undefined){
	      aniObj.delay=prop.delay;
		  delete prop.delay;
	   }
	   if(prop.ease!=undefined){
	      aniObj.ease=prop.ease;
		  delete prop.ease;
	   }
       aniObj.prop=prop;
	    
       if(jarvis.lib.isIE()==false){
           if(aniObj.listener==null){
		       this.animationJS.startAnimation(element,aniObj);
		   }else{
		   	   
		       this.animationCSS.startAnimation(element,aniObj);
		   }
	   }else{
		   this.animationJS.startAnimation(element,aniObj);
	   }
	


	   
    }
	
	,
	stopAllAnimation: function() 
	{
        if(this.animationJS==null){
		   return;
		}
		
		this.animationJS.stopAllAnimation();
		this.animationCSS.stopAllAnimation();
    }
	,
    stopAnimation: function(id) 
	{
        if(this.animationJS==null){
		   return;
		}
	   this.animationJS.stopAnimation(id);
	   this.animationCSS.stopAnimation(id);
	  
    }

	
	
	
}

jarvis.animation=new jarvis.Animation();





/*

*/