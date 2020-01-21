/**
 * lib v1.0: jarvis component
 * by aeddang
 */
/*
interfaces
*/


if(typeof jarvis == "undefined") var jarvis = new Object();
document.write("<link rel='stylesheet' href='"+jarvisSrc+"uicomponent/style/uislidebar.css'>");


/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
    
	valueChanging : function(amount){},   
	valueChanged : function(amount){}
}
*/
jarvis.UISlideBarOption=function(){
   
	this.usedState=true;
	this.usedPointer=true;
	this.isVertical=false;
	this.endValue=1;
    this.startValue=0.5;

	this.cssKey="jarvis-uislidebar-panel";

}



jarvis.UISlideBar= function(pageID,delegate,option) 
{
	
	if(option=== undefined || option=== null){
	    option=new jarvis.UISlideBarOption();
	}
    if(delegate=== undefined){
	    delegate=null;
    }
	this.delegate=delegate;
	this.option=option;
	
	var parent;
	if(typeof pageID=="String" || typeof pageID=="string"){
	    parent=document.getElementById(pageID);
	}else{
	    parent=pageID;
	}
	
	
	if(this.option.isVertical==true){
	   jarvis.lib.addAttribute(parent,option.cssKey+"-v");
	}else{
	   jarvis.lib.addAttribute(parent,option.cssKey+"-h");
	}
    
	this.value=option.startValue;
	this.endValue=option.endValue;
	this.isVertical=option.isVertical;
	
    this.view=document.createElement("div");
	jarvis.lib.addAttribute(this.view,"view");
    parent.appendChild(this.view);

	if(this.option.usedState==true){
		this.stateBar=document.createElement("span");
		jarvis.lib.addAttribute(this.stateBar,"default-bar state-bar");
		this.view.appendChild(this.stateBar);
	}
	
	this.slideBar=document.createElement("span");
    jarvis.lib.addAttribute(this.slideBar,"default-bar slide-bar");
	this.view.appendChild(this.slideBar);

	this.prevSlideBar=document.createElement("span");
	jarvis.lib.addAttribute(this.prevSlideBar,"default-bar prev-slide-bar");
	this.view.appendChild(this.prevSlideBar);
    
	this.pRange=0;
	if(this.option.usedPointer==true){
		this.pointer=document.createElement("button");
		jarvis.lib.addAttribute(this.pointer,"pointer");
		this.view.appendChild(this.pointer);
		if(this.isVertical==true){
		    this.pRange=Math.ceil(jarvis.lib.getAbsoluteBounce(this.pointer).height);
		}else{
		    this.pRange=Math.ceil(jarvis.lib.getAbsoluteBounce(this.pointer).width);
		}
		
	}
	
    
    this.isDraging=false;
    this.init();
	this.reset();
	
}






jarvis.UISlideBar.prototype = 
{
	
    init: function() 
	{
		var that=this;
		var gestureDelegate=function(){}; 
		gestureDelegate.prototype = {
		                      
						     stateChange :function(e,point){
							    if(e==jarvis.GestureElement.START)
								{
								    that.touchStart(point);
								}
								else if(e==jarvis.GestureElement.MOVE)
								{
								    that.touchMove(point);
								}
								else if(e==jarvis.GestureElement.END)
								{
								    that.touchEnd(point);
								}
						   }
							  
		}
		var gestureElement=new  jarvis.GestureElement( this.view,new gestureDelegate());
        

		if(this.option.usedPointer==true)
		{
			var dragDelegate=function(){}; 
			
			dragDelegate.prototype = 
			{
		                      
									startDrag : function(point)
									{
									    
										that.touchStart(point);
									},
									moveDrag : function(point)
									{
									     
										that.touchMove(point,true);
									},
									endDrag : function(point)
									{
									    that.touchEnd(point);
									}
							  
							  
			}
			var rectV=jarvis.lib.getAbsoluteBounce(this.view);
			var rectP=jarvis.lib.getAbsoluteBounce(this.pointer);
			var len=this.getRange();
			var pos;
			if(this.isVertical==true){
                pos=rectP.x-rectV.x;
                rect=new jarvis.Rectangle(pos,0,0,rectV.height);
			}else{
				pos=rectP.y-rectV.y;
				rect=new jarvis.Rectangle(0,pos,rectV.width,0);
			}
			
			var dragElement=new  jarvis.DragElement( this.pointer,new dragDelegate(),rect);
		}
		
	},

	getRange : function()
	{
        var len;
		var bounce=jarvis.lib.getAbsoluteBounce(this.view);
		if(this.isVertical==true){
		    len=bounce.height;
		}else{
		    len=bounce.width;
		}
		return len-this.pRange; 
	},
	

   

    touchStart:function(point)
	{
	    
		if(this.isDraging==true){
		   return;
		}
		this.isDraging=true;
    },
    touchMove:function(point,isDrag)
	{
	    
		if(this.isDraging==false){
		   return;
		}
		if(isDrag===undefined){
			isDrag=false;
			return;
		}
	    var len=this.getRange();

		if(this.isVertical==true){
		    this.changeValue(this.value+(point.y/len),isDrag);
		}else{
		    this.changeValue(this.value+(point.x/len),isDrag);
		}
		

    },
    touchEnd:function(point)
	{
	   
		if(this.isDraging==false){
		   return;
		}
        this.isDraging=false;
		var len=this.getRange();
		
		if(this.isVertical==true){
		    this.setValue(this.value+(point.y/len));
		}else{
		    this.setValue(this.value+(point.x/len));
		}
        
	},

	reset: function() 
	{
		
		this.setValue(this.option.startValue);
         
	},
    setState: function(amount) 
	{
        if(amount<0){
		   amount=0;
		}else if(amount>1){
		   amount=1;
		}

		var pct=100*amount;
		if(this.isVertical==true){
		    this.stateBar.style.height=pct+"%";
		}else{
		    this.stateBar.style.width=pct+"%";
		}
		

	},
	changeValue: function(amount,isDrag) 
	{
        if(amount<0){
		   amount=0;
		}else if(amount>1){
		   amount=1;
		}
        if(isDrag===undefined){
			isDrag=false;
		}
      
		var pct=100*amount;
		if(this.isVertical==true){
			if(this.isDraging==true){
			    this.prevSlideBar.style.height=pct+"%";
			}else{
				this.slideBar.style.height=pct+"%";
			    this.prevSlideBar.style.height="0%";
			}
			
			
		}else{
			if(this.isDraging==true){
			    this.prevSlideBar.style.width=pct+"%";
			}else{
				this.slideBar.style.width=pct+"%";
			    this.prevSlideBar.style.width="0%";
			}
			
			
	    }
		
		if(this.option.usedPointer==true && isDrag==false){
			 var len=this.getRange();
             var tx=len*amount;
             if(tx<0){
			     tx=0;
			 }else if(tx>len){
			     tx=len;
			 }

             if(this.isVertical==true){
				this.pointer.style.top=tx+"px";
			 }else{
				this.pointer.style.left=tx+"px";
			 }
		     
		}
        var returnValue=this.endValue*amount;
		
		jarvis.lib.excuteDelegate(this.delegate,"valueChanging",[returnValue]);
		return returnValue;
    },
    setValue: function(amount) 
	{
        if(amount<0){
		   amount=0;
		}else if(amount>1){
		   amount=1;
		}
		
		
		this.value=amount;
		var returnValue=this.changeValue(amount);
		
		jarvis.lib.excuteDelegate(this.delegate,"valueChanged",[returnValue]);

    }

	
	
	
		
}

/*

*/