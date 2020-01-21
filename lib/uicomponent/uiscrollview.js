/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces
*/


if(typeof jarvis == "undefined") var jarvis = new Object();

document.write("<script type='text/javascript' src='"+jarvisSrc+"uicomponent/uiscrollview.customscroll.js'></script>"); 
document.write("<script type='text/javascript' src='"+jarvisSrc+"uicomponent/uiscrollview.defaultscroll.js'></script>");

document.write("<link rel='stylesheet' href='"+jarvisSrc+"uicomponent/style/uiscrollview.css'>");


/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
    stateChange : function(e){},      //option
    addCell : function(idx,cell){},
	removeCell : function(idx,cell){},
}
*/

jarvis.UIScrollViewOption=function(){
   this.isVertical=true;
   this.isTable=false;
   if(jarvis.lib.isMobile()==true){
      this.isSnap=false;
   }else{
      this.isSnap=true;
   }
   this.isAndroid=jarvis.lib.isAndroid();
   this.isFullSize=false;
   this.dynamicLineNum=false;
   this.dynamicLineRange=0;
   this.lineNum=1;
   this.isAutoScrollRelease=true;
   this.lineRange=50;
   this.range=100;	
   this.rangeEnd=10;
   this.scrollID="";
   this.scrollUiGep=-1;
   this.scrollUiGepOver=20;
   this.scrollGep=30;
   this.cssKey="jarvis-uiscrollview";
   this.noDataView="<p style='padding: 10px;  font-size: 14px'>nodata</p>" ;
}

jarvis.UIScrollViewOption.prototype = 
{
    resetOption: function(type) 
	{
	    if(this.isTable==false){
		   this.lineNum=1;
		}
		if(this.dynamicLineNum==true){
		  this.dynamicLineRange= this.lineRange;
		}
		if(this.scrollUiGep==-1){
		   if(type==0){
		      this.scrollUiGep=17;
		   }else{
		      this.scrollUiGep=10;
		   }
		   
		}
	}

}

jarvis.UIScrollView= function(scrollID,option,delegate,type) 
{
	
    if(option=== undefined || option=== null){
	    option=new jarvis.UIScrollViewOption();
	}
    if(delegate=== undefined){
	    delegate=null;
    }
	
	if(type===undefined){
	    type=2;
	}
	var vs=jarvis.lib.getIEVersion();
	
    if(vs<=7 && vs!=-1){
	  //type=0;
	  // option.isSnap=false;
	}
	//type=0;

    if(type==0){
	    this.scroll=new jarvis.UIDefaultScroll(scrollID,option,delegate);
    }else if(type==1){
	    this.scroll=new jarvis.UICustomScroll(scrollID,option,delegate);
	}else{
		if(jarvis.lib.isMobile()==true){
			option.scrollUiGep=0;
			if(option.isAndroid==true){
			   if(jarvis.lib.getADSdkVersion(jarvis.lib.getADVersion())<12){
				   //this.scroll=new jarvis.UIDefaultScroll(scrollID,option,delegate); 
			       this.scroll=new jarvis.UICustomScroll(scrollID,option,delegate);
			   }else{
				   
			       this.scroll=new jarvis.UIDefaultScroll(scrollID,option,delegate); 
			   }
			}else{
			   this.scroll=new jarvis.UIDefaultScroll(scrollID,option,delegate);
			}
		
		    
		}else{
			this.scroll=new jarvis.UICustomScroll(scrollID,option,delegate);
        }
	    
	}
	

}


jarvis.UIScrollView.SCROLL_BOTTOM="SCROLL_BOTTOM";  
jarvis.UIScrollView.SCROLL_TOP="SCROLL_TOP";
jarvis.UIScrollView.SCROLL_LEFT="SCROLL_LEFT";  
jarvis.UIScrollView.SCROLL_RIGHT="SCROLL_RIGHT";
jarvis.UIScrollView.SCROLL_START="SCROLL_START";
jarvis.UIScrollView.SCROLL_STOP="SCROLL_STOP";
jarvis.UIScrollView.SCROLL_UP="SCROLL_UP";
jarvis.UIScrollView.SCROLL_DOWN="SCROLL_DOWN";
jarvis.UIScrollView.SCROLL_MOVE="SCROLL_MOVE";


jarvis.UIScrollView.prototype = 
{
	
    reset: function() 
	{
		this.scroll.reset();
	},
	resetDataView: function(noDataView) 
	{
		this.scroll.option.noDataView=noDataView;
	},
	remove: function() 
	{
		this.scroll.remove();
		this.scroll=null;
	},
    scrollMove: function(amount,isAni)
    {
		this.scroll.scrollMove(amount,isAni);
	},
	scrollTo: function(pos,isAni)
    {
		this.scroll.scrollTo(pos,isAni);

	},
    scrollToIdx : function(idx,isAni)
    {
		
		this.scroll.scrollToIdx(idx,isAni);
	},
	getScrollIdx : function()
    {
		
		return this.scroll.getScrollIdx();
	},
    addCell: function(obj)
    {
	   
        return  this.scroll.addCell(obj);

	},
	addComplete: function()
    {
	  
		this.scroll.addComplete();
	  
    },
	resize: function()
    {
		this.scroll.resize();
	}
		
}
jarvis.UIScrollViewCell=function(obj,idx,isHtml,isVertical,isTable){
   
	this.idx=idx;
	this.id="jarvis.UIScrollViewCell"+idx;
	this.range=0;
	this.cell=document.createElement("li");
    this.cell.setAttribute("id", this.id);
    
	if(isVertical==true){
	   this.cell.style.width="100%";
	}else{
	   this.cell.style.height="100%";
	}
	this.cell.style.listStyle= "none";
	if(isTable==true){
	   this.cell.style.position="absolute";
	   this.cell.style.overflow="hidden";
	}
    
	
    if(isHtml==true){
        this.cell.innerHTML=obj;
		this.obj=null;
	}else{
	    this.obj=obj;
        this.cell.appendChild(this.obj);
	}
	this.isAdd=false;
	this.isView=false;
}


/*

*/