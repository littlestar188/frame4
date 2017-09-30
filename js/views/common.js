/*created by caixx on 20170823*/
/*写入本地存储数据
* @param name  命名
* @param data  
*/
function setStorage(name,data){
	//判断json结构不严谨 
	var value = typeof(data) == "object" ? JSON.stringify(data):data;

	console.log('set localStorage----')
	//console.log(typeof(value))
	if(window.localStorage){
		localStorage.setItem(name,value);	
	}else{
		alert('浏览器不支持localStorage');
		return
	}	
}
/*获取本地存储的数据
*@param name 命名
*/
function getStorage(name){

	if(! window.localStorage){
		alert('浏览器不支持localStorage');
		return;
	}
	if(localStorage.length>0 && localStorage.getItem(name) ){
		var value = localStorage.getItem(name);
		//console.log('get---'+typeof(value))
		//console.log(value)
		return value;
	}
}

/*时间控件 转换格式*/
function getSmpFormatDate(date, isFull) {
    if(date == null || date == undefined){
        return "-";
    }
    if (isFull == true || isFull == undefined) {
        return moment(date).format("YYYY-MM-DD HH:mm");
    } else {
        return moment(date).format("YYYY-MM-DD");
    }
}

/*传参密码 加密函数*/
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64encode = function (str) {
   console.log(str)
   var out, i, len;
   var c1, c2, c3;
   len = str.length;
   i = 0;
   out = "";
   while(i < len) {
       c1 = str.charCodeAt(i++) & 0xff;
       if(i == len)
       {
           out += base64EncodeChars.charAt(c1 >> 2);
           out += base64EncodeChars.charAt((c1 & 0x3) << 4);
           out += "==";
           break;
       };
       c2 = str.charCodeAt(i++);
       if(i == len)
       {
           out += base64EncodeChars.charAt(c1 >> 2);
           out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
           out += base64EncodeChars.charAt((c2 & 0xF) << 2);
           out += "=";
           break;
       };
       c3 = str.charCodeAt(i++);
       out += base64EncodeChars.charAt(c1 >> 2);
       out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
       out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
       out += base64EncodeChars.charAt(c3 & 0x3F);
   }
   return out;
};