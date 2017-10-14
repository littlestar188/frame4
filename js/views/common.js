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
/*ztree菜单数据 功能节点过滤
@param ztreeObj 
*/
function menuFunFilter(ztreeObj){
  var funcsNodes = ztreeObj.getNodesByParam("type","1");
  if(funcsNodes && funcsNodes.length>0){
      $.each(funcsNodes,function(index,value){
          ztreeObj.removeNode(value);
      });                 
  };
}
/*菜单树重构
*param data
*/
function rebuildToZtreeData(data){

  var arr = [];

  for(var i=0;i<data.length;i++){
    //自身是父节点
    if(data[i].parentId == null ){

      /*if(data[i].checked !="checked"){
        data[i].checked = false
      }*/

      var obj = new SeriesItem(0,data[i].id,data[i].menuName,null,0)
      arr.push(obj);

      if(data[i].subMenus !== null){
        //二级菜单子节点

          for(var j=0;j<data[i].subMenus.length;j++){

            /*if(data[i].subMenus[j].checked !="checked"){
              data[i].subMenus[j].checked = false
            }*/

             var subObj = new SeriesItem(data[i].id,data[i].subMenus[j].id,data[i].subMenus[j].menuName,data[i].subMenus[j].menuUrl,0)
             arr.push(subObj);

              //二级菜单的功能子节点  
            if(data[i].subMenus[j].funcs !== null){
              for(var n=0;n<data[i].subMenus[j].funcs.length;n++){

                /*if(data[i].subMenus[j].funcs[n].checked != "checked"){
                  data[i].subMenus[j].funcs[n].checked = false
                }*/

                var subFuncsObj = new SeriesItem(data[i].subMenus[j].id,data[i].subMenus[j].funcs[n].id,data[i].subMenus[j].funcs[n].funName,data[i].subMenus[j].funcs[n].funUrl,1)
                  arr.push(subFuncsObj);
              };
                
            };

          };                    

      }else{
        if(data[i].funcs!== null ){
            //一级菜单对应的功能子节点  
            for(var k=0;k<data[i].funcs.length;k++){
              /*if(data[i].funcs[k].funName,data[i].funcs[k].checked != "checked"){
                  data[i].funcs[k].funName,data[i].funcs[k].checked = false
                }*/

              var funcsObj = new SeriesItem(data[i].id,data[i].funcs[k].id,data[i].funcs[k].funName,data[i].funcs[k].funUrl,1)
                arr.push(funcsObj);
            };
        };
      };
                      
    };

  };
  console.log("处理menutree data后-----")  ; 
  console.log(arr);
  setStorage("menuZtree",arr);
  return arr;       
};

function CreateSeriesItem(pId,id,name,url,type,checked){
  this.pId = pId;
  this.id = id;
  this.name = name;
  this.url = url;
  this.type = type;//0表示菜单 1表示功能，以便在传参过程中区分id类型
  this.checked = checked;
  //this.isParent = isParent;        
  //this.children = children;
  
};
function SeriesItem(){
  CreateSeriesItem.apply(this,arguments);
};
SeriesItem.prototype = new CreateSeriesItem();
SeriesItem.prototype.constructor = SeriesItem;
/*克隆数组对象 保留原数据对象 避免原始数据被修改
*@param source 
*/
var objDeepCopy = function (source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    };
    return sourceCopy;
};

/*时间控件 转换格式
*@param date
*@param isFull
*/
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

/*传参密码 加密函数
@param str
*/
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

/*table option functions */
/*可用状态判断
@param value 
*/
function availableJudge(value){
  var filterValue = "";
  if(value != "" || value != undefined){
      switch(value){
          case 1:
          filterValue ="可用";
          break;
          case  0:
          filterValue = "禁用";
          break;

      };
  };                                    
  return filterValue;
};
/*card-actions*/
//minisize
var collapse = function(){
    
    $(".btn-minisize").on('click',function() {
        var $BOX_PANEL = $(this).closest('.block-detail'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.item-box');
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {//现状是打开 再次点击是关闭
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });

        } else {//现状是关闭，再次点击是打开
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        };

        $ICON.toggleClass('icon-arrow-up icon-arrow-down');
    });
}();