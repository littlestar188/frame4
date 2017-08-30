$(function(){
	'use strict';
	function initPerson(){
		$.ajax({
			//url:'resources/json/person.json',
			url:"/manage/user/personInfo",
			cache:false,
			dataType:"json",
			success:function(res){
				console.log(res)
				var data = res.data;
				
				var tr = $('<tr><td></td><td></td></tr>');
				$.each(data,function(i,n){
					var trc = tr.clone();
					trc.find('td:nth-child(1)').text(i);
					if(n !== null && n !== undefined ){						
						trc.find('td:nth-child(2)').text(n);
						//console.log(i,n)
					}
					trc.appendTo('#person_table>tbody');//无序
					//console.log(trc)
				})

				$('#person_table>tbody').find('tr>td:nth-child(1)').each(function(){

					var txt = $(this).text();
					//if(txt !== "null" && txt !== undefined ){
						var newTxt = redefine(txt);
						$(this).text(newTxt+" :");
					//}
					
					//console.log(txt)
				})
				

			},
			error:function(){
				console.log('person infomation  --- fall')
			}
		})
		
	}

	function redefine(text){
		switch(text){
			case "userId":
			     text = "用户ID";
			     break;
			case "userName":
			     text = "用户姓名";
			     break;
			case "realName":
				text = "真实姓名"
			    break;
			case "roleName":
				text = "角色名";
				 break;
			case "type":
				text = "角色类型"
			    break;
			case "sex":
				text = "性别"
			    break;
			case "phone":
				text = "电话"
			    break;
			case "email":
				text = "邮箱"
			    break;
			case "createTime":
				text = "创建时间"
			    break;
			case "lastLoginTime":
				text = "最后登录时间"
			    break;
			case "lastLoginIp":
				text = "最后登录IP"
			    break;
			case "count":
				text = "登录次数"
			    break;
			case "limit":
				text = "权限区域"
			    break;
			case "remark":
				text = "备注"
			    break;
			 case "department":
			 	text = "部门"
			    
		}
		return text;
	}
	initPerson()
});