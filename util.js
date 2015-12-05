var prefix = 'app';
var tipTimeOut = null;
UTIL = window.UTIL || {};
UTIL.Search = {
    searchToJson:function(){
        var search = window.location.search;
        if (!search){
            return false;
        }else{
            search = search.substr(1);
            var searchJson = {};
            var searchArr = search.split('&');
            for(var i = 0 , len = searchArr.length ; i < len ; i++){
                var tempArr = searchArr[i].split('=');
                searchJson[tempArr[0]] = tempArr[1];
            }
            return searchJson;
        }
    },
    getSearchParam:function(param){
        var searchJson = UTIL.Search.searchToJson();
        if(!searchJson || !(searchJson[param])){
            return false;
        }else{
            return searchJson[param];
        }
    }
};
UTIL.DATE = {
    date:function(timestamp){
        timestamp = timestamp || Date.now();
        var dateObj = new Date(timestamp);
        return {year:dateObj.getFullYear(),month:1+dateObj.getMonth(),date:dateObj.getDate(),day:dateObj.getDay()};
    },
    getEnglishMonth:function(month){
        return englishM[month];
    },
    getChineseWeek:function(day){
        return chineseW[day];
    },
    getDate:function(split,daySpace){
        split = split || '/';
        daySpace = daySpace || 0;
        var timestamp = new Date().getTime();
        timestamp = new Date(timestamp + daySpace*24*60*60*1000);
        return timestamp.getFullYear()+split+(1+timestamp.getMonth())+split+timestamp.getDate();
    },
    getTime:function(dateYMD,split){
        return new Date(UTIL.DATE.replaceDate(dateYMD,split)).getTime();
    },
    replaceDate:function(dateYMD,split){
        split = split || '-';
        var patt1 = new RegExp(split,'g');
        return dateYMD.replace(patt1,'/');
    },
    clearTime:function (date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },
    clearUTCTime:function (date) {
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        return date;
    },
    translateIOSDate:function(date,split){
        split = split || '-';
        var tIndex = date.indexOf('T');
        if(~tIndex){
            date = date.substr(0,date.indexOf('T'));
        }
        return date.split('-').join(split);
    },
    tranTimeYMD:function(time,split){
        split = split || '-';
        var d = new Date();
        d.setTime(time);
        var month = d.getMonth()+1;
        var date = d.getDate();
        month = UTIL.DATE.addZero(month);
        date = UTIL.DATE.addZero(date);
        var timeYMD = d.getFullYear()+split+month+split+date;
        return timeYMD;
    },
    tranTimeHMS:function(time,split){
        split = split || ':';
        var d = new Date();
        d.setTime(time);
        var hours = UTIL.DATE.addZero(d.getHours());
        var minutes = UTIL.DATE.addZero(d.getMinutes());
        var seconds = UTIL.DATE.addZero(d.getSeconds());
        var timeHMS = hours + split + minutes + split + seconds;
        return timeHMS;
    },
    tranTimeYMDHMS:function(time){
        var timeYMDHMS = UTIL.DATE.tranTimeYMD(time)+' '+UTIL.DATE.tranTimeHMS(time);
        return timeYMDHMS;
    },
    addZero:function(t){
        if(t < 10){
            t = '0' + t;
        }
        return t;
    }
};
UTIL.NUMBER = {
    formatToStr : function(num){
        num = num || 0;
        var negative = false;
        if(num === 0){
            return 0;
        }
        if(num < 0){
            num *= -1;
            negative = true;
        }
        if(num){
            var x1 = window.parseInt(num).toString();
            var len = x1.length;
            var x2 = num.toString().slice(len);
            if(len <= 3){
                return negative ? '-' + x1 + x2 : x1 + x2;
            }
            var r = len % 3;
            var b = x1.slice(r,len).match(/\d{3}/g).join(",");
            x1 = r > 0 ? x1.slice(0,r)+","+b : b;
            var x = negative ? '-' + x1 + x2 : x1 + x2;
            return x;
        }else{
            return 0;
        }
    },
    formatToStrObj : function(obj,array,fixNum){
        var returnObj = _.clone(obj);
        if(array && array.length){
            _.each(array,function(value){
                var num = returnObj[value] || 0;
                if(fixNum || fixNum === 0 ){
                    num = num.toFixed(fixNum);
                }
                returnObj[value] = UTIL.NUMBER.formatToStr(num);
            });
        }else{
            _.each(returnObj,function(value,key){
                if(_.isNumber(value)){
                    if(fixNum || fixNum === 0 ){
                        value = value.toFixed(fixNum);
                    }
                    returnObj[key] = UTIL.NUMBER.formatToStr(value);
                }
            });
        }
        return returnObj;

    },
    formatToNum : function(str){
        return parseFloat(str.replace(/,/g,''));
    },
    slicePointNum: function(data,num){
        data = data || 0;
        if(num !== 0){
            num = num || 2;
        }
        var index = data.toString().indexOf('.');
        if(~index){
            data = data.toString().slice(0,index+num+1);
        }
        data = UTIL.NUMBER.formatToStr(parseFloat(data));
        return data;
    }
};
UTIL.STORE = {
    setItem:function(key,val){
        window.localStorage.setItem(prefix+key,JSON.stringify(val));
    },
    getItem:function(key){
        return JSON.parse(window.localStorage.getItem(prefix+key));
    },
    removeItem:function(key){
        window.localStorage.removeItem(prefix+key);
    }
};
UTIL.WINDOW = {
    getWidth:function(){
        if(document.documentElement && document.documentElement.clientHeight) {
            return window.parseInt(document.documentElement.clientWidth);
        }
        if(document.body) {
            return window.parseInt(document.body.clientWidth);
        }
    },
    getHeight:function(){
        if(document.documentElement && document.documentElement.clientHeight) {
            return window.parseInt(document.documentElement.clientHeight);
        }
        if(document.body) {
            return window.parseInt(document.body.clientHeight);
        }
    }
};
UTIL.TIP = {
    alert:function(text,second){
        second = second || 3;
        var tipID = document.getElementById('tipID');
        if(!tipID){
            tipID = document.createElement('div');
            tipID.setAttribute('id','tipID');
            tipID.style.cssText = 'padding:5px 10px;border-radius:5px;position:fixed;left:50%;max-width:90%;top:50%;margin-top:-20px;background:rgba(0,0,0,0.8);text-align:center;color:#fff;z-index:99999999;';
            document.getElementsByTagName('body')[0].appendChild(tipID);
        }
        tipID.style['left'] = 0;
        tipID.innerHTML = text;           
        tipID.style.display = 'block';
        tipID.style['margin-left'] = -(tipID.clientWidth/2)+'px';
        tipID.style['left'] = '50%';
        tipTimeOut && clearTimeout(tipTimeOut);
        tipTimeOut = setTimeout(function(){
            tipID.style.display = 'none';
        },second *1000);
    }
}