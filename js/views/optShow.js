/*
	Createed by caixx on 2017-08
*/

function optShow(id){
	//获取hash值
	var hash = location.hash;
	var pathname = location.pathname;
	hash = hash.substring(1,hash.length);

	var htmlwrap = $('<span></span>');
	var $addBtn = $('.addBtn');
	var $searchBtn = $('.searchBtn');
	var $delGroupBtn = $('.delGroupBtn');
	var $editBtn = createOptBtn(id,'btn-edit','修改','btn-info');
	
	var $watchBtn = createOptBtn(id,'btn-watch','详情');
	if(pathname.indexOf("userManage") != -1){
		$watchBtn = createOptBtn(id,'btn-watch','重置密码');
	}

	var $delBtn = createOptBtn(id,'btn-del','删除','btn-danger'); 
	//console.log($editBtn)

	// var btnPerJudge = function(){
	// 	var opts = $('<span></span>');
	// 	[$addBtn,$delBtn,$editBtn].map(function(item,index){
	// 		//console.log(item,(index+1).toString())
	// 		if(hash.indexOf((index+1).toString())!= -1 ){
	// 			item.removeAttr("disabled");
	// 		}else{
	// 			item.attr("disabled","true");
	// 		}				
	// 		return item[0].outerHTML;
	// 	})
	// 	console.log([$addBtn,$delBtn,$editBtn].get());
	// 	//console.log(html)	
	// 	console.log(opts,[$addBtn,$delBtn,$editBtn])
	// }()
	


	//增
	if(hash.indexOf("1")!= -1 ){
		$addBtn.removeAttr("disabled");
	}else{
		$addBtn.attr("disabled","true");
	}
	//删
	if(hash.indexOf("2")!= -1 ){
		$delBtn.removeAttr("disabled")
		$delGroupBtn.removeAttr("disabled");
	}else{	
		$delBtn.attr("disabled","true")		
		$delGroupBtn.attr("disabled","true");
	}
	//改
	if(hash.indexOf("3")!= -1){
		$editBtn.removeAttr("disabled");
		
	}else{
		$editBtn.attr("disabled","true");
	}
	
	//查
	if(hash.indexOf("4")!= -1 ){
		$searchBtn.removeAttr("disabled");
	}else{
		$searchBtn.attr("disabled","true");
	}
	
	html = $watchBtn[0].outerHTML+"&nbsp;&nbsp;"+$editBtn[0].outerHTML+"&nbsp;&nbsp;"+$delBtn[0].outerHTML
	html = htmlwrap.append(html)[0].outerHTML;
	//console.log(html)
	return html;
}

/*创建table操作中的功能按键
@param id 		roleId
@param btnType 详情/修改/删除
@param btnName
@param btnClass  按键颜色
*/
function createOptBtn(id,btnType,btnName,btnClass){
	var $optBtn = $("<button type='button' class='btn btn-success btn-sm' id='' data-id="+id+" title=''></button>")
	btnClass = btnClass || "btn-success" ;
	var $newOptBtn = $optBtn.clone().attr('id',btnType).attr('title',btnName).removeClass('btn-success').addClass(btnClass).text(btnName);
	return $newOptBtn;
}
