var util = {
	
	//COMMON TOOLS
	isEmptyStr:function(s){
		return !s||s.trim().length==0;
	},
	
	isNull:function(object){
		return object===undefined||object===null;
	},
	
	/**
	*Get url param
	*/
	getUrlParam:function(key){
		var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
		return result && unescape(result[1]) || ""; 
	},
	
	/**
	*eg:10000 to 10,000
	*/
	formatMoney:function(n){
		var b=parseInt(n).toString();
		var len=b.length;
		if(len<=3){return b;}
		var r=len%3;
		return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
	},
	
	/**
	*Convert sq.ft to m².
	*/
	localizeArea:function(sqft){
		return parseInt(sqft/10.7639104);
	},
	/**
	*Translate en to zh_cn.
	*/
	translate:function(key){
		for(var i in translateData){
			if(translateData[i].key==key){
				return translateData[i].value;
			}
		}
	},
	//END COMMON TOOLS
	
	//BUSINESS SERVICES	
	//Some available constants
	PROP_MARKER_ORANGE:'/static/img/orange_position.png',
	DEFAULT_PORTRAIT:'http://api.fun-fang.com/portraits/portraits0.png',
	LOGIN_COOKIE:'bmgf_u',
	FAVORITE_PAGE:'fav',
	CONTACT_PAGE:'contact',
	REQUEST_TRY_TIMES:3,
	/**
	*Get location by Google Geocode.
	*return a latlng object as:{lat:'',lng:''}
	*/
	getGeoByAdressAsync:function(address,callback){
		$.get('http://maps.google.cn/maps/api/geocode/json?address='+address,function(data){
			if(data.status=='OK'){
				if(callback){
					callback(data.results[0].geometry.location);
				}
			}
		});
	},
	
	/**
	*Check user is logged in,if not,open the login dialog.
	*/
	checkLogin:function(){
		if(!isAuthenticated){
			$('#authModal').modal('show');
			return false;
		}
		return true;
	},
	/**
	*Get current login user.
	*/
	getCurrentUser:function(){
		if(sessionStorage.USER){
			return JSON.parse(sessionStorage.USER);
		}
		return null;
	},
	/**
	*Delete login cookie.
	*/
	deleteLoginCookie:function(){
		$.cookie(this.LOGIN_COOKIE,null,{expires:-1});
	},
	/**
	*Update local user data. 
	*/
	updateLocalUser:function(portrait,username,email){
		if(sessionStorage.USER){
			var user=JSON.parse(sessionStorage.USER);
			user.portrait=portrait;
			user.username=username;
			user.email=email;
			sessionStorage.USER=JSON.stringify(user);
		}
		console.log(portrait);
		$('#accountNav img#userPortrait').attr('src',portrait);
		$('#accountNav #username').text(username);
	},
	/**
	*Get current selected property.
	*/
	getCurrentProperty:function(){
		return appModel.selProperty;
	},
	
	/**
	*Initialize the neighborhood map
	*/
	initNeighborhoodMap:function(){
		neighborhoodMap = new google.maps.Map(document.getElementById('nearbyMap'), {
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			zoomControl: true
		});
	},
	/**
	*Set neighborbood map center.
	*/
	setMapCenter:function(lat,lng){
		if(!map){
			map = new google.maps.Map(document.getElementById('googleMap'), {
				zoom: 5,
				center: new google.maps.LatLng(lat, lng),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI:true,
				zoomControl:true,
			});
			return;
		}
		map.setCenter(new google.maps.LatLng(lat,lng));
	},
	
	/**
	*Create a neighborhood marker.
	*/
	createNeighborhoodMarker:function(neighborhood){
		if(!neighborhoodMap)
			return;
		var position=new google.maps.LatLng(neighborhood.lat,neighborhood.lng);
		var marker=new google.maps.Marker({
			map:neighborhoodMap,
			position: position,
			icon: neighborhood.icon_32
		});
		var content='';
		content+='<div>';
		content+='<img src="'+neighborhood.icon_64+'" width="64" height="64">';
		content+='名称：'+neighborhood.name+'<br>地址：'+neighborhood.address+'<br>距离：'+neighborhood.distance;
		content+='</div>';
		var infowindow = new google.maps.InfoWindow({
			position: position,
			content: content
		});
		marker.addListener('click', function() {
			infowindow.open(neighborhoodMap, marker);
		});
		neighborhoodMarkers.push(marker);
	},
	
	/**
	*Create a property marker on neighborhood map.
	*/
	createPropertyMarkerOnNeighborhoodMap:function(property){
		if(!neighborhoodMap)
			return;	
		var position=new google.maps.LatLng(property.geo.lat,property.geo.lng);
		var marker=new google.maps.Marker({
			map:neighborhoodMap,
			position: position,
			icon: this.PROP_MARKER_ORANGE
		});
		var infowindow = new google.maps.InfoWindow({
			position: position,
			content: '您查看的是:'+property.mlsId
		});
		marker.addListener('click', function() {
			infowindow.open(neighborhoodMap, marker);
		});
		neighborhoodMarkers.push(marker);
	},
	
	/**
	*Clear all neighborhood markers.
	*/
	clearNeightborhoodMarkers:function(){
		if(!neighborhoodMap)
			return;
		for(var i in neighborhoodMarkers){
			neighborhoodMarkers[i].setMap(null);
		}
		neighborboodMarkers=[];
	},
	
	/**
	*Show property's photos slider in detail page.
	*/
	showPropertyPhotosSlider:function(){
		$('#neighborhoodMapWrapper').hide();
		$('#propertyPhotosSlider').show();
	},
	
	/**
	*Get new message by object id.
	*/
	getNewMessageByObjectId:function(objectId){
		for(var i =0;i<navModel.newMessageList().length;i++){
			if(navModel.newMessageList()[i].object.id()==objectId){
				return navModel.newMessageList()[i];
			}
		}
		return null;
	},
	
	/**
	*Update new message list of local data.
	*/
	updateLocalNewMessage:function(){
		
		if(navModel.newMessageList()){
				var newMessageList=[];
				for(var i=0;i<navModel.newMessageList().length;i++){
					newMessageList.push(ko.mapping.toJS(navModel.newMessageList()[i]));
				}
				sessionStorage.NEW_MESSAGES=JSON.stringify(newMessageList);
			}
	},
	/**
	*Get conversation by agent id.
	*/
	getConversation:function(agentId){
		for(var i=0;i<chatModel.conversationList().length;i++){
			if(chatModel.conversationList()[i].agentId()==agentId){
				return chatModel.conversationList()[i];
			}
		}
		return null;
	},
	/**
	*Get conversation by object id.
	*/
	getConversationByObjectId:function(objectId){
		for(var i=0;i<chatModel.conversationList().length;i++){
			if(chatModel.conversationList()[i].object.id()==objectId){
				return chatModel.conversationList()[i];
			}
		}
		return null;
	},
	/**
	*Update local conversation history.
	*/
	updateLocalHistory:function(){
		if(chatModel.conversationList()){
			var chatHistory=[];
			for(var i=0;i<chatModel.conversationList().length;i++){
				chatHistory.push(ko.mapping.toJS(chatModel.conversationList()[i]));
			}
			sessionStorage.CHAT_HISTORY=JSON.stringify(chatHistory);
		}
	},
	/**
	*Remove the new message by object id.
	*/
	removeNewMessageByObjectId:function(objectId){
		for(var i=0;i<navModel.newMessageList().length;i++){
			if(navModel.newMessageList()[i].object.id()==objectId){
				navModel.newMessageList.splice(i,1);
				return;
			}
		}
	},
	/**
	*Get a static map image's url by the provided lat and lng.
	*/
	getStaticMap:function(lat,lng){
		var position=lat+','+lng;
		return 'http://maps.google.cn/maps/api/staticmap?center='+position+'&zoom=10&size=340x210&format=jpg&maptype=satellite&markers=size:mid|color:red|label:S|'+position+'&sensor=false';
	},
	
	/**
	*Open the chatting dialog
	*/
	openChatDialog:function(){
		$('#chatWrapper').show();
	},
	/**
	*User login.
	*/
	login:function(request){
		$.post(apiBaseUrl+'/login',request,function(data){
			if(data.code==200){
				sessionStorage.USER=JSON.stringify(data.result);
				window.location.reload();
			}else{
				alert(data.message);
			}
		});
	},
	/**
	*Get contact item html in contact list.
	*/
	getContactItemHtml:function(agent){
		var html='';
		html+='<li data-objectid="'+agent.objectId+'" class="contact-item">';
		html+='		<div class="pull-left">';
		html+='			<img class="img-circle item-portrait" src="'+agent.portrait+'">';
		html+='		</div>';
		html+='		<div class="pull-left">';
		html+='			<ul class="list-unstyled">';
		html+='				<li><h4 class="item-title">经纪人 (中介) 信息</h4></li>';
		html+='				<li><div class="item-agentname">'+agent.username+'</div></li>';
		html+='				<li>'+this.getStarHtml(agent.star)+'<div class="clearfix"></div></li>';
		html+='				<li><div class="item-info">邮箱：</div></li>';
		html+='				<li><div class="item-info">微信：</div></li>';
		html+='			</ul>';
		html+='		</div>';
		html+='		<div class="clearfix"></div>';
		html+='		<div class="item-footer">';
		html+='			<button class="call-agent-btn btn btn-orange-o contact-btn" data-agentid="'+agent.agentId+'" data-loading-text="免费电话">免费电话</button>';
		html+='			<button class="chat-agent-btn btn btn-gray-o contact-btn" data-agentid="'+agent.agentId+'" data-loading-text="在线咨询">在线咨询</button>';
		html+='		</div>';
		html+='	</li>';
		return html;
	},
	/**
	*Load chat expressions.
	*/
	loadExpressions:function(){
		if(chatModel.expressions().length==0){
			var emojiObjectList = RongIMClient.Expression.getAllExpression(64,0);
			for(var i=0,item;item=emojiObjectList[i++];){
				chatModel.expressions.push(item);
			}
		}
	},
	/**
	*Show the special favorite button by mlsId.
	*/
	showFavoriteBtn:function(mlsId){
		console.log(mlsId);
		$('.cancel-favorite-btn-'+mlsId).removeAttr('data-objectid');
		$('.cancel-favorite-btn-'+mlsId).hide();
		$('.favorite-btn-'+mlsId).css('display','block');
	},
	/**
	*Show the special cancel favorite button by mlsId.
	*/
	showCancelFavoriteBtn:function(mlsId,objectId){
		$('.favorite-btn-'+mlsId).hide();//hide favorite button
		$('.cancel-favorite-btn-'+mlsId).attr('data-objectid',objectId);//set cancel button's object id
		$('.cancel-favorite-btn-'+mlsId).css('display','block');;//show cancel favorite button
	},
	/**
	*Add a favorite to local data.
	*/
	addLocalFavorite:function(mlsId,objectId){
		if(sessionStorage.FAV_PROPS){
			var favProps=JSON.parse(sessionStorage.FAV_PROPS);
			for(var i in favProps){
				if(favProps[i].mlsId==mlsId){
					return;
				}
			}
			favProps.push({mlsId:mlsId,objectId:objectId});
		}else{
			sessionStorage.FAV_PROPS=JSON.stringify([{mlsId:mlsId,objectId:objectId}]);
		}
	},
	/**
	*Delete a favorite in local data.
	*/
	deleteLocalFavorite:function(mlsId){
		if(sessionStorage.FAV_PROPS){
			var favProps=JSON.parse(sessionStorage.FAV_PROPS);
			for(var i=favProps.length-1;i>=0;i--){
				if(favProps[i].mlsId==mlsId){
					favProps.splice(i,1);
				}
			}
			sessionStorage.FAV_PROPS=JSON.stringify(favProps);
		}
	},
	/**
	*Get property by mlsId.Note:this method returns a KO object.
	*/
	getPropertyKO:function(mlsId){
		for(var i=0;i<appModel.properties().length;i++){
			if(appModel.properties()[i].mlsId()==mlsId){
				return appModel.properties()[i];
			}
		}
		return null;
	},
	/**
	*Get rating html.
	*/
	getStarHtml:function(star){
		var html='';
		for(var i=1;i<=star;i++){
			html+='<span class="icon icon-star"></span>';
		}
		if(star%parseInt(star)>0){
			html+='<span class="icon icon-star-half"></span>';
		}
		for(var i=0;i<5-Math.round(star);i++){
			html+='<span class="icon icon-star-o"></span>';
		}
		return html;
	},
	/**
	*Add prompt code to local data.
	*/
	addLocalPrompCode:function(prompt){
		if(sessionStorage.COUPONS){
			var coupons=JSON.parse(sessionStorage.COUPONS);
			for(var i in coupons){
				if(coupons[i].promptcode==prompt.promptcode)
					return;
			}
			coupons.push(prompt);
			sessionStorage.COUPONS=JSON.stringify(coupons);
		}else{
			sessionStorage.COUPONS=JSON.stringify([prompt]);
		}
		appModel.coupons.push(prompt);
	},
	/**
	*Create property marker.
	*/
	
	
	createMarker:function(property) {
		preMarker = null;
		if(property.geo.lat && property.geo.lng) {
			var position = new google.maps.LatLng(property.geo.lat, property.geo.lng);
			var marker = new google.maps.Marker({
				position: position,
				icon: '/static/img/blue_position.png'
			});
			
			

			marker.addListener('click', function(e) {
				$('#favori_list').empty();
//				$('#fullFade').fadeIn(10);
				$('#house_pop').show();
				var misc = JSON.parse(sessionStorage.getItem('misc'));
				
				if(preMarker !== null){
					preMarker.setIcon('/static/img/pink_position.png')
				}
				map.panTo(position);
				marker.setIcon('/static/img/orange_position.png');
				preMarker = marker;
				
				var html = '<li class="favoriItem slide-up-box">';
				html += '<div class="behind">';
				html += '<a href="javascript:void(0);" class="ui-btn delete-btn">关闭</a></div>';
				html += '<i class="fa fa-image list-item-default-img"></i>';
				html += '<a href="./view.php?id='
				html += property['mlsId']
				html += '"><img alt="" src="'
				html += property['photos']['0']
				html += '"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约'
				html += parseInt( property['listPrice'] * misc.rate ).formatMoney(0, '¥', ',', '.') +'(人民币)</td><td>房  型：'
				html += property['property']['bedrooms']
				html += '卧 '
				html += parseInt(property['property']['bathrooms'])
				html += '卫</td></tr><tr><td>建筑面积：'
				html += util.localizeArea(property['property']['area'])
				html += '㎡</td><td>土地面积：'
				html += util.localizeArea(property['property']['lotSize'])
				html += '㎡</td></tr><tr><td colspan="2">地  址：'
				html += property['address']['full'];
				html += ' ';
				html += property['address']['city'];
				html += ' ';
				html += property['address']['state'] 
				html += '</td></tr></table><div class="itemIcon" style="right: -15px; padding: 5px;"><i class="btnFavori ';
				html += undefined == property['fav'] ? 'favoriGray' : 'favoriRed';
				html += '" idata="'
				html += property['mlsId']
				html += '" odata=""></i></div></div></div></a></li>';
				
				$('#favori_list').append(html);
				
				$('.property-preview-close-btn').one('click', function(){
					$('#house_pop').fadeOut();
				});
			});

			markerCluster.addMarker(marker);
		}
			
//			var infoHtml='';
//			infoHtml+='<div style="font-size: 12px;color: #666;">';
//			infoHtml+='	<div style="float:left;margin-right: 10px;">';
//			infoHtml+='		<img src="'+util.getPropertyPhoto(property)+'" style="width: 70px;height: 70px;">';
//			infoHtml+='	</div>';
//			infoHtml+='	<div style="float:left;width:150px;">';
//			infoHtml+='		<h4 style="font-size: 14px;color: #eb6334;margin: 7px 0;">约'+property.listPrice+'万(美金)</h4>';
//			infoHtml+='		<div style="margin-bottom: 3px;">';
//			infoHtml+='		<span>'+property.property.lotSize+'平方米</span>';
//			infoHtml+='		<span style="float: right;">'+property.property.bedrooms+'卧'+parseInt(property.property.bathrooms)+'卫</span>';
//			infoHtml+='	</div>';
//			infoHtml+='	<div>'+property.address.full+'</div>';
//			infoHtml+='</div>';
//			var infoWindow = new google.maps.InfoWindow({
//				position: position,
//				content: infoHtml
//			});
//			propertyInfoWindows.push(infoWindow);
//			marker.addListener('click', function() {
//				//close all info windows
//				for(var i in propertyInfoWindows){
//					if(propertyInfoWindows[i]){
//						propertyInfoWindows[i].close();
//					}
//				}
//				//open this info window
//				infoWindow.open(map, marker);
//				//active the item in property list
//				$('#propertyList .property-item').removeClass('active');
//				$('#propertyList #property-item-'+property.mlsId).addClass('active');
//				console.log($('#propertyList #property-item-'+property.mlsId).position().top);
//				$('#propertyListWrapper').animate({scrollTop:$('#propertyList #property-item-'+property.mlsId).position().top-100}, 800);
//			});
			//markerCluster.addMarker(marker);
		},
	/**
	*Get default property photo.
	*/
	getPropertyPhoto:function(property){
		if(property.photos&&property.photos.length>0){
			return property.photos[0];
		}else{
			return util.getStaticMap(property.geo.lat,property.geo.lng);
		}
	},
	/**
	*Check if the property has space.
	*/
	hasSpace:function(property){
		var space=property.property.parking?property.property.parking.spaces:false;
		var garageSpaces=property.garageSpaces;
		if(!space&&!garageSpaces){
			return false;
		}
		return true;
	},
	/**
	*Format some fields's value of propery.
	*/
	formatProperty:function(property){		
		property.defaultPhoto=util.getPropertyPhoto(property);//get a default photo of the property	
		property.listPrice=util.formatMoney(property.listPrice);
		property.property.bathrooms=property.property.bathrooms.replace('.00','');
		property.address.full=property.address.full+','+property.address.city+','+property.address.postalCode;				
		property.property.bathsFull=!property.property.bathsFull?'无':property.property.bathsFull;
		property.property.bathsHalf=!property.property.bathsHalf?'无':property.property.bathsHalf;
		property.property.subType=util.translate(property.property.subType);//房产类型
		property.mls.status=util.translate(property.mls.status);//房产状态
		property.property.lotSize=util.localizeArea(property.property.lotSize);//土地面积
		property.property.area=util.localizeArea(property.property.area);//建筑面积
		//车位信息
		if(!property.property.parking){
			property.property.parking={};
		}
		property.property.hasSpace=util.hasSpace(property)?'有车位':'无车位';
		property.property.parking.spaces=!property.property.parking.spaces?'无':property.property.parking.spaces;
		property.property.garageSpaces=!property.garageSpaces?'无':property.property.garageSpaces;
		//favorite flag
		if(!property.isFavorite){
			property.isFavorite=false;
			property.favoriteObjectId='';
			if(sessionStorage.FAV_PROPS){
				var favoriteProperties=JSON.parse(sessionStorage.FAV_PROPS);
				for(var i in favoriteProperties){
					if(favoriteProperties[i].mlsId==property.mlsId){
						property.isFavorite=true;
						property.favoriteObjectId=favoriteProperties[i].objectId;
						break;
					}
				}
			}
		}
		// if(!property.favoriteObjectId){
			// property.favoriteObjectId='';				
		// }
		//contact flag
		if(!property.isContacted){
			property.isContacted=false;
			if(sessionStorage.CONT_AGENTS){
				var contactRecords=JSON.parse(sessionStorage.CONT_AGENTS);
				for(var i in contactRecords){
					for(var j in contactRecords[i].properties){
						if(contactRecords[i].properties[j]==property.mlsId){
							property.isContacted=true;
							break;
						}
					}
				}
			}
		}
		//
		//prompt flag
		if(!property.recommand){
			property.recommand=false;
		}
		//hot flag
		if(!property.hot){
			property.hot=false;
			if(sessionStorage.HOT_PROPS){
				var hotProperties=JSON.parse(sessionStorage.HOT_PROPS);
				for(var i in hotProperties){
					if(hotProperties[i].mlsId==property.mlsId){
						property.hot=true;
						break;
					}
				}
			}
		}
		//tag
		if(!property.tag){
			property.tag='';
		}
	},
	/**
	*Check if the property is removed.
	*/
	propertyIsRemoved:function(mlsId){
		if(sessionStorage.REMOVED_PROPS){
			var removedProperties=sessionStorage.REMOVED_PROPS.split(',');
			if(removedProperties.indexOf(mlsId+'')!=-1){
				return true;
			}
		}
		return false;
	},
	/**
	*Append a property to list.
	*/
	appendProperty:function(property){
		appModel.properties.push(ko.mapping.fromJS(property));
	},
	/**
	*Get favorite properties
	*/
	getFavoriteProperties:function(){
		if(!sessionStorage.FAV_PROPS){
			$.get(apiBaseUrl+'/favorite',function(data){
				if(data.code==200){
					//save to local
					sessionStorage.FAV_PROPS=JSON.stringify(data.result);
					//is favorite page
					if(util.getCurrentPage()==util.FAVORITE_PAGE){
						$('.propertyLoading').hide();
						for(var i in data.result){
							var property=data.result[i].property;
							if(!property.property)
								continue;			
							property.isFavorite=true;
							property.favoriteObjectId=data.result[i].objectId;
							util.formatProperty(property);
							util.appendProperty(property);
							appModel.propertyTotal(appModel.propertyTotal()+1);
							util.createMarker(property);
						}
					}else{
						//is other page,only need to set favorite flag of property
						for(var i in appModel.properties()){
							for(var j in data.result){
								if(appModel.properties()[i].mlsId()==data.result[j].mlsId){
									appModel.properties()[i].isFavorite(true);
									appModel.properties()[i].favoriteObjectId(data.result[j].objectId);
								}
							}
						}
					}					
				}else{
					alert(data.message);
				}
			}).fail(function(){util.getFavoriteProperties();});
		}
	},
	/**
	*Get contact records.
	*/
	getContactRecords:function(){
		$.get(apiBaseUrl+'/contact',function(data){
			if(data.code==200){
				sessionStorage.CONTACT_RECORDS=JSON.stringify(data.result);
				//if contact page,render the contact record list
				if(util.getCurrentPage()==util.CONTACT_PAGE){
					var contactListHtml='';
					$('#contactCount').text(data.result.length);
					for(var i in data.result){
						var agent=data.result[i];
						contactListHtml+=util.getContactItemHtml(agent);
						util.displayAgentOnMap(agent);
					}
					$('#contactList').append(contactListHtml);
				}else{//if other page,only set the contact flag
					for(var i in appModel.properties()){
						for(var j in data.result){
							if(appModel.properties()[i].mlsId()==data.result[j].mlsId){
								appModel.properties()[i].contacted(true);
							}
						}
					}
				}
			}else{
				alert(data.message);
			}
		});
	},
	/**
	*Get hot properties
	*/
	getHotProperties:function(){
		$.get(apiBaseUrl+'/hot',function(data){
			if(data.code==200){
				sessionStorage.HOT_PROPS=JSON.stringify(data.result);
				for(var i in appModel.properties()){
					for(var j in data.result){
						if(appModel.properties()[i].mlsId()==data.result[j].mlsId){
							appModel.properties()[i].hot(true);
						}
					}
				}
			}else{
				
			}
		}).fail(function(){
			util.getHotProperties();
		});
	},
	/**
	*Get current page name
	*/
	getCurrentPage:function(){
		return util.getUrlParam('page_action');
	},
	/**
	*display agent on map
	*/
	displayAgentOnMap:function(agent){
		var address=agent.city+','+agent.state;
		util.getGeoByAdressAsync(address,function(geo){
			util.createAgentMarker(agent,geo);
		});
	},
	/**
	*Create agent marker on map.
	*/
	createAgentMarker:function(agent,geo){
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
	},
	/**
	*Get contact record.
	*/
	getContactRecord:function(objectId){
		if(sessionStorage.CONTACT_RECORDS){
			var records=JSON.parse(sessionStorage.CONTACT_RECORDS);
			for(var i in records){
				if(records[i].objectId==objectId){
					return records[i];
				}
			}
		}
		return null;
	},
	/**
	*Get recommand properties.
	*/
	getRecommandProperties:function(tryTimes){
		$.get(apiBaseUrl+'/prompt',function(data){
			if(data.code==200){
				for(var i in data.result){
					var property=data.result[i].property;						
					if(!property.property)
						continue;
					property.tag=data.result[i].tag;
					property.recommand=true;
					util.formatProperty(property);
					util.appendProperty(property);
					appModel.propertyTotal(appModel.propertyTotal()+1);
				}
			}else{
				alert('获取推荐房源失败！'+data.message);
			}
			$('.propertyLoading').hide();
		}).fail(function(){
			if(!tryTimes)
				tryTimes=1;
			if(tryTimes>=util.REQUEST_TRY_TIMES){
				alert('发生错误，获取房源失败！');
			}
			else{
				util.getRecommandProperties(tryTimes+1);
			}			
		});
	},
	/**
	*Load city data from server.
	*/
	loadCities:function(callback){
		$.get(apiUrl+'/city',function(data){
			if(data.code==200){
				if(callback)
					callback(data.result);
			}else{
				//util.locaCities();
			}
		}).fail(function(){
			//util.locaCities();
		});
	}
	//END BUSINESS SERVICES
};

/**
 * 转换货币格式，对象必须为数值类型
 * places 小数位数
 * symbol 货币符号
 * thousand 千位分隔符
 * decimal 小数点分隔符
 */
Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
        negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + ' ' + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
};

Date.prototype.format = function(format) {
    var date = {
           "M+": this.getMonth() + 1,
           "d+": this.getDate(),
           "h+": this.getHours(),
           "m+": this.getMinutes(),
           "s+": this.getSeconds(),
           "q+": Math.floor((this.getMonth() + 3) / 3),
           "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
}

//https://scotch.io/quick-tips/how-to-encode-and-decode-strings-with-base64-in-javascript
Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}