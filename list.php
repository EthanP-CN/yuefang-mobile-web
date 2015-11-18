<!-- List search property -->

<?php include_once 'header.php'; ?>

<style>
<!--
.dropdown-menu {
	position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 200px;
    padding: 5px 0;
    margin: 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 0px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}

.typeahead li {
	width: 100%;
	float: left;
	display: block;
	height: 26px;
	line-height: 26px;
}
.typeahead li a {
	font-size: 0.8em;
	width: 94%;
	margin: 0 3%;
	height: 100%;
	display: block;
	float: left;
	color: #696969;
}
-->
</style>

        <div id="site">
            <header id="header">
                <a id="return" href="javascript:void(0);"></a>
                <div id="top_search">
                    <form id="headerSearchForm" action="">
                        <input id="input_search" type="search" placeholder="请输入城市名" autocomplete="off" value="<?= isset($_GET['q']) ? $_GET['q'] : '' ?>">
                        <button id="btn_search"></button>
                    </form>
                </div>
                <a id="filterBtn" href="javascript:void(0);">筛选</a>
            </header>
            
            <div class="content">
                <section id="order_banner">
                    <div>
                        <span>排序：</span><span id="order_name">名称</span><i class="iconOrder"></i>
                    </div>
                </section>
                <ul id="favori_list" class="common-list">
                </ul>
                <a id="more" style="float: left; dispaly: none; line-height: 50px; text-align: center; color: #03a9f4; width: 100%; height: 50px; background: #f2f2f2;" href="javascript:void(0)">点击加载更多</a>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    <div id="search_pop" class="pop" style="display:none;"></div>
    <div id="filterBlock" class="pop" style="display: none;"><?php include_once './filter.php'; ?></div>
    <div id="order_pop" class="pop" style="display: none;">
        <ul id="order_list">
            <li><span data-order-by='address_full'>地址</span></li>
            <li><span data-order-by='listPrice'>价格</span></li>
            <li><span data-order-by='property_bedrooms'>房间数</span></li>
            <li><span data-order-by='property_bathrooms'>洗手间数</span></li>
            <li><span data-order-by='property_area'>面积</span></li>
<!--             <li><span data-order-by=''>房源开放时间</span></li> -->
            <li><span data-order-by='mls_daysOnMarket'>发布时间</span></li>
        </ul>
    </div>
    
    
