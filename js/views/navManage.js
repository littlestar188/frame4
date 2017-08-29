$(function(){
	'use strict';
	var initNav = function(){
		$('#navTable').bootstrapTable({
			locale: 'zh-CN',
			url:'resources/json/listNavs.json',
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	 //queryParams: role.queryParams,
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	columns: [
                {field: 'state',checkbox: true},
                {field: 'navName',title: '菜单名称',align: 'center',valign: 'middle'},
               	{field: 'navId',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
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
		if($('.main').find('#addBtn').length != 0){
			addNav();
		}

		//判断是否存在【查询】
		if($('.main').find('#searchBtn').length != 0){
			//searchNav();
		}

		$('#navTable').on('click','.btn.btn-sm',function(){

			//判断是否为【详情】
			if($(this).is('#btn-watch')){
				BootstrapDialog.show({
					title:"详情",
					type:BootstrapDialog.TYPE_PRIMARY,
					size: BootstrapDialog.SIZE_SMALL,
					message:""
					
				});	
			}

			//判断是否为【修改】
			if($(this).is('#btn-edit')){
				BootstrapDialog.confirm({
					title:"修改",
					type:BootstrapDialog.TYPE_PRIMARY,
					message:$('<div></div>').load('resources/forms/navEdit.html'),
					callback:function(res){
						

					}
				});	
			}

			//判断是否为【删除】
			if($(this).is('#btn-del')){
				var navId = $(this).attr("data-id");
				BootstrapDialog.confirm({
					title:"提示",
					type:BootstrapDialog.TYPE_DANGER,
					size: BootstrapDialog.SIZE_SMALL,
					message:"确定删除吗？",
					callback:function(res){
						if(res){
							console.log(navId)
							$.ajax({
								url:"resources/json/returnBack.json",
								data:navId,
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

	/*新增用户
		
	*/
	function addNav(){
		$('#addBtn').click(function(){
			
			BootstrapDialog.confirm({
				title:"新增",
				type:BootstrapDialog.TYPE_PRIMARY,
				message:$('<div></div>').load('resources/forms/navEdit.html'),
				callback:function(res){
					if(res){

						console.log($("#navEdit").serialize())
						$.ajax({
							url:"resources/json/returnBack.json",							
							data:$("#navEdit").serialize(),
							success:function(res){
								if(res.returnCode == 0){
									successTip("新增成功！")
								}else{
									dangerTip("提示","新增失败！")
								}
							},
							error:function(){
								console.log("新增菜单----后台报错")
							}

						})
					}

				}
			});		
			
		})
	}

	/*查询角色*/
	function searchUser(){
		
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