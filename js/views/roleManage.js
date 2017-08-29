$(function(){
	//'use strict';
	

	var initRole = function(){
		$('#roleTable').bootstrapTable({
			locale: 'zh-CN',
			//url:'resources/json/listRoles.json',
			url:"/manage/role/listRoles",
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	 //queryParams: role.queryParams,
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	paginationDetailHAlign: 'left',
	      	columns: [
                {field: 'state',checkbox: true,formatter:function(row,value,index){
                	//return role.disableDel(row,value,index);}
                }},                  	   
                {field: 'roleName',title: '角色名称',align: 'center',valign: 'middle'},
                {field: 'id',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
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
		if($('.main').find('#addBtn').length != 0){
			addRoleTree();
		}

		//判断是否存在【查询】
		if($('.main').find('#searchBtn').length != 0){
			searchRole();
		}

		//表格中的操作
		$('#roleTable').on('click','.btn.btn-sm',function(){

			var roleId = $(this).attr('data-id');
			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				detailTree();
			}

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				
				var editName = $(this).parents('td').prev().html();
				//console.log(editName)
				$('.ztree_roleInput').val(editName)

				editRoleTree(roleId,editName);
			}

			//判断是否为【删除】
			if($(this).is('#btn-del')){
				 
				BootstrapDialog.confirm({
					title:"提示",
					type:BootstrapDialog.TYPE_DANGER,
					size: BootstrapDialog.SIZE_SMALL,
					message:"确定删除吗？",
					callback:function(res){
						if(res){
							console.log(roleId)
							$.ajax({
								url:"resources/json/returnBack.json",
								data:roleId,
								success:function(res){
									if(res.returnCode == 0){
										successTip("删除成功！")
									}else{
										dangerTip("提示","删除失败！")
									}
								}
							})
						}
					}
				});	
			}	

		})

	}();

	/*角色详情*/
	function detailTree(){
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
	   		url:'resources/json/listDetailTree.json',
	   		dataType:"json",
	   		async : false,//必写
	   		success:function(res){
	   			console.log(res)
	   			zNodes = res.data	   		
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
			initZtree('resources/json/listNewTree.json','get','123');
	    	//checkAddRole($('.ztree_roleInput'),"/manage/role/addCheck");
	    	$('.ztree_roleInput').off("change")
	    	$('.ztree_roleInput').change(function(){
				var valueName = $(this).val();
				checkRole("/manage/role/addCheck",valueName);
			})
	    	
	    	ztreeDateSave("resources/json/addRole.json");	
			
		})
	}

	/*修改角色
	  @param editId
	  @param editName
	*/
	function editRoleTree(editId,editName){
	
		ztreeShow('修改');
		initZtree('resources/json/listNewEditTree.json','get','123');
		//checkEditRole($('.ztree_roleInput'),"/manage/role/updateCheck",editId);		
		$('.ztree_roleInput').off("change")	;	
		$('.ztree_roleInput').change(function(){
			var valueName = $(this).val();
			checkRole("/manage/role/updateCheck",valueName,editId)
		})
		
		ztreeDateSave("resources/json/updateRole.json");
		
	}

	/*查询角色*/
	function searchRole(){
		
		$('#searchBtn').click(function(){
			$("#roleTable").bootstrapTable('refreshOptions', {
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
    			type:"post",
    			//contentType: 'application/json;charset=utf-8',
    			cache: false,
    			//async : false,
    			data:postData,
    			success:function(res){
    				var returnCode = res.returnCode;
    				var returnMsg = res.message;
    				checkCallback(returnCode,returnMsg);
    				
    			}
    		})
		
		}else{
			$('.correct').hide();
			//$('.error i').html('用户名不能为空');
			$('.error').show()
		}

		
	}
	/*后台反馈验证信息
	  @param retrunCode
	  @param renturnMsg
	  @param valueName
	*/
	function checkCallback(returnCode,retrunMsg){

		if(returnCode == 0){
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
	function initZtree(ajaxURL,method,id){
			var zNodes =[];
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
		    
		    var ajaxObj = {
		   		url:ajaxURL,
		   		type:method,
		   		dataType:"json",
		   		async : false,//必写
		   		success:function(res){
		   			console.log(res)

		   			//zNodes = res.menus;
		   			zNodes = res.data
		   			//callback();
		   		}
		    }
		    var params = {
		   		data:{"id":id}
		    }

		    if(method == "get"){
		   		$.ajax(ajaxObj)
		    }
		    if(method == "post"){
		   		$.ajax($.extend(ajaxObj,params))
		    }
		   
		   	//console.log($.extend(ajaxObj,params))

		    $.fn.zTree.init($('#treePermission'), setting, zNodes); 

		    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission'); 
		    //必须有延迟才能实现初始化时全部展开
		    setTimeout(function(){
		    	zTreeObj.expandAll(true);
		    },500);		
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
        	console.log(znodes)

        	//1.name值变化并通过验证  2.name未变化
        	if( (status1 != "none" && znodes.length != 0) || (status1 == "none" && status2 == "none" && name !="")){

        		//所选的权限菜单数组 id
        		var per = [];
	            for(var i=0;i<znodes.length;i++){
	                per.push(znodes[i].id);
	            }
	            //console.log(per);
	            var param = {
	               	permission:per,
	                name : name
	            }
	            console.log(param)

	            $.ajax({
	            	url:ajaxURL,
	            	dataType:"json",
	            	data:param,
	            	success:function(res){
	            		if(res.returnCode == 0){

	            			BootstrapDialog.show({
	            				title:"提示",
	            				type:BootstrapDialog.TYPE_SUCCESS,
	            				size: BootstrapDialog.SIZE_SMALL,
	            				message:res.message,
	            				buttons:[{
	            					label:"确定",
	            					action:function(dialog){
	            						dialog.close();
	            						ztreeSaveLeave();
	            						$("#roleTable").bootstrapTable('refresh', {url:'/manage/role/listRoles'});
	            						
	            					
	            					}
	            				}]
	            			});

	            		}

	            		if(res.returnCode == 1){
	            			dangerTip("错误提示","修改失败！")
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

	/*右侧权限树显示		   
	  @param title 新增/修改
	*/
	function ztreeShow(title){
		$('.ztree_title').html(title);

		if(title == "详情"){
			$('.ztree_roleInput').hide();
			$('.ztree_wrapper .tree_save').hide();
		}else{
			$('.ztree_roleInput').show();
			$('.ztree_wrapper .tree_save').show();
		}

		
		$('.ztree_tip').children().css('display','none');
		$('.ztree_wrapper').removeClass('fadeOutRight')
		$('.table_wrapper').removeClass('col-lg-12').addClass('col-lg-9');
		$('.ztree_wrapper').addClass('slideInRight').fadeIn();

	}
	/*右侧权限树消失
	  @param elem  btn-success/btn-cancel 
	*/
	function ztreeSaveLeave(){
		
			setTimeout(function(){				
				$('.table_wrapper').removeClass('col-lg-9').addClass('col-lg-12');
			},1500)

			setTimeout(function(){				
				$('.ztree_wrapper').removeClass('slideInRight').fadeOut();
			},500)
			
	}

	function ztreeCancelLeave(){
		$('.btn_wrapper').on("click",".btn-primary.tree_cancel",function(){
			setTimeout(function(){				
				$('.table_wrapper').removeClass('col-lg-9').addClass('col-lg-12');
			},1500)

			setTimeout(function(){				
				$('.ztree_wrapper').removeClass('slideInRight').fadeOut();
			},500)
		})
	}

});