/*created by caixx on 20170823*/
$(function(){
	var navigation,permission,menuTreeData;

	var initNavZtree = function(navData,perData){
			var zNodes = [];
			var newNodes = [];
			zNodes = navData;
			newNodes = perData;

			//console.log(zNodes,newNodes) 
					
		    //ajax获取数据 模拟数据
		    var setting = {
		   		view:{
		   			dbclickExpand:false,
		   			selectedMulti:false,
		   			addDiyDom: addDiyDom,
		   			showLine:false,
		   			showIcon:false,	   			
		   			fontCss:{}
		   		},
			   	data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "pId",
						rootPId: 0
					},
					key:{
						name:"name"
					}
				},
				
				callback:{
					onClick:onClick
				}
		    };

		   
		    function onClick(e,treeId, treeNode) {
		     	var treeObj = $.fn.zTree.getZTreeObj("leftTreeNav");
				treeObj.expandNode(treeNode);
			}

			/*自定义一级导航icon*/
			function addDiyDom(treeId, treeNode){				
				var treeObj = $.fn.zTree.getZTreeObj("leftTreeNav");
				if (treeNode.parentNode && treeNode.parentNode.id!=0) return;
				console.log(treeNode)

				var aObj = $("#" + treeNode.tId + '_a');
				var bObj = $("#" + treeNode.tId + '_a.level0')


				if(treeNode.id != undefined && treeNode.id !=null){					
					aObj.removeAttr("target");
				}

				//添加icon 
				bObj.each(function(){
					var iconHtml = '<i class="icon-star"></i>';
					$(this).prepend(iconHtml)
				})
				
				//console.log(bObj)
				//console.log(treeNode,treeNode.id)				
			}

			

			
			
			$(document).ready(function(){
				

		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);
		    
		    	var firstNodes = treeObj.getNodesByParam("level","0");
		    	
				var secondNodes = treeObj.getNodesByParam("level","1");
				var funcsNodes = treeObj.getNodesByParam("type","1");

				treeObj.hideNodes(funcsNodes)	

		    		
		    	
		    })		
	};

	

	/*获取导航树*/
	function getNav(){
		$.ajax({
			url:'resources/json/listNavTree.json',
			dataType:"json",
			//async : false,
			success:function(res){
				console.log('初始化菜单-----')
				console.log(res);
				var data = res.data;				
				//本地存储导航数据
				setStorage("nav",data);
				judgeStorage('nav');
			},
			error:function(){
				console.log('左侧导航------后台出错');
			}

			
		})
	}
	/*获取功能权限树*/
	function getPermission(){
		$.ajax({
			url:'resources/json/listPermission.json',
			dataType:"json",
			//async : false,
			success:function(res){
				console.log('初始化功能权限-----')
				console.log(res);
				var data = res.data;				
				//本地存储导航数据
				setStorage("permission",data);
				judgeStorage('permission');
			},
			error:function(){
				console.log('功能权限------后台出错');
			}

			
		})
	}

	function getMenuTree(){
		$.ajax({
            url: '/userPermission-controller/menu/tree',
            dataType: "json",
            type:"get",
            async: false,//必写
            success: function (res) {
                console.log("获得数据");
                console.log(res.data);
                if(res.success == true){
	   				var menuTreeData = res.data;	   				
	   				setStorage("menuTree",menuTreeData)
	   				judgeStorage("menuZtree");	
	   			}   
                //获取数据,初始化ztree树
                //zNodes = resetData(getData);
            },
            error: function () {
                console.log("获取新增---后台报错")
            }
        })
	}

	//菜单树重构
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
							}
								
						}

					}		   							

			}else{
				if(data[i].funcs!== null ){
						//一级菜单对应的功能子节点	
						for(var k=0;k<data[i].funcs.length;k++){
							/*if(data[i].funcs[k].funName,data[i].funcs[k].checked != "checked"){
									data[i].funcs[k].funName,data[i].funcs[k].checked = false
								}*/

							var funcsObj = new SeriesItem(data[i].id,data[i].funcs[k].id,data[i].funcs[k].funName,data[i].funcs[k].funUrl,1)
					  		arr.push(funcsObj);
						}
					}
			}
					   						
			}

		}
		console.log("处理menutree data后-----")		
		console.log(arr)
		setStorage("menuZtree",arr);
		return arr;				
    }

    function CreateSeriesItem(pId,id,name,url,type,checked){
    	this.pId = pId;
    	this.id = id;
        this.name = name;
        this.url = url;
        this.type = type;//0表示菜单 1表示功能，以便在传参过程中区分id类型
        this.checked = checked
        //this.isParent = isParent;        
        //this.children = children;
        
    }
    function SeriesItem(){
        CreateSeriesItem.apply(this,arguments);
    }
    SeriesItem.prototype = new CreateSeriesItem();
    SeriesItem.prototype.constructor = SeriesItem;

	/*第一步：判断当前浏览器是否存在某数据缓存
	*@param name
	*/
	var judgeStorage = function (name){
		
		//模拟菜单树
	/*	if(name == "nav"){
			if(getStorage(name)!= undefined){
    			var data1 = getStorage("nav");
    			navigation = JSON.parse(data1)
   				
			}else{
			 	getNav();
			 
			}
	    }
		
		//模拟权限
	    if(name == "permission"){
	    	if(getStorage(name)!= undefined){
    		  var data3 = getStorage("permission");	
    	 	  permission = JSON.parse(data3);
    	 	  	
			}else{
			 	getPermission();
			 
			}
	    }*/	    

	   	if(name == "username"){
			if(getStorage(name)!= undefined && getStorage(name)!= null){
    			var data2 = getStorage("username");
    		 	$('.user.user-menu .user-name').html(data2);
    		 	
			}else{
		 		publicFun.getUserInfo();
			} 
	    }

	    //正式菜单树
	    if(name == "menuTree"){
			if(getStorage(name)!= undefined){
				var data1 = getStorage("menuTree");
				menuTreeData = JSON.parse(data1);
				setStorage("menuZtree",rebuildToZtreeData(menuTreeData));
				judgeStorage("menuZtree");

			}else{
			 	getMenuTree();

			 
			}
	    }

    	//缓存重构后的menuZtreeData
        if(name == "menuZtree"){
    		if(getStorage(name)!= undefined){
    			var data1 = getStorage("menuZtree");
    			menuZtreeData = JSON.parse(data1)
    			initNavZtree(menuZtreeData,permission);
    				
    		}else{
    			judgeStorage("menuTree");  		 	
    		 
    		}
        }
	    		

	    // if(navigation && permission){

	    // 	initNavZtree(navigation,permission);
	    // }
	   
	    
	};
	judgeStorage("menuZtree");
	// judgeStorage("nav");
	// judgeStorage("permission");

	
	
	
})	

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

/*判断当前页面刷新或离开或关闭*/
/*window.onbeforeunload = function(event){
	event.returnValue = "leave?";
	// localStorage.removeItem("nav");
	// localStorage.removeItem("permission");
}*/


/*传参密码 加密函数*/
function encrypt(str){
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    function base64encode(str) {
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
           }
           c2 = str.charCodeAt(i++);
           if(i == len)
           {
               out += base64EncodeChars.charAt(c1 >> 2);
               out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
               out += base64EncodeChars.charAt((c2 & 0xF) << 2);
               out += "=";
               break;
           }
           c3 = str.charCodeAt(i++);
           out += base64EncodeChars.charAt(c1 >> 2);
           out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
           out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
           out += base64EncodeChars.charAt(c3 & 0x3F);
       }
       return out;
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