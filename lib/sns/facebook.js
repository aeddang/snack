/**
 * lib v1.0: AdaptPlayer
 * 2013/04/12 by aeddang
 * FlashPlayer 1.0
 */






document.write("<script type='text/javascript' src='"+jarvisSrc+"sns/all.js'><"+"/script>"); 

jarvis.FaceBookAPI=function(appID){
   
	this.appID=appID   //"276256019133993";
    this.init();
}




jarvis.FaceBookAPI.prototype = 
{
    init: function() 
	{
		 var that=this;
		 FB.init({
               appId  : that.appID,
			   status : true
         });
         
    },
	login: function() 
	{
		var that=this;
		jarvis.fbLoginComplete=function fbLoginComplete(response) 
		{
			if (response.authResponse) {
				
				userName=""
				fbLoginCheck();
			} else {
				faceBookBtn0.text("login");
				userName="logout"
			}
			userInfo.text( userName);
		}
		FB.login(jarvis.fbLoginComplete);
    },
	logout: function() 
	{
		var that=this;
		jarvis.fbLogoutComplete=function fbLoginComplete(response) 
		{
			if (response.authResponse) {
				
			} else {
				
			}
			userInfo.text( userName);
		}
        FB.logout(jarvis.fbLogoutComplete);
    },
	function fbLoginCheck(){
	    FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
						fbGetProfile();
                    } else if (response.status === 'not_authorized') {
					    fbLogout();
					} else {
                        fbLogin();
                    }
					initComplete() ;
        });
	}
	;
    function fbLoginChange() 
	{
	   if(userName=="logout"){
	      fbLogin();
	   }else{
	      fbLogout();
	   }
	}
	;
	function fbLogin() 
	{
	    FB.login(fbLoginComplete);
	}
	;
	function fbLogout() 
	{
	    FB.logout(fbLoginComplete);
	}
	;

    function fbGetProfile(who) 
	{
	   if ( who === undefined ||  who == "") {
               who="me";
       }
	   FB.api('/'+who, function(response) {
			  if (!response) {
                 alert('retry');
			     return;
              }
			  userName=response.name;
			  userInfo.text(userName);
       });
	}
	;
	function fbGetFriend(who) 
	{
	    //removeSlideBox(); 
		if ( who === undefined ||  who == "") {
               who="me";
        }
		FB.api('/'+who+'/friends', {limit: 10}, function(response) {
		      
			  if (!response) {
                 fbLoginCheck();
			     return;
              }
			  if (!response.data) {
                 fbLoginCheck();
			     return;
              }
		      var str="";
 
		      var num=Number(response.data.length);
		      for (var i=0; i< num; ++i) {
                   var info = response.data[i];
                   if (info.id) {
                      info.id; 
				      info.name; 
				      str=str+"  |   "+info.id+" "+info.name;
                   }
			  }
	   	      fbDebug(str);   
														
        });  
	}
	;
    
    function fbLoadTimeLine(who) 
	{
		 removeSlideBox(); 
		 if ( who === undefined ||  who == "" ) {
               who="me";
         }
		  
		  FB.api('/'+who+'/feed', { limit: 30 }, function(response){
		      if (!response) {
                 fbLoginCheck();
			     return;
              }
			  if (!response.data) {
                 fbLoginCheck();
			     return;
              }
		       var cInfo=new DataInfo();
	           cInfo.setFBTimeLineData(response.data);
	           slideBox=new SlideBox(listsBody,cInfo,stageRect);  
          });
	};
    function fbUpload(imgData,title,linkUrl,desc) 
	{
		   if(imgData==null){
		      alert('Post was not ready.');
		      return
		   };

		   FB.ui(
           {
              method: 'feed',
              name: "app shere",
              link: linkUrl,
              picture: imgData,
              caption: title,
              description: desc
           },
           fbUploadComplete );
	};
    
 
    function fbLoginComplete(response) 
	{
	     if (response.authResponse) {
		     faceBookBtn0.text("logout");
             userName="waiting..."
			 fbLoginCheck();
		 } else {
		     faceBookBtn0.text("login");
		     userName="logout"
         }
		 userInfo.text( userName);
	}
	;
    function fbUploadComplete(response) 
	{
	    
		 if (response && response.post_id) {
                alert('Post was published.');
          } else {
                alert('Post was not published.');
         }
	}
}

 //jarvis.flashPlayer;//used event delegate

 