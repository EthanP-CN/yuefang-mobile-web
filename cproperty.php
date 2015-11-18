<!-- Agent properties -->

<?php include_once 'header.php'; ?>
        <div id="site">
            <header id="header">
                <a id="return" href="./contact.php"></a>
                <h3></h3>
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
    <div id="order_pop" class="pop" style="display: none;">
        <ul id="order_list">
            <li><span>热门推荐</span></li>
            <li><span>距离</span></li>
            <li><span>地址</span></li>
            <li><span>价格</span></li>
            <li><span>房间数</span></li>
            <li><span>洗手间数</span></li>
            <li><span>面积</span></li>
            <li><span>房源开放时间</span></li>
            <li><span>发布时间</span></li>
        </ul>
    </div>
<script type="text/javascript">
$(function() {
    var imgSrc = "";
	
	showLoader();
	$('#load_fade').show();
	$('#header h3').text(GET['name']);
	
	$.ajax({
        cache: false, 
		url: apiUrl + "/contactedproperty/"+GET['id'],
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			console.log(msg);
			hideLoader();
			$('#load_fade').hide();
			if(msg['code'] == 200) {
				$.each(msg['result'][0]['properties'], function(idx, ele) {
					if(ele['geo']) {
						if(ele['photos']['0']) {
						    imgSrc = ele['photos']['0'];
						} else {
						    imgSrc = 'http://maps.google.cn/maps/api/staticmap?center='+ele['geo']['lat']+','+ele['geo']['lng']+'&zoom=5&size=500x300&format=jpg&maptype=roadmap&markers=size:mid|color:red|label:S%E6%82%A6%E6%88%BF|'+ele['geo']['lat']+','+ele['geo']['lng']+'\'';
						}
						var html = '<li class="favoriItem"><div class="behind"><a href="javascript:void(0);" class="ui-btn delete-btn">删除</a></div><a href="./view.php?id='
						html += ele['mlsId']
						html +='"><img alt="" src="'
						html += imgSrc
						html += '"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约'
						html += ele['listPrice']+'(人民币)</td><td>房  型：'
						html += ele['property']['bedrooms']+'卧 '
						html += util.localizeArea(ele['property']['bathrooms'])
						html += ' 卫</td></tr><tr><td>建筑面积：'
						html += ele['property']['area']
						html += '㎡</td><td>土地面积：'
						html += util.localizeArea(ele['property']['lotSize'])
						html += '㎡</td></tr><tr><td colspan="2">地  址：'
						html += ele['address']['full']
						html += ' ' 
						html += ele['address']['city']
						html += ' '
						html += ele['address']['state']
						html += '</td></tr></table><div class="itemIcon"><i class="btnFavori ';
						html += undefined == ele['fav'] ? 'favoriGray' : 'favoriRed'; 
						html += '" idata="';
						html += ele['mlsId'];
						html += '"></i></div></div></div></a></li>';
					    $('#favori_list').append(html);
					}
				});
			}
		}
	});
});
</script>
<?php include_once 'footer.php'; ?>