/**
 * lib v1.0: jarvis class
 * by aeddang
 */
/*
interfaces


*/
if(typeof jarvis == "undefined") var jarvis = new Object();


jarvis.Switch= function(body) 
{
    
	this.body=body;
	this.isOn = false;
	this.header = null;
	this.bg = null;
	

}


jarvis.Switch.prototype =
{
	init : function(style)
	{
		this.createElements(style);
		
	},
    createElements:function(style)
	{	
		jarvis.lib.addAttribute(this.body,style);
        
        this.bg = document.createElement("div");
        jarvis.lib.addAttribute(this.bg,'bg');
        this.body.appendChild(this.bg);

		this.header = document.createElement("div");
        jarvis.lib.addAttribute(this.header,'header');
        this.body.appendChild(this.header);
        
		
    },

	setupEvent: function(){
		var that = this;
		jarvis.lib.addEventListener(this.body,"click",function (e){ that.togleSwitch();});
	},

	togleSwitch : function(){
		
		if(this.isOn == true)
		{
			this.switchOff();
		}else
		{
			this.switchOn();
		}
		jarvis.lib.dispatchEvent(this.body,"change");
		
	},
	switchOn: function()
	{
		this.isOn = true;
		this.setView(this.isOn);
		
	},
	switchOff: function()
	{
		
		this.isOn = false;
		this.setView(this.isOn);
		
	},

    //private
	setView:function(ac)
	{
		var that = this;
		var tx=0;
		var style="";
        if(ac==true)
		{
			
			var size = jarvis.lib.getAbsoluteBounce(this.body);
			var margin = jarvis.lib.getAbsoluteBounce(this.header);
            tx=size.width-margin.width;
			jarvis.lib.addAttribute(that.bg,'bg-on');
		}else{
			tx=0;
            jarvis.lib.removeAttribute(that.bg,'bg-on');
		}
		
		var that = this;
		var aniDelegate=function(){};
		aniDelegate.prototype = {
				complete : function(e)
				{
					if(ac==true)
					{
						
					}else{

			            
					}
					
				}
			}
        jarvis.animation.startAnimation( that.header.style, { 
																	 listener:that.header,
																
			                                                         duration:0.15, 
																     left:tx,
																     isPx:true,
																     ease:"ease-in" },new aniDelegate());

	}

}



/*

*/