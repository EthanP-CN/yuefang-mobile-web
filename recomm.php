<!-- Recommend property -->

<?php include_once 'header.php'; ?>
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <h3>热门推荐</h3>
            </header>
            
            <div class="content">
                <section id="order_banner">
                    <div>
                        <span>排序：</span><span id="order_name">名称</span><i class="iconOrder"></i>
                    </div>
                </section>
                <ul id="favori_list">
                </ul>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    <?php include_once './order.php'; ?>
<script type="text/javascript">
$(function() {
    var imgSrc = "";
    var properties = [];

    // Get currency rate
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
    
// 	$('#order_banner').click(function() {
// 	    $('#order_pop').show();
// 	});

// 	$('#order_list').on({
// 	    click:function() {
// 		    $('#order_pop').hide();
// 		    $('#order_name').text($('span', this).text());
// 		    onTest();
// 	    }
// 	}, 'li');

	/*
	*  Recommend property
	*/
	showLoader();
	$('#load_fade').show();
	$.ajax({
        cache: false, 
		url: apiUrl + "/prompt",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			console.log(msg);
			hideLoader();
			$('#load_fade').hide();
			if(msg['code'] == 200) {
				properties = msg['result'];
				console.log(properties);
				$.each(msg['result'], function(idx, ele) {
// 					properties[idx] = ele;
					
					if(ele['item']['geo']) {
						if(ele['item']['photos']['0']) {
						    imgSrc = ele['item']['photos']['0'];
						} else {
						    imgSrc = 'http://maps.google.cn/maps/api/staticmap?center='+ele['item']['geo']['lat']+','+ele['item']['geo']['lng']+'&zoom=5&size=500x300&format=jpg&maptype=roadmap&markers=size:mid|color:red|label:S%E6%82%A6%E6%88%BF|'+ele['item']['geo']['lat']+','+ele['item']['geo']['lng']+'\'';
						}
						var html = '<li class="favoriItem">'
						html += '<i class="fa fa-image list-item-default-img"></i>';
						html += '<a href="./view.php?id=';
						html += ele['mlsId'];
						html += '"><img alt="" src="';
						html += imgSrc;
						html += '"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约';
						html += util.formatMoney(ele['item']['listPrice'] * rate);
						html += '(人民币)</td><td>房  型：';
						html += ele['item']['property']['bedrooms'];
						html += '卧 ';
						html += parseInt(ele['item']['property']['bathrooms']);
						html += ' 卫</td></tr><tr><td class="parea">建筑面积：';
						html += util.localizeArea(ele['item']['property']['area']);
						html += '㎡</td><td>土地面积：';
						html += util.localizeArea(ele['item']['property']['lotSize']);
						html += '㎡</td></tr><tr><td colspan="2">地  址：';
						html += ele['item']['address']['full'];
						html += ' ';
						html += ele['item']['address']['city'];
						html += ' ';
						html += ele['item']['address']['state'];
						html += '</td></tr></table><div class="itemIcon"><i class="btnFavori '
						html += undefined == ele['fav'] ? 'favoriGray' : 'favoriRed';
						html += '" idata="';
						html += ele['mlsId'];
						html += '" odata=""></i></div></div></div></a></li>';
					    $('#favori_list').append(html);
					}
				});
			}
		}
	});

	$('#order_banner').click(function() {
	    $('#order_pop').show();
	});

	$('#order_list').on({
	    click:function() {
		    var self = $(this);
		    var sort = self.data("sort");
		    
		    $('#order_pop').hide();
		    $('#order_name').text($('span', this).text());

		    properties.sort(orderBy(sort));
		    $('#favori_list').empty();
		    
		    $.each(properties, function(idx, ele) {				
				if(ele['item']['geo']) {
					if(ele['item']['photos']['0']) {
					    imgSrc = ele['item']['photos']['0'];
					}
					else {
					    imgSrc = 'http://maps.google.cn/maps/api/staticmap?center='+ele['item']['geo']['lat']+','+ele['item']['geo']['lng']+'&zoom=5&size=500x300&format=jpg&maptype=roadmap&markers=size:mid|color:red|label:S%E6%82%A6%E6%88%BF|'+ele['item']['geo']['lat']+','+ele['item']['geo']['lng']+'\'';
					}
				    $('#favori_list').append('<li class="favoriItem"><a href="./view.php?id='+ele['mlsId']+'"><img alt="" src="'+imgSrc+'"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约'+util.formatMoney(ele['item']['listPrice']*rate)+'(人民币)</td><td>房  型：'+ele['item']['property']['bedrooms']+'卧 '+parseInt(ele['item']['property']['bathrooms'])+' 卫</td></tr><tr><td class="parea">建筑面积：'+util.localizeArea(ele['item']['property']['area'])+'㎡</td><td>土地面积：'+util.localizeArea(ele['item']['property']['lotSize'])+'㎡</td></tr><tr><td colspan="2">地  址：'+ele['item']['address']['full']+ ' ' + ele['item']['address']['city']+' '+ele['item']['address']['state']+'</td></tr></table><div class="itemIcon"><i class="btnFavori favoriGray" idata="'+ele['mlsId']+'" odata=""></i></div></div></div></a></li>');
				}
			});
	    }
	}, 'li');
});


</script>
<?php include_once 'footer.php'; ?>