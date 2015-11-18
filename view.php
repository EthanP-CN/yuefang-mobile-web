<?php 
$headerTitle = '悦房-为你推荐好房';
?>

<?php include_once 'header.php'; ?>
<script src="/static/js/jquery.bxslider.js"></script>
        <div id="site">
            <header>
                <a id="return" href="javascript:void(0);"></a>
                <h3></h3>
                <span class="header-property-controls">
                    <a href="javascript:void(0)" id="prevPropertyBtn">
                        <i class="fa fa-angle-left"></i>
                    </a>
                    <a href="javascript:void(0)" id="nextPropertyBtn">
                        <i class="fa fa-angle-right"></i>
                    </a>
                </span>
            </header>
            
            <div id="mainContent" class="content" style="display:none; height: auto;">
                <div id="slides_wrapper" style="float: left; width: 100%;">
                	<ul id="slides" class="bxslider"></ul>
<!--                 	<div id="sliderPageNum" class="slider-page-num"></div> -->
                </div>

                <section id="basic_info" class="property-basic-info">
                    <a id="view_map" href=""><img src="/static/img/view_map.png"></a>
                </section>
                
                <section id="view_basic">
                    <div class="sectionTitle lh30">
                        <span>物业特色</span>
                        <button class="btn btn-sm btn-primary pull-right baidu-trans-btn" data-target="#remarks" data-trans-state="src" data-is-trans="0">帮我翻译</button>
                    </div>
                    <div id="remarks" style="font-size: 0.9em;" class="sectionContent">
                        <span class="src-text"></span>
                        <span class="dst-text" style="display: none;"></span>
                    </div>
                </section>
                
                <section id="more_info">
                    
                </section>
                <a id="showMoreDetailBtn" href="javascript: void(0)" class="show-more-detail-btn">
                    <span>更多</span>
                    <i class="fa fa-angle-down"></i>
                </a>
                <!-- 
                <section class="viewSection">
                    <div class="sectionTitle">
                        <span>价格/税务历史</span><i class="arrow arrowDown"></i>
                    </div>
                    <div class="sectionContent">
                    
                    </div>
                </section>
                
                <section class="viewSection">
                    <div class="sectionTitle">
                        <span>家庭开支</span><i class="arrow arrowDown"></i>
                    </div>
                    <div class="sectionContent">
                    
                    </div>
                </section>
                
                <section class="viewSection">
                    <div class="sectionTitle">
                        <span>美食指数</span><i class="arrow arrowDown"></i>
                    </div>
                    <div class="sectionContent">
                    
                    </div>
                </section>
                -->
                <section class="viewSection">
                    <a id="toggle_life_index" class="sectionTitle">
                        <span>华人生活指数</span><i class="arrow arrowDown view-section-arrow"></i>
                    </a>
                    <div style="display: none;" class="sectionContent">
                        <ul id="life_index">
                        </ul>
                    </div>
                </section>
                
                <section class="viewSection view-section-last">
                    <a id="toggle_edu_index" class="sectionTitle" href="javascript:void(0);">
                        <span>教育指数</span><i class="arrow arrowDown view-section-arrow"></i>
                    </a>
                    <div style="display: none;" class="sectionContent">
                        <ul id="edu_index">
                            
                        </ul>
                    </div>
                </section>
                
                <section id="agent_info" class="viewAgent">
                    <div class="agentInfo">
                        <img id="agent_avatar" alt="" src="">
                        <div id="agent_basic">
                            <h3>经纪人（中介）信息</h3>
                            <p id="agent_name"></p>
                            <div id="agent_raty"></div>
                            <p id="agent_wechat"></p>
                            <p id="agent_email"></p>
                            
                        </div>
                    </div>
                    
                    <div class="agentContact">
                        <a id="agent_call" href="javascript:void(0);" class="">电话联系</a>
                        <a id="agent_chat" href="javascript:void(0);" class="">在线联系</a>
                    </div>
                </section>
                
                <section id="">
                    <div class="sectionTitle">
                        <span>类似房源</span>
                    </div>
                </section>
                <ul id="favori_list" style="margin-bottom: 60px;" class="common-list"></ul>
            </div>
            
            <ul id="view_footer">
                <li class="telContact"><a id="goToAgent" href="javascript:void(0);"><span><i id="ico_chat"></i>联系</span></a></li>
                <li class="onlineContact"><a id="view_favori" href="javascript:void(0);"><span><i id="ico_favori"></i><span>收藏</span></span></a></li>
                <li class="onlineContact"><a id="view_share" class="-mob-share-open" href="javascript:void(0);"><span><i id="ico_share"></i>分享</span></a></li>
            </ul>
        </div>
        <div id="fade"></div>
        <div id="pop_fade"></div>
        <div id="load_fade"></div>
    </div>
    
    <div id="share_pop" class="pop" style="display:none;">

    </div>
    
    <div class="-mob-share-ui" style="display: none;">
        <ul class="-mob-share-list">
            <li class="-mob-share-weibo"><p>新浪微博</p></li>
            <li class="-mob-share-tencentweibo"><p>腾讯微博</p></li>
            <li class="-mob-share-qzone"><p>QQ空间</p></li>
            <li class="-mob-share-qq"><p>QQ好友</p></li>
            <li class="-mob-share-weixin"><p>微信</p></li>
        </ul>
        <button id="cancel_share" style="height: 50px; line-height: 50px; background: #eb6334; width: 90%; margin: 0 5% 30px 5%; font-size: 1em; border-style: none; color: #fff;" class="-mob-share-close">取消</button>
    </div>
