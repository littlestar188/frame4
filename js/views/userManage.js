$(function(){
	'use strict';
	var $USERMODAL =$('#userModal');
	var $USERTABLE = $('#userTable');
	var $MAIN = $('.main');
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
	     	    username:"",		
	     		pageNumber:	params.offset+1,
	     		pageSize:params.limit
	     		}
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
                {field: 'updateDate',title: '更新日期',valign: 'middle'},
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
			
			$('#saveBtn').on('click',function(){
				addUser();
			})
		}

		//判断是否存在【查询】
		if($MAIN.find('#searchBtn').length != 0){
			//searchUser();
		}

		//判断是否存在【批量删除】
		if($MAIN.find('#delGroupBtn').length!=0){
			delGroupRole();
		}

		$USERTABLE.on('click','.btn.btn-sm',function(){

			var userId = $(this).attr("data-id");

			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				/*BootstrapDialog.confirm({
					title:"重置密码",
					type:BootstrapDialog.TYPE_PRIMARY,
					size: BootstrapDialog.SIZE_SMALL,
					message:$('<div></div>').load('resources/forms/passwordEdit.html'),
					callback:function(res){

					}
				});	*/
				detailUser(userId);
			}

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				/*BootstrapDialog.confirm({
					title:"修改信息",
					type:BootstrapDialog.TYPE_PRIMARY,
					message:$('<div></div>').load('resources/forms/userEdit.html'),
					callback:function(res){

					}
				});	*/
				var editName = $(this).parents('td').prev().html();
				checkUserName(editName);
				editUser(userId);

			}

			//判断是否为【删除】
			if($(this).is('#btn-del')){
				delTip("userTable",userId,"/userPermission-controller/user/delete","/userPermission-controller/user/getList");

			}

			if($(this).is("#btn-limit")){

			}	

		})

	}();
	/*批量删除用户*/
	function delGroupRole(){
		$('#delGroupBtn').click(function(){
			var selectedItems = $USERTABLE.bootstrapTable('getSelections');
       		console.log(selectedItems)
       		var idList = selectedItems.map(function(item){
       			return item.id
       		})
       		console.log(idList)

       		$.ajax({
       			url:'/userPermission-controller/user/deleteBatch',
		   		type:'post',
		   		dataType:"json",
		   		contentType:"application/json;charset=utf-8",
		   		data:JSON.stringify(idList),
		   		success:function(res){
		   			if(res.success == true){
		   				successTip('删除成功！');
		   				$USERTABLE.bootstrapTable('refresh', {url:'/userPermission-controller/user/getList'});
		   			}
		   		},
		   		error:function(){

		   		}
       		})
		})
		
	}
	/*新增用户*/
	function addUser(){		
		/*BootstrapDialog.confirm({
			title:"新增用户",
			type:BootstrapDialog.TYPE_PRIMARY,
			message:$('<div></div>').load('resources/forms/userEdit.html'),
			callback:function(res){
				if(res){
					console.log($("#userEdit").serialize())
					$.ajax({
						url:"resources/json/returnBack.json",							
						data:$("#userEdit").serialize(),
						success:function(res){
							if(res.returnCode == 0){
								successTip("新增成功！")
							}else{
								dangerTip("提示","新增失败！")
							}
						},
						error:function(){
							console.log("新增用户----后台报错")
						}

					})
				}
			}
		});		*/
		$('#userForm').show();
		$('#detailUser').hide();

		var userData = {
			"userName":$('#username').val(),
			"roleName":$('#rolename option:selected').text()
		}

		$.ajax({
			url:"/userPermission-controller/user/add",			
			type:"post",
			dataType:"json",
			contentType:"application/json;charset=utf-8",
			data:JSON.stringify(userData),
			success:function(res){
				if(res.success == true){
					successTip("添加成功！");
					$USERMODAL.modal('hide');						
					clearModalData();
					$USERTABLE.bootstrapTable('refresh', {url:'/userPermission-controller/user/getList'});
        			
				}else{

					dangerTip("提示",res.msg+"！")
				}
			}
		})

	}

	/*用户修改*/
	function editUser(userId){

		$('.modal-title').html('修改用户');
		$('#userForm').show();
		$('#detailUser').hide();

		$.ajax({
			url:"/userPermission-controller/user/getDetail",			
			type:"post",
			dataType:"json",
			data:{"id":userId},
			success:function(res){
				if(res.success == true){
					$('#username').val(res.data.userName);
					$('#updateDate').val(res.data.updateDate);
					
				}
			}
		})
		
		$USERMODAL.modal('show');	

	} 
	/*用户详情*/
	function detailUser(userId){
		$('.modal-title').html('用户详情');
		$('#userForm').hide();
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
					})

					$('#detailUser>tbody').find('tr>td:nth-child(1)').each(function(){
						var txt = $(this).text();
						var newTxt = redefine(txt);
						$(this).text(newTxt);
						console.log(txt)
					})
				}
			}
		})

		$USERMODAL.modal('show');	

	}

	/*输入框内容有变化 则验证
	  @param  ajaxURL    /addCheck/updataCheck
	  @param  valueName
	  @param  editId      
	*/
	function checkUserName(ajaxURL,valueName,editId){
		var postData = {};
		//增
		if(arguments.length == 2){				
			postData = {"userName":valueName};														
		}

		//改
		if(arguments.length == 3){				
			postData = {"userName":valueName,"roleId":editId};							
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

	function  clearModalData(){
		$USERMODAL.on('hidden.bs.modal',function(){
			$USERMODAL.find('input[type=text]').each(function(){
				$(this).val("")
			})
		});
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
			text = "真实姓名"
		    break;
		case "roleName":
			text = "角色名";
			 break;
		case "type":
			text = "角色类型"
		    break;
	    case "password":
	    	text = "密码"
	        break;
		case "phone":
			text = "电话"
		    break;
		case "mail":
			text = "邮箱"
		    break;
		case "createDate":
			text = "创建时间"
		    break;
		case "lastLoginTime":
			text = "最后登录时间"
		    break;
		case "lastLoginIp":
			text = "最后登录IP"
		    break;
		case "count":
			text = "登录次数"
		    break;
		case "limit":
			text = "权限区域"
		    break;
		case "remark":
			text = "备注"
		    break;
		    
	}
	return text;
}
});