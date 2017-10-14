
$(function(){
	var navigation,permission,menuTreeData;

	/*初始化左侧导航*/
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

				var siblingsTreeNodes = treeObj.getNodesByFilter(filterNode)

				function filterNode(node){
					return (node.id !== treeNode.id && node.pId == 0)
				};

				$.each(siblingsTreeNodes,function(index,value){
					treeObj.expandNode(value, false, true, true)
				})	
				//console.log(siblingsTreeNodes)

			};

			/*自定义一级导航icon*/
			function addDiyDom(treeId, treeNode){				
				var treeObj = $.fn.zTree.getZTreeObj("leftTreeNav");
				if (treeNode.parentNode && treeNode.parentNode.id!=0) return;
				//console.log(treeNode);

				var aObj = $("#" + treeNode.tId + '_a');
				var bObj = $("#" + treeNode.tId + '_a.level0');


				if(treeNode.id != undefined && treeNode.id !=null){					
					aObj.removeAttr("target");
				};

				//添加icon 重构后的treeNode多一个icon属性 
				bObj.each(function(){
					var iconHtml = '<i class="icon-star"></i>';//改变'<i class="'+$(this).icon+'"></i>'
					$(this).prepend(iconHtml);
				});
				
				//console.log(bObj)
				//console.log(treeNode,treeNode.id)				
			};
			

			$(document).ready(function(){
				
		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);
		    
		    	var firstNodes = treeObj.getNodesByParam("level","0");
		    	
				var secondNodes = treeObj.getNodesByParam("level","1");
				var funcsNodes = treeObj.getNodesByParam("type","1");

				//若存在功能子节点 移除功能子节点
				if(funcsNodes && funcsNodes.length>0){
					$.each(funcsNodes,function(index,value){
						treeObj.removeNode(value);
					});					
				};

				/*对应当前url地址 相应的菜单呈现展开状态*/		    	 
		    	ExpandNodeFilter(treeObj);
					
		    	
		    	
	    		
		    });		
	};

	/*判断当前url地址 
	  对应的父级菜单呈现展开状态
	  对应子级菜单 添加css样式	
	*/
	function ExpandNodeFilter(treeObj){
    	//获取当前地址
    	var pathname = location.pathname;
		pathname = pathname.split('/');
		pathname = pathname[pathname.length-1];
		console.log(pathname)

		//筛选节点 父级菜单展开
		var currentChildNode = treeObj.getNodesByParam("url",pathname);
		if(currentChildNode.length>0){
			if(currentChildNode[0].isParent == false){
				//获取当前子节点的父节点
				var currentParentNode = currentChildNode[0].getParentNode();
				setTimeout(function(){
					treeObj.expandNode(currentParentNode, true, true, true)
				},500);
			};
		};

		/*筛选dom对象 子级菜单加css*/

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
	   				menuTreeData = rebuildToZtreeData(res.data);
	   				setStorage("menuZtree",menuTreeData);
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


	/*第一步：判断当前浏览器是否存在某数据缓存
	*@param name
	*/
	var judgeStorage = function (name){   

	   	if(name == "username"){
			if(getStorage(name)!= undefined && getStorage(name)!= null){
    			var data2 = getStorage("username");
    		 	$('#loginName').html(data2);
    		 	
			}else{
		 		publicFun.getUserInfo();
			}; 
	    };	    

    	//缓存重构的menuZtreeData
        if(name == "menuZtree"){
    		if(getStorage(name)!= undefined){
    			var data1 = getStorage("menuZtree");
    			menuZtreeData = JSON.parse(data1)
    			initNavZtree(menuZtreeData,permission);
    				
    		}else{
    			getMenuTree();  		 	
    		 
    		};
        };	   
	    
	};
	judgeStorage("menuZtree");
	judgeStorage("username");
	
	
	
})	
