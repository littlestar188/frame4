$(function(){

	$('.card:eq(0)').addClass('slideInDown');

	var validator = $('#loginform_email').validate({
		rules:{
			email:{
				required:true,
				email:true,
				remote:"emails.action"
			},
			password:{
				required:true
			}
			/*,
			code:{
				required:true
			}*/

		},
		messages:{
			email:{
				required:"邮箱不能为空",
				email: "请输入正确的邮箱地址",
				remote: jQuery.validator.format("{0} is already in use")//使用ajax方式调用
			},
			password:{
				required:"密码不能为空"
			}
			/*,
			code:{
				required:"验证码不能为空"
			}*/

		},
		errorPlacement: function(error, element) {				
			error.appendTo(element.parent().next());				
		},
		submitHandler:function(){
			alert('submitted!');

		}
	});
	
	var validator = $('#loginform_username').validate({
		focusInvalid:false,
		rules:{
			username:{
				required:true
			},
			password:{
				required:true
			}
			/*,
			code:{
				required:true,
				number:true
			}*/

		},
		messages:{
			username:{
				required:"用户名不能为空"
			},
			password:{
				required:"密码不能为空"
			}
			/*,
			code:{
				required:"验证码不能为空",
				number:"验证码格式不正确"
			}*/

		},
		errorPlacement: function(error, element) {
			//console.log(error,element)
			
			if(element.parent().next().next().html() != ""  ){//.back_error

				element.parent().next().next().html("");
				error.appendTo(element.parent().next());
			}else{
				error.appendTo(element.parent().next());
			}	
							
		},
		submitHandler:function(){
			alert('submitted!');

			//方法一	
			// var param = $("#loginform_username").serialize();
			// param = param.split('&');					
			// console.log(param[0].split('=')[1])
			// console.log(param)
			// var data = {
			// 	userName:param[0].split('=')[1],
			// 	passWord:param[1].split('=')[1],
			// 	checkCode:param[2].split('=')[1]
			// };
			
			//方法二
			var param = $('#loginform_username input').map(function(){
					//console.log($(this).val());
					return $(this).val();
			}).get();

			console.log(param);
			var data = {
				userName:param[0],
				password:base64encode(param[1])
				//,checkCode:param[2]
			};
			console.log(data)
			$.ajax({
				url:'/userPermission-controller/user/login',
				type:"post",
				cache:false,
				dataType:"json",
				data:data,
				success:function(result){
					console.log(result)
					var msgCode = result.code;
					var tip="";
					if(result.success == true){
						localStorage.removeItem("menuTree");
						localStorage.removeItem("menuZtree");
						console.log(result.data.menuFunctionVOList)
						setStorage('menuTree',result.data.menuFunctionVOList);
						setStorage('username',result.data.userName);
						localStorage.removeItem("nav");
						localStorage.removeItem("permission");
						window.location.href="index.html"  ;
					}else{
						/*switch(msgCode){
							case "0":
								tip = "账号不存在";
								$('#username').parent().next().next().html(tip);
								break;
							case "1":
								tip = "验证码错误";
								$('#code').parent().next().next().html(tip);
								break;	
							case "2":
								tip = "用户名或密码错误";
								$('#username').parent().next().next().html(tip);
								break;
						};*/
					}
				},
				error:function(){
					alert("提交异常！");
				}
			});
		}
	});

	var clear = function(){
		$('input').each(function(){
			$(this).on("focus",function(){
				$(this).parent().siblings().html("");
			});
		});
	}();
	
});

