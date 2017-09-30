
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
			};

			/*自定义一级导航icon*/
			function addDiyDom(treeId, treeNode){				
				var treeObj = $.fn.zTree.getZTreeObj("leftTreeNav");
				if (treeNode.parentNode && treeNode.parentNode.id!=0) return;
				console.log(treeNode);

				var aObj = $("#" + treeNode.tId + '_a');
				var bObj = $("#" + treeNode.tId + '_a.level0');


				if(treeNode.id != undefined && treeNode.id !=null){					
					aObj.removeAttr("target");
				};

				//添加icon 重构后的treeNode多一个icon属性 
				bObj.each(function(){
					var iconHtml = '<i class="icon-star"></i>';//改变'<i class="'+$(this).icon+'"></i>'
					$(this).prepend(iconHtml)
				});
				
				//console.log(bObj)
				//console.log(treeNode,treeNode.id)				
			};

			

			
			
			$(document).ready(function(){
				
		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);
		    
		    	var firstNodes = treeObj.getNodesByParam("level","0");
		    	
				var secondNodes = treeObj.getNodesByParam("level","1");
				var funcsNodes = treeObj.getNodesByParam("type","1");

				treeObj.hideNodes(funcsNodes);	
		    	
		    });		
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

			
		});
	};
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

			
		});
	};

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
	   				setStorage("menuTree",menuTreeData);
	   				judgeStorage("menuZtree");	
	   			}   
                //获取数据,初始化ztree树
                //zNodes = resetData(getData);
            },
            error: function () {
                console.log("获取新增---后台报错");
            }
        });
	};

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
					   						
			}

		};
		console.log("处理menutree data后-----")	;	
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

	/*第一步：判断当前浏览器是否存在某数据缓存
	*@param name
	*/
	var judgeStorage = function (name){
		
		//模拟菜单树
		/*if(name == "nav"){
			if(getStorage(name)!= undefined){
    			var data1 = getStorage("nav");
    			navigation = JSON.parse(data1)
   				
			}else{
			 	getNav();
			 
			}
	    }*/
		
		//模拟权限
	   /* if(name == "permission"){
	    	if(getStorage(name)!= undefined){
    		  var data3 = getStorage("permission");	
    	 	  permission = JSON.parse(data3);
    	 	  	
			}else{
			 	getPermission();
			 
			}
	    }	 */   

	   	if(name == "username"){
			if(getStorage(name)!= undefined && getStorage(name)!= null){
    			var data2 = getStorage("username");
    		 	$('#loginName').html(data2);
    		 	
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
				window.location.href="login.html"  ;
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
	judgeStorage("nav");
	judgeStorage("permission");
	
	
	
})	
