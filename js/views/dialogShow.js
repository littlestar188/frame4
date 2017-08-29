/*created by caixx on 20170829*/

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
/*
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
