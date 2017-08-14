$(function(){
	//'use strict';
	var initRole = function(){
		$('#roleTable').bootstrapTable({
			locale: 'zh-CN',
			url:'resources/json/listRoles.json',
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	 //queryParams: role.queryParams,
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	//toolbar:'#custom-toolbar',
	      	paginationDetailHAlign: 'left',
	      	columns: [
                {field: 'state',checkbox: true,formatter:function(row,value,index){
                	//return role.disableDel(row,value,index);}
                }},                  	   
                {field: 'roleName',title: '角色名称',align: 'center',valign: 'middle'},
                {field: 'roleId',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
                	//console.log(value)id                     	
                	return optShow(value);
                	
                }
                }
			]
		})
	}()
	var addRoleTree = function(){
		$('.addBtn').click(function(event){
			
			falshZtree('新增');
			initZtree('resources/json/listNewTree.json','get','123');
	    	checkRole($('.ztree_roleInput'),"/manage/role/addCheck");
	    	ztreeDateSave();	
			
		})
	}()

	/*
		@param elem   
		@param title 新增/修改
	*/
	function falshZtree(title){
		$('.ztree_title').html(title);
		$('.ztree_wrapper').removeClass('fadeOutRight')
		$('.table_wrapper').removeClass('col-lg-12').addClass('col-lg-9');
		$('.ztree_wrapper').addClass('slideInRight').fadeIn();

		$('.btn_wrapper .tree_cancel').click(function(){

			setTimeout(function(){				
				$('.table_wrapper').removeClass('col-lg-9').addClass('col-lg-12');
			},1500)

			setTimeout(function(){				
				$('.ztree_wrapper').removeClass('slideInRight').addClass('fadeOutRight');
			},500)
			//$('.table_wrapper');
			
		})
	}
	/*
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
		   
		   	console.log($.extend(ajaxObj,params))

		    $.fn.zTree.init($('#treePermission'), setting, zNodes); 

		    var zTreeObj = $.fn.zTree.getZTreeObj('treePermission'); 
		    //必须有延迟才能实现初始化时全部展开
		    setTimeout(function(){
		    	zTreeObj.expandAll(true);
		    },500);		
	}

	function ztreeDateSave(){
		$('.btn_wrapper .tree_save').click(function(){
			var name = $('.ztree_roleInput').val();
			var ztreeObj = $.fn.zTree.getZTreeObj("treePermission");
        	var znodes = ztreeObj.getCheckedNodes(true);
        	console.log(znodes)
        	//所选的权限菜单数组 id
            var per = [];
            for(var i=0;i<znodes.length;i++){
                per.push(znodes[i].id);
            }
            console.log(per);
            var param = {
               	per:per,
                name : name
            }
            console.log(param)
           
			setTimeout(function(){
				$('.table_wrapper').removeClass('col-lg-9');
				$('.ztree_wrapper').removeClass('slideInRight').addClass('slideOutRight');
			},500)
			
			
		})
	}

});