<?php include_once 'templates.php'; ?>
<script src="http://maps.google.cn/maps/api/js?sensor=false&amp;libraries=drawing"></script>
<script type="text/javascript">
$(function() {
	var misc = JSON.parse(sessionStorage.getItem('misc'));
	var listContext = null;
	
	$('#headerSearchForm').on('submit', function(e){
		return false;
	});

	// 排序 Start
	$('#order_banner').click(function() {
	    $('#order_pop').show();
	});

	$('#order_list').on({
	    click:function() {
		    $('#order_pop').hide();
		    $('#order_name').text($('span', this).text());
		    var orderby = $(this).children('span').data('order-by');
		    var source = $("#list-item-template").html();
		    var template = Handlebars.compile(source);
		    var context = listContext;
		    var html = '';

		    //二维数组转一维数组，方便后面排序
		    if(context[0].property_bedrooms === undefined){
    		    for(var i = 0; i < context.length; i++){
    			    var property = context[i].property;
    			    var address = context[i].address;
    			    var mls = context[i].mls;
    				for(p in property){
    					var newProKeyName = 'property_' + p;
    					context[i][newProKeyName] = property[p];
    				}
    				for(a in address){
    					var newAdrKeyName = 'address_' + a;
    					context[i][newAdrKeyName] = address[a];
    				}
    				for(m in mls){
						var newMlsKeyName = 'mls_' + m;
						context[i][newMlsKeyName] = mls[m];
        			}
    			}
			}
			
			context = _.sortBy(context, orderby);

		    Handlebars.registerHelper('formatMoney', function(src) {
    			var dst = parseInt(src) * parseFloat(misc.rate);
		    	return dst.formatMoney('2', '¥', ',', '.');
		    });

		    Handlebars.registerHelper('formatArea', function(area) {
		    	return util.localizeArea(area);
		    });

		    Handlebars.registerHelper('ifFav', function(fav) {
		    	return undefined === fav ? 'favoriGray' : 'favoriRed';
		    });

		    Handlebars.registerHelper('formatBaths', function(baths) {
		    	return parseInt(baths);
		    });
		    
		    html = template(context);
		    $('#favori_list').empty().html(html);
	    }
	}, 'li');
	// 排序 End

	$('#return').on('click', function(){
		var searchQueryStr = sessionStorage.getItem('search.query.string');
		var rtnUrl = '';
		if(searchQueryStr !== null){
			rtnUrl += '/search.php';
			rtnUrl += searchQueryStr;
		}else{
			rtnUrl += '/index.php';
		}

		location.href = rtnUrl;
	});

	var rate = "";
    $.ajax({
        cache: false, 
		url: apiUrl + "/misc",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			rate = msg['rate'];
		}
	});

	/*
	*  List search
	*/
	if(GET['q']) {
		showLoader();
		$('#load_fade').show();
		var query = "";

		if(GET['maxdom'] == 0) {
			query = GET['q']+'&minprice='+GET['minprice']+'&maxprice='+GET['maxprice']+'&type='+GET['type']+'&status='+GET['status']+'&minbaths='+GET['minbaths']+'&minbeds='+GET['minbeds']+'&minyear='+GET['minyear'];
		} else {
			query = GET['q']+'&minprice='+GET['minprice']+'&maxprice='+GET['maxprice']+'&type='+GET['type']+'&status='+GET['status']+'&minbaths='+GET['minbaths']+'&minbeds='+GET['minbeds']+'&maxdom='+GET['maxdom']+'&minyear='+GET['minyear'];
		}
		
		$.ajax({
	        cache: false, 
			url: apiUrl + "/properties?q="+query,
			type: "GET",
			dataType: 'json',
			success: function (msg) {
				hideLoader();
				$('#load_fade').hide();
				if(msg['total'] == 0){
					showMsg('No result searched', 'error');						
				} else {
					tpage = Math.ceil(msg['total'] / limit);	
					listContext = msg['results'];
					var mlsids = '';	
					$.each(msg['results'], function(idx, ele) {
						var photo = '';
						var photoHtml = '<img class="lazy" width="320" height="180" ';
						

						if(idx == msg['results'].length - 1){
							mlsids += ele['mlsId']
						} else {
							mlsids += ele['mlsId'] + ',';
						}

						if(ele['photos'][0] === undefined){
							if(ele['geo']['lat'] === null){
    							var address = ele['address']['full'] + ' ' + ele['address']['city'] + ' ' + ele['address']['state'];
    							var geocoder = new google.maps.Geocoder();
    							photoHtml += 'id="afterLoadImg' + ele['mlsId'] + '"'; 
    							geocoder.geocode({'address': address}, function(results, status){
    								if (status === google.maps.GeocoderStatus.OK) {
        								console.log(photo);
    									photo = getGoogleStaticMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    									$('#afterLoadImg' + ele['mlsId']).attr('src', photo);
    								}
    							});
							}else{
								photo = getGoogleStaticMap(ele['geo']['lat'], ele['geo']['lng']);
								photoHtml += 'src="' + photo + '"';
							}
						}else{
							photo = ele['photos'][0];
							photoHtml += 'src="' + photo + '"';
						}

						photoHtml += '>';
						var html = '<li class="favoriItem"><div class="behind"><a href="javascript:void(0);" class="ui-btn delete-btn">删除</a></div>';
							html += '<i class="fa fa-image list-item-default-img"></i>';
							html += '<a href="./view.php?id=';
							html += ele['mlsId'];
							html += '">';
							html += photoHtml;
							html += '<div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约';
							html += util.formatMoney(ele['listPrice'] * rate);
							html += '(人民币)</td><td>房  型：';
							html += ele['property']['bedrooms'];
							html += '卧 ';
							html += parseInt(ele['property']['bathrooms']);
							html += '卫</td></tr><tr><td>建筑面积：';
							html += util.localizeArea(ele['property']['area']);
							html += '㎡</td><td>土地面积：';
							html += util.localizeArea(ele['property']['lotSize']);
							html += '㎡</td></tr><tr><td colspan="2">地  址：';
							html += ele['address']['full'];
							html += ' ';
							html += ele['address']['city'];
							html += ' ';
							html += ele['address']['state']
							html += '</td></tr></table><div class="itemIcon"><i class="btnFavori '
							html += undefined == ele['fav'] ? 'favoriGray' : 'favoriRed' 
							html += '" idata="'
							html += ele['mlsId']
							html += '" odata=""></i></div></div></div></a></li>';
					    $('#favori_list').append(html);
// 					    $('img.lazy').lazyload({effect : "fadeIn",  container: $("#favori_list")});
					});

					saveListMlsids(mlsids);
					
				}	
			}
		});
	}

	function getGoogleStaticMap(lat, lng){
		var staticMap;
		staticMap = 'http://maps.google.cn/maps/api/staticmap?center=';
		staticMap += lat + ',' + lng;
		staticMap += '&zoom=12&size=320x180&format=jpg&maptype=roadmap&markers=size:mid|color:red|label:S%E6%82%A6%E6%88%BF|';
		staticMap += lat + ',' + lng;
		return staticMap;
	}

	function saveListMlsids(mlsids){
		sessionStorage.setItem('list.current.mlsids', mlsids);
	}
	
    // Search button click
	$('#btn_search').click(function() {
		var search = $('#input_search').val();
		var type = $('#house_type').val(),
		    status = $('#house_status').val();
	        minprice = $('#minprice').val(),
	        maxprice = $('#maxprice').val(),
	        minarea = $('#minarea').val(),
	        minbaths = $('#minbaths').val(),
	        minbeds = $('#minbeds').val(),
	        maxdom = $('#maxdom').val(),
	        minyear = $('#minyear').val();
	    var params = "";

		if(search && search.trim() != '') {
			if(search.indexOf('(') != '-1' && search.indexOf(')') != '-1'){
    			var start = search.indexOf('(') + 1;
    			var end = search.indexOf(')');
    			search = search.substring(start, end).toLowerCase();
			} else if(search.indexOf('mls#') != '-1') {
				//搜索MLSID add by penghk 2015.11.16 15:53
				showLoader();
				$('#load_fade').show();
				mlsid = parseInt(search.substring(search.indexOf('#') + 1));
				if(mlsid !== '' && mlsid === +mlsid){
					$.get(apiUrl + '/properties/' + mlsid, function(data){
						if(data.code == '400'){
							showMsg('对不起，没有找到对应的结果', 'error');
							hideLoader();
							$('#load_fade').fadeOut(100);
						}else{
							window.location.href = "/view.php?id=" + mlsid;
						}
					});			
				}else{
					showMsg('Id 格式不正确', 'error');
					hideLoader();
					$('#load_fade').fadeOut(100);
				}
				return false;
			}

			if(maxdom == 0) {
				params = 'q='+search+'&type='+type+'&status='+status+'&minprice='+minprice+'&maxprice='+maxprice+'&minbaths='+minbaths+'&minbeds='+minbeds+'&minarea='+minarea+'&minyear='+minyear;
			} else {
				params = 'q='+search+'&type='+type+'&status='+status+'&minprice='+minprice+'&maxprice='+maxprice+'&minbaths='+minbaths+'&minbeds='+minbeds+'&minarea='+minarea+'&maxdom='+maxdom+'&minyear='+minyear;
			}
			window.location.href = './list.php?' + params;
		} else {
		    showMsg('Please input city name', 'error');
		}
		
		$('#city_complete').css('display', 'none');
	});


	/*
	* Scroll loading more data
	*/
// 	$(window).bind("scroll",function() {
// 	    if ($(document).scrollTop() + $(window).height() > $(document).height() - 200) {
// 			$("#more").trigger("click");
// 		}
// 	});

	var page = 0;	
	$('#more').on("click", function() {
		var more = (page += 1);
		var offset = limit * (more - 1);

		$(this).text('正在加载，请稍后...')

		$.ajax({
	        cache: false, 
			url: apiUrl + "/properties?q="+GET['q']+'&minprice='+GET['minprice']+'&maxprice='+GET['maxprice']+'&type='+GET['type']+'&status='+GET['status']+'&minbaths='+GET['minbaths']+'&minbeds='+GET['minbeds']+'&maxdom='+GET['maxdom']+'&minyear='+GET['minyear']+"&limit="+limit+"&offset="+offset,
			type: "GET",
			dataType: 'json',
			success: function (msg) {
				$('#more').text('点击加载更多');
				var mlsids = '';
				listContext = listContext.concat(msg.results);
				$.each(msg['results'], function(idx, ele) {
					var photo = '';
					var photoHtml = '<img class="lazy" width="320" height="180" ';

					if(idx == msg['results'].length - 1){
						mlsids += ele['mlsId']
					} else {
						mlsids += ele['mlsId'] + ',';
					}
					
					if(ele['photos'][0] === undefined){
						if(ele['geo']['lat'] === null){
							var address = ele['address']['full'] + ' ' + ele['address']['city'] + ' ' + ele['address']['state'];
							var geocoder = new google.maps.Geocoder();
							photoHtml += 'id="afterLoadImg' + ele['mlsId'] + '"'; 
							geocoder.geocode({'address': address}, function(results, status){
								if (status === google.maps.GeocoderStatus.OK) {
    								console.log(photo);
									photo = getGoogleStaticMap(results[0].geometry.location.lat(), results[0].geometry.location.lng());
									$('#afterLoadImg' + ele['mlsId']).attr('src', photo);
								}
							});
						}else{
							photo = getGoogleStaticMap(ele['geo']['lat'], ele['geo']['lng']);
							photoHtml += 'src="' + photo + '"';
						}
					}else{
						photo = ele['photos'][0];
						photoHtml += 'src="' + photo + '"';
					}

					photoHtml += '>';
					var html = '<li class="favoriItem"><div class="behind"><a href="javascript:void(0);" class="ui-btn delete-btn">删除</a></div>';
						html += '<i class="fa fa-image list-item-default-img"></i>';
						html += '<a href="./view.php?id=';
						html += ele['mlsId'];
						html += '">';
						html += photoHtml;
						html += '<div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约';
						html += util.formatMoney(ele['listPrice'] * rate);
						html += '(人民币)</td><td>房  型：';
						html += ele['property']['bedrooms'];
						html += '卧 ';
						html += parseInt(ele['property']['bathrooms']);
						html += '卫</td></tr><tr><td>建筑面积：';
						html += util.localizeArea(ele['property']['area']);
						html += '㎡</td><td>土地面积：';
						html += util.localizeArea(ele['property']['lotSize']);
						html += '㎡</td></tr><tr><td colspan="2">地  址：';
						html += ele['address']['full']; 
						html += ' '; 
						html += ele['address']['city'];
						html += ' ';
						html += ele['address']['state'];
						html += '</td></tr></table><div class="itemIcon"><i class="btnFavori';
						html +=  undefined == ele['fav'] ? 'favoriGray' : 'favoriRed';
						html +=  '" idata="';
						html += ele['mlsId'];
						html += '" odata=""></i></div></div></div></a></li>';

				    $('#favori_list').append(html);
				});

				saveListMlsids(mlsids);
// 				$('img.lazy').lazyload({effect : "fadeIn",  container: $("#favori_list")});
			}
		});

		if((more+1) == tpage){
			$("#more").remove();
	    }
	});

	/*
	 * Toggle filter pop
	 */
	$('#filterBtn').click(function() {
		var $filterBlock = $('#filterBlock');

		if('none' === $filterBlock.css('display')){
			$filterBlock.slideDown(100);
			$(this).text('确定');
		}else{
			$filterBlock.slideUp(100);
			$(this).text('筛选');

// 			var url = apiUrl + '/properties';
			var url = '/list.php'
			var q = $('#input_search').val();
			var filterDataJson = filterModel.getFilterData();
			var filterObj = null;
			if(null !== filterDataJson){
				filterObj = JSON.parse(filterDataJson);
			}

			if(null !== filterObj){
				url += '?q=' + q;
				for(var i = 0; i < filterObj.length; i++){
					if(undefined !== filterObj[i].val){
    					url += '&';
    					url += filterObj[i].name;
    					url += '=';
    					url += filterObj[i].val;
					}
				}
			}
			window.location.href = url;
		}
	});
});
</script>
<?php include_once 'footer.php'; ?>