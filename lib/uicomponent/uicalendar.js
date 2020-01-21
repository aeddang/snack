/**
 * lib v1.0: jarvis component
 * by aeddang
 */
/*
interfaces
*/


if(typeof jarvis == "undefined") var jarvis = new Object();
document.write("<link rel='stylesheet' href='"+jarvisSrc+"uicomponent/style/uicalendar.css'>");
document.write("<script type='text/javascript' src='"+jarvisSrc+"model/calendarinfo.js'></script>");

/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
 
	calendarChange : function(currentMonth){},   
	calendarSelect : function(currentDate){}, 
}
*/
jarvis.UICalendarOption=function(){
    this.startDate=-1;
	this.isTitleView=true;
	this.isDayView=true;
    this.changeAble=true; 

	this.cssKey="jarvis-uicalendar-panel";
}



jarvis.UICalendar= function(pageID,delegate,option) 
{
	
	if(option=== undefined || option=== null){
	    option=new jarvis.UICalendarOption();
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
	this.info=new jarvis.CalendarInfo();
	this.view=document.createElement("div");
	jarvis.lib.addAttribute(this.view,"view");
    

	this.calendarBox=document.createElement("div");
	jarvis.lib.addAttribute(this.calendarBox,"calendar-box");
	parent.appendChild(this.view);
	
	if(this.option.isTitleView==true){
		this.title=document.createElement("h2");
		jarvis.lib.addAttribute(this.title,"title");
		this.calendarBox.appendChild(this.title);
	}
    if(this.option.isDayView==true){
		this.topBar=document.createElement("ul");
		jarvis.lib.addAttribute(this.topBar,"top-bar");
		this.dayA=new Array();
		var day;
		var days=new Array("일","월","화","수","목","금","토");
		for(var i=0;i<7;++i){
			day=document.createElement("li");
			day.innerHTML=days[i];
            jarvis.lib.addAttribute(day,"cell cell_default");
			if(i==6){
			   jarvis.lib.addAttribute(day,"cell_saturday");
			}else if(i==0){
			   jarvis.lib.addAttribute(day,"cell_sunday");
			}
            this.dayA.push(day);
			this.topBar.appendChild(day);
		}
		this.calendarBox.appendChild(this.topBar);
	}
	

    this.calendar=document.createElement("ul");
	jarvis.lib.addAttribute(this.calendar,"calendar");

    if(this.option.changeAble==true){
	    this.prevBtn=document.createElement("button");
	    this.nextBtn=document.createElement("button");
        jarvis.lib.addAttribute(this.prevBtn,"btn prev-btn");
		jarvis.lib.addAttribute(this.nextBtn,"btn next-btn");

		this.prevBtn.innerHTML="<";
		this.nextBtn.innerHTML=">";
	}

   
	if(this.option.changeAble==true){
	    this.view.appendChild(this.prevBtn);
		this.view.appendChild(this.calendarBox);
		this.view.appendChild(this.nextBtn);
	}else{
	    this.view.appendChild(this.calendarBox);
	}
	
	
	this.calendarBox.appendChild(this.calendar);
   
    this.cellA=new Array();
	this.selectCell=null;

	this.currentMonth;
	this.currentDate;
    this.resetDate();
    this.init();
	
}






jarvis.UICalendar.prototype = 
{
	
    init: function() 
	{
		var that=this;
		if(this.option.changeAble==true){
			jarvis.lib.addEventListener(this.prevBtn,"click",function (e){ that.calendarMove(-1);})
			jarvis.lib.addEventListener(this.nextBtn,"click",function (e){ that.calendarMove(1);})
			var gestureDelegate=function(){}; 
			gestureDelegate.prototype = {
		                      gestureComplete: function(e){
								
							    if(e==jarvis.GestureElement.PAN_LEFT){
								   that.calendarMove(-1);
								    
								}else if(e==jarvis.GestureElement.PAN_RIGHT){
								   that.calendarMove(1);
								}
							    
							  }
							  
			}
			var gestureElement=new  jarvis.GestureElement( this.view,new gestureDelegate());
        }
        

		this.reset();
	},
	reset: function() 
	{
		this.resetDate();
		this.calendarChange();

	},

	resetDate: function() 
	{
		if(this.option.startDate.length==8){
			var yy=this.option.startDate.slice(0,4);
			var mm=this.option.startDate.slice(4,6);
			var dd=this.option.startDate.slice(6,8);

			this.currentMonth=new jarvis.MonthData(yy,mm);
			this.currentDate=new jarvis.DayData(yy,mm,dd);
		}else{
			this.currentMonth=this.info.getCurrentMonth();
            this.currentDate=new jarvis.DayData();
			
		}
		
	},
	
	calendarMove: function(dr) 
	{
		 for(var i=0;i<Math.abs(dr);++i){
		    if(dr>0){
		       this.currentMonth=this.info.getNextMonth(this.currentMonth.getYear(),this.currentMonth.getMonth());
			}else{
		       this.currentMonth=this.info.getPrevMonth(this.currentMonth.getYear(),this.currentMonth.getMonth());
	        } 
		}
		
		this.calendarChange();
		
	},
	calendarChange: function() 
	{
		
		this.selectCell=null;
		this.cellA=new Array();
		this.calendar.innerHTML="";
		
       
        var dates=this.info.getCalendarInfo(this.currentMonth.getYear(),this.currentMonth.getMonth());
        var today=new jarvis.DayData();
		var firstDay=dates[0];
		var lastDay=dates[dates.length-1];
		var prevNum=firstDay.getDay();
        var nextNum=6-lastDay.getDay();
		
        var i=0;
		var prevA=new Array();
        for(i=0;i<prevNum;++i){
		   firstDay=this.info.getPrevDay(firstDay.getYear(),firstDay.getMonth(),firstDay.getDate());
		   prevA.unshift(firstDay);
	    }

        var nextA=new Array();
        for(i=0;i<nextNum;++i){
		   lastDay=this.info.getNextDay(lastDay.getYear(),lastDay.getMonth(),lastDay.getDate());
		   nextA.push(lastDay);
	    }
        
		var cell;
        var idx=0;
		var line=7;
		for(i=0;i<prevA.length;++i){
		   
           cell=this.makeCell(prevA[i],"prev",Math.floor(idx/line),today);
		   this.cellA.push(cell);
		   idx++;
        }
		for(i=0;i<dates.length;++i){
		  
		   cell=this.makeCell(dates[i],"current",Math.floor(idx/line),today);
		   this.cellA.push(cell);
		   idx++;
        }
		for(i=0;i<nextA.length;++i){
		   
		   cell=this.makeCell(nextA[i],"next",Math.floor(idx/line),today);
		   this.cellA.push(cell);
		   idx++;
        }
		if(this.option.isTitleView==true){
			this.title.innerHTML=this.currentMonth.getYear()+"."+this.currentMonth.getMonth();
		}
		
		jarvis.lib.excuteDelegate(this.delegate,"calendarChange",[this.currentMonth]);
		
	},
    makeCell: function(dayData,type,line,today) 
	{
		
		
		var that=this;
		var cell=document.createElement("li");
		var btn=document.createElement("button");
		jarvis.lib.addAttribute(cell,"cell cell_default");
		if((line%2)==0){
		   jarvis.lib.addAttribute(cell,"cell_default_0");
		}else{
		   jarvis.lib.addAttribute(cell,"cell_default_1");
		}
        jarvis.lib.addAttribute(btn,"btn_default");
		if(type=="prev"){
			jarvis.lib.addAttribute(btn,"btn_prev");
	    }else if(type=="next"){
			jarvis.lib.addAttribute(btn,"btn_next");
		}else{
			var day=dayData.getDay();
			if(day==6){
				jarvis.lib.addAttribute(btn,"btn_saturday");
			}else if(day==0){
				jarvis.lib.addAttribute(btn,"btn_sunday");
			}
		}
        btn.innerHTML=dayData.getDate();
		cell.info=dayData;
		cell.btn=btn;
		cell.appendChild(btn);
		jarvis.lib.addEventListener(btn,"click",function (e){ that.calendarSelect(e);});
        this.calendar.appendChild(cell);
        if(today.getCode()  == dayData.getCode())
		{
		    jarvis.lib.addAttribute(cell,"cell_today");
			jarvis.lib.addAttribute(cell.btn,"btn_today");
		}
		if(dayData.getCode() == this.currentDate.getCode())
		{
		   this.setSelect(cell);
		}
		
        return cell;

	},
    setSelect: function(cell) 
	{
		if(this.selectCell!=null){
		    jarvis.lib.removeAttribute(this.selectCell,"cell_select");
			jarvis.lib.removeAttribute(this.selectCell.btn,"btn_select");
		}
		
		jarvis.lib.addAttribute(cell,"cell_select");
		jarvis.lib.addAttribute(cell.btn,"btn_select");
         
		var date=cell.info;
		this.selectCell=cell;
		this.currentDate=date;
        jarvis.lib.excuteDelegate(this.delegate,"calendarSelect",[date]);
	},

	calendarSelect: function(e) 
	{
		var tg=jarvis.lib.getEventTarget(e);
		
		this.setSelect(tg.parentNode);
	}
	

	
	
	
		
}

/*

*/