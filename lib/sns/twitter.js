/**
 * lib v1.0: AdaptPlayer
 * 2013/04/12 by aeddang
 * FlashPlayer 1.0
 */


jarvis.TwitterAPI=function(delegate,returnType){
   
	if ( returnType === undefined ) {
          returnType="json_parse";
    }
	this.TW_API="https://api.twitter.com/1.1/";  
	this.TW_API_STREAM="https://stream.twitter.com/1.1/";
	this.API="http://test.com/api/twitterAPI.php";  
	this.returnType=returnType;
	this.delegate=delegate;
	this.init();
}




jarvis.TwitterAPI.prototype = 
{
    init: function() 
	{
		
	},
	requestToken: function() 
	{
		var param=new Object();
        param.command='requestToken';
		var that=this;
		var ajax=new jarvis.Ajax();
		jarvis.requestTokenComplete= function(result){
			if(result=="Y"){
				data=ajax.returnData;
				alert(data);
			}else{
				    
			}
			
		    if(jarvis.requestTokenComplete==this){
			   jarvis.requestTokenComplete=null;
			}
			
		}
        ajax.request(this.API,param,"jarvis.requestTokenComplete","POST","json"); 
    },
	

	request: function (command,twParam,requestMethod,isStream) 
	{
		if ( requestMethod === undefined ) {
            requestMethod="POST";
        }
        if ( isStream === undefined ) {
            isStream=false;
        }

		var that=this;
		var param=new Object();
		if(isStream ==true){
		     param.url=this.TW_API_STREAM+command +'.json';
		}else{
		     param.url=this.TW_API+command +'.json';
		}
       
        param.requestMethod=requestMethod;
        
		var field="";
		var value="";
		var i=0;
		for (var key in twParam)
		{
			if(i==0){
				field=field+key;
				value=value+twParam[key];
			}else{
				field=field+","+key;
				value=value+","+twParam[key];
			}
			i++;
			
		}
		param.field=field;
		param.value=value;
		

		var cmd=command.replace('/','');
		var ajax=new jarvis.Ajax();
        jarvis["twRequestComplete"+cmd]= function(result){
			var data=null;
			
			if ( that.returnType == "jsonp") {
				data=JSON.parse(result);
			}else{
				if(result=="Y"){
					data=ajax.returnData;
				}else{
				    
				}
			    
			}
	        if(data==null){
			    jarvis.lib.excuteDelegate(that.delegate,"error",[command,[{'message':'data is null','code':9999}]]);
			}else{
				if(data.errors!= null && data.errors!= undefined){
				    jarvis.lib.excuteDelegate(that.delegate,"error",[command,data.errors]);
				}else{
				    jarvis.lib.excuteDelegate(that.delegate,"complete",[command,data]);
				}
			    
			}
            

			if(jarvis["twRequestComplete"+cmd]==this){
			   jarvis["twRequestComplete"+cmd]=null;
			}
			
		}
        

		ajax.request(this.API,param,"jarvis.twRequestComplete"+cmd,"POST",this.returnType);
    }
}

 //jarvis.flashPlayer;//used event delegate

 