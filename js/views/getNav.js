/*created by caixx on 20170823*/
$(function(){
	var data2;
	var initNavZtree = function(data1){
			var zNodes,
				zNodes_per = [];

			zNodes = data1;
			console.log(data1,data2)
			
			
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
				

				if (treeNode.parentNode && treeNode.parentNode.id!=0) return;
				console.log(treeNode)
				var aObj = $("#" + treeNode.tId + '_a');
				var bObj = $("#" + treeNode.tId + '_a.level0')



				bObj.each(function(){
					var iconHtml = '<i class="icon-star"></i>';
					$(this).prepend(iconHtml)
				})
				
				//console.log(bObj)
				//console.log(treeNode.children())
				//console.log(treeNode,treeNode.id)
				if(treeNode.id != undefined && treeNode.id !=null){
					
					aObj.removeAttr("target");

				}
				
				
				

			}

			

			
			
			$(document).ready(function(){
				

		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);

		    	var firstNodes = treeObj.getNodesByParam("level","0");
		    	
				var secondNodes = treeObj.getNodesByParam("level","1");
				// 从树对象中获取一级导航的code 创建url字符串
		    	// var urls = $.map(secondNodes,function(item){

		    	// 	if( item.code != undefined){
		    	// 		return item.code+".html"		    		
		    	// 	}
		    	// })


				console.log(secondNodes)
					

		    		
		    	
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
	
	/*第一步：判断当前浏览器是否存在某数据缓存
	*@param name
	*/
	var judgeStorage = function (name){

		if(name == "nav"){
			if(getStorage(name)!= undefined){
    			 var data1 = getStorage("nav");
    	 		
    	 		initNavZtree(JSON.parse(data1));

			}else{
			 	getNav();
			 
			}
	    }
		
	    if(name == "permission"){
	    	if(getStorage(name)!= undefined){
    		   data2 = getStorage("permission");	
    	 		//initNavZtree(JSON.parse(data2));

			}else{
			 	getPermission();
			 
			}
	    }

	   	if(name == "username"){
			if(getStorage(name)!= undefined && getStorage(name)!= null){
    			var data2 = getStorage("username");
    		 	$('.user.user-menu .user-name').html(data2);
    		 	
			}else{
		 		publicFun.getUserInfo();
			} 
	    }
	};
	judgeStorage("nav");
	judgeStorage("permission");

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
			return	
		}
		if(localStorage.length>0 && localStorage.getItem(name) ){
			var value = localStorage.getItem(name);
			//console.log('get---'+typeof(value))
			//console.log(value)
			return value;
		}
	}

	//localStorage.clear();
	/*判断当前页面刷新或离开或关闭*/
	window.onbeforeunload = function(){
		alert(1)
		BootstrapDialog.confirm({
			title:"提示",
			type:BootstrapDialog.TYPE_DANGER,
			size: BootstrapDialog.SIZE_SMALL,
			message:"确定离开此页面吗？",
			callback:function(res){

			}
		});	
	}

})