<script id="-mob-share" src="http://f1.webshare.mob.com/code/mob-share.js?appkey=7f09e39d6c20"></script>
<div id="call_pop" class="pop" style="display: none;"></div>
<script type="text/javascript" src="/static/js/jquery.raty.js"></script>
<script type="text/javascript">


$(function() {
	showLoader();
	$('#load_fade').show();
	var agentId = "", agentName = "", agentAvatar="";
	var imgSrc = "";
	var rate = "", sqft = "";
	var currentId = GET['id'];
	if(sessionStorage.getItem('list.current.mlsids') !== null){
    	var ssmlsids = sessionStorage.getItem('list.current.mlsids').split(',');
    	var i = ssmlsids.indexOf(currentId);
		$('header').find('h3').text((i + 1) + ' / ' + ssmlsids.length);
	}else{
    	$('#prevPropertyBtn, #nextPropertyBtn').fadeOut(10);
	}
	
	RongIMClient.init("sfci50a7chtpi");

	

	$.ajax({
        cache: false, 
		url: apiUrl + "/misc",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			rate = msg['rate'];
			sqft = msg['sqft'];
		}
	});

	$('#return').on('click', function(){
		var searchQueryStr = sessionStorage.getItem('search.query.string');
		var rtnUrl = '';
		if(searchQueryStr !== null){
			rtnUrl += '/list.php';
			rtnUrl += searchQueryStr;
		}else{
			rtnUrl += '/index.php';
		}

		location.href = rtnUrl;
	});

	$('#goToAgent').on('click', function(){
		$('html, body').animate({scrollTop: $('#agent_info').position().top}, 1000);
	});

	$('#showMoreDetailBtn').on('click', function(){
		if($('.show-more-detail').css('display') == 'none'){
    		$(this).find('span').text('隐藏');
    		$(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
    		$('.show-more-detail').slideDown(200);
		}else{
			$(this).find('span').text('更多');
			$(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    		$('.show-more-detail').slideUp(200);
		}
	});

	$('#prevPropertyBtn').on('click', function(){
		


		var prevMlsid = '';
		if(i == 0){
			prevMlsid = ssmlsids[ssmlsids.length - 1];
		}else{
			prevMlsid = ssmlsids[i-1];
		}

		location.href = '/view.php?id=' + prevMlsid;
	});

	$('#nextPropertyBtn').on('click', function(){
		


		var nextMlsid = '';
		if(i == ssmlsids.length - 1){
			nextMlsid = ssmlsids[0];
		}else{
			nextMlsid = ssmlsids[i+1];
		}

		location.href = '/view.php?id=' + nextMlsid;
	});
	
	$.ajax({
        cache: false, 
		url: apiUrl + "/properties/"+ GET['id'],
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			$('#load_fade').fadeOut(100);
			if(msg.code !== 200){
				showMsg('网站好像出现了一点小问题哦，程序猿们正在努力排查！');
				return;
			}

// 			var photoTotal = msg.result.photos.length;
// 			$('#sliderPageNum').text(  ' / ' + photoTotal);

			$.each(msg.result.photos, function(idx, ele) {
				$('#slides').append('<li><img src="'+ele+'"></li>');
			});

			$('.bxslider').bxSlider({
				auto: true,
				mode: 'fade',
				controls: false,
				pager: true,
				pagerType: 'short'
			}).startAuto;

			if(undefined !== msg['result']['fav'] && msg['result']['fav'] == 1){
				$('#ico_favori').css({"background":"url(/static/img/favori_red.png) no-repeat", "background-size":"contain"});
				$('#ico_favori').next('span').text('已收藏');
			}

			
			$('#mainContent').fadeIn(500)
			hideLoader();
			if(msg.result){
				msg = msg.result;
				agentId = msg['agent']['id'];
				agentName = msg['agent']['firstName'];
				agentAvatar = msg['agent']['portrait'];

				$('#agent_avatar').attr('src', msg['agent']['portrait']);
				$('#agent_name').text(msg['agent']['firstName'])
				$('#agent_raty').raty({ score : msg['agent']['star'] });
				$('#agent_wechat').text("微信："+msg['agent']['wechat']);
				$('#agent_email').text("邮箱："+msg['agent']['email']);
				
				$('#view_map').attr('href', './vmap.php?id='+GET['id']+'&lat='+msg['geo']['lat']+'&lng='+msg['geo']['lng']);				
				$('#basic_info').append('<table id="binfo_table"><tr><td class="introPrice">约'+util.formatMoney(msg['listPrice']*rate)+'(人民币)</td><td>房  型：'+msg['property']['bedrooms']+'卧 '+parseInt(msg['property']['bathrooms'])+'卫</td></tr><tr><td>建筑面积：'+util.localizeArea(msg['property']['area'])+'㎡</td><td>土地面积：'+util.localizeArea(msg['property']['lotSize'])+'㎡</td></tr><tr><td colspan="2">地  址：'+msg['address']['full'] + ' ' + msg['address']['city']+' '+msg['address']['state']+'</td></tr></table>');
				
				$('#remarks > .src-text').text(msg['remarks']);

				var subType = "";
				var msubType = msg['property']['subType'];
				
				switch(msubType) {
    				case 'Residential':
    					subType = "住宅";
    					break;
    				case 'Multifamily':
    					subType = "多栋";
    					break;
    				case 'Condominium':
    					subType = "公寓";
    					break;
    				case 'Commercial':
    					subType = "商业地产";
    					break;
    				case 'Land':
    					subType = "地块";
    					break;
    				case 'SingleFamilyResidence':
    					subType = "独栋";
    					break;
    				case 'Townhouse':
    					subType = "联排";    
    					break;
				}

				var moreInfoHtml = '<table id="info_table">';
				moreInfoHtml += '<tr><th colspan="2">基本信息</th></tr>';
				moreInfoHtml += '<tr>';
				moreInfoHtml += '<td><i>&#9679;</i>发布时间：'+msg['mls']['daysOnMarket']+'天</td>';
				moreInfoHtml += '<td><i>&#9679;</i>修建时间：'+msg['property']['yearBuilt']+'年</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr>';
				moreInfoHtml += '<td><i>&#9679;</i>房产类型：'+ subType +'</td>';
				moreInfoHtml += '<td><i>&#9679;</i>MLS#：'+msg['listingId']+'</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr>';
				moreInfoHtml += '<td><i>&#9679;</i>税号：'+msg['tax']['id']+'</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr><th>信息来源</th><th>特别鸣谢</th></tr>';
				moreInfoHtml += '<tr>';
				moreInfoHtml += '<td><i>&#9679;</i>'+msg['source']+'</td>';
				moreInfoHtml += '<td><i>&#9679;</i>'+msg['office']['name']+'</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr class="show-more-detail"><th colspan="2">内部特征</th></tr>';
				moreInfoHtml += '<tr class="show-more-detail"><th>浴室信息</th><th>房间信息</th></tr>';
				moreInfoHtml += '<tr class="show-more-detail">';
				moreInfoHtml += '<td><i>&#9679;</i>浴室（全）：'+msg['property']['bathsFull']+'</td>';
				moreInfoHtml += '<td><i>&#9679;</i>房间：'+msg['property']['additionalRooms']+'</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr class="show-more-detail"><td colspan="2"><i>&#9679;</i>浴室（3/4）：'+msg['property']['bathsHalf']+'</td></tr>';
				moreInfoHtml += '<tr class="show-more-detail"><th colspan="2">车位 / 车库</th></tr>';
				moreInfoHtml += '<tr class="show-more-detail"><th>车位</th><th>车库信息</th></tr>';
				moreInfoHtml += '<tr class="show-more-detail">';
				moreInfoHtml += '<td><i>&#9679;</i>有车位</td>';
				moreInfoHtml += '<td><i>&#9679;</i>车库数：'+msg['property']['garageSpaces']+'</td>';
				moreInfoHtml += '</tr>';
				moreInfoHtml += '<tr class="show-more-detail"><td colspan="2"><i>&#9679;</i>车位数：'+msg['property']['parking']['spaces']+'</td></tr>';
				moreInfoHtml += '<tr class="show-more-detail"><th colspan="2">租赁信息</th></tr>';
				moreInfoHtml += '<tr class="show-more-detail"><td colspan="2"><i>&#9679;</i>土地租赁：'+msg['leaseType']+'</td></tr>';
				moreInfoHtml += '</table>';
				
				$('#more_info').append(moreInfoHtml);
				
				lifeIndex(msg['geo']['lat'], msg['geo']['lng']);
				eduIndex(msg.address.full, msg.address.city, msg.address.state);
				relatedHouse();
			}
		}
	});

	
	$('.baidu-trans-btn').on('click',function(){
		var target = $(this).data('target');
		var state = $(this).data('trans-state');
		var isTrans = $(this).data('is-trans');
		var transText = $.trim($(target).text());
		var url = 'http://openapi.baidu.com/public/2.0/bmt/translate';

		   

		if(state === 'src'){
			if(isTrans == '0'){
    			$('.baidu-trans-btn').text('正在翻译，请稍后...');
    			$.ajax({  
    		         url: "http://openapi.baidu.com/public/2.0/bmt/translate",
    		         data: {client_id: '3STOykApYNfwyIKjjFTzvxFa', q: transText, from: 'en', to: 'zh'},
    		         dataType: "jsonp",  
    		         jsonp: "cb", //  
    		         //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)  
    		         jsonpCallback:"test", //需要的回调函数  
    		         success: function(data){  
    		        	 if(data.error_code === undefined){
 	        				$('.baidu-trans-btn').removeClass('btn-primary').addClass('btn-success').text('切换回英文').data('trans-state', 'dst').data('is-trans', '1');
 	        				$(target).find('.src-text').fadeOut(10);
 	        				$(target).find('.dst-text').text(data.trans_result[0].dst).fadeIn(200);
 	        			}else{
 	        				alert('翻译功能好像出现问题了哦，程序猿们正在加紧修复...');
 	        			}
    		         },  
    		         error: function(){  
    		            conosle.error('网络异常');  
    		         }  
    		    });  
//         		$.get(url, {client_id: '3STOykApYNfwyIKjjFTzvxFa', q:transText, from: 'en', to: 'zh'}, function(data){
//         			if(data.error_code === undefined){
//         				$('.baidu-trans-btn').removeClass('btn-primary').addClass('btn-success').text('切换回英文').data('trans-state', 'dst').data('is-trans', '1');
//         				$(target).find('.src-text').fadeOut(10);
//         				$(target).find('.dst-text').text(data.trans_result[0].dst).fadeIn(200);
//         			}else{
//         				alert('翻译功能好像出现问题了哦，程序猿们正在加紧修复...');
//         			}
//         		});
			}else{
				$('.baidu-trans-btn').removeClass('btn-primary').addClass('btn-success').text('切换回英文').data('trans-state', 'dst').data('is-trans', '1');
				$(target).find('.src-text').fadeOut(10);
				$(target).find('.dst-text').fadeIn(200);
			}
		} else {
			$('.baidu-trans-btn').removeClass('btn-success').addClass('btn-primary').text('帮我翻译').data('trans-state', 'src');
			$(target).find('.dst-text').fadeOut(10);
			$(target).find('.src-text').fadeIn(200);
		}
	});
	
    var flag = 1;
	$('#toggle_life_index, #toggle_edu_index').click(function() {
		if(flag == 1) {
			$('i', this).removeClass('arrowDown').addClass('arrowUp');
		    $(this).siblings('div').slideDown(200);
			flag = 0;
		}
		else {
			$('i', this).removeClass('arrowUp').addClass('arrowDown');
		    $(this).siblings('div').slideUp(200);
			flag = 1;
		}
	});


    // Property favorite
    var favori = true;
    var objectId = "";
	$('#view_favori').click(function() {
		if(!($.cookie('userid'))) {
			showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
		}
		else {
			showLoader();
			$('#load_fade').show();
    		
    		if(favori) {
    			$('#ico_favori').css({"background":"url(/static/img/favori_red.png) no-repeat", "background-size":"contain"});
    			favori = false;
    			$.ajax({
    	            cache: false, 
    	    		url: apiUrl + "/favorite",
    	    		type: "POST",
    	    		dataType: 'json',
    	    		data: {'mlsId' : GET['id']},
    	    		success: function (msg) {
    	    			$('#load_fade').hide();
    	    			hideLoader();
    	    			if(msg['code'] == 200){
        	    			objectId = msg['result']['objectId'];
    		    			showMsg('Successful', 'ok');
    	    			}
    	    			else {
        	    			showMsg(msg['message'], 'error');
    	    			}
    	    		}
    	    	});
    		}
    		else {
    			$('#ico_favori').css({"background":"url(/static/img/ico_favori.png) no-repeat", "background-size":"contain"});
    			favori = true;
    	    	$.ajax({
    	            cache: false, 
    	    		url: apiUrl + "/delfavorite",
    	    		type: "POST",
    	    		data: {'objectId':objectId },
    	    		dataType: 'json',
    	    		success: function (msg) {
    	    			$('#load_fade').hide();
    	    			hideLoader();
    	    			if(msg){
    		    			showMsg(msg['message'], 'error');
    	    			}
    	    		}
    	    	});
    		}
		}
	});

	$('#agent_call').click(function() {
		if(!($.cookie('userid'))) {
			showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
		}
		else {
			$('#call_pop').show().html('<p>已为您联系经纪人<br>是否现在接通（本次通话为免费电话）</p><div><button class="popBtn" id="yes_btn">确定</button><button class="popBtn" id="no_btn">取消</button></div>');
			$('#yes_btn').click(function() {
				$('#call_pop').hide();
			    agentCall(agentId);
			});
			$('#no_btn').click(function() {
			    $('#call_pop').hide();
			});
		}
	});
	
	$('#agent_chat').click(function() {
		if(!($.cookie('userid'))) {
			showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
		}
		else {
    		if (agentId) {
    			agentChat(agentId, agentName, agentAvatar);
    		}
    		else {
    			showMsg('Agent data wrong', 'error');
    		}
		}
	});

	/*
	*  Cancel share
	*/
    $('#cancel_share').click(function() {
    	$('#share_pop').hide();
    });
});

