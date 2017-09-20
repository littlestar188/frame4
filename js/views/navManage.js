$(function(){
	'use strict';
	var initNav = function(){
		$('#navTable').bootstrapTable({
			locale: 'zh-CN',
			url:'resources/json/listNavs.json',
	     	sidePagination:'server',
	      	cache: false,//设置False禁用AJAX请求的缓存
	      	height: '',
	     	striped: true,//使表格带有条纹
	     	pagination: true,//设置True在表格底部显示分页工具栏
            queryParams: function(params){
                return {
                pageNumber: params.offset+1,
                pageSize:params.limit
                }               
            },
            pageNumber:1,
	      	pageSize: 10,
	      	pageList: [10, 25, 50, 100],
	      	toolbar:'#custom-toolbar',
	      	columns: [
                {field: 'state',checkbox: true},
                {field: 'name',title: '菜单名称',align: 'center',valign: 'middle'},
               	{field: 'id',title: '操作',align: 'center',valign: 'middle',formatter:function(value){
                	return optShow(value);
                }
                }
			]
		})
	}();

	/*table中的按键功能实现

	*/
	var optPerform = function(){
	    var menuId = null;
		//判断是否存在【新增】		
		if($('.main').find('#addBtn').length != 0){
			addNav(menuId);
            //addNav();
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
                menuId = $(this).attr("data-id");
                var name = $(this).attr("title");
                console.log(menuId.charAt(menuId.length - 1));
                if(menuId.length==3&&menuId.charAt(menuId.length - 1)=="0"){
                    BootstrapDialog.confirm({
                    	title:"修改",
                    	type:BootstrapDialog.TYPE_PRIMARY,
                    	message:$('<div></div>').load('resources/forms/navEdit.html'),
                    	callback:function(res){
                    	}
                    });
                }else{
                    editMenu(menuId);
                }

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
							//console.log(navId)
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
	function addNav(menuId){
		$('#addBtn').click(function(){
            	var selectMenu = {};
				ztreeShow("新增");
				//ajax获取数据 模拟数据
            	initMenuZtree(menuId);
		})
	}
	$(".tree_cancel").click(function () {
        ztreeCancelLeave();
    })
     function editMenu(menuId) {
         menuEditShow("修改");
         initMenuZtree(menuId);
     }
    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
	    console.log(treeNodes);
        console.log(targetNode);
        console.log(targetNode+','+treeNodes.length + "," + (targetNode ? (targetNode.tId + ", " + targetNode.name) : "isRoot" ));
    };
	/* 通过拖拽修改菜单的位置*/
    function beforeDrag(menuId, treeNodes) {
        var zTree = $.fn.zTree.getZTreeObj("treeMenu2"),
            nodes = zTree.getNodes();
        console.log("拖拽的节点树:");
        console.log(treeNodes);
        for (var i=0,l=treeNodes.length; i<l; i++) {
            /* 判断是否要拖拽的菜单,其他的菜单都不能拖拽*/
            if(treeNodes[i].id != '101'){
                return false;
            }else{
                return true;
            }
        }
    }
	/*
	* 点击选中
	* */
    function onClick(e, treeId, treeNode,selectMenu) {
        var zTree ='',
            nodes = '',
            v = "",
            menuId = "";
        console.log(treeId);
        if(treeId == 'treeMenu'){
                zTree = $.fn.zTree.getZTreeObj("treeMenu"),
                nodes = zTree.getSelectedNodes();
            nodes.sort(function compare(a,b){
                return a.id-b.id;}
            );
            for (var i=0, l=nodes.length; i<l; i++) {
                v  = nodes[i].name;
                menuId = nodes[i].id;
            }
            if (v.length > 0 ){
                v = v.substring(0, v.length);
            }
            var menuObj = $("#parentInput");
            menuObj.attr("value", v);
            // $("#menuId").text(menuId);
            selectMenu ={
                menuName: v,
                menuId:menuId
            };
            addSaveMenu(selectMenu);
        }

    }
    /* 保存新的菜单*/
     function addSaveMenu(selectMenu) {
         var zTree = $.fn.zTree.getZTreeObj("treeMenu"),
             nodes =  zTree.getNodes();
         var selectNode = zTree.getSelectedNodes();
         var  lastZnodesId ="";
         var newNode ={};
         var indexShow = selectMenu.menuId.substring(0,1);
         /* 点击 选择的是根节点*/
         if(indexShow === "0"){
             var parentNode=null;
             console.log("选中一级菜单");
             newNode = selectRootOne(zTree,nodes,lastZnodesId,parentNode);
             console.log(newNode);
		 }else{
             /* 点击 选择的不是根节点*/
             var parentNode = selectNode;
             console.log("选中二级菜单");
            // var nodes = treeObj.getSelectedNodes();
             newNode = selectChildNode(zTree,selectNode,lastZnodesId,parentNode);
             console.log(newNode);
		 }
		 /* 点击保存ajax 异步传到后台*/
         ztreeMenuSave("resources/json/addRole.json",newNode);
     }
     /*点击保存*/
     function ztreeMenuSave(ajaxURL,newNode) {
         $('.btn_wrapper .tree_save').off("click");
         $('.btn_wrapper .tree_save').click(function(){
             $.ajax({
                 url:ajaxURL,
                 dataType:"json",
                 data:newNode,
                 success:function(res){
                     console.log(res.data);
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
         })

     }

     /*
     * 添加新的根节点到菜单下面
     * */
     function selectRootOne(zTree,nodes,lastZnodesId,parentNode,newNode) {
         var childName  = $('.ztree_roleInput').val();
         for(var i=0,len=nodes.length;i<len;i++){
             lastZnodesId= nodes[nodes.length-1].id;
         }
         var  newMenuId = (parseInt(lastZnodesId) +100).toString();
              newNode= {name:childName,id:newMenuId};
         //newNode = zTree.addNodes(parentNode, newNode);
             newNode = {
                 "pId":"0",
                 "id": newNode.id,
                 "url":"navManage.html",
                 "name": newNode.name
             }
         //nodes.push(newNode);
         return newNode;

     }
     /*
     * 添加子菜单下面的节点
      */
    function selectChildNode(zTree,nodes,lastZnodesId,parentNode,newNode) {
        var childName  = $('.ztree_roleInput').val();
        var childNodes = '';
        var  newMenuId = "";
        for(var i=0,len=nodes.length;i<len;i++){
            childNodes = nodes[i].children;
            var selectNodeOne =  (nodes[i].pId).toString();
            if(selectNodeOne.length == 1 && childNodes!= undefined){ // 选中的是一级菜单且一级菜单有children
                for(var j =0,childLen=childNodes.length;j<childLen;j++){
                    lastZnodesId = childNodes[childNodes.length-1].id;
                    var  newPid = childNodes[j].pId;
                }
                newMenuId = (parseInt(lastZnodesId) +1).toString();
                newNode = {name:childName,id:newMenuId};
                newNode = {
                    "pId": newPid,
                    "id": newNode.id,
                    "url":"navManage.html",
                    "name": newNode.name
                };
               // nodes[i].children.push(newNode);
            }else if(selectNodeOne.length == 1 && childNodes==undefined){// 选中的是一级菜单且一级菜单无children
                //nodes[i].children = [];
                newMenuId = (parseInt(nodes[i].id) + 1).toString();
                newNode = {name:childName,id:newMenuId};
                newNode = {
                    "pId": nodes[i].id,
                    "id": newNode.id,
                    "url":"navManage.html",
                    "name": newNode.name
                }
                //nodes[i].children.push(newNode)
            }

			if(selectNodeOne.length == 3){ //选中的是二级菜单
                if(childNodes == undefined){//没有children
                   // nodes[i].children = [];
                    newMenuId = nodes[i].id +"1";
                    newNode = {name:childName,id:newMenuId};
                    newNode = {
                        "pId": nodes[i].id,
                        "id": newNode.id,
                        "url":"navManage.html",
                        "name": newNode.name
                    }
                    //nodes[i].children.push(newNode)
                }else{ //有children
                    for(var j =0,childLen=childNodes.length;j<childLen;j++){
                        lastZnodesId = childNodes[childNodes.length-1].id;
                        var  newPid = childNodes[j].pId;
                    }
                    newMenuId = (parseInt(lastZnodesId) +1).toString();
                    newNode = {name:childName,id:newMenuId};
                    newNode = {
                        "pId": newPid,
                        "id": newNode.id,
                        "url":"navManage.html",
                        "name": newNode.name
                    }
                   // nodes[i].children.push(newNode);
                }
            }
        }
        return newNode;
    }
	/* 显示所有菜单*/
    $("#slectMenu").click(function () {
        $("#treeMenu").fadeIn();
        //$(".btn_wrapper").fadeIn();
    });

    function initMenuZtree(menuId) {
        var zNodes=[];
        var setting = {
            view:{
                showIcon:false,
                dblClickExpand: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: 0
                },
                key: {
                    url: "xUrl"
                }
            },
            callback: {
                onClick: onClick,
                beforeDrag: beforeDrag,
                onDrop: zTreeOnDrop

            },
            edit:{
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    isCopy: false
                }
            }
        };
        $.ajax({
            url:'resources/json/listNavTree2.json',
            dataType:"json",
            async : false,//必写
            success:function(res){
                console.log(res);
                zNodes = res.data;
                console.log("获得数据");
                console.log(zNodes);
            },
            error:function(){
                console.log("获取新增---后台报错")
            }
        })
        var zTreeObj1 ="";
        var zTreeObj2 ="";
        if(menuId==null){
            $.fn.zTree.init($('#treeMenu'), setting, zNodes);
            zTreeObj1 = $.fn.zTree.getZTreeObj('treeMenu');
            //必须有延迟才能实现初始化时全部展开
            setTimeout(function(){
                zTreeObj1.expandAll(true);
            },500);
        }else{
            $.fn.zTree.init($('#treeMenu2'), setting, zNodes);
             zTreeObj2 = $.fn.zTree.getZTreeObj('treeMenu2');
            //必须有延迟才能实现初始化时全部展开
            setTimeout(function(){
                zTreeObj2.expandAll(true);
            },500);
        }
        //console.log($.extend(ajaxObj,params))
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