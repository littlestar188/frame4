$(function(){
	'use strict';
	var initFun = function(){
		$('#funTable').bootstrapTable({
			locale: 'zh-CN',
			//url:'resources/json/listFunction.json',
			url:'/userPermission-controller/function/table',
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	queryParams: function(params){
	     		return {
	     		pageNumber:	params.offset/params.limit+1,
	     		pageSize:params.limit,
	     		funName:$('#funName').val()	     		
	     		}	     		
	     	},
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	columns: [
                {field: 'state',checkbox: true},
                {field: 'funName',title: '功能名称',valign: 'middle'},
                {field: 'menuName',title: '菜单名称',valign: 'middle'},
                {field: 'funUrl',title: '功能URL',valign: 'middle'},
                {field: 'status',title: '可用状态',valign: 'middle',formatter:function(value){
                	return availableJudge(value);
                }},
               	{field: 'funId',title: '操作',valign: 'middle',formatter:function(value){
                	return optShow(value);}
                }
			]
		})
	}();

	/*table中的按键功能实现

	*/
	var optPerform = function(){
		//判断是否存在【新增】		
		if($('.main').find('#addBtn').length != 0){
			//addFun();
		}

		//判断是否存在【查询】
		if($('.main').find('#searchBtn').length != 0){
			//searchFun();
		}

		$('#funTable').on('click','.btn.btn-sm',function(){

			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				BootstrapDialog.show({
					title:"查看详情",
					type:BootstrapDialog.TYPE_PRIMARY,
					size: BootstrapDialog.SIZE_SMALL,
					message:"",
					callback:function(res){

					}
				});	
			}

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				BootstrapDialog.confirm({
					title:"修改信息",
					type:BootstrapDialog.TYPE_PRIMARY,
					message:$('<div></div>').load('resources/forms/userEdit.html'),
					callback:function(res){

					}
				});	
			}

			//判断是否为【删除】
			if($(this).is('#btn-del')){
				BootstrapDialog.confirm({
					title:"提示",
					type:BootstrapDialog.TYPE_DANGER,
					size: BootstrapDialog.SIZE_SMALL,
					message:"确定删除吗？",
					callback:function(res){

					}
				});	
			}

			

		})

	}();

	/*新增用户
		
	*/
	var addFun = function(){
		$('#addBtn').click(function(){
			
			BootstrapDialog.confirm({
				title:"新增用户",
				type:BootstrapDialog.TYPE_PRIMARY,
				message:$('<div></div>').load('resources/forms/userEdit.html'),
				callback:function(res){

				}
			});		
			
		})
	}

	/*查询角色*/
	function searchFun(){
		
		/*$('#searchBtn').click(function(){
			
			$.ajax({
				//url:"/manage/role/selectRoles",
				dataType:"json",
				data:{
					roleName:$('#roleSearch').val()
				},
				success:function(res){
					console.log(res.returnCode)

					if(res.returnCode == 0){						
						$("#roleTable").bootstrapTable('refresh', {url:'/manage/role/listRoles'});						
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
			})
		})*/

	} 
});