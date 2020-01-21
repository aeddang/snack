/**
 * lib v1.0: AdaptPlayer
 * 2013/04/12 by aeddang
 * FlashPlayer 1.0
 */



if(typeof jarvis == "undefined") var jarvis = new Object();


document.write("<script type='text/javascript' src='"+jarvisSrc+"sns/twitter.js'><"+"/script>"); 
document.write("<script type='text/javascript' src='"+jarvisSrc+"sns/facebook.js'><"+"/script>"); 

jarvis.Sns=function(){
   
	this.tw=null;  
	this.fb=null;  

}



jarvis.Sns.prototype = 
{
    init: function() 
	{
	},
	login: function(type) 
	{
		
    },
	
	
}

 //jarvis.flashPlayer;//used event delegate