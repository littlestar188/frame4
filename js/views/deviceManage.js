$(function(){
	"use strict";
	var initDevice = function(){
		$('#deviceList').bootstrapTable({
			locale: 'zh-CN',
			url:'resources/json/listDevice.json',
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
                {field: 'state',checkbox: true},
			           {field : 'product',title : '设备型号',align : 'center',width : 60,valign : 'middle',
			               formatter : function(value) {
			                   if(value){
			                       return value.model;
			                   }
			               }
			           },
			           {field : 'terminalSN',title : '设备SN码',align : 'center',width : 80,valign : 'middle',
			               formatter : function(value, row) {
			                   return '<a href="/device/detail/'+value+'" >'+value+'</a>';
			                   // return addClick(value, row.id);
			               }
			           },
			           {field : 'online',title : '在线状态',align : 'center',width : 20,valign : 'middle',
			               formatter : function(value) {
			                   if(value){
			                       return "<span class='label label-info'>在线</span>";
			                   }else{
			                       return "<span class='label label-default'>离线</span>";
			                   }
			               }
			           },
			           {field : 'status',title : '运行状态',align : 'center',width : 40,valign : 'middle',
			               formatter : function(value) {
			                   if(value==0 || value==4 || value==5 || value==6 ){
			                       return "<span class='label label-success'>正常</span>";
			                   }
			                   if(value==1 || value==2 || value==9 ){
			                       return "<span class='label label-danger'>故障</span>";
			                   }
			                   if(value==3){
			                       return "<span class='label label-danger'>欠费</span>";
			                   }
			                   if(value==7){
			                       return "<span class='label label-danger'>关机</span>";
			                   }
			                   if(value==8){
			                       return "<span class='label label-danger'>停机</span>";
			                   }
			               }
			           },
			           
			           {field : 'id',title : '操作',align : 'center',width : 100,valign : 'middle',
			               formatter : function(value,row) {
			               
			               return optShow(value);
			           }
			           }
			       ]
		})

		
		$("#deviceList").on('click','#btn-edit',function(){
			BootstrapDialog.confirm({
				title:"修改",
				type:BootstrapDialog.TYPE_PRIMARY,
                size: BootstrapDialog.SIZE_NORMAL,
				message:$("<div id="+$(this).attr("data-id")+"></div>").load('resources/forms/deviceEdit.html'),
				callback:function(){}
				
				
			});							
		
		})

		$("#deviceList").on('click','#btn-del',function(){
			BootstrapDialog.alert({
				title:"提示",
				type:BootstrapDialog.TYPE_DANGER,
                size: BootstrapDialog.SIZE_SMALL,
				message:"确定删除吗？",
				callback:function(){}
				
				
			});	
		})
		
		


	}()
})