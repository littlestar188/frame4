
$(function () {
    'use strict';
    var zTreeObj1 = "";
    var zTreeObj2 = "";
    var modifyObj = {};
    var newNode = {};
    var checkNameBack;
    var $MENUS = $('#navTable');
    
    /*初始化navigation table*/
    var initNav = function () {
        $MENUS.bootstrapTable({
            locale: 'zh-CN',
            url: '/userPermission-controller/menu/table',
            sidePagination: 'server',
            cache: false,//设置False禁用AJAX请求的缓存
            height: '',
            queryParams: function (params) {
               /* console.log("获取页数");
                console.log(params);*/
                return {
                    pageNumber: params.offset / params.limit + 1,
                    pageSize: params.limit,
                    menuName: $('#menuNameSearch').val()
                    //withFunction:false
                }
            },
            striped: true,//使表格带有条纹
            pagination: true,//设置True在表格底部显示分页工具栏
            pageList: [10, 25, 50, 100],
            toolbar: '#custom-toolbar',
            paginationDetailHAlign: 'left',
            columns: [
                {field: 'state', checkbox: true},
                {field: 'menuName', title: '菜单名称', valign: 'middle'},
                {field:'parentId',title:'父级菜单',valign:'middle',formatter:function(value,row,index){
                    var menuName ="";
                    var menuOne = '';
                    var self_index = index;
                    if(value!=null){
                        $.ajax({
                            url: "/userPermission-controller/menu/detail",
                            data: {"menuId": value},
                            dataType:'json',
                            type:'GET',
                            async: true,
                            cache: false,
                            success: function (res) {
                             //   console.log("菜单详情----");
                               // console.log(res);
                                menuOne = res.data;
                                menuName = menuOne.menuName;
                               // console.log(slef_index);
                                $($('tr[data-index='+self_index+']').find('td')[2]).text(menuName);
                            }
                          });
                        }
                    }
                },
                {field:'menuUrl',title:'菜单地址',valign:'middle',formatter:function(value){
                    return value.split('.')[0];}
                },
                {field:'status',title:'可用状态',valign:'middle',formatter:function(value){                  
                   return availableJudge(value);}
                },
                {field: 'id', title: '操作', valign: 'middle', formatter: function (value) {
                  //  console.log("返回的操作数据是------");
                  //  console.log(value);
                    return optShow(value);}
                }
            ]
        });
    }();

    /*table中的按键功能实现

     */
    var optPerform = function () {
        var menuId = null;
        //判断是否存在【新增】
        if ($('.main').find('#addBtn').length != 0) {
            addNav(menuId);
        }

        //判断是否存在【查询】
        if ($('.main').find('#searchBtn').length != 0) {
            //searchNav();
            $("#searchBtn").click(function () {
                $MENUS.bootstrapTable("refresh");
            })
        }

        $MENUS.on('click', '.btn.btn-sm', function () {
            //判断是否为【详情】
            if ($(this).is('#btn-watch')) {
                menuId = $(this).attr("data-id");
                var name = $(this).attr("title");
                console.log(menuId,name);
                $.ajax({
                    url: "/userPermission-controller/menu/detail",
                    data: {"menuId": menuId},
                    success: function (result) {
                        console.log("菜单详情");
                        console.log(result.data);
                        var menuOne = result.data;
                        //菜单详情
                        MenuDetail(menuOne, menuId);
                    }
                })
            }
            //判断是否为【修改】
            if ($(this).is('#btn-edit')) {
                menuId = $(this).attr("data-id");
                var name = $(this).attr("title");
                // console.log(menuId.charAt(menuId.length - 1));
                //获取要修改的菜单
                console.log(menuId);
                $.ajax({
                    url: "/userPermission-controller/menu/detail",
                    data: {"menuId": menuId},
                    success: function (result) {
                        console.log("修改的菜单");
                        console.log(result.data);
                        var menuOne = result.data;

                        //修改菜单
                        modifyMenu(menuOne, menuId);
                    }
                })
            }
            //判断是否为【删除】
            if ($(this).is('#btn-del')) {
                var navId = $(this).attr("data-id");

                BootstrapDialog.confirm({
                    title: "提示",
                    type: BootstrapDialog.TYPE_DANGER,
                    size: BootstrapDialog.SIZE_SMALL,
                    message: "确定删除吗？",
                    callback: function (res) {
                        if (res) {
                            //console.log(navId)
                            $.ajax({
                                url: "/userPermission-controller/menu/deleteOne",
                                data: {"id": navId},
                                type: "post",
                                success: function (res) {
                                    console.log("删除的结果");
                                    console.log(res.success);
                                    if (res.success == true) {
                                        successTip("删除成功！");
                                        $("#navTable").bootstrapTable('refresh', {url: '/userPermission-controller/menu/table'});
                                    } else {
                                        dangerTip("提示", "删除失败！")
                                    }
                                },
                                error: function () {
                                    dangerTip("提示", "删除失败！")
                                }
                            })
                        }
                    }
                });
            }
        })
    }();
    //菜单详情
    function MenuDetail(menuOne,menuId) {
        var selectOneMenu =[];
        var zNodes = [];
        ztreeShow("详情");
        zNodes = listOneMenu(menuOne);
        console.log("详情数组");
        console.log(zNodes);
        initMenuZtree(menuId, zNodes,true);
    };
    //ztree 菜单详情
    function listOneMenu(data){
        var zNodes = [];
        if (data.parentId == null || data.parentId == 0 || data.parentId !== null) {
            var obj = new ztreeObj(0, data.id, data.menuName, data.menuUrl);
            zNodes.push(obj);
            if (data.funcs !== null) {
                //二级菜单子节点
                for (var j = 0; j < data.funcs.length; j++) {
                    var subObj = new ztreeObj(data.id, data.funcs[j].id, data.funcs[j].funName, data.funcs[j].funUrl,data.funcs[j].funType);
                    zNodes.push(subObj);
                }
            }
        }
        return zNodes;
    };
    //批量删除
    $("#delGroupBtn").click(function () {

        // var selectedItems = $ROLETABLE.bootstrapTable('getSelections');
        // console.log(selectedItems);
        // var idList = selectedItems.map(function(item){
        //     return item.id
        // });
        // console.log(idList);
        var selected = $('.selected .bs-checkbox').parent().find('#btn-watch');
        if (selected.length > 0) {
            var menuIds = [];
            console.log("选中的checked");
            console.log(selected);
            console.log(typeof  selected);
            console.log(selected.length);
            for (var i = 0, le = selected.length; i < le; i++) {
                var dataId = $(selected[i]).attr('data-id');
                menuIds.push(dataId);
            }
            //console.log(menuIds);
            BootstrapDialog.confirm({
                title: "提示",
                type: BootstrapDialog.TYPE_DANGER,
                size: BootstrapDialog.SIZE_SMALL,
                message: "确定删除吗？",
                callback: function (res) {
                    if (res) {
                        console.log(menuIds)
                        $.ajax({
                            type: "post",
                            traditional: true,
                            url: "/userPermission-controller/menu/deleteBatch",
                            data: {"ids": menuIds},
                            // contentType: "application/json;charset=utf-8",
                            success: function (res) {
                                console.log("删除的结果");
                                console.log(res.success);
                                if (res.success == true) {
                                    successTip("删除成功！");
                                    $("#navTable").bootstrapTable('refresh', {url: '/userPermission-controller/menu/table'});
                                } else {
                                    dangerTip("提示", "删除失败！")
                                }
                            },
                            error: function () {
                                dangerTip("提示", "删除失败！")
                            }
                        })
                    }
                }
            });
        } else {
            dangerTip("提示", "请至少选择一个！")
        }

    });


    /*新增用户
     */
    function addNav(menuId) {
        $('#addBtn').click(function () {
            var selectMenu = {};
            var zNodes = [];
            ztreeShow("新增");
            //ajax获取数据            
            initMenuZtree(menuId, getMenu());
        })
    }
   //点击取消按钮
    $(".tree_cancel").click(function () {
        $('#menuName').val('');
        $("#parentInput").text('父级菜单');
        ztreeCancelLeave();
    });
    //修改菜单
    function modifyMenu(menuOne, menuId) {
        var menuName = menuOne.menuName;
        var menuUrl = menuOne.menuUrl;
        var menuStatus = menuOne.status;
        var StatusValue ='';
        switch (menuStatus){
            case 0:
                $(':radio[name="Status"]').eq(1).attr("checked",false);
                $(':radio[name="Status"]').eq(0).attr("checked",true);
                // StatusValue = '可用';
            case 1:
                $(':radio[name="Status"]').eq(0).attr("checked",false);
                $(':radio[name="Status"]').eq(1).attr("checked",true);
               //  StatusValue = '禁用';
        }
        //$("#navName").val(menuName);
        $("#navName2").text(menuName);
        $("#menuUrl2").val(menuUrl);
        StatusValue = $(':radio[name="Status"]:checked').val();
        $("#status2").val(StatusValue);
        var menuOnePid = menuOne.parentId;
        if (menuOnePid == null) {
            //修改一级菜单的弹出框
            update(menuName,menuUrl,StatusValue,menuId);
        } else {
            editMenu(menuId);
        }
    }
    //修改一级菜单的弹出框
    function update(obj,menuUrl,StatusValue,val) {
        $('#update').modal('show');
        $(".commitModalName").val(obj);
        $(".commitModalName").attr("id", val);
        $(".commitModalUrl").val(menuUrl);
        switch (StatusValue){
            case '0':
                $(':radio[name="Status"]').eq(1).attr("checked",false);
                $(':radio[name="Status"]').eq(0).attr("checked",true);
            // StatusValue = '可用';
            case '1':
                $(':radio[name="Status"]').eq(0).attr("checked",false);
                $(':radio[name="Status"]').eq(1).attr("checked",true);
               // StatusValue = '禁用';
        }
       // $(".commitModalStatus").val(StatusValue);
    }
    //修改二级菜单
    function editMenu(menuId) {
        ztreeShow('修改');
        var zNodes = [];      
        initMenuZtree(menuId, getMenu());
    }

    //点击提交修改一级菜单
    $("#submitOk").click(function () {
        updateMenu();
    });
    //点击提交修改一级菜单
    function updateMenu() {
        var menuName = $(".commitModalName").val();
        var menuId = $(".commitModalName").attr("id");
        var menuUrl  = $(".commitModalUrl").val();
        var menuStatus  = $(".commitModalStatus").val();
        var StatusValue ='';
        switch (menuStatus){
            case '0':
                StatusValue = 0;
            case '1':
                StatusValue = 1;
        }
        // alert(menuId);
        modifyCheckName("menuName", menuName);
        if (checkNameBack === "true") {
            $.ajax({
                url: "/userPermission-controller/menu/detail",
                data: {"menuId": menuId},
                success: function (result) {
                    console.log("最后查找修改菜单的功能");
                    console.log(result.data);
                    var menuOne = result.data;

                    if (menuOne.funcs != null) {
                        for (var i = 0, le = menuOne.funcs.length; i < le; i++) {
                            menuOne.funcs[i].createUser = null;
                            menuOne.funcs[i].createDate = null;
                            menuOne.funcs[i].updateUser = null;
                            menuOne.funcs[i].updateDate = null;
                        }
                        console.log(menuOne.funcs);
                        modifyObj = {
                            "id": menuId,
                            "menuName": menuName,
                            "menuUrl": menuUrl,
                            "parentId": menuOne.parentId,
                            "status": StatusValue,
                            "funcs": menuOne.funcs
                        };
                        console.log(modifyObj);
                    }
                    ajaxSave("/userPermission-controller/menu/update", modifyObj);
                    $('#update').modal('hide');
                }
            })

        } else {
            dangerTip("提示", "菜单不可以重名！");
        }
    }

    // 修改菜单的名字
    function zTreeBeforeRename(treeId, treeNode, newName, isCancel) {
        var navName2 = $("#navName2").text();
        console.log("旧名字:" + navName2);
        console.log("修改的新名字:" + newName);
        navName2 = $("#navName2").text(newName);
        console.log(navName2);
        console.log("想要修改的菜单对象");
        console.log(treeNode);
        var menuId = treeNode.id;
        var menuUrl = $("#menuUrl2").val();
        var  menuStatus = $("#menuUrl2").val();
        var StatusValue ='';
        switch (menuStatus){
            case '0':
                StatusValue = 0;
            case '1':
                StatusValue = 1;
        }
        checkNameBack = modifyCheckName("menuName", newName);
        if (checkNameBack === "true") {
            $.ajax({
                url: "/userPermission-controller/menu/detail",
                data: {"menuId": menuId},
                success: function (result) {
                    console.log("最后查找修改菜单的功能");
                    console.log(result.data);
                    var menuOne = result.data;

                    if (menuOne.funcs != null) {
                        for (var i = 0, le = menuOne.funcs.length; i < le; i++) {
                            menuOne.funcs[i].createUser = null;
                            menuOne.funcs[i].createDate = null;
                            menuOne.funcs[i].updateUser = null;
                            menuOne.funcs[i].updateDate = null;
                        }
                        console.log(menuOne.funcs);
                        modifyObj = {
                            "id": menuId,
                            "menuName": newName,
                            "menuUrl": menuUrl,
                            "parentId": treeNode.pId,
                            "status": StatusValue,
                            "funcs": menuOne.funcs
                        };
                        console.log(modifyObj);
                    }
                    //  menuModifySave("/userPermission-controller/menu/update", modifyNewsMenu);
                }
            })
        } else {
            $("#navName2").text(treeNode.name);
            console.log(treeNode);
            navName2 = $("#navName2").text();
            dangerTip("提示", "菜单不可以重名！");
            return false;
            setTimeout(function () {
                var treeObj = $.fn.zTree.getZTreeObj('treeMenu2');
                zTreeObj2.cancelEditName(navName2);

            }, 50)

        }
    }

    function zTreeOnRename(event, treeId, treeNode, isCancel) {
        console.log("修改名称后的节点对象treeNode");
        checkNameBack = modifyCheckName("menuName", treeNode.name);
        if (checkNameBack === "false") {
            isCancel = true;
            console.log(treeNode.id + ", " + treeNode.name + "," + isCancel);
        }
    }

    //判断哪个菜单可以修改
    function zTreeBeforeEditName(treeId, treeNode, newName) {
        var zTree = $.fn.zTree.getZTreeObj("treeMenu2");
        var navName2 = $("#navName2").text();
        if (treeNode.name === navName2) {
            console.log(navName2);
            return true;
        } else {
            console.log(navName2);
            return false;
        }
    }

    //通过拖拽修改菜单的父级菜单
    function modifyNewMenu(treeNodes) {
        var name = '', menuId = '', url = '', parentid = '',menuStatus ='';
        console.log(treeNodes);
        for (var i = 0, l = treeNodes.length; i < l; i++) {
            name = treeNodes[i].name;
            menuId = treeNodes[i].id;
          //  url = treeNodes[i].url;
            parentid = treeNodes[i].pId;
        }
        url = $("#menuUrl2").val();
        menuStatus = $("#menuUrl2").val();
        var StatusValue ='';
        switch (menuStatus){
            case '0':
                StatusValue = 0;
            case '1':
                StatusValue = 1;
        }
        $.ajax({
            url: "/userPermission-controller/menu/detail",
            data: {"menuId": menuId},
            success: function (result) {
                console.log("最后查找修改菜单的功能");
                console.log(result.data);
                var menuOne = result.data;

                if (menuOne.funcs != null) {
                    for (var i = 0, le = menuOne.funcs.length; i < le; i++) {
                        menuOne.funcs[i].createUser = null;
                        menuOne.funcs[i].createDate = null;
                        menuOne.funcs[i].updateUser = null;
                        menuOne.funcs[i].updateDate = null;
                    }
                    console.log(menuOne.funcs);
                    modifyObj = {
                        "id": menuId,
                        "menuName": name,
                        "menuUrl": url,
                        "parentId": parentid,
                        "status": StatusValue,
                        "funcs": menuOne.funcs
                    };
                    console.log(modifyObj);
                }
                // menuModifySave("/userPermission-controller/menu/update", modifyObj);
            }
        })
    }
   //通过拖拽修改菜单的父级菜单
    function zTreeOnDrop(event, treeId, treeNodes, targetNode, moveType) {
        console.log(treeNodes);
        console.log(targetNode);
        var modifyNewsMenu = {};
        //通过拖拽修改菜单的父级菜单
        modifyNewsMenu = modifyNewMenu(treeNodes);
    }
   // ajax 点击确定修改保存
    $('#modifySave').click(function () {
        ajaxSave("/userPermission-controller/menu/update", modifyObj);
    });
    /*菜单名称校验*/
    function modifyCheckName(name, val) {
        console.log(name);
        console.log(val);
        $.ajax({
            url: "/userPermission-controller/menu/checkField",
            data: {"fieldName": name, "fieldValue": val},
            type: "post",
            async: false,
            success: function (res) {
                checkNameBack = res;
            }
        });
        return checkNameBack;
    }

    /* 通过拖拽修改菜单的位置*/
    function beforeDrag(menuId, treeNodes) {
        console.log("拖拽的节点树:");
        console.log(menuId);
        var navName = $("#navName2").text();
        console.log(navName);
        // console.log(treeNodes);
        for (var i = 0, l = treeNodes.length; i < l; i++) {
            /* 判断是否要拖拽的菜单,其他的菜单都不能拖拽*/
            if (treeNodes[i].name != navName) {
                return false;
            } else {
                return true;
            }
        }
    }
    // 点击选中
    function onClick(e, treeId, treeNode, selectMenu) {
        var zTree = '',
            nodes = '',
            v = "",
            menuId = "";
        console.log(treeId);
        if (treeId == 'treeMenu') {
            zTree = $.fn.zTree.getZTreeObj("treeMenu"),
                nodes = zTree.getSelectedNodes();
            nodes.sort(function compare(a, b) {
                    return a.id - b.id;
                }
            );
            for (var i = 0, l = nodes.length; i < l; i++) {
                v = nodes[i].name;
                menuId = nodes[i].pId;
            }
            if (v.length > 0) {
                v = v.substring(0, v.length);
            }
            var menuObj = $("#parentInput").text(v);
            console.log("选中的父级菜单" + $("#parentInput").text());
            selectMenu = {
                menuName: $("#parentInput").text(),
                menuId: menuId
            };
            /* 保存新的菜单*/
            addSaveMenu(selectMenu, nodes);
        }
    }


    //保存新的菜单
    function addSaveMenu(selectMenu) {
        var zTree = $.fn.zTree.getZTreeObj("treeMenu");
        var selectNode = zTree.getSelectedNodes();
        var lastZnodesId = "";
        var indexShow = selectMenu.menuId;
        //console.log("节点的ID---"+indexShow);
        /* 点击 选择的是根节点*/
        if (indexShow === 0) {
            var parentNode = null;
            console.log("选中一级菜单");
            console.log(selectNode);
            newNode = selectRootOne(zTree, selectNode, lastZnodesId, parentNode);
            console.log(newNode);
        } else {
            /* 点击 选择的不是根节点*/
            var parentNode = selectNode;
            newNode = selectRootOne(zTree, selectNode, lastZnodesId, parentNode);
            console.log("选中二级菜单");
            console.log(newNode);
        }
    }

    /* 判断菜单是否重名*/
    function checkName(name, val) {
        console.log(name);
        console.log(val);
        $.ajax({
            url: "/userPermission-controller/menu/checkField",
            data: {"fieldName": name, "fieldValue": val},
            type: "post",
            success: function (res) {
                if (res === "true") {
                    ajaxSave("/userPermission-controller/menu/insert", newNode);
                }
                else {
                    dangerTip("提示", "菜单不可以重名！");
                }
            }
        })
    }

    //点击保存
    $('#savetree').click(function () {
        var childName = $('#menuName').val();
        var menuUrl = $('#menuUrl').val();
        var status = $('#status').val();
        var parentName = $('#parentInput').text();
        var checkMenuName = '';
        //父级菜单不为空
        if (parentName !== "父级菜单") {
            newNode.menuName = childName;
            console.log(newNode);
            console.log(newNode.menuName);
            console.log("提交后的数据-----");
            checkName("menuName", newNode.menuName);
        } else if (childName === "") {
            dangerTip("错误提示", "菜单名称不能空");
        } else if (childName !== "" && parentName == "父级菜单") {//添加一级菜单
            newNode = {
                "parentId": null,
                "menuUrl": "navManage.html",
                "menuName": childName,
                "status": 1,
                "funcs": [{
                    "funName": "添加",
                    "funType": 2,
                    "funUrl": "/add",
                    "status": ""
                },
                    {
                        "funName": "查询",
                        "funType": 1,
                        "funUrl": "string",
                        "status": ""
                    }
                ]
            };
            checkName("menuName", newNode.menuName);
            // if(checkMenuName === "true"){
            //      ajaxSave("/userPermission-controller/menu/insert", newNode);
            //  }
            //ajaxSave("/userPermission-controller/menu/insert", newNode);
        }
    })


    //ajax 提交保存菜单
    function ajaxSave(ajaxURL, newNode) {
        $.ajax({
            url: ajaxURL,
            type: "post",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(newNode),
            success: function (res) {
                console.log("返回的数据-----");
                console.log(res.data);
                if (res.success == true) {
                    BootstrapDialog.show({
                        title: "提示",
                        type: BootstrapDialog.TYPE_SUCCESS,
                        size: BootstrapDialog.SIZE_SMALL,
                        message: '添加成功',
                        buttons: [{
                            label: "确定",
                            action: function (dialog) {
                                dialog.close();
                                ztreeSaveLeave();
                                $("#navTable").bootstrapTable('refresh', {url: '/userPermission-controller/menu/table'});
                                $('#menuName').val('');
                                $('#menuUrl').val('');
                               // $('input[name="Status"]:eq(0):checked');
                                $(':radio[name="Status"]').eq(0).attr("checked",true);
                                console.log(  $('input[name="Status"]:checked').val());
                                $("#parentInput").text('父级菜单');
                            }
                        }]
                    });
                } else {
                    dangerTip("错误提示", "保存失败");
                }
            },
            error: function () {
                console.log("保存或修改----后台报错");
                dangerTip("错误提示", "保存失败");
            }
        })
    }

    // 添加新的根节点到菜单下面
    function selectRootOne(zTree, nodes, lastZnodesId, parentNode, newNode) {
        var childName = $('#menuName').val();
        var menuUrl = $('#menuUrl').val();

        var StatusValue =  $('input[name="Status"]:checked').val();
        var status = '';
        if(StatusValue !="" || StatusValue != undefined){
            switch (StatusValue){
                case '0':
                    status = 0;
                case '1':
                    status = 1;
            }
        }
        var newMenuId = "";
        for (var i = 0, len = nodes.length; i < len; i++) {
            newMenuId = nodes[i].id;
        }
        console.log("选中的id---" + newMenuId);
        newNode = {
            "parentId": newMenuId,
            "menuUrl": menuUrl,
            "menuName": childName,
            "status": status,
            "funcs": [{
                "funName": "添加",
                "funType": 2,
                "funUrl": "/add",
                "status": ""
            },
                {
                    "funName": "查询",
                    "funType": 1,
                    "funUrl": "string",
                    "status": ""
                }
            ]
        };
        return newNode;
    }

    /* 显示所有菜单*/
    $("#slectMenu").click(function () {
        $("#treeMenu").fadeIn();
        //$(".btn_wrapper").fadeIn();
    });
    //获取ztree树
    function getMenu() {
        var zNodes = [];
        $.ajax({
            url: '/userPermission-controller/menu/tree',
            dataType: "json",
            async: false,//必写
            success: function (res) {
                console.log("获得数据");
                console.log(res.data);
                /*var getData = res.data;
                //获取数据,初始化ztree树
                zNodes = resetData(getData);*/
                zNodes = res.data;
            },
            error: function () {
                console.log("获取新增---后台报错")
            }
        });
        return zNodes;
    }

    /*创建一个Ztree对象*/
    function ztreeObj() {
        this.pId = arguments[0];
        this.id = arguments[1];
        this.name = arguments[2];
        this.url = arguments[3];
        this.type = arguments[4];
    }
   // ztree 树的形成
    function resetData(data) {
        var zNodes = [];
        for (var i = 0; i < data.length; i++) {
            //父节点
            if (data[i].parentId == null || data[i].parentId == 0) {
                var obj = new ztreeObj(0, data[i].id, data[i].menuName, data[i].menuUrl);
                zNodes.push(obj);
                if (data[i].subMenus !== null) {
                    //二级菜单子节点
                    for (var j = 0; j < data[i].subMenus.length; j++) {
                        var subObj = new ztreeObj(data[i].id, data[i].subMenus[j].id, data[i].subMenus[j].menuName, data[i].subMenus[j].menuUrl);
                        zNodes.push(subObj);
                    }
                }
            }
        }
        return zNodes;

    }

    function initMenuZtree(menuId, zNodes) {
        var setting = {
            view: {
                showIcon: false,
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
                //beforeDrop:beforeDrop,
                onDrop: zTreeOnDrop,
                beforeRename: zTreeBeforeRename,
                beforeEditName: zTreeBeforeEditName
                // onRename: zTreeOnRename
            },
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: true,
                drag: {
                    isCopy: false
                }
            }
        };


        

        if (menuId == null&&arguments.length ==2) {
            //list列表
            console.log("最后传入的ztree1");
            console.log(zNodes);
            $.fn.zTree.init($('#treeMenu'), setting, zNodes);
            zTreeObj1 = $.fn.zTree.getZTreeObj('treeMenu');
            zTreeObj1.setEditable(false);
            //必须有延迟才能实现初始化时全部展开
            setTimeout(function () {
                zTreeObj1.expandAll(true);
            }, 500);

        } else if(menuId!==null &&arguments.length ==2) {
            //修改菜单列表
            $.fn.zTree.init($('#treeMenu2'), setting, zNodes, menuId);
            zTreeObj2 = $.fn.zTree.getZTreeObj('treeMenu2');                    
            //必须有延迟才能实现初始化时全部展开
            setTimeout(function () {
                zTreeObj2.expandAll(true);
            }, 500);
        }else if(menuId!==null &&arguments.length ==3){
            //菜单详情列表
            $.fn.zTree.init($('#treeMenu2'), setting, zNodes, menuId);
            zTreeObj2 = $.fn.zTree.getZTreeObj('treeMenu2');
            zTreeObj2.setEditable(false);
            //必须有延迟才能实现初始化时全部展开
            setTimeout(function () {
                zTreeObj2.expandAll(true);
            }, 500);
        }
    }

});