$(function(){
	'use strict';
	var $ROLETABLE = $('#roleTable');
	var $MAIN = $('.main');
	/*从本地缓存获取菜单树*/
	//var menuTreeData = JSON.parse(getStorage("menuZtree"));
	var originMenuTreeData = JSON.parse(getStorage("menuZtree"));
	console.log(originMenuTreeData);

	//克隆数组对象 保留原数据对象 避免原始数据被修改
	var objDeepCopy = function (source) {
	    var sourceCopy = source instanceof Array ? [] : {};
	    for (var item in source) {
	        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
	    };
	    return sourceCopy;
	};

	var menuTreeData = objDeepCopy(originMenuTreeData);
	//console.log(menuTreeData)

	var rebuildToZtreeData;
	var initRole = function(){
		$ROLETABLE.bootstrapTable({
			locale: 'zh-CN',
			url:"/userPermission-controller/role/getList",
			//url:"http://192.168.1.69/userPermission-controller/common/getRoleList",
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	queryParams: function(params){
	     		return {
	     		pageNumber:	params.offset/params.limit+1,
	     		pageSize:params.limit,
	     		roleName:$('#roleName').val()
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
                {field: 'state',checkbox: true},                  	   
                {field: 'roleName',title: '角色名称',align: 'center',valign: 'middle'},
                {field: 'id',title: '操作',align: 'center',valign: 'middle',formatter:function(value){ 
                	/*根据权限，显示/隐藏功能按键*/                    	
                	return optShow(value);
                	
                }
                }
			]
		});
	}();

	

	/*按键的功能实现 增删改查*/
	var optPerform = function(){

		//判断是否存在【新增】		
		if($MAIN.find('#addBtn').length != 0){
			addRoleTree();
		};

		//判断是否存在【查询】
		if($MAIN.find('#searchBtn').length != 0){
			$("#searchBtn").click(function(){
				$ROLETABLE.bootstrapTable("refresh");
			});
		};
		//判断是否存在【批量删除】
		if($MAIN.find('#delGroupBtn').length!=0){
			delGroupRole();
		};

		//表格中的操作
		$ROLETABLE.on('click','.btn.btn-sm',function(){

			var roleId = $(this).attr('data-id');
			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				detailTree(roleId);
			};

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				
				var editName = $(this).parents('td').prev().html();
				//console.log(editName)
				$('.ztree_roleInput').val(editName);
				editRoleTree(roleId);
			};

			//判断是否为【删除】
			if($(this).is('#btn-del')){ 
				delTip("roleTable",roleId,"/userPermission-controller/role/delete","/userPermission-controller/role/getList");
			};

		});

	}();

	/*角色批量删除*/
	function delGroupRole(){
		$('#delGroupBtn').click(function(){
			//从table列表获取所有选中项
			var selectedItems = $ROLETABLE.bootstrapTable('getSelections');
       		console.log(selectedItems);
       		var idList = selectedItems.map(function(item){
       			return item.id;
       		});
       		console.log(idList);

       		$.ajax({
       			url:'/userPermission-controller/role/deleteBatch',
		   		type:'post',
		   		dataType:"json",
		   		data:{"idList":idList},
		   		success:function(res){
		   			if(res.success == true){
		   				successTip('删除成功！');
		   				$ROLETABLE.bootstrapTable('refresh', {url:'/userPermission-controller/role/getList'});
		   			};
		   		},
		   		error:function(){

		   		}
       		});
		});
		
	};
	/*角色详情
	@param id string
	*/
	function detailTree(id){
		ztreeShow("详情");
		//ajax获取数据 模拟数据
		
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
	    
	    function filterMenu(node){
	    	return (node.level == 2 && node.checked == false)
	    };

	    $.fn.zTree.init($('#treePermission'), setting, getRoleMenuFunsData(id)); 
	    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission');
	    var uncheckedNodes = zTreeObj.getNodesByFilter(filterMenu);
	    console.log(uncheckedNodes);
	    zTreeObj.hideNodes(uncheckedNodes);
	    
	    //必须有延迟才能实现初始化时全部展开
	    setTimeout(function(){
	    	zTreeObj.expandAll(true);
	    },500);

	    ztreeCancelLeave();
	};

	/*新增角色*/
	function addRoleTree(){

		$('#addBtn').click(function(){
			
			//初始化输入框			
			$('.ztree_roleInput').val("");

			ztreeShow('新增');
			
			
			initZtree(originMenuTreeData);
			console.log(originMenuTreeData);
			
	    	//checkAddRole($('.ztree_roleInput'),"/userPermission-controller/role/checkRoleNameExist");
	    	$('.ztree_roleInput').off("change");
	    	$('.ztree_roleInput').change(function(){
				var valueName = $(this).val();
				checkRole(valueName);
			});
	    	
	    	ztreeDateSave("/userPermission-controller/role/add");	
			
		});
	};
	/*修改角色
	  @param editId
	*/
	function editRoleTree(editId){
	
		ztreeShow('修改');
		//获取该角色所有信息
		initZtree(getRoleMenuFunsData(editId));		
		//initZtree('resources/json/listNewEditTree.json','get','123');
		//checkEditRole($('.ztree_roleInput'),"/manage/role/updateCheck",editId);		
		$('.ztree_roleInput').off("change")	;	
		$('.ztree_roleInput').change(function(){
			var valueName = $(this).val();
			checkRole(valueName,editId);
		});
		
		ztreeDateSave("/userPermission-controller/role/update",editId);
		
	};

    
    /*修改/详情时 获取菜单、功能、角色名
	@param editId	
    */
    function getRoleMenuFunsData(editId){
    	var arrZtree;
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
	   			console.log(res);
	   	
	   			if(res.success == true){
	   				var menuFunList = res.data.roleMenuFunctionList;
	   				/*两组数据做对比*/
	   				if(menuFunList !=null || menuFunList !=undefined){
	   					//arrZtree = detailRebuildToZtreeData(menuFunList,rebuildToZtreeData(menuTreeData));
	   					arrZtree = detailRebuildToZtreeData(menuFunList,menuTreeData);
	   						
	   				};
	   				
	   			};   		
	   		},
	   		error:function(){
	   			console.log("获取详情---后台报错")
	   		}
	    });
	    return arrZtree;
    };

	/*详情/修改时 对比menuTree 和 menuFunctionList 
	  找到存在id 重构成 {"id":id,"checked":"checked"}
	*/
	function doWitchDetailData(menuFunList){
		var newList = [];
		for(var i=0;i<menuFunList.length;i++){
			newList.push(menuFunList[i].menuId);

			if(menuFunList[i].funIdList.length!=0){
				for(var j=0;j<menuFunList[i].funIdList.length;j++){
				newList.push(menuFunList[i].funIdList[j]);

				};
			};
		};
		console.log(newList);
		return newList;
	};
	/*获取menuFunList下的所有id 与menuTree 做对比
	@param menuFunList 详情数据
	@param menuTreeData   已完成ztree数据重构的menuTree
	*/
    function detailRebuildToZtreeData(menuFunList,menuTree){
    	//console.log(menuTreeData);
    	var ids = doWitchDetailData(menuFunList);
    	var menuTreeData = objDeepCopy(menuTree); 
    	//console.log(ids,menuTreeData);
		for(var m=0;m<menuTreeData.length;m++){
			console.log(m + ':' + menuTreeData[m].id);
			for(var n=0;n<ids.length;n++){
				if(ids[n]==(menuTreeData[m].id) ||ids[n]==(menuTreeData[m].pId)){  
					console.log('xx:' + menuTreeData[m].id);
					menuTreeData[m]["checked"] = true;
					break;
				};
				/*else{
					arr[m]["checked"] = false;//便于【详情】隐藏无权限的菜单和功能
					break;
				}*/
			};
		};
		console.log("修改 获取匹配checked data-------");
    	console.log(menuTreeData);
		return menuTreeData;
    	  	
    };
	
	/*输入框内容有变化 则验证
	  @param  ajaxURL    /addCheck/updataCheck
	  @param  valueName
	  @param  editId      
	*/
	function checkRole(valueName,editId){
		var postData = {};
		//增
		if(arguments.length == 1){				
			postData = {"roleName":valueName};														
		};

		//改
		if(arguments.length == 2){				
			postData = {"roleName":valueName,"id":editId};							
		};
		sendCheck(postData);
		
	};


	/*发送角色名
	  @param valueName
	  @param ajaxURL
	  @param data   	
	*/
	function sendCheck(postData){

		//console.log(postData);		
		if(postData.roleName != ""){
			$.ajax({
    			url:"/userPermission-controller/role/checkRoleNameExist",
    			type:"get",
    			cache: false,
    			data:postData,
    			success:function(res){
    				checkCallback(res.success,res.data,res.code,res.msg);
    				
    			}
    		});
		
		}else{
			$('.correct').hide();
			//$('.error i').html('用户名不能为空');
			$('.error').show();
		};

		
	};
	/*后台反馈验证信息
	  @paran returnFlag
	  @param retrunCode
	  @param renturnMsg
	  @param valueName
	*/
	function checkCallback(returnFlag,returnData,returnCode,retrunMsg){

		if(returnFlag == true){
			if(returnData == false){
				$('.error').hide();
				//$('.correct i').html(retrunMsg);//返回的错误信息提示
				$('.correct').show();
			}else{
	
				$('.correct').hide();			
				$('.error').show();
				//$('.error i').html(retrunMsg);
			};										
		};
	};

	

	/*初始化权限树
	  @param zNodes 节点数据
	*/
	function initZtree(zNodes){

			$.fn.zTree.destroy('treePermission');

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
		    
		    $.fn.zTree.init($('#treePermission'), setting, zNodes); 

		    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission'); 
		    
		    //若当前点击【修改】 更新		    
		    var checkedNodes = zTreeObj.getNodesByParam("checked","true",null);
		    console.log(checkedNodes);
	    	if(checkedNodes.length !=0){	    			
	    	  zTreeObj.updateNode(checkedNodes);
	   		};
	    
		    
		   		    
		   	//必须有延迟才能实现初始化时全部展开	
		    setTimeout(function(){
		    	zTreeObj.expandAll(true);
		    },500);		
	};

	/*将新增或修改后的 menuFunction ztree数据结构 转换成后台所需的传参数据结构
	@param funcData 
	*/
	function rebuildSaveData(funcsData){

		var roleMenuFunctionList=[];
		if(funcsData.length != 0){

			//=>{pId.value:id.value}
			var menuFunc = funcsData.map(function(item){				
				if(item.pId != undefined || item.pId != null){						
					return JSON.parse('{"'+item.pId+'":"'+item.id+'"}');			
				};
				
			});

			//=>{menuId:pId,funcIdList:id}
			for(var i=0;i< menuFunc.length;i++){
				
				for(var key in menuFunc[i]){					
					var obj = {
					"menuId":key,
					"funIdList":menuFunc[i][key]
					};				
					
				};
				roleMenuFunctionList.push(obj);
				
			};
			//console.log(roleMenuFunctionList)
			var newroleMenuFunctionList = doWithData(roleMenuFunctionList);
			console.log(newroleMenuFunctionList);
			console.log(menuFunc);
			return newroleMenuFunctionList;
		
		};

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
						};
					};
					ele["funIdList"] = list;
					result.push(ele);
				};
			};
			return result;
		};
	};

	/* 保存新增/修改权限树
	@param ajaxURL
	@param id 
	*/
	function ztreeDateSave(ajaxURL,id){

		$('.btn_wrapper .tree_save').off("click");
		$('.btn_wrapper .tree_save').click(function(){
			/*角色名验证通过且权限树不为空 则保存并传递数据
			  否则，保存功能无效 并提示错误信息
			*/
			console.info("ztree save");
			var name = $('.ztree_roleInput').val();
			var ztreeObj = $.fn.zTree.getZTreeObj("treePermission");
        	var znodes = ztreeObj.getCheckedNodes(true);
        	
        	//角色名验证结果 判断retrunCode
        	var status1 = $('.ztree_tip .correct').css("display");
        	var status2 = $('.ztree_tip .error').css("display");
        	

        	console.log(name,status);
        	//var checkedMenuData = ztreeObj.getNodesByFilter(filterMenu);
        	var checkedFuncsData = ztreeObj.getNodesByFilter(filterFuncs);
        	//console.log( checkedMenuData)
        	console.log(checkedFuncsData);

        	function filterMenu(node){
        		return (node.type==0 && node.checked == true);
        	};

        	function filterFuncs(node){
        		return (node.type==1 && node.checked == true);	
        	};

        	//1.name值变化并通过验证  2.name未变化
        	if( (status1 != "none" && znodes.length != 0) || (status1 == "none" && status2 == "none" && name !="")){

        		//所选的权限菜单数组 id
        		// var per = [];
	         //    for(var i=0;i<znodes.length;i++){
	         //        per.push(znodes[i].id);
	         //    }
	            //console.log(per);
	            
	            sendSaveParam(ajaxURL,checkedFuncsData,name,id);

	            
	           

        	}else{
        		dangerTip("错误提示","新增内容不能为空！");	
        	};

            //console.log(name)
            //console.log(znodes)			
		});
		
		ztreeCancelLeave();
	};
	/*判断修改或新增 向后台传递不同类型的参数结构
	@param ajaxURL
	@param checkFuncsData
	@param name
	@param id
	*/
	function sendSaveParam(ajaxURL,checkedFuncsData,name,id){
		var param = {};
        if(arguments.length == 3){
        	param = {
           	"roleMenuFunctionList":rebuildSaveData(checkedFuncsData),/*重构向后台传递保存数据的结构*/
            "roleName" : name
        	};
        	
        };
        if(arguments.length == 4){
        	param = {
           	"roleMenuFunctionList":rebuildSaveData(checkedFuncsData),/*重构向后台传递保存数据的结构*/
            "roleName" : name,
            "id" : id
        	};
    		
        };
        console.log(param);
        sendSave(ajaxURL,param);
	};
	/*向后台发送保存数据
	@param ajaxURL
	@param param
	*/
	function sendSave(ajaxURL,param){
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
        				message:"成功！",
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
        			dangerTip("错误提示",res.msg+"！");
        		
        		};
        		

        	},
        	error:function(){
        		console.log("保存或修改----后台报错");
        	}
        });
	};

	//localStorage.clear();

});


