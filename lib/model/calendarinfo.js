/**
 * lib v1.0: jarvis model
 * by aeddang
 */
/*

*/


if(typeof jarvis == "undefined") var jarvis = new Object();


jarvis.CalendarInfo=function(){
  
  
}
jarvis.CalendarInfo.prototype = 
{
	
		
	getMonthInfo : function(sday,eday) 
	{
		sday=Number(sday);
        eday=Number(eday);
		var yy;
		var mm;
		var dataA=new Array();
		while(sday<=eday){
            yy=Number(jarvis.lib.intToText(sday,6).slice(0,4));
			mm=Number(jarvis.lib.intToText(sday,6).slice(4));
			dataA.push(new jarvis.MonthData(yy,mm));
			sday++;
			mm=jarvis.lib.intToText(sday,6).slice(4);
			if(mm=="13"){
				sday=sday+100-12;
			} 
		}
		return dataA
	},

    getYearInfo : function(listA) 
	{
        var yy=-1
	    var dataA=new Array();
	    var dataObj;
		var num=listA.length-1;
		for(var i=num;i>=0;--i)
		{
			if(yy!=listA[i].year)
			{
				dataObj=new jarvis.YearData(listA[i].year);
				dataA.push(dataObj);
				yy=listA[i].year;
			} 
			dataObj.listA.push(listA[i]);
		}
		return dataA;
	},
		
	getCalendarInfo : function(yy,mm)
	{
        var num=jarvis.lib.getDaysInMonth(yy,mm)
	    var dd=1
		var dataA=new Array();
	    for(var i=0;i<num;++i){
			dataA[i]=new jarvis.DayData(yy,mm,dd)
			dd++
		}
		return dataA
	},

	getWeekData : function (yy,mm,dd)
	{
		var data=new jarvis.DayData(yy,mm,dd);
		var dataA=new Array();
        for(var i=0;i<7;++i){
			dataA[i]=new jarvis.DayData();
		}
		var num=data.day;
		var pi;
		dataA[num]=data;
		var _yy=yy;
		var _mm=mm;
		var _dd=dd;
		  
		if(num!=0){	
				
			for(i=num-1;i>=0;--i){
				dataA[i]=this.getPrevDay (_yy,_mm,_dd);
				_yy=dataA[i].year;
				_mm=dataA[i].month;
				_dd=dataA[i].date;
				   
			}	
	    }
		_yy=yy;
		_mm=mm;
		_dd=dd;
		if(num!=6){	
			for(i=num+1;i<7;++i){
				dataA[i]=this.getNextDay (_yy,_mm,_dd);
				_yy=dataA[i].year;
				_mm=dataA[i].month;
				_dd=dataA[i].date;
					
			}	
		}	
		return 	dataA;
	},
    getCurrentMonth : function ()
	{
		var today=new jarvis.DayData();
		return new jarvis.MonthData(today.getYear(),today.getMonth());
	},
	getPrevMonth : function (yy,mm)
	{
		
		mm--;
		if(mm<1){
			yy--;
			mm=12;
		}
		
		return new jarvis.MonthData(yy,mm);
	},

	getNextMonth : function (yy,mm)
	{
		mm++;
		if(mm>12){
			yy++;
			mm=1;
		}
	
		return new jarvis.MonthData(yy,mm);
	},

	getPrevDay : function (yy,mm,dd)
	{
		dd--;
		if(dd<1){
			mm--;
			if(mm<1){
				yy--;
			    mm=12;
			} 
			dd=jarvis.lib.getDaysInMonth(yy,mm);
		}	
		return new jarvis.DayData(yy,mm,dd);
	},

	getNextDay : function (yy,mm,dd)
	{
		var num=jarvis.lib.getDaysInMonth(yy,mm);
		dd++;
		if(dd>num){
			mm++;
			if(mm>12){
				yy++;
				mm=1;
			} 
			dd=1;
		}	
		return new jarvis.DayData(yy,mm,dd);
	}
		
}

jarvis.YearData=function(_yy){
	
	this.listA=new Array();
	this.monthData=new jarvis.MonthData(_yy,12);
}

jarvis.MonthData=function(yy,mm){
	
	this.ym=(yy*100)+mm;
	this.yy=Math.floor(yy);
	this.mm=mm;

}

jarvis.MonthData.prototype = 
{
	getCode : function ()
	{
	    return this.ym;
	},
		
	getMonth : function ()
	{
		return this.mm;
	},
	
	getYear : function ()
	{
		return this.yy;
	},

    getYearStr : function ()
	{
		return String(this.yy)+"년";
	},

    getMonthStr : function ()
	{
		return jarvis.lib.intToText (this.mm,2)+"월";
	},

    getFullStr : function ()
	{
		return String(this.yy)+"년"+jarvis.lib.intToText (this.mm,2)+"월";
	}
}

jarvis.DayData=function(_yy,_mm,_dd){
	
	var today=new Date();
	if ( _yy === undefined ) {
        _yy=Number(today.getFullYear());
	}
	if ( _mm === undefined ) {
        _mm=Number(today.getMonth())+1;
    }
	if ( _dd === undefined ) {
        _dd=Number(today.getDate());
    }
	
	
	this.yy=_yy;
	this.mm=_mm;
	this.dd=_dd;
	this.ymd=Number(jarvis.lib.intToText (_yy,4)+jarvis.lib.intToText (_mm,2)+jarvis.lib.intToText (_dd,2));
	this.ymdStr=jarvis.lib.getDateByCode (this.ymd,".");
	this.dayNum=jarvis.lib.getDays(_yy,_mm,_dd);
	

}

jarvis.DayData.prototype = 
{
	setDayData : function (_code)
	{
		this.ymdStr=_code;
		this.yy=Number(this.ymdStr.slice(0,4));
		this.mm=Number(this.ymdStr.slice(4,6));
		this.dd=Number(this.ymdStr.slice(6,8));
		this.ymd=Number(this.ymdStr);
		this.dayNum=jarvis.lib.getDays(this.yy,this.mm,this.dd);
	},

	getDay : function ()
	{
		return new Date(this.yy,this.mm,this.dd).getDay();
	},
		
    getCode : function ()
	{
		return this.ymd;
	},
    
	getViewStr : function ()
	{
		return this.ymdStr;
	},
    
	getDate : function ()
	{
		return this.dd;
	},

	getMonth : function ()
	{
		return this.mm;
	},
    
	getYear : function ()
	{
		return this.yy;
	},
    
	getYearStr : function ()
	{
		return String(yy)+"년";
	},
	
	getMonthStr : function ()
	{
		return jarvis.lib.intToText (this.mm,2)+"월";
	},
    
	getDateStr : function ()
	{
		return jarvis.lib.intToText (this.dd,2)+"일";
	},
	
	getDayStr : function ()
	{
		return jarvis.lib.getDay(this.getDay());
	},

    getFullStr : function ()
	{
		return String(this.yy)+"년"+jarvis.lib.intToText (this.mm,2)+"월"+jarvis.lib.intToText (this.dd,2)+"일";
	}
}


/*

*/