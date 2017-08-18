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

		/*新增
		*/
		$('#addBtn').on('click',function(){
			BootstrapDialog.show({
				title:"新增",
				type:BootstrapDialog.TYPE_PRIMARY,
                size: BootstrapDialog.SIZE_NORMAL,
                message:$('<form id="deviceEdit" class="form-horizontal"></form>').load('resources/forms/deviceEdit.html'),
                callback:function(res){

                	//returnBack("add");
                }
			})
		})

		/*修改
		*/
		$("#deviceList").on('click','#btn-edit',function(){
			var id = $(this).attr("data-id");
			BootstrapDialog.confirm({
				title:"修改",
				type:BootstrapDialog.TYPE_PRIMARY,
                size: BootstrapDialog.SIZE_NORMAL,
				message:$("<form data-id="+$(this).attr("data-id")+"></form>").load('resources/forms/deviceEdit.html'),
				
			});							
		
		})
		/*删除
		*/
		$("#deviceList").on('click','#btn-del',function(){
			var id = $(this).attr("data-id");
			BootstrapDialog.confirm({
				title:"提示",
				type:BootstrapDialog.TYPE_DANGER,
                size: BootstrapDialog.SIZE_SMALL,
				message:"确定删除吗？",
				callback:function(res){
					console.log(res)
					if(res){
						$.ajax({
	                        //url: "/device/" + id,
	                        url:"resources/json/returnBack.json",
	                       //type: "delete",
	                        dataType: 'json',
	                        cache:false,
	                        async: false,
	                        success: function (data) {
	                            if (data.returnCode == 0) {
	                                returnBack("delete");
	                            }
	                        }
	                    })
					}
				}
				
				
			});	
		})
		
		


	}()
	/*添加或修改信息不能为空校验
	*/
	// function checkInfo(){
	// 	var validator = $("#deviceEdit").validate({
	// 		debug:true,//只验证 不提交表单
	// 		onsubmit:false,//提交验证
	// 		onfocusout:true,//失焦时验证
	// 		rules:{
	// 			nullCheck:{
	// 				required:true
	// 			}
	// 		},
	// 		message:{
	// 			nullCheck:{
	// 				required:"不能为空"
	// 			}
	// 		},
	// 		errorPlacement: function(error, element) {								
	// 			error.appendTo(element.parent().next());									
	// 		},
	// 		// 每个字段验证通过执行函数
	// 		success:function(){

	// 		}
	// 	})
		
	// }
	/*成功回调函数
	  @param type
	*/
	function returnBack(type){
		var msg="";
		switch(type){
			case "add":
			msg = "添加成功！";
			break;
			case "edit":
			msg = "修改成功！";
			break;
			case "delete":
			msg = "删除成功！";
			break;
		}
		BootstrapDialog.show({
        	message:msg,
        	type:BootstrapDialog.TYPE_SUCCESS,
        	size: BootstrapDialog.SIZE_SMALL	                                   	
            
        }).getModalHeader().hide();

        $("#deviceList").bootstrapTable('refresh');
	}
})