/*
	Createed by caixx on 2017-08
*/

var perArr,navArr;

$(function(){
	
	perArr = JSON.parse(getStorage("permission"));
	navArr = JSON.parse(getStorage("nav"));
	console.log(navArr)
})

var pathname = location.pathname;
pathname = pathname.split('/')[2];
console.log(pathname);


function navId(){
  for(var i=0;i<navArr.length;i++){
    if(navArr[i].url != undefined){
      console.log(navArr[i].url)
      console.log()
      if(navArr[i].url == pathname){         
        return navArr[i].id
      }
    }       
  }
}


var per = function(){
  var navid = navId(); 
  console.log(navid)
  var newPerArr = [];
  for(var j=0;j<perArr.length;j++){
  
    if(perArr[j].pId != undefined && perArr[j].pId == navid){

      newPerArr.push(perArr[j].id)
    }
  }
  console.log(newPerArr)
  return newPerArr;
}


/*
*@param id 角色id
*/
function optShow(id){

	//获取hash值
	// var hash = location.hash;	
	// hash = hash.substring(1,hash.length);

	var htmlwrap = $('<span></span>');
	var $addBtn = $('#addBtn');
	var $searchBtn = $('#searchBtn');
	var $delGroupBtn = $('#delGroupBtn');
	var $editBtn = createOptBtn(id,'btn-edit','修改','btn-info');
	
	var $watchBtn = createOptBtn(id,'btn-watch','详情');
	if(pathname.indexOf("userManage") != -1){
		$watchBtn = createOptBtn(id,'btn-watch','重置密码');
	}

	var $delBtn = createOptBtn(id,'btn-del','删除','btn-danger');
	var $limitBtn = createOptBtn(id,'btn-limit','黑名单','btn-black');
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
	
	var perFunArr = per();	
	for(var key=0;key<perFunArr.length;key++){

			//增
			if(perFunArr[key].indexOf("1010")!= -1 ){
				$addBtn.show();
			}

			//删
			if(perFunArr[key].indexOf("1011")!= -1 ){
				$delBtn.show()
				$delGroupBtn.show();				
			}

			//改
			if(perFunArr[key].indexOf("1012")!= -1){
				$editBtn.show();
				
			}
			
			//查
			if(perFunArr[key].indexOf("1013")!= -1 ){
				$searchBtn.show();

			}

			if(perFunArr[key].indexOf("1014")!= -1 ){
				$limitBtn.show();
			}
	}

	
	
	html = $watchBtn[0].outerHTML+"&nbsp;&nbsp;"
		+$editBtn[0].outerHTML+"&nbsp;&nbsp;"
		+$delBtn[0].outerHTML+"&nbsp;&nbsp;"
		+$limitBtn[0].outerHTML;

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
	var $newOptBtn = $optBtn.clone()
					.attr('id',btnType)
					.attr('title',btnName)
					.removeClass('btn-success')
					.addClass(btnClass)
					.text(btnName)
					.css("display","none");
	return $newOptBtn;
}



/*var initshow = function(){
	console.info("initshow")
	var worker = new Worker('js/views/permission.js');

	worker.onmessage = function(event){
		document.getElementById("result").innerHTML += 
                event.data+"<br/>"; 
	}
}*/