/*
 * Lifestyle index
 */
function lifeIndex(lat, lng) {
	$.ajax({
        cache: false, 
		url: apiUrl + "/neighborhood?lat="+lat+"&lng="+lng,
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			if(msg['code'] == 200) {
				var ele = msg['result'];
				
				for(i=0; i<3; i++) {
					var html = '<li class="lindexItem"><img alt="" src="';
					html += ele[i]['icon_64'];
					html += '"><div><h3><span>';
					html += ele[i]['name'];
					html += '</span><em>';
					html += (ele[i]['distance'] / 1000).toFixed(2);
					html += '公里</em></h3><p>';
					html += ele[i]['address'];
					html += '</p></div></li>';
					$('#life_index').append(html);
				}
			} else {
				
			}
		}
	});
}

/*
 * Education index
 */
function eduIndex(address, city, state) {
	$.ajax({
        cache: false, 
		url: apiUrl + "/greatschool?type=1&address=" + address + "&city=" + city + "&state="+state,
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			if(msg['code'] == 200){
				var res = msg.result;
				
				$('#edu_index').append('<li class="eindexItem"><img alt="" src="/static/img/school/'+res['elementary-schools']['0']['rating']+'.png"><div><h3>'+res['elementary-schools']['0']['name']+'</h3><p>'+res['elementary-schools']['0']['grades']+'<em>距离：'+res['elementary-schools']['0']['distance']+'公里</em></p></div></li><li class="eindexItem"><img alt="" src="/static/img/school/'+res['high-schools']['0']['rating']+'.png"><div><h3>'+res['high-schools']['0']['name']+'</h3><p>'+res['high-schools']['0']['grades']+'<em>距离：'+res['high-schools']['0']['distance']+'公里</em></p></div></li><li class="eindexItem"><img alt="" src="/static/img/school/'+res['middle-schools']['0']['rating']+'.png"><div><h3>'+res['middle-schools']['0']['name']+'</h3><p>'+res['middle-schools']['0']['grades']+'<em>距离：'+res['middle-schools']['0']['distance']+'公里</em></p></div></li>');
			}
			else {
				
			}
		}
	});
}


