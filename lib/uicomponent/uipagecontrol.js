/**
 * lib v1.0: jarvis component
 * by aeddang
 */
/*
interfaces
*/


if(typeof jarvis == "undefined") var jarvis = new Object();
document.write("<link rel='stylesheet' href='"+jarvisSrc+"uicomponent/style/uipagecontrol.css'>");


/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
 
	pageChange : function(idx,cell){},     
}
*/
jarvis.UIPageControlOption=function(){
   this.pageSize=10;
   this.usedNumber=true;
   this.cssKey="jarvis-uipagecontrol-panel";
}

jarvis.UIPageControl= function(pageID,delegate,option) 
{
	
	if(option=== undefined || option=== null){
	    option=new jarvis.UIPageControlOption();
	}
    if(delegate=== undefined){
	    delegate=null;
    }

	var parent;
	if(typeof pageID=="String" || typeof pageID=="string"){
	    parent=document.getElementById(pageID);
	}else{
	    parent=pageID;
	}
	
	jarvis.lib.addAttribute(parent,option.cssKey);
	
	this.delegate=delegate;
	this.option=option;
	
	this.view=document.createElement("div");
    jarvis.lib.addAttribute(this.view,"view");

	this.prevBtn=document.createElement("button");
	this.nextBtn=document.createElement("button");
   
    this.prevBtn.innerHTML="이전";
	this.nextBtn.innerHTML="다음";
    
    parent.appendChild(this.view);
   
	jarvis.lib.addAttribute(this.prevBtn,"btn btn-prev");
	jarvis.lib.addAttribute(this.nextBtn,"btn btn-next");
	
    this.prevBtn.style.display="none";
	this.nextBtn.style.display="none";

    this.cellA=new Array();
	this.pageSize=this.option.pageSize;
	this.totalNum=0;
	this.currentPage=0;
    this.totalGroup=0;
    this.currentGroup=0;
    this.selectCell=null;
	this.totalInit=false;
    this.init();
}






jarvis.UIPageControl.prototype = 
{
	
    init: function() 
	{
		var that=this;
		jarvis.lib.addEventListener(this.prevBtn,"click",function (e){ that.pageGroupMove(-1);})
		jarvis.lib.addEventListener(this.nextBtn,"click",function (e){ that.pageGroupMove(1);})

        var gestureDelegate=function(){}; 
			gestureDelegate.prototype = {
		                      gestureComplete: function(e){
								
							    if(e==jarvis.GestureElement.PAN_LEFT){
								   that.pageMove(-1);
								    
								}else if(e==jarvis.GestureElement.PAN_RIGHT){
								   that.pageMove(1);
								}
							    
							  }
							  
			}
			var gestureElement=new  jarvis.GestureElement( this.view,new gestureDelegate());
		
	},
	initReset: function(totalNum) 
	{
		if(this.totalInit==false){
		    this.reset(totalNum);
		}
		
	},
	reset: function(totalNum) 
	{
	
		this.totalInit=true;
		this.currentGroup=0;
		this.totalNum=totalNum;
        this.totalGroup=Math.ceil(this.totalNum/this.pageSize);
        this.setPage();
		
	},
	
	pageMove: function(dr) 
	{
		var cp=this.currentPage+dr;
        if(cp<0){
		   return false;
		}
	    if(cp>=this.totalNum){
		   
		   return false;
		}
		
        this.pageChange(cp);
		return true;
		
	},
	pageChange: function(idx) 
	{
		jarvis.lib.excuteDelegate(this.delegate,"pageChange",[idx]);
		
	},
    modifyPageGroup: function(idx) 
	{
		var cg=Math.floor(idx/this.pageSize);
        if(cg!=this.currentGroup){
		    this.pageGroupChange(cg);
		}
	},

    pageGroupMove: function(dr) 
	{
		var cp=this.currentGroup+dr;
        if(cp<0){
		   return false;
		}
	    if(cp>=this.totalGroup){
		   
		   return false;
		}
        this.pageGroupChange(cp);
		return true;
	},
    pageGroupChange: function(idx) 
	{
		this.currentGroup=idx;
        this.setPage();
	},
	setPageIdx: function(idx) 
	{
        this.modifyPageGroup(idx);
		this.currentPage=idx; 
       
        if(this.selectCell!=null){
		    jarvis.lib.removeAttribute(this.selectCell,"on"); 
		}
		var cellIdx=this.currentPage%this.pageSize;
        
        if(cellIdx<this.cellA.length){
			this.selectCell=this.cellA[cellIdx];
			jarvis.lib.addAttribute(this.selectCell,"on");
		}

	},
	pageSelect: function(e) 
	{
		var tg=jarvis.lib.getEventTarget(e);
		var idx=tg.idx;
        jarvis.lib.excuteDelegate(this.delegate,"pageChange",[idx]);
        this.setPageIdx(idx);
	},
	setPage: function() 
	{
		this.setPageControl();
		this.setPageList();
	},

	setPageControl: function() 
	{
		if(this.totalGroup<=1){
		   this.prevBtn.style.display="none";
	       this.nextBtn.style.display="none";
		}else{
			
		   if(this.currentGroup==0){
		        this.prevBtn.style.display="none";
				this.nextBtn.style.display="inline-block";
		   }else if(this.currentGroup==(this.totalGroup-1)){
				this.prevBtn.style.display="inline-block";
				this.nextBtn.style.display="none";
		   }else{
				this.prevBtn.style.display="inline-block";
				this.nextBtn.style.display="inline-block";
		   }
		  
		}
        
	},
	setPageList: function() 
	{
      
		jarvis.lib.removeChild(this.prevBtn);
		jarvis.lib.removeChild(this.nextBtn);
	
		
		this.selectCell=null;
		this.cellA=new Array();
		this.view.innerHTML="";
		
		var cell;
		var btn;
		var that=this;
		var startidx=this.currentGroup*this.pageSize;
		var endIdx=startidx+this.pageSize;
		if( endIdx > this.totalNum){
		    endIdx=this.totalNum;
		}
        endIdx=endIdx-startidx;
		var idx;
		this.view.appendChild(this.prevBtn);
		for(var i=0;i<endIdx;++i){
		   cell=document.createElement("button");
           if(this.option.usedNumber==true){
				cell.innerHTML=(i+startidx+1);
		   }
		   cell.idx=startidx+i;
		   jarvis.lib.addAttribute(cell,"default");
		  
		   if(this.currentPage==cell.idx){
			  this.selectCell=cell;
		      jarvis.lib.addAttribute(cell,"on");
		   }
		   this.view.appendChild(cell);
		   jarvis.lib.addEventListener(cell,"click",function (e){ that.pageSelect(e);});
		   this.cellA.push(cell);
		}
		this.view.appendChild(this.nextBtn);
	}
	
		
}

/*

*/