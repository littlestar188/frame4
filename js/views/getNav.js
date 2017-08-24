/*created by caixx on 20170823*/
$(function(){

	var initNavZtree = function(data){
			var zNodes= [];

			
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
						name:"name",
						link:"link"
					}
				},
				callback:{
					onClick:onClick
				}
		    };

		    
		   
		    function onClick(e,treeId, treeNode) {
		     	var zTree = $.fn.zTree.getZTreeObj("leftTreeNav");		
				zTree.expandNode(treeNode);

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
					//console.log($(this).parent())
				})
				
				console.log(bObj)
				//console.log(treeNode.children())
				//console.log(treeNode,treeNode.id)
				if(treeNode.id != undefined && treeNode.id !=null){
					
					aObj.removeAttr("target");

				}
				
				
				

			}

			

			zNodes = data;
			
			$(document).ready(function(){
				

		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);

		    	var firstNodes = treeObj.getNodesByParam("level","1");
		    	// 从树对象中获取一级导航的code 创建url字符串
		    	var urls = $.map(firstNodes,function(item){
		    		if( item.code != undefined){

		    			return item.code+".html"		    		
		    		}
		    	})


		    	console.log(firstNodes)
		    	console.log(urls)

		    	//获取第三级的功能子节点 并隐藏
		    	var secondNodes = treeObj.getNodesByParam("level", "2");
		    	//console.log(nodes)
		    	treeObj.hideNodes(secondNodes);
		    	
		    })

		   
		
	};

	function getNav(){
		$.ajax({
			url:'resources/json/listNavTree.json',
			dataType:"json",
			//async : false,
			success:function(data){
				console.log('初始化菜单-----')
				console.log(data);
				var data = data.data;				
				//本地存储导航数据
				setStorage("nav",data);
				judgeStorage('nav');
			},
			error:function(){
				console.log('左侧导航------后台出错');
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

	/*写入本地存储数据
	* @param name  命名
	* @param data  
	*/
	function setStorage(name,data){
		//判断json结构不严谨 
		var value = typeof(data) == "object" ? JSON.stringify(data):data;

		console.log('set sessionstorage----')
		//console.log(typeof(value))
		if(window.sessionStorage){
			sessionStorage.setItem(name,value);	
		}else{
			alert('浏览器不支持sessionStorage');
			return
		}	
	}
	/*获取本地存储的数据
	*@param name 命名
	*/
	function getStorage(name){

		if(! window.sessionStorage){
			alert('浏览器不支持sessionStorage');
			return	
		}
		if(sessionStorage.length>0 && sessionStorage.getItem(name) ){
			var value = sessionStorage.getItem(name);
			//console.log('get---'+typeof(value))
			//console.log(value)
			return value;
		}
	}

})