function relatedHouse() {
	
	$.ajax({
        cache: false, 
		url: apiUrl + "/prompt",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			if(msg['code'] == 200) {
				var ele = msg['result'];
				var misc = JSON.parse(sessionStorage.getItem('misc'));
				for(var i = 0; i < 3; i++) {
					if(ele[i]['item']['geo']) {
						if(ele[i]['item']['photos']['0']) {
						    imgSrc = ele[i]['item']['photos']['0'];
						} else {
						    imgSrc = 'http://maps.google.cn/maps/api/staticmap?center='+ele[i]['item']['geo']['lat']+','+ele[i]['item']['geo']['lng']+'&zoom=5&size=500x300&format=jpg&maptype=roadmap&markers=size:mid|color:red|label:S%E6%82%A6%E6%88%BF|'+ele[i]['item']['geo']['lat']+','+ele[i]['item']['geo']['lng']+'\'';
						}

						var html = '<li class="favoriItem">';
						html += '<i class="fa fa-image list-item-default-img"></i>';
						html += '<a href="./view.php?id=';
						html += ele[i]['mlsId'];
						html += '"><img alt="" src="';
						html += imgSrc;
						html += '"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约';
						html += util.formatMoney(ele[i]['item']['listPrice'] * misc.rate);
						html += '(人民币)</td><td>房  型：';
						html += ele[i]['item']['property']['bedrooms'];
						html += '卧 '
						html += parseInt(ele[i]['item']['property']['bathrooms']);
						html += '卫</td></tr><tr><td>建筑面积：';
						html += util.localizeArea(ele[i]['item']['property']['area']);
						html += '㎡</td><td>土地面积：';
						html += util.localizeArea(ele[i]['item']['property']['lotSize']);
						html += '㎡</td></tr><tr><td colspan="2">地  址：';
						html += ele[i]['item']['address']['full'];
						html += ' ';
						html += ele[i]['item']['address']['city'];
						html += ' ';
						html += ele[i]['item']['address']['state'];
						html += '</td></tr></table><div class="itemIcon"><i class="btnFavori ';
						html += undefined == ele['fav'] ? 'favoriGray' : 'favoriRed';
						html += '" idata="';
						html += ele[i]['mlsId'];
						html += '" odata=""></i></div></div></div></a></li>';
						
					    $('#favori_list').append(html);
					}
				}
			}
		}
	});
}


//分享
// mobShare.config( {
//     debug: true, // 开启调试，将在浏览器的控制台输出调试信息
//     appkey: 'c5588f1e569b', // appkey
//     params: {
//     	pic: 'http://m.fun-fang.com/static/img/logo_small.png'
//     },

//     /**
//      * 分享时触发的回调函数
//      * 分享是否成功，目前第三方平台并没有相关接口，因此无法知道分享结果
//      * 所以此函数只会提供分享时的相关信息
//      * 
//      * @param {String} plat 平台名称
//      * @param {Object} params 实际分享的参数 { url: 链接, title: 标题, description: 内容, pic: 图片连接 }
//      */
//     callback: function( plat, params ) {
//     }
// } );

</script>
<?php include_once 'footer.php'; ?>