$(function(){
	"use strict";
	function createMap(){
		var markerPosition = [119.9923598, 30.2746772];
		var map = new AMap.Map('mapContainer',{
		    resizeEnable: true,
		    zoom: 10,
		    center: markerPosition
		});


		var marker = new AMap.Marker({
		    icon:'resources/img/spot_dgreen.png',
		    position:markerPosition ,//marker所在的位置
		    map:map//创建时直接赋予map属性
		});
		//也可以在创建完成后通过setMap方法执行地图对象

		var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
		marker.content = '<div style="margin:10px;"><table style="font-size:14px;white-space:nowrap; ">' +
		    '<tr><td>资产编号：</td><td></td></tr>'+
		    '<tr><td>条形码：</td><td><a href="/manage/device/view/69861224262211100">69861224262211100</td></tr>'+
		    '<tr><td>芯片编号：</td><td></td></tr>'+
		    '<tr><td>产品类型：</td><td></td></tr>' +
		    '<tr><td>产品型号：</td><td>SD-516BPZ</td></tr>' +
		    '<tr><td>设备归属：</td><td>三全</td></tr>' +
		    '<tr><td>定位时间：</td><td>2017-07-12 19:25:21 </td></tr>' +
		    '<tr><td>定位地址：</td><td>浙江省杭州市余杭区仓前街道文一西路利尔达物联网科技园</td></tr>' +
		    '<tr><td>偏移距离：</td><td>0</td></tr>' +
		    '</table></div>';
		marker.on('click', function (e) {
		    infoWindow.setContent(e.target.content);
		    infoWindow.open(map, e.target.getPosition());
		    map.setZoomAndCenter(18, markerPosition);
		});

		//添加控件
		map.plugin(["AMap.ToolBar"], function() {
		    map.addControl(new AMap.ToolBar());
		});

		marker.setMap(map);
	}
	createMap();
})