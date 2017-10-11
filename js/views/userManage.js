$(function(){
	'use strict';
	var $USERMODAL =$('#userModal');
	var $USERTABLE = $('#userTable');
	//user input
	var $USERNAME = $('#userName');
	var $PHONE =$('#phone');
	var $MAIL = $('#mail');
	var $MAIN = $('.main');
	//var userData = {};
	var initUsers = function(){
		$USERTABLE.bootstrapTable({
			locale: 'zh-CN',
			url:"/userPermission-controller/user/getList",	     	
	     	method:"post",
	     	contentType:"application/json;charset=utf-8",
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	sidePagination:'server',
	      	height: '',
	     	queryParams: function(params){
	     		
	     		var paramResult = {	
	     			pageNumber:	params.offset/params.limit+1,
	     			pageSize:params.limit,
	     			userName:$('#username').val()
	     		}

	     		console.log(paramResult)	
	     		
	     		return JSON.stringify(paramResult)	     		
	     	},
	     	
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	columns: [
                {field: 'state',checkbox: true},
                {field: 'userName',title: '用户名称',align: 'middle'},
                {field: 'roleName',title: '角色名称',valign: 'middle'},
                {field: 'phone',title: '手机',valign: 'middle'},
                {field: 'updateDate',title: '更新日期',valign: 'middle',formatter:function(value){
                	return getSmpFormatDate(value,true)
                }},
                {field: 'updateUser',title: '更新者',valign: 'middle'},
                {field: 'remark',title: '备注',valign: 'middle'},
               	{field: 'id',title: '操作',align:"center",valign: 'middle',formatter:function(value){
                	return optShow(value);
                }
                }
			]
		})
	}();
	
	/*table中的按键功能实现

	*/
	var optPerform = function(){
		//判断是否存在【新增】		
		if($MAIN.find('#addBtn').length != 0){

			$('#addBtn').click(function(){					
				addUser();
			});		
		};

		//判断是否存在【查询】
		if($MAIN.find('#searchBtn').length != 0){

			$('#searchBtn').click(function(){
				$USERTABLE.bootstrapTable('refresh');
			});
			
		};

		//判断是否存在【批量删除】
		if($MAIN.find('#delGroupBtn').length!=0){
			delGroupRole();
		};
		
		$USERTABLE.on('click','.btn.btn-sm',function(){

			var userId = $(this).attr("data-id");

			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				
				detailUser(userId);
			};

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				// var editName = $(this).parents('td:nth-child(2)').prev().html();
				editUser(userId);

			};

			//判断是否为【删除】
			if($(this).is('#btn-del')){
				delTip("userTable",userId,"/userPermission-controller/user/delete","/userPermission-controller/user/getList");

			};

			//黑名单	
			if($(this).is("#btn-limit")){

			};	

		})

	}();
	/*批量删除用户*/
	function delGroupRole(){
		$('#delGroupBtn').click(function(){
			var selectedItems = $USERTABLE.bootstrapTable('getSelections');
       		console.log(selectedItems);
       		var idList = selectedItems.map(function(item){
       			return item.id
       		});
       		console.log(idList);

       		$.ajax({
       			url:'/userPermission-controller/user/deleteBatch',
		   		type:'post',
		   		dataType:"json",
		   		data:{"idList":idList},
		   		success:function(res){
		   			if(res.success == true){
		   				successTip('删除成功！');
		   				$USERTABLE.bootstrapTable('refresh', {url:'/userPermission-controller/user/getList'});
		   			}
		   		},
		   		error:function(){
		   			console.log("后台出错")	
		   		}
       		});
		});
		
	}
	/*新增用户*/
	function addUser(){

		clearModalData();
		$('.modal-title').html('新增用户');
		$('#userForm').show();
		$('#detailUser').hide();
		$("#saveBtn_add").show()
		$("#saveBtn_edit").hide();
		$('#userModal').modal({show:true});
		getSelectRoleList();

		$USERMODAL.on('shown.bs.modal',function(){
			saveUser('add');
		});
		
	}

	/*用户修改*/
	function editUser(userId){

		clearModalData();
		$('.modal-title').html('修改用户');
		$('#userForm').show();
		$('#detailUser').hide();
		$("#saveBtn_add").hide();
		$("#saveBtn_edit").show();
				
		$.ajax({
			url:"/userPermission-controller/user/getDetail",			
			type:"post",
			dataType:"json",
			data:{"id":userId},
			async : false,
			success:function(res){
				if(res.success == true){
					console.log(res.data.userName);
					$('#userName').val(res.data.userName);
					$('#phone').val(res.data.phone);

					//$('#rolename').select2('val',res.data.roleName);角色名称写入
					$('#updateDate').val(res.data.updateDate);
					$USERMODAL.modal({show:true});
				};
			}
		});

		saveUser('edit',userId);
			
	}; 
	/*用户详情*/
	function detailUser(userId){
		
		$('.modal-title').html('用户详情');
		$('#userForm').hide();
		$("#saveBtn_add").hide()
		$("#saveBtn_edit").hide();
		//显示详情列表
		$('#detailUser').show();		

		$.ajax({
			url:"/userPermission-controller/user/getDetail",			
			type:"post",
			dataType:"json",
			data:{"id":userId},
			success:function(res){
				if(res.success == true){
					
					var tr = $('<tr><td></td><td></td></tr>');
					$.each(res.data,function(i,n){
						var trc = tr.clone();
						trc.find('td:nth-child(1)').text(i);						
						trc.find('td:nth-child(2)').text(n);
						//console.log(i,n)
						trc.appendTo('#detailUser>tbody');
						//console.log(trc)
					});

					$/*('#detailUser>tbody').find*/('tr>td:nth-child(1)').each(function(){
						var txt = $(this).text();
						var newTxt = redefine(txt);
						$(this).text(newTxt);
						console.log(txt);
					});
				}
			}
		});

		$USERMODAL.modal({show:true});
		$USERMODAL.on('hidden.bs.modal',function(){
			$('#detailUser tbody ').find('tr').remove();
		});
    };

    /*select框  获取用户所属的角色名称*/
	function getSelectRoleList(){
		$('#rolename').empty();		
		$.ajax({
   			url:'/userPermission-controller/common/getRoleList',
	   		type:'get',
	   		dataType:"json",
	   		success:function(res){
	   			console.log(res);
	   			if(res.success == true){
	   				var optionStr ="";	
	   				for(var i=0;i<res.data.length;i++){

	   					optionStr +='<option value="'+res.data[i].id+'">'+res.data[i].roleName+'</option>';
	   				};
	   				console.log(optionStr);
	   				$('#rolename').append(optionStr).select2({
	   					placeholder: "选择角色",
	   					allowClear: true
	   				});
	   				//去除多余的空option

	   				
	   			};
	   		},
	   		error:function(){

	   		}
		});
	};
	/*保存用户新增/修改信息
     @param flag string add/edit
     @param userId		
	*/	
	function saveUser(flag,userId){	
			//表单中所有的 input select 输入框
			//var $INPUT = $('.main').find('#userForm .form-group').children().not('label').children().not('.select2-container');		
			/*新增保存*/
			if(flag=="add"){
				var checkUserList=[];
				$('.main').find('#userForm input').each(function(){
					$(this).off('change');					
					$(this).change(function(){
						//校验输入内容 除了角色名称	
						var checkUserObj = checkExist($(this).attr('id'),$(this).val());
						console.log(checkUserObj);
						if(checkUserObj == null){
							dangerTip("提示",$(this).parent().prev().html()+'【'+$(this).val()+'】重复！')
							return;
						}
						checkUserList.push(checkUserObj);
					})
					
					console.log(checkUserList);		
				});

				$("#saveBtn_add").off('click');
				$("#saveBtn_add").on("click",function(){
					var newCheckObj={};
					console.log($('#rolename').val().toString());
					for(var i=0;i<checkUserList.length;i++){
						for(var key in checkUserList[i]){							
							newCheckObj[key] = checkUserList[i][key];
							newCheckObj["roleId"] = $('#rolename').val().toString();							
						};
					};

					$.ajax({
						url:"/userPermission-controller/user/add",			
						type:"post",
						dataType:"json",
						contentType:"application/json;charset=utf-8",
						data:JSON.stringify(newCheckObj),
						async : false,
						success:function(res){
							if(res.success == true){
								successTip("添加成功！");
								$USERMODAL.modal('hide').delay(500);														
								$USERTABLE.bootstrapTable('refresh', {url:'/userPermission-controller/user/getList'});
					      			
							}else{

								dangerTip("提示",res.msg+"！");
							};
						}
					});
					
				});	
			};
			
			/*修改保存*/
			if(flag=="edit"){	
				var checkUserList=[];	
				$('.main').find('#userForm input').each(function(){
					$(this).off('change');
					$(this).change(function(){	
						var checkUserObj = checkExist($(this).attr('id'),$(this).val(),userId);
						checkUserList.push(checkUserObj);
						
					});	
				});

				$("#saveBtn_edit").off('click');	
				$("#saveBtn_edit").on('click',function(){					
					var newCheckObj={};					
					for(var i=0;i<checkUserList.length;i++){
						for(var key in checkUserList[i]){
							newCheckObj[key] = checkUserList[i][key];
							newCheckObj["id"] = userId;
							newCheckObj["roleId"] = $('#rolename').val().toString();
						};
					};
					$.ajax({
						url:"/userPermission-controller/user/update",			
						type:"post",
						dataType:"json",
						contentType:"application/json;charset=utf-8",
						data:JSON.stringify(newCheckObj),
						async : false,
						success:function(res){
							if(res.success == true){
								successTip("修改成功！");
								$USERMODAL.modal('hide').delay(500);;						
								$USERTABLE.bootstrapTable('refresh', {url:'/userPermission-controller/user/getList'});
					      			
							}else{

								dangerTip("提示",res.msg+"！");
							};
						}
					});
						
					
				})

			}	
				

		
	}
	
	

	/*新增/修改 输入框内容有变化 则验证
	  @param  columnName    
	  @param  value
	  @param  editId      
	*/
	function checkExist(columnName,value,editId){
		var dataExist = {};
		//增
		if(arguments.length == 2){				
			dataExist = {"columnName":columnName,"value":value};
			return sendCheck(dataExist);														
		}

		//改
		if(arguments.length == 3){				
			dataExist = {"columnName":columnName,"value":value,"id":editId};
			var backData = sendCheck(dataExist);
			backData["id"] = editId;
			return 	backData;						
		}

		
	}


	/*向后台传验证数据
	  @param dataExist  	
	*/
	function sendCheck(dataExist){

		console.log(dataExist);
		var returnFlag,returnData,returnMsg ;
		var trueData = {};
		if(dataExist.columnName != "" && dataExist.value != ""){
			$.ajax({
    			url:"/userPermission-controller/user/checkExist",
    			type:"get",
    			cache: false,
    			data:dataExist,
    			async : false,
    			success:function(res){
    				console.log(res)
    				returnData = res.data;
    				returnMsg = res.msg;

    				if(res.success == true){
    					trueData[dataExist.columnName] = dataExist.value; 
    				}
    				
    				//checkCallback(returnFlag,returnCode,returnMsg);
    			}
    		});
    		console.log(returnData)
    		console.log(trueData)
    		if(!returnData){
    			return trueData;
    		};

    						
				
		}

		
	}
	/*后台反馈验证信息 
	  @paran returnFlag
	  @param retrunCode
	  @param renturnMsg
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

	/*清楚table表单里的内容*/
	function  clearModalData(){
		
		$USERMODAL.find('input').each(function(){
			$(this).val("");
		});

		//清空多选角色框
		$('#rolename').select2("val","");
		
	}
		
	/*详情table title中文化*/
	function redefine(text){
		switch(text){
			case "id":
			     text = "用户ID";
			     break;
			case "userName":
			     text = "用户姓名";
			     break;
			case "realName":
				text = "真实姓名";
			    break;
			case "roleName":
				text = "角色名";
				 break;
			case "type":
				text = "角色类型";
			    break;
		    case "password":
		    	text = "密码";
		        break;
			case "phone":
				text = "电话";
			    break;
			case "mail":
				text = "邮箱";
			    break;
			case "createDate":
				text = "创建时间";
			    break;
			case "lastLoginTime":
				text = "最后登录时间";
			    break;
			case "lastLoginIp":
				text = "最后登录IP";
			    break;
			case "count":
				text = "登录次数";
			    break;
			case "limit":
				text = "权限区域";
			    break;
			case "remark":
				text = "备注";
			    break;
			    
		};
		return text;
	};
});