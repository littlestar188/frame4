$(function(){
	'use strict';
	var initUsers = function(){
		$('#userTable').bootstrapTable({
			locale: 'zh-CN',
			url:'resources/json/listUsers.json',
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	 //queryParams: role.queryParams,
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	//toolbar:'#custom-toolbar',
	      	columns: [
                {field: 'state',checkbox: true},
                {field: 'userName',title: '用户名称',align: 'center',valign: 'middle'},
                {field: 'roleName',title: '角色名称',align: 'center',valign: 'middle'},
                {field: 'sex',title: '性别',align: 'center',valign: 'middle'},
                {field: 'phone',title: '手机',align: 'center',valign: 'middle'},
                {field: 'department',title: '部门',align: 'center',valign: 'middle'},
                {field: 'app登录',title: 'app登录',align: 'center',valign: 'middle'},
                {field: 'remark',title: '备注',align: 'center',valign: 'middle'},
               	{field: 'userId',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
                	return optShow(value);
                }
                }
			]
		})
	}();
});