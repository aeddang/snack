class LogObj
{
    constructor(logStr) 
    {
        var strs =  logStr.split(" ");
        var dateStr = strs[0] +"T"+strs[1]+"Z";
        var date = new Date(dateStr);
        var during = Number(strs[2].replace('s', '')) * 1000;
        this.end = date.getTime();
        this.start = this.end - during + 1;  
        this.prevMax = 1; 
        this.nextMax = 1; 
    }

    checkPrev(log)
    {
        var range = 999;
        var startTime = this.start - range;
        var limitTime = this.start;
        var isRun=false;
        isRun = (limitTime >= log.end && log.end >= startTime) ? true : isRun;   
        if(!isRun) isRun = (limitTime >= log.start && log.start>= startTime) ? true : isRun; 
        if(!isRun) isRun = (log.start <= startTime && log.end >= limitTime) ? true : isRun; 
        if(isRun) this.prevMax++;
        
       // console.log("prev isRun : " + isRun);
        //console.log("startTime : " + startTime+"  limitTime :"+limitTime);
        //console.log("log : " + log.start +" : "+log.end);
        return this.prevMax;
    }

    checkNext(log)
    {
        var range = 999;
        var startTime = this.end ;
        var limitTime = this.end + range;
        var isRun=false;
        isRun = (limitTime >= log.end && log.end >= startTime) ? true : isRun;   
        if(!isRun) isRun = (limitTime >= log.start && log.start>= startTime) ? true : isRun; 
        if(!isRun) isRun = (log.start <= startTime && log.end >= limitTime) ? true : isRun; 
        if(isRun) this.nextMax++;
        //console.log("next isRun : " + isRun);
        //console.log("startTime : " + startTime+"  limitTime :"+limitTime);
        //console.log("log : " + log.start +" : "+log.end);
        return this.nextMax;
    }
}

function solution(lines) {
   
    var max = 1;
    var currentLogs = new Array();
    var logLists = new Array();
    lines.forEach(
        line =>
        {
            let log = new LogObj(line)
            let num = linkedListMax(log);
            logLists.push(log);
            max = Math.max(max,num);
        }
    )
    function linkedListMax(cLog)
    {
        var num = 0
        logLists.forEach(
            log =>
            {
                num = Math.max(num,log.checkPrev(cLog),log.checkNext(cLog));
                num = Math.max(num,cLog.checkPrev(log),cLog.checkNext(log));
            }
        )
        return num;
    }
    return max;
}


function solution(n) {

    if(n<2) return 1;
 
    var len = n-1;
    var sum = 0;
    var n1 = 1;
    var n2 = 1;
    for (var i = 0; i< len; ++i)
    {
        sum = n1 + n2;
        n1 = n2;
        n2 = sum;
    }
    return sum % 1000000007;
}
