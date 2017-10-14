$(function(){
	'use strict';
    //初始化 无左侧菜单占位
    $('body.header-fixed').addClass('sidebar-hidden');
    //移除menu-toggle的icon
    $('.nav.navbar-nav li:first').empty();
    var menuData = JSON.parse(getStorage('menuTree'));
    var creacteBlock = function(){
    	if(menuData){
    		var blockStr = "";
			for(var i=0;i<menuData.length;i++){
				
				blockStr = '<div class="col-sm-6 col-lg-3">'
		                    +'<div class="card card-inverse card-primary menu-list">'
		                        +'<div class="btn-select">'
		                            +'<input type="checkbox">'
		                        +'</div>'
		                        +'<div class="card-block pb-0">'
		                            +'<h4 class="mb-0">'+menuData[i].menuName+'</h4>'
		                        +'</div>'    
		                    +'</div>'
		                +'</div>';
				
				$('#menu-listWrapper').append(blockStr)
			};						
    	};
    	
    }();
});