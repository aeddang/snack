jarvis.dataManagerInstance = null;

const API = Object.freeze
(
    {
        INPUT_SCORE : "inputdata.php",
        LOAD_SCORE : "loaddata.php"
    }
);

const TABLE = Object.freeze
(
    {
        RANK : "rank107"
    }
);

const SHARE_KEY = Object.freeze
(
    {
        UUID : "uuid108"
    }
);

const NOTIFY_ID = Object.freeze
(
    {
        LOADED_SCORE : "loadedScore",
        INSERT_SCORE : "insertScore"
    }
);

const API_RESULT_MSG = Object.freeze
(
    {
        NETWORK_ERROR: "네트워크 환경을 확인해주세요.",
        SERVER_ERROR: "알 수 없는 오류가 발생하였습니다.<br>다시 시도해주세요.",
        UNDEFINE_ERROR: "권한없음."
    }
);

class DataManager
{
	static getInstance()
	{
        if(jarvis.dataManagerInstance == null) return new DataManager();
		return jarvis.dataManagerInstance;
	}

	constructor() 
    {
        jarvis.dataManagerInstance = this;
        
        this.API_PATH = "http://13.124.28.70/game/snack/api/";
        this.isInitUser = true;

        this.notifier = new Rx.Subject();
        
        let uuid = jarvis.lib.getStorage(SHARE_KEY.UUID);
        if(uuid == null || uuid == undefined || uuid == "")
        {
            this.uuid = jarvis.lib.getUUIDV4("PPP");
            jarvis.lib.setStorage(SHARE_KEY.UUID,this.uuid);
            this.isInitUser = true;
        }
        else
        {
            this.uuid = uuid;
            this.isInitUser = false;
        }
        
    }


    loadScore()
    {
        
        var param = {};
        param.cate= TABLE.RANK;
        param.seq = this.uuid;

        var path = this.API_PATH+API.LOAD_SCORE;
        var that = this;
        var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
            ajaxDelegate.prototype = 
            {
                onEvent : function(e,value,xhrStatus)
                {
                    switch(e)
                    {
                        case jarvis.EVENT.COMPLETE:
                            break;

                        case jarvis.EVENT.ERROR:
                            alert(API_RESULT_MSG.NETWORK_ERROR);
                            break;

                    }     
                    that.notifier.next({id:NOTIFY_ID.LOADED_SCORE,value:value}); 
                }
            }

        ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.POST,jarvis.AJAX_RESPONSE_TYPE.JSON);
        
    }

    insertScore(score)
    {
        
        var param = {};
        param.cate= TABLE.RANK;
        param.seq = this.uuid;
        param.value = score;

        var path = this.API_PATH+API.INPUT_SCORE;
        var that = this;
        var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
            ajaxDelegate.prototype = 
            {
                onEvent : function(e,value,xhrStatus)
                {
                    switch(e)
                    {
                        case jarvis.EVENT.COMPLETE:
                            break;

                        case jarvis.EVENT.ERROR:
                            alert(API_RESULT_MSG.NETWORK_ERROR);
                            break;

                    }     
                    that.notifier.next({id:NOTIFY_ID.INSERT_SCORE,value:value}); 
                }
            }

        ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.POST,jarvis.AJAX_RESPONSE_TYPE.JSON);
        
    }

    

    

    

}


