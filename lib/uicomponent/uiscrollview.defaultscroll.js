/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();



jarvis.UIDefaultScroll= function(scrollID,option,delegate) 
{
	
	this.scrollID=scrollID;
	this.option=null;
	this.scrollBody=null;
    this.scrollContent=null;
	this.scrollTemp=null;

	this.delegate=null;
	this.cellA=null;//Array<UIScrollViewCell>
	this.posA=null;
////////////////////////////////////
    this.isInitTop=true;
	this.isInitLeft=true;
	this.cellIdx=0;
    this.isScrolling=false;
    this.isAnimation=false;
    this.startTouch;
	this.prevPos=0;
	this.scrollDirection=0;
	this.scrollDirectionEnd=0;
    this.scrollBodyBounce=null;
	this.timer=jarvis.timer;
	
	this.init(option,delegate);

}




jarvis.UIDefaultScroll.prototype = 
{
	init: function(option,delegate) 
	{
		
	    if(option=== undefined || option=== null){
	        this.option=new jarvis.UIScrollViewOption();
	    }else{
		    this.option=option;
		}
		var scroll=document.getElementById(this.scrollID);
        var style="";
		if(this.option.isVertical==true){
		    style="overflow-y:auto; overflow-x:hidden";
		}else{
		    style="overflow-x:auto; ; overflow-y:hidden";
		}
        scroll.innerHTML ="<div id='jarvis.UIScrollView.temp"+this.scrollID+"'></div>"
                          +"<div id='jarvis.UIScrollView.scrollBody"+this.scrollID+"' style='"+style+"; -webkit-backface-visibility:visible; -webkit-overflow-scrolling:touch;  width:100%; height:100%'>"
							   +"<ul id='jarvis.UIScrollView.scrollContent"+this.scrollID+"'  style='overflow:hidden; position:relative; width:0px; height:0px;'></ul>"
						  +"</div>";
        
		this.scrollBody=document.getElementById("jarvis.UIScrollView.scrollBody"+this.scrollID);
        this.scrollContent=document.getElementById("jarvis.UIScrollView.scrollContent"+this.scrollID);
		this.scrollTemp=document.getElementById("jarvis.UIScrollView.temp"+this.scrollID);

		jarvis.lib.addAttribute(scroll, this.option.cssKey);
		jarvis.lib.addAttribute(this.scrollBody, "body");
        jarvis.lib.addAttribute(this.scrollContent,"content");
       

		if(delegate=== undefined){
	        this.delegate=null;
	    }else{
		    this.delegate=delegate;
		}
		
        this.option.resetOption(0);

		var that=this;
        
		
		this.reset();
		jarvis.lib.addEventListener(this.scrollBody,"scroll",function (e){ that.scrolling(true); });
        
        jarvis.lib.addEventListener(this.scrollBody,"touchstart",function (e){ that.touchStart(e);});
		jarvis.lib.addEventListener(this.scrollBody,"touchmove",function (e){  that.touchMove(e);});
		jarvis.lib.addEventListener(this.scrollBody,"touchend",function (e){ that.touchEnd(e);});

        
        var vs=jarvis.lib.getIEVersion();
		if(vs>7 || vs==-1){
			//jarvis.lib.addEventListener(scroll,"resize",function(){that.resize();});
		}
		
		this.resize();
		
    },
	touchStart:function(e)
	{
	    this.startTouch = e.touches[0]; 
		
    },
    touchMove:function(e)
	{
	    
		touch=e.touches[0]; 
		var diffX=Math.abs(touch.pageX-this.startTouch.pageX);
		var diffY=Math.abs(touch.pageY-this.startTouch.pageY);
        if(diffY>diffX){
		   this.scrolling(true);
		}
       
        

	},
    touchEnd:function(e)
	{
	    
        this.startTouch = null;
         
	},
	
	remove: function() 
	{
		this.option=null;
		this.scrollBody=null;
		this.scrollContent=null;
		this.scrollTemp=null;
		this.delegate=null;
		this.cellA=null;//Array<UIScrollViewCell>
		this.posA=null;
		this.timer=null;
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

		this.scrollBody.scrollTop=0;
		this.scrollBody.scrollLeft=0;
	},
	scrollTouch: function()
    {
	},
	scrollInit: function()
    {
	   
		jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_START]);
		if(this.timer!=null &&  this.isAnimation==false){
		     
			var that=this;
			var tObj=new jarvis.TimerObject();
            tObj.id="jarvis.UIScrollView_SS";
			tObj.repeatCount=2;
			
            var timerDelegate=function(){}; 
            timerDelegate.prototype = {
                              complete : function(id){that.scrollComplete();}
		    }
			
			this.timer.addTimer(new timerDelegate(),tObj);
		}
		
	},
    scrollComplete: function()
    {
		
		if(this.timer!=null){
		    this.timer.removeTimer("jarvis.UIScrollView");
		}
		
		if(this.option.isVertical==true){
			this.scrollTo(this.scrollBody.scrollTop);
		}else{
			this.scrollTo(this.scrollBody.scrollLeft);
				
	    }
		        
	},
	scrollEnd: function()
    {
		this.isAnimation=false;
		this.isScrolling=false;
        jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_STOP]);
		        
	},
    scrollMove: function(amount,isAni)
    {
       if(this.option.isVertical==true){
           this.scrollTo(this.scrollBody.scrollTop+amount);
       }else{
		   this.scrollTo(this.scrollBody.scrollLeft+amount);
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
		    this.scrollTo(this.posA[idx],isAni);
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
			        
					if(pa==pos){
					   this.scrollEnd();
					   return;
					}else{
					    if(pa>=pos){
                            idx=i;
						    break;
			            }
					
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
        if(this.option.isVertical==true){
			
			
			if(jarvis.animation!=null && isAni==true && this.scrollBody.scrollTop!=pos){
				this.startAnimation(pos);
			}else{
				this.scrollBody.scrollTop=pos;
				this.scrollEnd();
			}
			
        }else{
			
			if(jarvis.animation!=null && isAni==true && this.scrollBody.scrollLeft!=pos){
				this.startAnimation(pos);
			}else{
				this.scrollBody.scrollLeft=pos;
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
			complete : function(e)
            {
             
				that.scrollEnd();
			}
	    }
        var easev="ease in out";
        var relativeDurationv="0.1;0.2;1.0";
		
		if(this.option.isVertical==true){
		     jarvis.animation.startAnimation(this.scrollBody,{scrollTop:pos, ease:easev , relativeDuration:relativeDurationv ,relativeKey:"scrollTop"},new  aniDelegate());
		}else{
		     jarvis.animation.startAnimation(this.scrollBody,{scrollLeft:pos, ease:easev , relativeDuration:relativeDurationv ,relativeKey:"scrollLeft"},new  aniDelegate());
		}
	},

	setCellPosition: function(isReset)
    {
         if(this.cellA!=null){
                   
			       if ( isReset === undefined ) {
                        isReset=false;
                   }
				   var rect=new Rectangle(this.scrollBody.scrollLeft,this.scrollBody.scrollTop,this.scrollBody.offsetWidth,this.scrollBody.offsetHeight)
                    
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
						     cell.cell.style.left=rectCell.x+"px";
                             cell.cell.style.top=rectCell.y+"px";
						     cell.cell.style.width=rectCell.width+"px";
						     cell.cell.style.height=rectCell.height+"px";
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
    scrolling: function(e)
    {
		     
			 var isReset;
			 if (e === undefined ) {
                isReset=false;
             }else{
			    isReset=true;
			 }
			 if( this.isScrolling==false){
			     this.isScrolling=true;
				 this.scrollInit();
				
			 }else{
			     if(this.timer!=null){
				    this.timer.resetTimer("jarvis.UIScrollView_SS");
				 }
			 }
             jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_MOVE]);
			 if(this.scrollBody.scrollTop== 0) 
			 {
	              if(this.isInitTop==false){
				      this.isInitTop=true;
					  jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_TOP]);
				  }
				  if(this.option.isVertical==true && this.option.isAndroid==true){
						this.scrollBody.scrollTop=1;
				  }
				  
	         }
			 else if(this.scrollBody.offsetHeight + this.scrollBody.scrollTop >= this.scrollBody.scrollHeight) 
		     {
				   jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_BOTTOM]);
				   
	         }else
			 {
			      this.isInitTop=false;
			 }
			 
             if(this.scrollBody.scrollLeft== 0) 
			 {
	               if(this.isInitLeft==false){
					   this.isInitLeft=true;
                       jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_LEFT]);
				   
				   }
				   if(this.option.isVertical==false && this.option.isAndroid==true){
						this.scrollBody.scrollLeft=1;
				  } 
	         }
			 else if(this.scrollBody.offsetWidth + this.scrollBody.scrollLeft >= this.scrollBody.scrollWidth) 
		     {
	              jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.UIScrollView.SCROLL_RIGHT]);
	         }else
			 {
			      this.isInitLeft=false;
			 }
			 var cPos;
             if(this.option.isVertical==true){
			     cPos=this.scrollBody.scrollTop;
			 }else{
				 cPos=this.scrollBody.scrollLeft;
			 }
             
			 
             if(cPos>this.prevPos){
			     this.scrollDirection=-1;
			 }else if(cPos<this.prevPos){
			     this.scrollDirection=1;
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
		 var bodyRange=0;
		 var lineRange=0
		 var scrollBodyBounce= jarvis.lib.getAbsoluteBounce(this.scrollBody);	
		 
         if(scrollBodyBounce.width>10000){
		     return;
		 }

		 if(this.scrollBodyBounce!=null && isReset==false){
			if(this.scrollBodyBounce.width==scrollBodyBounce.width && this.scrollBodyBounce.height==scrollBodyBounce.height){
				 return;
			}
		 }
		 this.scrollBodyBounce=scrollBodyBounce;
		 if(this.option.isVertical==true){
			 bodyRange=scrollBodyBounce.width;
		 }else{
		     bodyRange=scrollBodyBounce.height;
		 }
		 if(this.option.isFullSize==false){
			bodyRange=bodyRange-this.option.scrollUiGep;
		 }
		 if(this.option.dynamicLineNum==true){
	          this.option.lineNum=Math.floor(bodyRange/this.option.dynamicLineRange);
		 }
         this.option.lineRange=Math.floor(bodyRange/this.option.lineNum);

         if(this.option.isVertical==true){
			 this.scrollContent.style.width=bodyRange+"px";
		 }else{
             this.scrollContent.style.height=bodyRange+"px";
		 }
			

		 var scrRange=0;	   
		 if(this.option.isTable==true){
             scrRange=(this.option.range*Math.ceil(this.cellA.length/this.option.lineNum));	
		 }else{
             
			 this.posA=new Array();
			 this.posA.push(0);
			 var cell=null;
			 var divBounce=null;
			 
			 for(var i=0;i<this.cellA.length;++i){
				  cell=this.cellA[i];
				  this.scrollContent.appendChild(cell.cell);
				   divBounce=jarvis.lib.getAbsoluteBounce(cell.cell);	
			      if(this.option.isVertical==true){
					cell.range=divBounce.height;
				  }else{
					cell.range=divBounce.width;
				  }
				  cell.isAdd=true;
	              scrRange+=cell.range;
			      this.posA.push(scrRange);
			 }
            
		 }
		 try {
			if(scrRange==0){
			   this.scrollContent.style.overflow="visible";
			}else{
			   scrRange=scrRange+this.option.rangeEnd;
			   this.scrollContent.style.overflow="hidden";
			}
			
			if(this.option.isVertical==true){
			    
				this.scrollContent.style.height=scrRange+"px";
			}else{
				this.scrollContent.style.width=scrRange+"px";
			 
			}
		    this.scrolling(true);
		 }catch (e) {
					     
		 }	
		 
	}
		
}


/*

*/