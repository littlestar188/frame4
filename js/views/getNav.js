/*created by caixx on 20170823*/
$(function(){
	var initNavZtree = function(data){
			var zNodes = [];
			
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
		     	var zTree = $.fn.zTree.getZTreeObj("leftTreeNav");		
				zTree.expandNode(treeNode);

			}

			function addDiyDom(treeId, treeNode){
				if (treeNode.parentNode && treeNode.parentNode.id!=0) return;
				var aObj = $("#" + treeNode.tId + '_a');

				//console.log(treeNode.children())
				//console.log(treeNode,treeNode.id)
				if(treeNode.id != undefined && treeNode.id !=null){
					//aObj.attr('href',treeNode.link);
					aObj.removeAttr("target");

				}
				
				

			}

			function filter(node){

			}
			

			zNodes = data;
			$(document).ready(function(){
		    	var treeObj = $.fn.zTree.init($('#leftTreeNav'), setting, zNodes);
		    	var nodes = treeObj.getNodesByParam("level", "2");//获取第三级的功能子节点 并隐藏
		    	console.log(nodes)
		    	treeObj.hideNodes(nodes);
		    	
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

		console.log('set------')
		console.log(typeof(value))
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
			console.log('get---'+typeof(value))
			console.log(value)
			return value;
		}
	}

})
