/*created by caixx on 20170829*/


/*删除某条数据，显示提示并传参 返回结果
@param tableElemId  某表单DOM元素id
@param dataId   删除某数据id
@param ajaxURL1 删除某数据接口
@param ajaxURL2 刷新表单接口
*/
function delTip(tableElemId,dataId,ajaxURL1,ajaxURL2){
	if(arguments.length == 3){
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
						data:dataId,
						success:function(res){
							if(res.returnCode == 0){
								//$("#"+tableElemId).bootstrapTable('refresh', {url:ajaxURL2});
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
