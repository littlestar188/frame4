/*created by caixx on 20170829*/


/*删除某条数据，显示提示并传参 返回结果
@param tableElemId  某表单DOM元素id
@param dataId   删除某数据id
@param ajaxURL1 删除某数据接口
@param ajaxURL2 刷新表单接口
*/
function delTip(tableElemId,dataId,ajaxURL1,ajaxURL2){
	
		BootstrapDialog.confirm({
			title:"提示",
			type:BootstrapDialog.TYPE_DANGER,
			size: BootstrapDialog.SIZE_SMALL,
			message:"确定删除吗？",
			callback:function(res){
				if(res){
					console.log(dataId)
					$.ajax({
						url:ajaxURL1,
						type:"post",
						data:{
							"id":dataId
						},
						success:function(res){
							if(res.success == true){
								$("#"+tableElemId).bootstrapTable('refresh', {url:ajaxURL2});
								successTip("删除成功！")
							}else{
								dangerTip("提示",res.msg+"！")
							}
						}
					})
				}
			}
		});
		
}

/*成功提示*/
function successTip(msg){
	BootstrapDialog.show({
		title:"提示",
		type:BootstrapDialog.TYPE_SUCCESS,
		size: BootstrapDialog.SIZE_SMALL,
		message:msg,
		buttons:[{
			label:"确定",
			action:function(dialog){
				dialog.close();
			}
		}]
	});	
}

/*错误提示
@param tle 标题
@param msg 提示信息
*/
function dangerTip(tle,msg){
	BootstrapDialog.show({
		title:tle,
		type:BootstrapDialog.TYPE_DANGER,
		size: BootstrapDialog.SIZE_SMALL,
		message:msg,
		buttons:[{
			label:"确定",
			action:function(dialog){
				dialog.close();
			}
		}]
	});	
}

/*右侧权限树显示		   
  @param title 新增/修改
*/
function ztreeShow(title){
	$('.ztree_title').html(title);

	if(title == "详情"){
		$('.ztree_roleInput').hide();
		$('.ztree_wrapper .tree_save').hide();
	}else{
		$('.ztree_roleInput').show();
		$('.ztree_wrapper .tree_save').show();
	}

	
	$('.ztree_tip').children().css('display','none');
	$('.ztree_wrapper').removeClass('fadeOutRight')
	$('.table_wrapper').removeClass('col-lg-12').addClass('col-lg-9');
	$('.ztree_wrapper').addClass('slideInRight').fadeIn();

}

function menuEditShow(title) {
    $('.ztree_title_edit').html(title);
    if(title == "详情"){
        $('.ztree_roleInput').hide();
        $('.ztree_wrapper .tree_save').hide();
    }else{
        $('.ztree_roleInput').show();
        $('.ztree_wrapper .tree_save').show();
    }

    $('.ztree_tip').children().css('display','none');
    $('.ztree_wrapper_edit').removeClass('fadeOutRight')
    $('.table_wrapper').removeClass('col-lg-12').addClass('col-lg-9');
    $('.ztree_wrapper_edit').addClass('slideInRight').fadeIn();
}
/*右侧权限树消失
  @param elem  btn-success/btn-cancel 
*/
function ztreeSaveLeave(){
	
		setTimeout(function(){				
			$('.table_wrapper').removeClass('col-lg-9').addClass('col-lg-12');
		},1500)

		setTimeout(function(){				
			$('.ztree_wrapper').removeClass('slideInRight').fadeOut();
		},500)
		
}

function ztreeCancelLeave(){
	$('.btn_wrapper').on("click",".btn-primary.tree_cancel",function(){
		setTimeout(function(){				
			$('.table_wrapper').removeClass('col-lg-9').addClass('col-lg-12');
		},1500)

		setTimeout(function(){				
			$('.ztree_wrapper').removeClass('slideInRight').fadeOut();
		},500)
	})
}
