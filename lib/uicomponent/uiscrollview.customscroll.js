/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();



jarvis.UICustomScroll= function(scrollID,option,delegate) 
{
	
	this.scrollID=scrollID;
	this.option=null;
	this.scrollBody=null;
    this.scrollContent=null;
	this.scrollBar=null;
	this.scrollPoint=null;
	this.scrollTemp=null;
    this.delegate=null;
	this.cellA=null;//Array<UIScrollViewCell>
	this.posA=null;
////////////////////////////////////
    
	this.scrollBodyBounce=null;
	this.scrRange=0;
	this.viewRange=0;
    this.isInitTop=true;
	this.isInitLeft=true;
	this.cellIdx=0;
    this.isScrolling=false;
    this.isAnimation=false;
    
	this.prevPos=0;
	this.scrollDirection=0;
	this.scrollDirectionEnd=0;
    this.startPos=0;
	this.scrollAcceleration=0;
    this.isDrag=false;
	
	this.init(option,delegate);
	
}






jarvis.UICustomScroll.prototype = 
{
	init: function(option,delegate) 
	{
		
	    if(option=== undefined || option=== null){
	        this.option=new jarvis.UIScrollViewOption();
	    }else{
		    this.option=option;
		}
		if(delegate=== undefined){
	        this.delegate=null;
	    }else{
		    this.delegate=delegate;
		}
       
		var scroll=document.getElementById(this.scrollID);
		scroll.style.position = 'relative';
        
		
        scroll.innerHTML = 
						  "<div id='jarvis.UIScrollView.temp"+this.scrollID+"'></div>"
						  +"<div id='jarvis.UIScrollView.scrollBody"+this.scrollID+"' style='overflow:hidden;  width:100%; height:100%'>"
							   +"<ul id='jarvis.UIScrollView.scrollContent"+this.scrollID+"'  style='overflow:hidden; position:relative; width:0px; height:0px;'></ul>"
						  +"</div>"
						  +"<span id='jarvis.UIScrollView.scrollBar"+this.scrollID+"' style='overflow:hidden; display:none; position:absolute; padding:0; border:0; cursor:pointer'>"
							+"<button id='jarvis.UIScrollView.scrollPoint"+this.scrollID+"' type='button' style='display:block; position:absolute; right:0;  padding:0; border:0; cursor:pointer'></button>"
							+"<button id='jarvis.UIScrollView.scrollTop"+this.scrollID+"' type='button' style='display:block; position:absolute; right:0; top:0; padding:0; border:0; cursor:pointer'></button>"
							+"<button id='jarvis.UIScrollView.scrollBottom"+this.scrollID+"' type='button' style='display:block; position:absolute; right:0; bottom:0; padding:0; border:0; cursor:pointer'></button>"
						  +"</span>";
        
		this.scrollBody=document.getElementById("jarvis.UIScrollView.scrollBody"+this.scrollID);
        this.scrollContent=document.getElementById("jarvis.UIScrollView.scrollContent"+this.scrollID);
		this.scrollBar=document.getElementById("jarvis.UIScrollView.scrollBar"+this.scrollID);
	    this.scrollPoint=document.getElementById("jarvis.UIScrollView.scrollPoint"+this.scrollID);

		this.scrollBtnTop=document.getElementById("jarvis.UIScrollView.scrollTop"+this.scrollID);
		this.scrollBtnBottom=document.getElementById("jarvis.UIScrollView.scrollBottom"+this.scrollID);
		
		this.scrollTemp=document.getElementById("jarvis.UIScrollView.temp"+this.scrollID);
        this.scrollBtnTop.title="맨위로";
		this.scrollBtnBottom.title="아래로";

		jarvis.lib.addAttribute(scroll, this.option.cssKey);
		jarvis.lib.addAttribute(this.scrollBody, "body");
        jarvis.lib.addAttribute(this.scrollContent,"content");
		jarvis.lib.addAttribute(this.scrollBar,"bar");
		jarvis.lib.addAttribute(this.scrollPoint,"point");

		jarvis.lib.addAttribute(this.scrollBtnTop,"btn-top");
		jarvis.lib.addAttribute(this.scrollBtnBottom,"btn-bottom");
		
        this.option.resetOption(1);
        this.scrollBodyBounce=jarvis.lib.getAbsoluteBounce(this.scrollBody);	
		var that=this;

		jarvis.lib.addEventListener(this.scrollBar,"click",function (e){ that.barClick(e);})
		jarvis.lib.addEventListener(window,"mousemove",function (e){ that.dragMove(e);})
		jarvis.lib.addEventListener(this.scrollBar,"mousedown",function (e){ that.dragStart(e);})
        jarvis.lib.addEventListener(window,"mouseup",function (e){ that.dragEnd(e);})
        jarvis.lib.addEventListener(window,"mouseleave",function (e){ that.dragEnd(e);})
        jarvis.lib.addEventListener(this.scrollBar,"mouseover",function (e){ that.barOver(e);})
        jarvis.lib.addEventListener(this.scrollBar,"mouseout",function (e){ that.barOut(e);})
        
		if(jarvis.lib.isMobile()==true){
			var gestureDelegate=function(){}; 
		    gestureDelegate.prototype = {
		                      
								stateChange :function(e,point)
								{
									if(e==jarvis.GestureElement.START)
									{
										that.touchStart(point);
									}
									else if(e==jarvis.GestureElement.MOVE_H)
									{
										that.touchMove(point);
									}
									else if(e==jarvis.GestureElement.MOVE_V)
									{
										that.touchMove(point);
									}
									else if(e==jarvis.GestureElement.END)
									{
										that.touchEnd(point);
									}
								},
								gestureComplete: function(e)
								{
									that.touchComplete(e);
									

								}
							  
			}
			var gestureElement;
			if(this.option.isVertical==true){
				gestureElement=new  jarvis.GestureElement(scroll,new gestureDelegate(),true,false);
			}else{
				gestureElement=new  jarvis.GestureElement(scroll,new gestureDelegate(),false,true);
			}
			
		}
       
        this.wheel=jarvis.lib.addEventListener(scroll,"mousewheel",function (e,del){ that.wheelMove(del);})
		this.reset();	
        //jarvis.lib.addEventListener(scroll,"resize",function(){that.resize();});
		this.resize();
    },
	
	remove: function() 
	{
		this.option=null;
	    this.scrollBody=null;
        this.scrollContent=null;
		this.scrollBar=null;
		this.scrollPoint=null;
		this.scrollTemp=null;
		this.delegate=null;
		this.cellA=null;//Array<UIScrollViewCell>
		this.posA=null;
		var scroll=document.getElementById(this.scrollID);
		scroll.innerHTML ="";
	},
    reset: function() 
	{
		this.scrollContent.innerHTML="";
        this.cellA=new Array();
		this.posA=new Array();
		this.cellIdx=0;
		this.isInitTop=true;
	    this.isInitLeft=true;

		this.scrollContent.style.top="0px";
		this.scrollContent.style.left="0px";
	},
	dragStart:function(e)
	{
		
		this.isDrag=true;
	},
	dragMove:function(e)
	{
		if(this.isDrag==true){
		   this.movePoint(e,false);
		}
		
	},
	dragOut:function(e)
	{
		if(this.isDrag==true){
			var event = e ? e : window.event;
			var py=event.pageY ? event.pageY : event.clientY;
			var px=event.pageX ? event.pageX : event.clientX;
			
		}
	},
	dragEnd:function(e)
	{
		if(this.isDrag==true){
			
			this.isDrag=false;
			this.movePoint(e,true);
			this.barOut();
		}
	},
	barOver:function(e)
	{
         if(this.option.isVertical==true){
			 this.scrollBar.style.width=jarvis.lib.getPx(this.option.scrollUiGepOver);
		 }else{
             this.scrollBar.style.height=jarvis.lib.getPx(this.option.scrollUiGepOver);
		 }
	},
	barOut:function(e)
	{
         if(this.isDrag==true){
		     return;
		 }

		 if(this.option.isVertical==true){
			 this.scrollBar.style.width=jarvis.lib.getPx(this.option.scrollUiGep);
		 }else{
             this.scrollBar.style.height=jarvis.lib.getPx(this.option.scrollUiGep);
		 }
	},
	barClick:function(e)
	{
       this.movePoint(e,false);
	},
	movePoint:function(e,isAni)
	{
		var event = e ? e : window.event;
		var pagePos = 0;
		var relP = 0;
		var pct=0;
		var h=0;
		var r=0;

		var bounceP=jarvis.lib.getAbsoluteBounce(this.scrollBody);	
		var bounce=jarvis.lib.getAbsoluteBounce(this.scrollBar);	
       
		if(this.option.isVertical==true){
		   if(event.pageY!==undefined){
		       pagePos= event.pageY
		   }else{
			   pagePos= event.clientY+jarvis.lib.getDocumentScrollBounce().y;
		   }
		   
		 
		   r=bounce.height;
		   h=jarvis.lib.getNumber(this.scrollPoint.style.height);
		   relP = pagePos- bounce.y-(h/2);
		   
		   
		   pct=relP/(r-h);
		}else{
		   if(event.pageX!==undefined){
		       pagePos= event.pageX
		   }else{
			   pagePos= event.clientX+jarvis.lib.getDocumentScrollBounce().x;
		   }
		   r=bounce.width;
		   h=jarvis.lib.getNumber(this.scrollPoint.style.width);
		   relP = pagePos- bounce.x-(h/2);
		   pct=relP/(r-h);
		}
		
        if(pct>1){
		   pct=1;
		}else if(pct<0){
		   pct=0;
		}
       
        var tg=-(this.scrRange-r)*pct;
		
		if(isAni==true){
			this.setScrollPos(tg);
		}else{
		
		    if(this.option.isVertical==true){
		        this.scrollContent.style.top=jarvis.lib.getPx(tg);
			}else{
		        this.scrollContent.style.left=jarvis.lib.getPx(tg);
			}
			this.scrolling();
		}
		
	},
	touchStart:function(point)
	{
	    this.startPos=0;
		this.scrollAcceleration=0;
    },
    touchMove:function(point)
	{
	    
		var diff=0; 
		var pos=0;
		if(this.option.isVertical==true){
			diff= this.startPos-point.y;
			this.startPos=point.y;
			pos=jarvis.lib.getNumber(this.scrollContent.style.top);
		}else{
			diff= this.startPos-point.x;
			this.startPos=point.x;
			pos=jarvis.lib.getNumber(this.scrollContent.style.left);
		}
		
		
		if(this.scrollAcceleration==0){
		   this.scrollAcceleration=1;
		}
		
        if(Math.abs(diff)>=3){

            if(diff<0){
				diff-=this.scrollAcceleration;
			}else if(diff>0){
				diff+=this.scrollAcceleration;
			}
		    this.scrollAcceleration=(this.scrollAcceleration*2);
			if(this.scrollAcceleration>50){
			   this.scrollAcceleration=50;
			}
			pos=pos-diff;

            var bounce=50;
            var limit=0;
			if(this.option.isVertical==true){
				limit=this.scrollBodyBounce.height-jarvis.lib.getNumber(this.scrollContent.style.height);
			}else{
				limit=this.scrollBodyBounce.width-jarvis.lib.getNumber(this.scrollContent.style.width);
			}
			if(pos<(limit-bounce)){
				pos=limit-bounce;
			}
			if(pos>bounce){
				pos=bounce;
			}

			if(this.option.isVertical==true){
			   this.scrollContent.style.top=jarvis.lib.getPx(pos);
		    }else{
			   this.scrollContent.style.left=jarvis.lib.getPx(pos);
		    }
			this.scrolling();
	    }
		
    },
	touchComplete:function(e)
	{
        if(this.scrollAcceleration==0){
			return;
		}
		
		var pos=0;
		if(e==jarvis.GestureElement.PAN_RIGHT || e==jarvis.GestureElement.PAN_LEFT){
			if(this.option.isVertical==true){
			   return;
		    }
			pos=jarvis.lib.getNumber(this.scrollContent.style.left);
			if(e==jarvis.GestureElement.PAN_RIGHT){
			    this.setScrollPos(pos+this.scrollAcceleration);
			}else{
			    this.setScrollPos(pos-this.scrollAcceleration);
			}
			
			
		}else if(e==jarvis.GestureElement.PAN_UP || jarvis.GestureElement.PAN_DOWN){
			
			if(this.option.isVertical==false){
			   return;
		    }
			pos=jarvis.lib.getNumber(this.scrollContent.style.top);
			
			if(e==jarvis.GestureElement.PAN_UP){
			   
				this.setScrollPos(pos-this.scrollAcceleration);
			}else{
				
			    this.setScrollPos(pos+this.scrollAcceleration);
			}
		}
		this.scrollAcceleration=0;
		
	},
    touchEnd:function(point)
	{
        if(this.scrollAcceleration!=0){
			this.setScrollPos();
		}
		
	},
    wheelMove:function(del)
	{
	    
		var pos=0;
		if(this.option.isVertical==true){
			pos=jarvis.lib.getNumber(this.scrollContent.style.top);
		}else{
			pos=jarvis.lib.getNumber(this.scrollContent.style.left);
		}
		if(del<0){
		  this.scrollDirection=-1;
		}else{
		  this.scrollDirection=1;
		}
		del=del*50;
			
		
		pos=pos+del;
		this.setScrollPos(pos);
	   
    },
	setScrollPos: function(pos,isAni)
    {
        
		if (pos === undefined ) {
             if(this.option.isVertical==true){
			     pos=jarvis.lib.getNumber(this.scrollContent.style.top);
		     }else{
			     pos=jarvis.lib.getNumber(this.scrollContent.style.left);
		     }
        }
		var limit=0;
		if(this.option.isVertical==true){
			limit=this.scrollBodyBounce.height-jarvis.lib.getNumber(this.scrollContent.style.height);
		}else{
			limit=this.scrollBodyBounce.width-jarvis.lib.getNumber(this.scrollContent.style.width);
		}
		if(pos<limit){
		   pos=limit;
		}
		if(pos>0){
		   pos=0;
		}
		
		this.scrollTo(-pos,isAni);
	},
    scrollEnd: function()
    {
		this.isScrolling=false;
        jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_STOP]);
		        
	},
    scrollMove: function(amount,isAni)
    {
       if(this.option.isVertical==true){
           this.scrollTo(-jarvis.lib.getNumber(this.scrollContent.style.top)-amount,isAni);
       }else{
		   this.scrollTo(-jarvis.lib.getNumber(this.scrollContent.style.left)-amount,isAni);
	   }

	},
	scrollToIdx: function(idx,isAni)
    {
	     if(this.option.isTable==true){
		    this.scrollTo(this.option.range*idx,isAni);
		 }else{
			if(idx<0){
			   idx=0;
			}else if(idx>=this.posA.length){
			   idx=this.posA.length-1;
			}
			var pos=this.posA[idx];
			
		    this.scrollTo(pos,isAni);
		 }
	},
	getScrollIdx: function()
    {
	     var scrPos;
		 var scrBounce=jarvis.lib.getRelativeBounce(this.scrollContent);	
		 if(this.option.isVertical==true){
		     scrPos=Math.abs(scrBounce.y);
		 }else{
		     scrPos=Math.abs(scrBounce.x);
		 }
		 var idx;
		 if(this.option.isTable==true)
		 {
		     idx=Math.round(scrPos/this.option.range);
		 }else
		 {
             var pa=0;
		     for(var i=0;i<this.posA.length;++i){
		         pa=this.posA[i];
			     if(pa>=pos){
                    idx=i;
				    break;
			     }
		     }
		 }
		 return idx;
		 
	},
	scrollTo: function(pos,isAni)
    {
       
		if(this.cellA==null){
		  return;
		}
        if ( isAni === undefined ) {
               isAni=true;
        }
		var diffRange=this.scrRange-this.viewRange;
		if(diffRange<0){
		    pos=0;
		}else{
		    if(pos>diffRange){
			   pos=diffRange;
			}
		}
        
		if(this.option.isSnap==true){
		     var idx;
		     if(this.option.isTable==true){
			     if(this.scrollDirection==-1){
			         idx=Math.ceil(pos/this.option.range);
			     }else if(this.scrollDirection==1){
			         idx=Math.floor(pos/this.option.range);
			     }else{
			         idx=Math.round(pos/this.option.range);
			     }
			     pos=idx*this.option.range;
             }else{
                 var idx=0;
		         var pa=0;
                 var r=1;
			     for(var i=0;i<this.posA.length;++i){
		            pa=this.posA[i];
			        if(pa>=pos){
                        idx=i;
						break;
			        }
				 }
				 if(this.scrollDirection==1){
				     idx=idx-r;
				 }else{
				     idx=idx-this.scrollDirection-r;
				 }
                
                 if(idx<0){
			         idx=0;
			     }else if(idx>=this.posA.length){
			         idx=this.posA.length-1;
			     }
                 pos=this.posA[idx];
                 
		     }
             
		}
		pos=-1*pos;
		
        if(this.option.isVertical==true){
			
			if(jarvis.animation!=null && isAni==true){
				this.startAnimation(pos);
			}else{
				this.scrollContent.style.top=jarvis.lib.getPx(pos);
				this.scrolling();
				this.scrollEnd();
			}
			
        }else{
			
			if(jarvis.animation!=null  && isAni==true){
				this.startAnimation(pos);
			}else{
				this.scrollContent.style.left=jarvis.lib.getPx(pos);
				this.scrolling();
				this.scrollEnd();
			}
			
		} 
	    

	},

	startAnimation: function(pos)
    {
	   
		this.isAnimation=true;
		var that=this;
        var aniDelegate=function(){};
        aniDelegate.prototype = {
			
			update: function(e)
            {
				
				that.scrolling();
			},
			
			complete : function(e)
            {
				that.isAnimation=false;
				that.scrollEnd();
			}
	    }
        var easev="ease in out";
        var relativeDurationv="0.1;0.2;0.4";
		
		if(this.option.isVertical==true){
		     jarvis.animation.startAnimation(this.scrollContent.style,{top:pos, ease:easev , relativeDuration:relativeDurationv ,relativeKey:"top",isPx:true},new  aniDelegate());
		}else{
		     jarvis.animation.startAnimation(this.scrollContent.style,{left:pos, ease:easev , relativeDuration:relativeDurationv ,relativeKey:"left",isPx:true},new  aniDelegate());
		}
	},

	setCellPosition: function(isReset)
    {
         
		 
		 if(this.cellA!=null){
                   
			       if ( isReset === undefined ) {
                        isReset=false;
                   }
				   var rect=new Rectangle(
					                        -jarvis.lib.getNumber(this.scrollContent.style.left) 
					                       ,-jarvis.lib.getNumber(this.scrollContent.style.top) 
					                       ,jarvis.lib.getNumber(this.scrollBodyBounce.width)
					                       ,jarvis.lib.getNumber(this.scrollBodyBounce.height)
					                     );
                   
                   var cell=null;
                   var rectCell=null;
                   var range=0;
                   var pos=0;
				   for(var i=0;i<this.cellA.length;++i){
				       cell=this.cellA[i];
                       if(this.option.isTable==true){
					       range=this.option.range;
						   pos=Math.floor(i/this.option.lineNum)*this.option.range;
					   }else{
					       range=cell.range;
					   }
					   if(this.option.isVertical==true){
					       rectCell=new jarvis.Rectangle(
							                    (i%this.option.lineNum)*this.option.lineRange,
							                    pos,
							                    this.option.lineRange,range
						                      );
					   
					   }else{
					      rectCell=new jarvis.Rectangle(
							                    pos,
						                        (i%this.option.lineNum)*this.option.lineRange,
							                    range,this.option.lineRange
						                      );
					   
					   }
                       if(this.option.isTable==false){
                          pos=pos+range;
					   }
					   if(cell.cell!=null){
						  if(cell.isAdd==false){
							  this.scrollContent.appendChild(cell.cell);
						      cell.isAdd=true;
						  }
						  if(isReset==true && this.option.isTable==true){
						     cell.cell.style.left=jarvis.lib.getPx(rectCell.x);
                             cell.cell.style.top=jarvis.lib.getPx(rectCell.y);
						     cell.cell.style.width=jarvis.lib.getPx(rectCell.width);
						     cell.cell.style.height=jarvis.lib.getPx(rectCell.height);
						  }
						  
					   }
                     
					   if(jarvis.lib.hitTestRect(rectCell,rect)){
						   
					        if(cell.isView==false){
		                        cell.isView=true;
								if(cell.obj!=null){
									 
									 jarvis.lib.excuteDelegate(this.delegate,"addCell",[cell.idx,cell.obj]);
								}

                            } 
					   }else{
					        if(cell.isView==true){
		                        cell.isView=false;
								if(cell.cell!=null){
								   if(cell.obj!=null){
									   jarvis.lib.excuteDelegate(this.delegate,"removeCell",[cell.idx,cell.obj]);
								   }
								 }
		                    } 
					   }
				   
				   }//for
				   
			 
			 }//if
	}
	,
    scrolling: function(isReset)
    {
		     if (isReset === undefined ) {
                isReset=false;
             }
             jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_MOVE]);

             if(this.isScrolling==false && isReset==false){
			     jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_START]);
				 this.isScrolling=true;
			 }

             if(this.scrollContent.style.top== "0px") 
			 {
	              if(this.isInitTop==false){
				      this.isInitTop=true;

					  jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_TOP]);
				  }
				  if(this.option.isVertical==true && this.wheel!=null && this.option.isAutoScrollRelease==true){
					  this.wheel.removeFocus();
				  } 
				  
	         }
			 else if(jarvis.lib.getNumber(this.scrollContent.style.height)+jarvis.lib.getNumber(this.scrollContent.style.top)<= this.scrollBodyBounce.height) 
		     {
				   if(this.option.isVertical==true && this.wheel!=null && this.option.isAutoScrollRelease==true){
					       this.wheel.removeFocus();
				   } 
				   
				   jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_BOTTOM]);
				   
	         }else
			 {
			      this.isInitTop=false;
			 }
			 
             if(this.scrollContent.style.left== "0px") 
			 {
	               if(this.isInitLeft==false){
					   this.isInitLeft=true;
                       jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_LEFT]);
				   
				   }
				   if(this.option.isVertical==false && this.wheel!=null && this.option.isAutoScrollRelease==true){
					  this.wheel.removeFocus();
				  } 
				   
	         }
			 else if(jarvis.lib.getNumber(this.scrollContent.style.width)+jarvis.lib.getNumber(this.scrollContent.style.left)<= this.scrollBodyBounce.width) 
		     {
	              jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_RIGHT]);
				  if(this.option.isVertical==false && this.wheel!=null && this.option.isAutoScrollRelease==true){
					  this.wheel.removeFocus();
				  } 
				   
	         }else
			 {
			      this.isInitLeft=false;
			 }

			 var cPos;
			 var cPct;
			 var pPos;
             if(this.option.isVertical==true){
			     cPos=jarvis.lib.getNumber(this.scrollContent.style.top);
				 cPct=Math.abs(cPos)/(jarvis.lib.getNumber(this.scrollContent.style.height)-this.scrollBodyBounce.height);
          
				 this.scrollPoint.style.top = jarvis.lib.getPx((this.scrollBodyBounce.height-jarvis.lib.getNumber(this.scrollPoint.style.height))*cPct);

			 }else{
				 cPos=jarvis.lib.getNumber(this.scrollContent.style.left);
				 cPct=Math.abs(cPos)/(jarvis.lib.getNumber(this.scrollContent.style.width)-this.scrollBodyBounce.width);
				 this.scrollPoint.style.left=jarvis.lib.getPx((this.scrollBodyBounce.width-jarvis.lib.getNumber(this.scrollPoint.style.width))*cPct);
			 }
		
             if(cPos>this.prevPos){
			     this.scrollDirection=1;
			 }else if(cPos<this.prevPos){
			     this.scrollDirection=-1;
			 }else{
			     this.scrollDirection=0;
			 }
			
			 if(this.scrollDirectionEnd!=this.scrollDirection){
			    
				if(this.scrollDirection==1){
				    jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_UP]);
				}else if(this.scrollDirection==-1){
				    jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_DOWN]);
				}
			 
			 }
			 
             this.scrollDirectionEnd=this.scrollDirection;
             this.prevPos=cPos;
             this.setCellPosition(isReset);
			
	},
    addCell: function(obj)
    {
	    var isHtml;
		
		if( typeof obj=="string" ){
		    isHtml=true;
		}else{
			isHtml=false;
		}
		
        if(this.cellA==null){
		    this.cellA=new Array();
		}
		
		var cell= new jarvis.UIScrollViewCell(obj,this.cellIdx,isHtml,this.option.isVertical,this.option.isTable);
        this.cellA.push(cell);
        this.cellIdx++;
        return this.cellIdx-1;

	},
	addComplete: function()
    {
	  
	   this.resize(true);
	   if(this.cellA.length<1)
	   {
	      
		  this.scrollContent.style.overflow="visible";
		  this.scrollContent.innerHTML=this.option.noDataView;
	   }
    },
	resize: function(isReset)
    {
		 if(isReset === undefined){
			isReset=false;
		 }
		 if(this.cellA==null){
		    return;
		 }
		 var scrollBodyBounce=jarvis.lib.getAbsoluteBounce(this.scrollBody);	
		 if(scrollBodyBounce.width>10000){
		     return;
		 }
		 
		 if(this.scrollBodyBounce!=null && isReset==false){
			if(this.scrollBodyBounce.width==scrollBodyBounce.width && this.scrollBodyBounce.height==scrollBodyBounce.height){
				 return;
			}
		 }
		 this.scrollBodyBounce=scrollBodyBounce;

		 var bodyRange=0;
		 var viewRange=0;
		 var lineRange=0

         if(this.option.isVertical==true){
			 this.scrollBar.style.width=jarvis.lib.getPx(this.option.scrollUiGep);
			 this.scrollBar.style.height="100%";
             this.scrollBar.style.right=0;
             this.scrollBar.style.top=0;
		 }else{
             this.scrollBar.style.width="100%";
			 this.scrollBar.style.height=jarvis.lib.getPx(this.option.scrollUiGep);
			 this.scrollBar.style.left=0;
             this.scrollBar.style.bottom=0;
		 }

		
		 
		 
		 if(this.option.isVertical==true){
			 bodyRange=this.scrollBodyBounce.width;
			 viewRange=this.scrollBodyBounce.height;
		 }else{
		     bodyRange=this.scrollBodyBounce.height;
			 viewRange=this.scrollBodyBounce.width;
		 }
		 if(this.option.isFullSize==false){
			bodyRange=bodyRange-this.option.scrollUiGep;
		 }
		 if(this.option.dynamicLineNum==true){
	          this.option.lineNum=Math.floor(bodyRange/this.option.dynamicLineRange);
		 }
         this.option.lineRange=Math.floor(bodyRange/this.option.lineNum);
         
		 
		 this.scrRange=0;	   
		 if(this.option.isTable==true){
		     this.scrRange=(this.option.range*Math.ceil(this.cellA.length/this.option.lineNum));	
		 }else{
             this.posA=new Array();
			 this.posA.push(0);
             var cell=null;
			 var divBounce=null;
			 for(var i=0;i<this.cellA.length;++i){
				cell=this.cellA[i];
				this.scrollContent.appendChild(cell.cell);
				divBounce=jarvis.lib.getAbsoluteBounce(cell.obj);		   
				if(this.option.isVertical==true){
					cell.range=divBounce.height;
					//jarvis.debuger.log("cell.range :"+divBounce.toString);
				}else{
					cell.range=divBounce.width;
				}
                cell.isAdd=true;
			    this.scrRange+=cell.range;
				this.posA.push(this.scrRange);
			 }
			 
			
		 }

		 if(this.cellA.length==0){
			 this.scrollContent.style.overflow="visible";
		 }else{
			 this.scrollContent.style.overflow="hidden";
	     }
		
         this.scrRange=this.scrRange+this.option.rangeEnd;

		 if(this.option.isVertical==true){
			 this.scrollContent.style.height=jarvis.lib.getPx(this.scrRange);
		   
		 }else{

			 this.scrollContent.style.width=jarvis.lib.getPx(this.scrRange);
			 
		 }
         if(this.scrRange>viewRange){
		    this.scrollBar.style.display="block";
            var amount=this.scrRange/viewRange;
			var scrollBarBounce=jarvis.lib.getAbsoluteBounce(this.scrollBar);	
			if(this.option.isVertical==true){
                 this.scrollPoint.style.width="100%";
				 this.scrollPoint.style.height=jarvis.lib.getPx(scrollBarBounce.height/amount);
				
			}else{
				this.scrollPoint.style.height="100%";
				this.scrollPoint.style.width=jarvis.lib.getPx(scrollBarBounce.width/amount);
			}
			if(this.option.isVertical==true){
				this.scrollContent.style.width=jarvis.lib.getPx(bodyRange);
			}else{
				this.scrollContent.style.height=jarvis.lib.getPx(bodyRange);
			} 
		 }else{
		    this.scrollBar.style.display="none";
			if(this.option.isVertical==true){
				this.scrollContent.style.width=jarvis.lib.getPx(this.scrollBodyBounce.width);
			}else{
				this.scrollContent.style.height=jarvis.lib.getPx(this.scrollBodyBounce.height);
			} 
			
		 }
         this.viewRange=viewRange;
		 this.scrolling(true);
		
	}
		
}


/*

*/