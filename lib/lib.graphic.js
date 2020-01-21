/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces


*/





if(typeof jarvis == "undefined") var jarvis = new Object();


//override



jarvis.Graphic= function(canvas,w,h,dpi) 
{
	
	this.canvas=document.getElementById(canvas);
    this.canvas.style.position= "absolute";
    this.wid=w;
	this.hei=h;
    
	this.drawThickness=1;
	this.drawColor="#000000";
    
	this.dpi=dpi;
	this.pixels=new Array();
   
	this.tx=-1;
	this.ty=-1;

}

jarvis.Graphic.prototype =
{
	drawSet: function(drawThickness,drawColor) 
	{
		this.drawThickness=drawThickness;
		this.drawColor=drawColor;
	},
	
	lineMove: function(tx,ty) 
	{
		this.tx=tx;
		this.ty=ty;
	},
	
	lineTo: function(tx,ty) 
	{
		if(this.tx==-1 || this.ty==-1){
		    return;
		}
        
        var dw=tx-this.tx; 
		var dh=ty-this.ty; 
		var isSmooth;
		for(var i=0;i<this.drawThickness;++i){
          
			if(this.drawThickness==1){
			   isSmooth=false;
			}else if(i==0 || i==this.drawThickness-1){
			   isSmooth=true;
			}else{
			   isSmooth=false;
			}
			
			if(Math.abs(dw)<Math.abs(dh)){
				this.dwawLine(this.tx+i,this.ty,tx+i,ty,isSmooth);
			}else{
			    this.dwawLine(this.tx,this.ty+i,tx,ty+i,isSmooth);
			}
			
		}
        
		this.tx=tx;
		this.ty=ty;
	
    },

    dwawLine:function ( x0, y0,  x1,  y1)
	{
		var addr = (y0*640+x0)*4;
		var dx = x1-x0;
		var dy = y1-y0;
		
		if (Math.abs(dx) > Math.abs(dy))
		{
	
			var du = Math.abs(dx);
			var dv = Math.abs(dy);
			var u = x1;
			var v = y1;
			var uincr = 4;
			var vincr = 640*4;
			if (dx < 0) uincr = -uincr;
			if (dy < 0) vincr = -vincr;
		}
		else
		{
			var du = Math.abs(dy);
			var dv = Math.abs(dx);
			var u = y1;
			var v = x1;
			var uincr = 640*4;
			var vincr = 4;
			if (dy < 0) uincr = -uincr;
			if (dx < 0) vincr = -vincr;
		}
		var uend = u + 2 * du;
		var d = (2 * dv) - du;	    /* Initial value as in Bresenham's */
		var incrS = 2 * dv;	/* ¥Äd for straight increments */
		var incrD = 2 * (dv - du);	/* ¥Äd for diagonal increments */
		var twovdu = 0;	/* Numerator of distance; starts at 0 */
		var invD = 1.0 / (2.0*sqrt(du*du + dv*dv));   /* Precomputed inverse denominator */
		var invD2du = 2.0 * (du*invD);   /* Precomputed constant */
		do
		{
	
			DrawPixelD(addr, twovdu*invD);
			DrawPixelD(addr + vincr, invD2du - twovdu*invD);
			DrawPixelD(addr - vincr, invD2du + twovdu*invD);

			if (d < 0)
			{
				/* choose straight (u direction) */
				twovdu = d + du;
				d = d + incrS;
			}
			else
			{
				/* choose diagonal (u+v direction) */
				twovdu = d - du;
				d = d + incrD;
				v = v+1;
				addr = addr + vincr;
			}
			u = u+1;
			addr = addr+uincr;
		} 
		while (u < uend);
	},
    /*
    
	dwawLine: function(sx,sy,tx,ty,isSmooth) 
	{
		var dw=tx-sx; 
		var dh=ty-sy;
		var num;
		var idx;
		var pixel;
		
		if(Math.abs(dw)>Math.abs(dh)){
			num=Math.abs(dw);
			dh=dh/num;
			if(dw<0){
			   dw=-1;
			}else{
			   dw=1;
			}
			
		}else{
			num=Math.abs(dh);
			dw=dw/num;
			if(dh<0){
			   dh=-1;
			}else{
			   dh=1;	
			}
				 
		}
		   
		for(var i=0;i<num;++i){
			
			this.drawPixel(sx,sy,isSmooth);
			sx+=dw;
			sy+=dh;
			
		}
	},
   */
	drawPixel: function(tx,ty,isSmooth) 
	{
		
		
		
		var pixel=document.createElement("div");
        pixel.style.position= "absolute";
		
        pixel.style.left=(this.dpi*tx)+"px";
		pixel.style.top=(this.dpi*ty)+"px";
		pixel.style.width=this.dpi+"px"; 
		pixel.style.height=this.dpi+"px"; 
		if(isSmooth==true){
			if(tx==Math.round(tx) && ty==Math.round(ty)){
				pixel.style.background="#000000";
			}else {
				pixel.style.background="#eeeeee";
			}
		}else{
		    pixel.style.background="#000000";
		}
		
		this.canvas.appendChild( pixel);
		this.pixels.push(pixel);
	},
	
    
 
}



/*

*/