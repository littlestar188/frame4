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
			url:"/product-controller/material/getMaterialPage",	     	
	     	method:"post",
	     	contentType:"application/json;charset=utf-8",
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	sidePagination:'server',
	      	height: '',
	     	queryParams: function(params){
	     		
	     		var paramResult = {	
	     			pageNumber:	params.offset/params.limit+1,
	     			pageSize:params.limit,
	     			
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
                {field: 'materialName',title: '原料名称',align: 'middle'},
                {field: 'specName',title: '原料型号',valign: 'middle'},
                {field: 'typeName',title: '原料类型',valign: 'middle'},
                {field: 'updateDate',title: '更新日期',valign: 'middle',formatter:function(value){
                	return getSmpFormatDate(value,true)
                }},
                {field: 'updateUser',title: '更新者',valign: 'middle'},
                {field: 'remark',title: '备注',valign: 'middle'},
               	{field: 'id',title: '操作',align:"center",valign: 'middle',formatter:function(value){
                	return optShow(value);}
                }
			]
		})
	}();
	
	
});