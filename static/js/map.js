(function(){
	$(function(){
		appModel={
				properties:ko.observableArray([]),
				propertyTotal:ko.observable(0),
				loadingProperty:ko.observable(true),
				propertyMlsId:ko.observable(0),//current selected property's mlsId
				selProperty:{property:{parking:{}},address:{},tax:{},office:{},mls:{}},//current selected property
				elementarySchools:ko.observableArray([]),
				middleSchools:ko.observableArray([]),
				highSchools:ko.observableArray([]),
				schoolTab:ko.observable('elementary'),
				coupons:ko.observableArray([]),
				removeProperty:function(property){
					for(var i=0;i<appModel.properties().length;i++){
						var mlsId=appModel.properties()[i].mlsId();
						if(mlsId==property.mlsId()){
							appModel.properties.splice(i,1);
							appModel.propertyTotal(appModel.propertyTotal()-1);
							//remember this mlsId in local
							if(sessionStorage.removedProperties){
								var removedProperties=sessionStorage.removedProperties.split(',');
								removedProperties.push(mlsId);
								sessionStorage.removedProperties=removedProperties.toString();
							}else{
								sessionStorage.removedProperties=[mlsId].toString();
							}
						}
					}
				}
			};
			appModel.getSelP = ko.dependentObservable(function () {
				//WARNING:to make current selected property observable,add a redundant code as follow,
				//but don't delete it anyway,else the current selected property will not working!
				//actually,this code is for keeping reference with the appModel.selProperty,and the selected property 
				//will be observable!
				var id=this.propertyMlsId();
				return this.selProperty;
			}, appModel);
			
			document.getElementById('propertyWrapper') && ko.applyBindings(appModel,document.getElementById('propertyWrapper'));
		
		
		var propertyData={
			limit: 10
		};
		var pageSize=10;//display 10 results on per page.
		var perRequestLimit=50;//the max limit per request from server.
		var mapTotalNum=100;
		var preProperties=[];
		var contactData=[];
		

		//init map
		if(!map && $('#mapWrapper').length !== 0){
			map = new google.maps.Map(document.getElementById('googleMap'), {
				zoom: 3,
				center: new google.maps.LatLng(39.2780874, -100.692199),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI:true,
				//https://developers.google.com/maps/documentation/javascript/controls				
				zoomControl:false,
				mapTypeControl:false
			});
			
//			if(GET['cords']){
//				var cords = GET['cords'];
//				var cordsArr = cords.split(',');
//
//				map.setCenter({lat:parseInt(cordsArr[0]), lng:parseInt(cordsArr[1])});
//				map.setZoom(8);
//			}
			
			//
//			map.data.loadGeoJson('/static/data/usa_state_geo.json');
//			
//			map.data.setStyle({
//				fillColor: 'grey',
//				fillOpacity: .5,
//				strokeColor: 'grey',
//				strokeWeight: 1
//			});
			 
//			map.data.addListener('click', function(event) {
//				console.log(event);
//				map.data.revertStyle();
//				map.data.overrideStyle(event.feature, {strokeWeight: 2, fillColor: '#eb6334'});
//			});
			
			
			var mcStyles = [
                {
                	url: '/static/img/1.png',
                	width: 38,
                	height: 38,
                	textColor: '#fff',
                	textSize: 13
                },
                {
                	url: '/static/img/2.png',
                	width: 38,
                	height: 38,
                	textColor: '#fff',
                	textSize: 13
                },
	        ];
			markerCluster = new MarkerClusterer(map,[],{imagePath:'/static/img/', styles: mcStyles});
			
			
			var drawingManager = new google.maps.drawing.DrawingManager({
					drawingControl: false,
					drawingControlOptions: {
						position: google.maps.ControlPosition.RIGHT_TOP,
						drawingModes: [
							google.maps.drawing.OverlayType.POLYGON
						]
					},
					circleOptions: {
						fillColor: '#ffff00',
						fillOpacity: 1,
						strokeWeight: 5,
						clickable: false,
						editable: true,
						zIndex: 1
					}
				});
				google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
					var params='?';
					var latLngs=polygon.latLngs.j[0].j;
					for(var i=0;i<latLngs.length;i++){
						params+='&points='+latLngs[i].J+','+latLngs[i].M;
					}
					getProperties(params,function(){polygon.setMap(null);});
				});
				drawingManager.setMap(map);
				
				//custom drawing control
				function drawingControl(drawingControlDiv, map){
					var isActived = false;
					var polygon = null;
					var drawingControlUI = $('#btn_draw');

					$('#btn_draw').on("click", function() {

						isActived = !isActived;						
						console.log('isActived: ' + isActived);

						var oraPoint, startPoint, endPoint, guideLine, guideLineOpt, guideLineArr, polygonPoints, polygonPointsCount, polygonDefault;
						
						guideLineOpt = {
						    strokeColor: '#ff5c00',
						    strokeOpacity: 1,
						    strokeWeight: 2,
						    clickable: !1
						}

						polygonDefault = {
							strokeColor: "#999999",
							fillColor: "#999999",
							fillOpacity: .3,
							strokeOpacity: 1,
							strokeWeight: 2,
							clickable: !0
						}
						
						polygonPointsCount = 1;
						polygonPoints = new Array();
						guideLineArr = new Array();
						
						if(isActived){
							$('#btn_draw').css({background: '#fafafa', opacity: '.8'}).addClass('fa fa-remove');
							map.setOptions({draggable: false});
							
							google.maps.event.addListener(map, 'mousedown', function(e){
								console.log('mousedown: ' + e.latLng);
								startPoint = e.latLng;
								oraPoint = startPoint;
								polygonPoints.push(startPoint);
							});
							
							//清除Safari浏览器默认上拉下拉行为
							document.ontouchmove = function(event){
							    event.preventDefault();
							}
							
							google.maps.event.addListener(map, 'mousemove', function(e){
								
								console.log('mousemove: ' + e.latLng);
								var currentPoint = e.latLng;
									guideLine = new google.maps.Polyline(guideLineOpt);
									guideLine.setMap(map);
									guideLine.setPath([startPoint, currentPoint]);
									
									guideLineArr.push(guideLine);
									startPoint = currentPoint;
								
								if(polygonPointsCount % 3 == 0){
									polygonPoints.push(currentPoint);
								}
								
								polygonPointsCount++;
							});
							
							google.maps.event.addListener(map, 'mouseup', function(e){
								console.log('mouseup: ' + e.latLng);
								var currentPoint = e.latLng;
								polygonPoints.push(currentPoint);
								
								polygon = new google.maps.Polygon(polygonDefault);
								polygon.setMap(map);
								polygon.setPath(polygonPoints);
								
								clearGuideLines(guideLineArr);
								getPropertiesByPolygon(polygon);
							});
						}else{
							$('#btn_draw').css({background: 'url(/static/img/btn_draw.png) no-repeat', 'background-size': 'contain'}).removeClass('fa fa-remove');
							clearPolygon(polygon);
							map.setOptions({draggable: true});
							google.maps.event.clearListeners(map, 'mousedown');
							google.maps.event.clearListeners(map, 'mousemove');
							google.maps.event.clearListeners(map, 'mouseup');
						}
						
						function clearGuideLines(guideLinesArr){
							for(var i = 0; i < guideLinesArr.length; i++){
								guideLinesArr[i].setMap(null);
							}
						}
						
						function clearPolygon(obj){
							obj.setMap(null);
						}
						
						function getPropertiesByPolygon(polygon){
							var params = '';
							var latLngs = polygon.latLngs.j[0].j;
							for(var i = 0; i < latLngs.length; i++){
								params += '&points=' + latLngs[i].lat() + ',' + latLngs[i].lng();
							}
							
							getProperties('?' + params);
							
						}
					});
				}

				var drawingControlDiv, drawingControl;

				drawingControlDiv = document.createElement('div');
				drawingControlDiv.style.marginTop = '10px';
				drawingControlDiv.style.marginRight = '10px';
				drawingControlDiv.index = 3;

				drawingControl = new drawingControl(drawingControlDiv, map);
				map.controls[google.maps.ControlPosition.RIGHT_TOP].push(drawingControlDiv);
		}
		
		$('#neiborhoodRoadMapBtn').click(function(){
			$('#neighborhoodMapWrapper').show();
			$('#propertyPhotosSlider').hide();
			if(neighborhoodMap){
				neighborhoodMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
			}
		});
		
		$('#neiborhoodSattliteMapBtn').click(function(){
			$('#neighborhoodMapWrapper').show();
			$('#propertyPhotosSlider').hide();
			if(neighborhoodMap){
				neighborhoodMap.setMapTypeId(google.maps.MapTypeId.SATELLITE);
			}
		});
		//bind some click event in property detail
		/*$('#agentWrapper #callAgentBtn').click(function(){
			var agentId=$(this).attr('data-agentid');
			var mlsId=$(this).attr('data-mlsid');
			$('#agentWrapper #contactAgentLoading').show();
			$.get(apiBaseUrl+'/call/'+agentId+'?mlsId='+mlsId,function(data){
				$('#agentWrapper #contactAgentLoading').hide();
				if(data.code==200){
					alert(data.message);
					for(var i in appModel.properties()){
						if(appModel.properties()[i].mlsId()==mlsId){
							appModel.properties()[i].isContacted(true);
						}
					}
					//refresh contact data from server
					$.get(apiBaseUrl+'/contact',function(data){
						if(data.code==200){
							sessionStorage.contactData=JSON.stringify(data.result);
						}else{
							
						}
					});
				}else{
					alert(data.message);
				}
			});
		});*/
		//contact page:bind some buttons' click event
		/*$('#contactPage #closePropertyListBtn').click(function(){
			$('#propertyListWrapper').removeClass('property-list-show');
			$('#propertyDetailWrapper').removeClass('property-detail-show');
		});
		$('#closePropertyDetailBtn').click(function(){
			$('#propertyDetailWrapper').removeClass('property-detail-show');
		});
		$('.click-school-tab').click(function(){
			appModel.schoolTab($(this).data('type'));
		});
		$('.sort-btn').click(function(){
			appModel.loadingProperty(true)
			var self=$(this);
			var sort=self.data('sort');
			var order=self.data('order')==''?'-':'';
			self.data('order',order);
			self.text(order+self.text().replace('-',''));
			getProperties(window.location.search+'&sort='+order+sort);
		});*/
		var renderPropertyPaginationHtml=function(){
			if(appModel.propertyTotal()>0){
				$('.propertyPagination').twbsPagination({
					totalPages:	appModel.propertyTotal()/perRequestLimit,
					visiblePages: 6,
					prev:'<',
					next:'>',
					first:'',
					last:'',
					onPageClick:function(event, page){
						appModel.properties([]);
						var start=(page-1)*pageSize;
						var end=start+pageSize-1;

						var properties=preProperties.slice(start,end);
						for(var i=0;i<properties.length;i++){
							appendProperty(properties[i]);
						}
					}
				});
			}
		};
		var getInboxContentHtml=function(title1, title2, img, outerDirector, url){
			var contentHtml='';
			contentHtml='<div class="infobox"><a href="'+url+'">';
			contentHtml+='	<div class="infobox-bg"></div>';
			contentHtml+='	<div class="infobox-body">';
			contentHtml+='		<div class="infobox-img infobox-img-'+img+'"></div>';
			contentHtml+='		<div class="infobox-content">';
			contentHtml+='			<h3>'+title1+'</h3>';
			contentHtml+='			<h4>'+title2+'</h4>';
			contentHtml+='		</div>';
			contentHtml+='	</div>';
			contentHtml+='	<div class="infobox-outer infobox-outer-'+outerDirector+'"></div>';
			contentHtml+='</a></div>';
			return contentHtml;
		};
		
		var createMarker=function(property){
			var position=new google.maps.LatLng(property.geo.lat,property.geo.lng);
			var marker=new google.maps.Marker({
				position: position,
				icon: '/static/img/orange_position.png'
			});
			var infowindow = new google.maps.InfoWindow({
				position: position,
				content: '您查看的是:'+property.mlsId
			});
			marker.addListener('click', function() {
				if(!$.cookie('userid')) {
					showMsg('Please login', 'error');
					return;
				}
				$('#favori_list').empty();
				$('#house_pop').show();
				$('#favori_list').append('<li class="favoriItem slide-up-box"><div class="behind"><a href="javascript:void(0);" class="ui-btn delete-btn">关闭1</a></div><a href="./view.php?id='+property['mlsId']+'"><img alt="" src="'+property['photos']['0']+'"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约'+util.formatMoney(property['listPrice'])+'(人民币)</td><td>房  型：'+property['property']['bedrooms']+'卧 '+parseInt(property['property']['bathrooms'])+'卫</td></tr><tr><td>建筑面积：'+util.localizeArea(property['property']['area'])+'㎡</td><td>土地面积：'+util.localizeArea(property['property']['lotSize'])+'㎡</td></tr><tr><td colspan="2">地  址：'+property['address']['state']+' '+property['address']['city']+'</td></tr></table><div class="itemIcon"><i class="btnFavori favoriGray" idata="'+property['mlsId']+'" odata=""></i></div></div></div></a></li>')
			});
			markerCluster.addMarker(marker);
		};
		
		//create agent marker on map
		var createAgentMarker=function(agent,geo){
			var a=agent;
			var position=new google.maps.LatLng(geo.lat,geo.lng);
			var marker=new google.maps.Marker({
				map:map,
				position: position,
				icon: '/static/img/agent.png'
			});
			var infowindow = new google.maps.InfoWindow({
				position: position,
				content: '经纪人:'+a.username
			});
			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
		};
		
		//display agent on map
		var displayAgentOnMap=function(agent){
			var address=agent.city+','+agent.state;
			util.getGeoByAdressAsync(address,function(geo){
				createAgentMarker(agent,geo);
			});
		}
		
		//get property data
		var getProperties=function(params,callback){
			showLoader();
			$('#load_fade').show();
			$.get(apiUrl+'/properties'+params+'&limit='+perRequestLimit,function(data){
				hideLoader();
				$('#load_fade').hide();
				if(callback){callback();}
				if(data.results.length===0){
					showMsg('No result searched', 'error');
					return;
				}
				for(var i in mapZoneMarks){
					console.log(mapZoneMarks[i]);
					if(mapZoneMarks[i]){
						//mapZoneMarks[i].setMap(null);
						mapZoneMarks[i].close();
					}
						
				}
				markerCluster.clearMarkers();
				appModel.properties([]);
				preProperties=[];
				//var markerImage = new google.maps.MarkerImage('img/m3.png',new google.maps.Size(24, 32));
				for(var i=0;i<data.results.length;i++){
//					if(i<pageSize){
//						appendProperty(data.results[i]);
//					}
//					//add this result to preload property array,and display it on map.
//					preProperties.push(data.results[i]);
					createMarker(data.results[i]);
				}
				//total page
				var totalPageNum=data.total/perRequestLimit;
				//load the behind results,start from second page
				for(var i=1;i<totalPageNum;i++){
					if(i>=mapTotalNum/perRequestLimit)
						break;
					$.get(apiUrl+'/properties'+params+'&limit='+perRequestLimit+'&offset='+i*perRequestLimit,function(data){
						for(var i=0;i<data.results.length;i++){
							//preProperties.push(data.results[i]);
							createMarker(data.results[i]);
						}
					});
				}
				
				appModel.propertyTotal(data.total);
				//renderPropertyPaginationHtml();
				//displayMapProperties();
			});
		};
		
		//display properties zone
		var displayMapPropertyZone = function() {
			//http://www.oschina.net/code/snippet_12_815
			var icon='/static/img/point.png';
			//Seattle
			var marker1=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(47.6062095000,-122.3320708000),
				icon:icon
			});
			
			//http://stackoverflow.com/questions/7616666/google-maps-api-v3-custom-styles-for-infowindow
			//http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/docs/reference.html#InfoBoxOptions
			var infobox1 = new InfoBox({
				content: getInboxContentHtml('西雅图','微软、亚马逊','seattle','bottom', './search.php?q=Seattle&cords=47.6062095000,-122.3320708000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox1.open(map,marker1);
			mapZoneMarks.push(infobox1);
			
			//San Francisco
			var marker2 = new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(37.7749295000,-122.4194155000),
				icon:icon
			});
			var infobox2 = new InfoBox({
				content: getInboxContentHtml('旧金山','硅谷,科技中心','sfrancisco','bottom', './search.php?q=San Francisco&cords=37.7749295000,-122.4194155000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox2.open(map,marker2);
			mapZoneMarks.push(infobox1);
			
			//Las Vegas
			var marker3=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(36.1699412000,-115.1398296000),
				icon:icon
			});
			var infobox3 = new InfoBox({
				content: getInboxContentHtml('拉斯维加斯','赌城', 'lvegas','', './search.php?q=Las Vegas&cords=36.1699412000,-115.1398296000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(20, -35)
			});
			infobox3.open(map,marker3);
			mapZoneMarks.push(infobox1);
			
			//Los Angeles
			var marker4=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(34.0522342000,-118.2436849000),
				icon:icon
			});
			var infobox4 = new InfoBox({
				content: getInboxContentHtml('洛杉矶','好莱坞,月子中心','langeles','top', './search.php?q=Los Angeles&cords=34.0522342000,-118.2436849000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, 10)
			});
			infobox4.open(map,marker4);
			mapZoneMarks.push(infobox1);
			
			//New York
			var marker5=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(40.7127837000,-74.0059413000),
				icon:icon
			});
			var infobox5 = new InfoBox({
				content: getInboxContentHtml('纽约','自由女神,华尔街','nyork','bottom', './search.php?q=New York&cords=40.7127837000,-74.0059413000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox5.open(map,marker5);
			mapZoneMarks.push(infobox1);
			
			//Cajero Bolivariano
			var marker6=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(27.6648274000,-81.5157535000),
				icon:icon
			});
			var infobox6 = new InfoBox({
				content: getInboxContentHtml('佛罗里达','便宜海景房','cbolivariano','bottom', './search.php?q=Cajero Bolivariano&cords=27.6648274000,-81.5157535000'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox6.open(map,marker6);
			mapZoneMarks.push(infobox1);
			
			//Yellowstone National Park
			var marker7=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(43.0759678000,-107.2902839000),
				icon:icon
			});
			
			var infobox7 = new InfoBox({
				content: getInboxContentHtml('黄石国家公园','地热喷泉','ynpark','bottom', './search.php?q=Yellowstone National Park&cords=44.426395,-110.583664'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox7.open(map,marker7);
			mapZoneMarks.push(infobox1);
			
			//Houston
			var marker8=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(29.760941, -95.364341),
				icon:icon
			});
			
			var infobox8 = new InfoBox({
				content: getInboxContentHtml('休斯顿','航天中心','houston','bottom', './search.php?q=Houston&cords=29.760941, -95.364341'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox8.open(map,marker8);
			mapZoneMarks.push(infobox1);
			
			//Great Lakes
			var marker9=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(45.0834, -82.461313),
				icon:icon
			});
			
			var infobox9 = new InfoBox({
				content: getInboxContentHtml('五大湖','优美湖景','gl','bottom', './search.php?q=Great Lakes&cords=45.0834, -82.461313'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox9.open(map,marker9);
			mapZoneMarks.push(infobox1);
			
			//Detroit
			var marker10=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(42.331193, -83.046038),
				icon:icon
			});
			
			var infobox10 = new InfoBox({
				content: getInboxContentHtml('底特律','钢铁城','detroit','bottom', './search.php?q=Detroit&cords=42.331193, -83.046038'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox10.open(map,marker10);
			mapZoneMarks.push(infobox1);
			
			//Chicago
			var marker11=new google.maps.Marker({
				map:map,
				position:new google.maps.LatLng(41.865616, -87.628852),
				icon:icon
			});
			
			var infobox11 = new InfoBox({
				content: getInboxContentHtml('芝加哥','建筑中心','chicago','bottom', './search.php?q=Chicago&cords=41.865616, -87.628852'),
				closeBoxURL:'',
				pixelOffset: new google.maps.Size(-119, -80)
			});
			infobox11.open(map,marker11);
			mapZoneMarks.push(infobox1);
		};
		
		var current_page = document.location.href;
		if (current_page.match(/index/)) {
			displayMapPropertyZone();
		} else if (current_page.match(/search/)) {
			//getProperties('?q=l');
		}

	});
})();
