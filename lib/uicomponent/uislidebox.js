/**
 * lib v1.0: jarvis component
 * by aeddang
 */
/*
interfaces
*/


if(typeof jarvis == "undefined") var jarvis = new Object();


/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
    initBox : function(div){},   
	moveStart : function(divL,divR){},   
	moveChanged : function(div,dr){},
	moveEnd : function(div,dr){}
}
*/
jarvis.UISlideBoxOption=function()
{
   	this.cssKey="jarvis-uislidebox-panel";
    this.divKey="div";
	this.slideSpd=0.2;
}



jarvis.UISlideBox= function(pageID,delegate,option) 
{
	
	if(option=== undefined || option=== null){
	    option=new jarvis.UISlideBoxOption();
	}
    if(delegate=== undefined){
	    delegate=null;
    }
	this.delegate=delegate;
	this.option=option;
	this.isMoveAble=false;
	this.isMoving=false;
	this.selfStart=false;
	this.body;
	if(typeof pageID=="String" || typeof pageID=="string"){
	    this.body=document.getElementById(pageID);
	}else{
	    this.body=pageID;
	}
	this.body.style.position="relative";
	this.body.style.overflow='hidden';
    this.view=document.createElement("div");
	
   
    this.view.style.position="relative";
	this.view.style.top="0px";
	
    this.body.appendChild(this.view);

    this.currentView=null;
    this.currentR=null;
    this.currentL=null;

    this.currentIndex=-1;
    this.limitedIndex=-1;
    this.finalGesture="";
}


jarvis.UISlideBox.prototype = 
{
	
    init: function() 
	{
		
		var that=this;
		var gestureDelegate=function(){}; 
		gestureDelegate.prototype = {
		                      
								stateChange :function(e,point)
								{
									if(e==jarvis.GestureElement.START)
									{
										that.touchStart();
									}
									else if(e==jarvis.GestureElement.MOVE_H)
									{
										that.touchMove(point.x);
									}
									else if(e==jarvis.GestureElement.END)
									{
										that.touchEnd(point);
									}
								},
								gestureComplete: function(e)
								{
									if(e==jarvis.GestureElement.PAN_RIGHT || e==jarvis.GestureElement.PAN_LEFT){
											that.finalGesture=e;
									}
								}
							  
		}
		var gestureElement=new  jarvis.GestureElement(this.body,new gestureDelegate(),false,true);
      
        this.resize();
		
	},
	

    touchStart:function()
	{
	    this.selfStart=true;
		
		this.isMoving=true;
		
    },
    touchMove:function(point)
	{
	    this.moveInit();
		if(this.isMoveAble==false){
		    return;
		}
		 
		
		var bounce=jarvis.lib.getAbsoluteBounce(this.body);
		var tx=-bounce.width+point;
        this.view.style.left=tx+"px"
        
		
	},
    touchEnd:function(point)
	{
		if(this.isMoveAble==false){
		    return;
		}
        
        var dr;
        if(this.finalGesture==jarvis.GestureElement.PAN_RIGHT){
			dr=-1;							
		}else if(this.finalGesture==jarvis.GestureElement.PAN_LEFT){
			dr=1;							   
		}else{
			dr=0;
			
		}
        this.finalGesture="";
		
		this.isMoving=false;
		this.moveSlide(dr);
	},
    resize: function() 
	{
        var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        
		if(bounce.width>10000){
		    return;
		}
		
		var w=Math.floor(bounce.width);
        var h=Math.floor(bounce.height);
        this.view.style.width=w*3;
        this.view.style.height=h;
        this.view.style.left=-w+"px"

        if(this.currentView==null){
			this.currentView=this.creatCell(0);
			jarvis.lib.excuteDelegate(this.delegate,"initBox",[this.currentView]);
		}else{
			this.currentView.style.width=w+"px";
			this.currentView.style.height=h+"px";
			this.currentView.style.left=w+"px";
		}
		

    },
	moveInit: function() 
	{
        if(this.isMoveAble==true){
		    return;
		}
		this.isMoveAble=true;
		this.currentL=this.creatCell(-1);
		this.currentR=this.creatCell(1);
		jarvis.lib.excuteDelegate(this.delegate,"moveStart",[this.currentL,this.currentR]);
    },
	moveSlide: function(dr) 
	{
        if(this.isMoveAble==false){
		    this.moveInit();
		}
		
		if(this.isMoving==true){
		    return;
		}

		
        if(this.limitedIndex!=-1){
		
		    var idx=this.currentIndex+dr;
			if(idx<0 || idx>=this.limitedIndex){
			   dr=0;
			}
		}
       
		this.isMoving=true;
		var bounce=jarvis.lib.getAbsoluteBounce(this.body);

		var that=this;
		var tx=-(dr+1)*bounce.width;
        

	    var aniDelegate=function(){};
		aniDelegate.prototype = {
				complete : function(e)
				{
					if(dr==0){
					      that.currentL.innerHTML="";
						  that.currentR.innerHTML="";
						  that.view.removeChild(that.currentL);
						  that.view.removeChild(that.currentR);
					}else{
					   that.currentView.innerHTML="";
					   that.view.removeChild(that.currentView);
					   if(dr==-1){
					      that.currentView=that.currentL;
						  that.currentR.innerHTML="";
						  that.view.removeChild(that.currentR);
					   }else{
					      that.currentView=that.currentR;
						  that.currentL.innerHTML="";
						  that.view.removeChild(that.currentL);
					   }
                       that.view.style.left=-bounce.width+"px";
					 
					   that.currentView.style.left=bounce.width+"px";
                       if(that.selfStart==true && dr!=0){
					       jarvis.lib.excuteDelegate(that.delegate,"moveChanged",[that.currentView,dr]);
					   }
					   that.selfStart=false;
					   jarvis.lib.excuteDelegate(that.delegate,"moveEnd",[that.currentView,dr]);
					}
					that.currentR=null;
					that.currentL=null;
					that.isMoving=false;
					that.isMoveAble=false;
					
				}
		}
		var easev="ease in";
		
		jarvis.animation.startAnimation(this.view.style, {duration:this.option.slideSpd, left:tx, ease:easev ,isPx:true},new aniDelegate());


    },
	creatCell: function(dr) 
	{
        var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        var w=Math.floor(bounce.width);
        var h=Math.floor(bounce.height);

		var cell=document.createElement(this.option.divKey);
		cell.style.position="absolute";
		cell.style.width=w+"px";
		cell.style.height=h+"px";
		var idx=dr+1;
		cell.style.top="0px";
		cell.style.left=(idx*w)+"px";
		this.view.appendChild(cell);
		
		return cell;

    }
	
	
	
	
	
		
}

/*

*/