$(function(){
	'use strict';
	var $ROLETABLE = $('#roleTable');
	var $MAIN = $('.main');
	var initRole = function(){
		$ROLETABLE.bootstrapTable({
			locale: 'zh-CN',
			//url:'resources/json/listRoles.json',
			url:"/userPermission-controller/role/getList",
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	queryParams: function(params){
	     		return {
	     		pageNumber:	params.offset/params.limit+1,
	     		pageSize:params.limit
	     		}	     		
	     	},
	     	pageNumber:1,
	     	pageSize:10,
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	paginationDetailHAlign: 'left',
	      	columns: [
                {field: 'state',checkbox: true,formatter:function(row,value,index){
                	
                	}
                },                  	   
                {field: 'roleName',title: '角色名称',align: 'center',valign: 'middle'},
                {field: 'id',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
                	//console.log(value)
                	//console.log(value)id 
                	/*根据权限，显示/隐藏功能按键*/                    	
                	return optShow(value);
                	
                }
                }
			]
		})
	}();



	/*按键的功能实现 增删改查*/
	var optPerform = function(){

		//判断是否存在【新增】		
		if($MAIN.find('#addBtn').length != 0){
			addRoleTree();
		}

		//判断是否存在【查询】
		if($MAIN.find('#searchBtn').length != 0){
			searchRole();
		}
		//判断是否存在【批量删除】
		if($MAIN.find('#delGroupBtn').length!=0){
			delGroupRole();
		}

		//表格中的操作
		$ROLETABLE.on('click','.btn.btn-sm',function(){

			var roleId = $(this).attr('data-id');
			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				detailTree(roleId);
			}

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				
				var editName = $(this).parents('td').prev().html();
				//console.log(editName)
				$('.ztree_roleInput').val(editName)

				editRoleTree(roleId);
			}

			//判断是否为【删除】
			if($(this).is('#btn-del')){ 
				delTip("roleTable",roleId,"/userPermission-controller/role/delete","/userPermission-controller/role/getList");
			}

		})

	}();

	/*角色批量删除*/
	function delGroupRole(){
		$('#delGroupBtn').click(function(){
			var selectedItems = $ROLETABLE.bootstrapTable('getSelections');
       		console.log(selectedItems)
       		var idList = selectedItems.map(function(item){
       			return item.id
       		})
       		console.log(idList)

       		$.ajax({
       			url:'/userPermission-controller/role/deleteBatch',
		   		type:'post',
		   		dataType:"json",
		   		contentType:"application/json;charset=utf-8",
		   		data:JSON.stringify(idList),
		   		success:function(res){
		   			if(res.success == true){
		   				successTip('删除成功！');
		   				$ROLETABLE.bootstrapTable('refresh', {url:'/userPermission-controller/role/getList'});
		   			}
		   		},
		   		error:function(){

		   		}
       		})
		})
		
	}
	/*角色详情
	@param id string
	*/
	function detailTree(id){
		ztreeShow("详情");
		//ajax获取数据 模拟数据
		var zNodes=[];
	    var setting = {
	   		view:{
	   			showIcon:false
	   		},
		   	data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: 0
				}
			}
	    };
	    
	  	$.ajax({
	   		
	   		url:'/userPermission-controller/role/getDetail',
	   		type:"get",
	   		dataType:"json",
	   		data:{
	   			"id":id
	   		},
	   		async : false,//必写
	   		success:function(res){
	   			console.log(res)
	   			//zNodes = res.data	   		
	   		},
	   		error:function(){
	   			console.log("获取详情---后台报错")
	   		}
	    })
	   
	   
	   	//console.log($.extend(ajaxObj,params))

	    $.fn.zTree.init($('#treePermission'), setting, zNodes); 

	    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission'); 
	    // var allNodes = zTreeObj.getNodes();
	    //  zTreeObj.hideNodes(allNodes);
	    var checkedNodes = zTreeObj.getNodesByParam("limit","false",null);
	    zTreeObj.hideNodes(checkedNodes);
	    //必须有延迟才能实现初始化时全部展开
	    setTimeout(function(){
	    	zTreeObj.expandAll(true);
	    },500);
	}

	/*新增角色*/
	function addRoleTree(){

		$('#addBtn').click(function(){
			
			//初始化输入框			
			$('.ztree_roleInput').val("");

			ztreeShow('新增');
			getMenuTree();
			//initZtree('resources/json/listNavs.json','get');
	    	//checkAddRole($('.ztree_roleInput'),"/userPermission-controller/role/checkRoleNameExist");
	    	$('.ztree_roleInput').off("change")
	    	$('.ztree_roleInput').change(function(){
				var valueName = $(this).val();
				checkRole("/userPermission-controller/role/checkRoleNameExist",valueName);
			})
	    	
	    	ztreeDateSave("/userPermission-controller/role/add");	
			
		})
	}
	/*修改角色
	  @param editId
	  @param editName
	*/
	function editRoleTree(editId){
	
		ztreeShow('修改');
		//获取该角色所有信息
		getRoleMenuFunsData(editId)
		
		//initZtree('resources/json/listNewEditTree.json','get','123');
		//checkEditRole($('.ztree_roleInput'),"/manage/role/updateCheck",editId);		
		$('.ztree_roleInput').off("change")	;	
		$('.ztree_roleInput').change(function(){
			var valueName = $(this).val();
			checkRole("/userPermission-controller/role/checkRoleNameExist",valueName,editId)
		})
		
		ztreeDateSave("resources/json/updateRole.json");
		
	}
    /*所有菜单功能*/
    function getMenuTree(){
    	$.ajax({
	   		//url:'resources/json/listDetailTree.json',
	   		url:'/userPermission-controller/menu/tree',
	   		type:"get",
	   		dataType:"json",
	   		async : false,//必写
	   		success:function(res){
	   			console.log(res)
	   	
	   			if(res.success == true){
	   				var data = res.data;
	   				rebuildToZtreeData(data);	
	   			}   		
	   		},
	   		error:function(){
	   			console.log("获取详情---后台报错")
	   		}
	    })
    }
    /*修改/详情时 获取菜单、功能、角色名*/
    function getRoleMenuFunsData(editId){
    	$.ajax({
	   		//url:'resources/json/listDetailTree.json',
	   		url:'/userPermission-controller/role/getDetail',
	   		type:"get",
	   		dataType:"json",
	   		data:{
	   			"id":editId
	   		},
	   		async : false,//必写
	   		success:function(res){
	   			console.log(res)
	   	
	   			if(res.success == true){
	   				var menuFunList = res.data.roleMenuFunctionList;
	   				detailRebuildToZtreeData(menuFunList);	
	   			}   		
	   		},
	   		error:function(){
	   			console.log("获取详情---后台报错")
	   		}
	    })
    }
    /*创建类 用于重构菜单树数据结构*/
    function CreateSeriesItem(pId,id,name,url,type){
    	this.pId = pId;
    	this.id = id;
        this.name = name;
        this.url = url;
        this.type = type;//0表示菜单 1表示功能，以便在传参过程中区分id类型
        //this.isParent = isParent;        
        //this.children = children;
        
    }
    function SeriesItem(){
        CreateSeriesItem.apply(this,arguments);
    }
    SeriesItem.prototype = new CreateSeriesItem();
    SeriesItem.prototype.constructor = SeriesItem;

    /*新增时 menu重新构造ztree型数据结构
	*@param data menu/list 	
    */	
    function rebuildToZtreeData(data){

    	var arr = [];

		for(var i=0;i<data.length;i++){
			//自身是父节点
			if(data[i].parentId == null ){
				
			var obj = new SeriesItem(0,data[i].id,data[i].menuName,data[i].menuUrl,0)
			arr.push(obj);
		
			if(data[i].subMenus !== null){
				//二级菜单子节点	
					for(var j=0;j<data[i].subMenus.length;j++){

					   var subObj = new SeriesItem(data[i].id,data[i].subMenus[j].id,data[i].subMenus[j].menuName,data[i].subMenus[j].menuUrl,0)
					   arr.push(subObj);

					    //二级菜单的功能子节点	
					 	if(data[i].subMenus[j].funcs !== null){
							for(var n=0;n<data[i].subMenus[j].funcs.length;n++){

								var subFuncsObj = new SeriesItem(data[i].subMenus[j].id,data[i].subMenus[j].funcs[n].id,data[i].subMenus[j].funcs[n].funName,data[i].subMenus[j].funcs[n].funUrl,1)
						  		arr.push(subFuncsObj);
							}
								
						}

					}		   							

			}else{
				if(data[i].funcs!== null ){
						//一级菜单对应的功能子节点	
						for(var k=0;k<data[i].funcs.length;k++){
							var funcsObj = new SeriesItem(data[i].id,data[i].funcs[k].id,data[i].funcs[k].funName,data[i].funcs[k].funUrl,1)
					  	arr.push(funcsObj);
						}
					}
			}
					   						
			}

		}		
		console.log(arr)
		//初始化ztree
		initZtree(arr);
    }

	/*详情/修改时 重新将数据还原成ztree默认格式*/
    function detailRebuildToZtreeData(data){
    	
    }

	/*查询角色*/
	function searchRole(){
		
		$('#searchBtn').click(function(){
			$ROLETABLE.bootstrapTable('refreshOptions', {
				url:'/manage/role/listRoles',
				queryParams:queryParams
			});	
			/*$.ajax({
				url:"/manage/role/selectRoles",
				dataType:"json",
				type:"get",
				data:queryParams,
				success:function(res){
					console.log(res.returnCode)

					if(res.returnCode == 0){						
						$("#roleTable").bootstrapTable('refresh', {
							url:'/manage/role/listRoles'
							
						});						
					}

					if(res.returnCode == 1){
						BootstrapDialog.alert({
		        			title:"错误提示",
		        			type:BootstrapDialog.TYPE_DANGER,
		        			size: BootstrapDialog.SIZE_SMALL,
		        			message:"查询失败！"
		        		});	
					}
					
				},
				error:function(){
					console.info('后台报错')
				}
			})*/
		})

	} 
	/*查询参数*/
	function queryParams(params){

		var value = $('#roleSearch input[type=text]').val();
		var temp = {
			roleName:value,
			limit:params.limit,
			offset:params.offset,
							
		}
		return temp;
	}
	
	/*输入框内容有变化 则验证
	  @param  ajaxURL    /addCheck/updataCheck
	  @param  valueName
	  @param  editId      
	*/
	function checkRole(ajaxURL,valueName,editId){
		var postData = {};
		//增
		if(arguments.length == 2){				
			postData = {"roleName":valueName};														
		}

		//改
		if(arguments.length == 3){				
			postData = {"roleName":valueName,"roleId":editId};							
		}

		sendCheck(ajaxURL,postData);
		
	}


	/*发送角色名
	  @param valueName
	  @param ajaxURL
	  @param data   	
	*/
	function sendCheck(ajaxURL,postData){

		console.log(ajaxURL,postData)		
		if(postData.roleName != ""){
			$.ajax({
    			//url:"resources/json/addCheck.json",
    			url:ajaxURL,
    			type:"get",
    			//contentType: 'application/json;charset=utf-8',
    			cache: false,
    			//async : false,
    			data:postData,
    			success:function(res){
    				var returnFlag = res.success;
    				var returnCode = res.code;
    				var returnMsg = res.msg;
    				checkCallback(returnFlag,returnCode,returnMsg);
    				
    			}
    		})
		
		}else{
			$('.correct').hide();
			//$('.error i').html('用户名不能为空');
			$('.error').show()
		}

		
	}
	/*后台反馈验证信息
	  @paran returnFlag
	  @param retrunCode
	  @param renturnMsg
	  @param valueName
	*/
	function checkCallback(returnFlag,returnCode,retrunMsg){

		if(returnFlag == true){
			$('.error').hide();
			//$('.correct i').html(retrunMsg);//返回的错误信息提示
			$('.correct').show();							
		}else{
			$('.correct').hide();
			//$('.error i').html(retrunMsg);
			$('.error').show();
		}
	}

	

	/*初始化权限树
	  @param ajaxURL 
	  @param method  get/post
	  @param id
	*/
	function initZtree(/*ajaxURL,method,id*/zNodes){
			
		    //ajax获取数据 模拟数据
		    var setting = {
		   		view:{
		   			showIcon:false,
		   			fontCss:{}
		   		},
			   	check:{
			   		enable:true,
			   		chkboxType :{ "Y" : "ps", "N" : "ps" },
			   		chkStyle:"checkbox"
			   	},
			   	data: {
					simpleData: {
						enable: true,
						idKey: "id",
						pIdKey: "pId",
						rootPId: 0
					}
				}
		    };
		    
		   //  var ajaxObj = {
		   // 		url:ajaxURL,
		   // 		type:method,
		   // 		dataType:"json",
		   // 		async : false,//必写
		   // 		success:function(res){
		   // 			//console.log(res)

		   // 			//zNodes = res.menus;
		   // 			zNodes = res.data
					// console.log("获得数据");
					// console.log(zNodes);
		   // 			//callback();
		   // 		}
		   //  }
		   //  var params = {
		   // 		"id":id
		   //  }

		   //  if(method == "get"){
		   // 		$.ajax(ajaxObj)
		   //  }
		   //  if(method == "post"){
		   // 		$.ajax($.extend(ajaxObj,params))
		   //  }
		   
		   	//console.log($.extend(ajaxObj,params))

		    $.fn.zTree.init($('#treePermission'), setting, zNodes); 

		    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission'); 
		    //必须有延迟才能实现初始化时全部展开
		    setTimeout(function(){
		    	zTreeObj.expandAll(true);
		    },500);		
	}

	function rebuildSaveData(funcsData){

		var roleMenuFunctionList=[];
		if(funcsData.length != 0){

			//=>{pId.value:id.value}
			var menuFunc = funcsData.map(function(item){				
				if(item.pId != undefined || item.pId != null){						
					return JSON.parse('{"'+item.pId+'":"'+item.id+'"}')				
				}
				
			});

			//=>{menuId:pId,funcIdList:id}
			for(var i=0;i< menuFunc.length;i++){
				
				for(var key in menuFunc[i]){					
					var obj = {
					"menuId":key,
					"funIdList":menuFunc[i][key]
					}				
					
				}
				roleMenuFunctionList.push(obj)
				
			}
			//console.log(roleMenuFunctionList)
			var newroleMenuFunctionList = doWithData(roleMenuFunctionList);
			console.log(newroleMenuFunctionList)
			console.log(menuFunc)
			return newroleMenuFunctionList;
		
		}

		//=>去重 组合
		function doWithData(data){
			var result = [];
			var exists = [];
			for(var i=0; i<data.length; i++){
				var ele = {};
				if(exists.indexOf(data[i].menuId) < 0){
					exists.push(data[i].menuId);
					ele["menuId"] = data[i].menuId;
					var list = [];
					for(var j=0; j<data.length; j++){
						if(data[j].menuId == ele["menuId"]){
							list.push(data[j].funIdList);
						}
					}
					ele["funIdList"] = list;
					result.push(ele);
				}
			}
			return result;
		}
	}



	/* 保存新增/修改权限树
	@param ajaxURL 
	*/
	function ztreeDateSave(ajaxURL){

		$('.btn_wrapper .tree_save').off("click");
		$('.btn_wrapper .tree_save').click(function(){
			/*角色名验证通过且权限树不为空 则保存并传递数据
			  否则，保存功能无效 并提示错误信息
			*/
			console.info("ztree save")
			var name = $('.ztree_roleInput').val();
			var ztreeObj = $.fn.zTree.getZTreeObj("treePermission");
        	var znodes = ztreeObj.getCheckedNodes(true);
        	
        	//角色名验证结果 判断retrunCode
        	var status1 = $('.ztree_tip .correct').css("display");
        	var status2 = $('.ztree_tip .error').css("display")
        	

        	console.log(name,status)
        	//var checkedMenuData = ztreeObj.getNodesByFilter(filterMenu);
        	var checkedFuncsData = ztreeObj.getNodesByFilter(filterFuncs)
        	//console.log( checkedMenuData)
        	console.log(checkedFuncsData)

        	function filterMenu(node){
        		return (node.type==0 && node.checked == true)
        	}

        	function filterFuncs(node){
        		return (node.type==1 && node.checked == true)	
        	}

        	//1.name值变化并通过验证  2.name未变化
        	if( (status1 != "none" && znodes.length != 0) || (status1 == "none" && status2 == "none" && name !="")){

        		//所选的权限菜单数组 id
        		// var per = [];
	         //    for(var i=0;i<znodes.length;i++){
	         //        per.push(znodes[i].id);
	         //    }
	            //console.log(per);
	            var param = {
	               	"roleMenuFunctionList":rebuildSaveData(checkedFuncsData),/*重构向后台传递保存数据的结构*/
	                "roleName" : name
	            }
	            console.log(param)

	            $.ajax({
	            	url:ajaxURL,
	            	dataType:"json",
	            	type:"post",
	            	data:JSON.stringify(param),
	            	contentType:"application/json;charset=utf-8",		
	            	success:function(res){
	            		console.log(res.data);
	            		if(res.success == true){
	            			BootstrapDialog.show({
	            				title:"提示",
	            				type:BootstrapDialog.TYPE_SUCCESS,
	            				size: BootstrapDialog.SIZE_SMALL,
	            				message:"添加成功！",
	            				buttons:[{
	            					label:"确定",
	            					action:function(dialog){
	            						dialog.close();
	            						ztreeSaveLeave();
	            						$ROLETABLE.bootstrapTable('refresh', {url:'/userPermission-controller/role/getList'});
	            					}	
	            				}]
	            			});

	            		}else{
	            			dangerTip("错误提示",res.msg+"！")
	            		
	            		}
	            		

	            	},
	            	error:function(){
	            		console.log("保存或修改----后台报错")
	            	}
	            })

	            

        	}else{
        		dangerTip("错误提示","新增内容不能为空！")	
        	}

            //console.log(name)
            //console.log(znodes)			
		})
		
		ztreeCancelLeave();
	}



});