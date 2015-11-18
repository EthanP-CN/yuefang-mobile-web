<!-- My Favorite -->

<?php include_once 'header.php'; ?>    
    <div id="site">
        <header id="header">
            <a id="nav"></a>
            <h3>我的收藏</h3>
        </header>
        
        <div class="content">
            <ul id="favori_list">
            </ul>
        </div>
    </div>
    <div id="fade"></div>
    <div id="load_fade"></div>
</div>
<script type="text/javascript">
$(function() {
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

	// Load favorite data
	showLoader();
	$('#load_fade').show();
	$.ajax({
        cache: false, 
		url: apiUrl + "/favorite",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			$('#load_fade').hide();
			hideLoader();
			if(msg['code'] == 206) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
            }
			else if(msg['code'] == 200) {
				$.each(msg['result'], function(idx, ele) {
					var html = '<li class="favoriItem"><div class="behind"><a odata="';
					html += ele['objectId'];
					html += '" href="javascript:void(0);" class="ui-btn delete-btn">删除</a></div><a href="./view.php?id=';
					html += ele['mlsId'];
					html += '&oid=';
					html += ele['objectId'];
					html += '"><img alt="" src="';
					html += ele['item']['photos']['0'];
					html += '"><div class="itemIntro"><div class="itemWrapper"><table><tr><td class="introPrice">约';
					html += util.formatMoney(ele['item']['listPrice']*rate);
					html += '万(人民币)</td><td>房  型：';
					html += ele['item']['bedrooms'];
					html += '卧 ';
					html += parseInt(ele['item']['bathrooms']);
					html += '卫</td></tr><tr><td>建筑面积：';
					html += util.localizeArea(ele['item']['area']);
					html += '㎡</td><td>土地面积：';
					html += util.localizeArea(ele['item']['lotSize']);
					html += '㎡</td></tr><tr><td colspan="2">地  址：';
					html += ele['item']['address']['full'];
				    html += ' ';
				    html += ele['item']['address']['city'];
			    	html += ' '+ele['item']['address']['state'];
		    	    html += '</td></tr></table><div class="itemIcon"><i odata="';
		    	    html += ele['objectId'];
	    	    	html += '" idata="';
	    	    	html += ele['mslId'];
    	    		html += '" class="btnFavorid favoriRed"></i></div></div></div></a></li>';
				    $('#favori_list').append(html);
				});
			}
		}
	});

	// Cancel favorite item
    $('body').on('click', '.btnFavorid', function(e) {
		e.preventDefault();
		e.stopPropagation();
		showLoader();
		$('#load_fade').show();

		var objectId = $(this).attr('odata');
		$(this).css({"background":"url(/static/img/ico_favori.png) no-repeat", "background-size":"contain"});

		$.ajax({
            cache: false, 
    		url: apiUrl + "/delfavorite",
    		type: "POST",
    		data: {'objectId' : objectId },
    		dataType: 'json',
    		success: function (msg) {
    			$('#load_fade').hide();
    			hideLoader();
    			if(msg){
	    			if(msg['code'] == 200) {
	    				showMsg(msg['message'], 'ok');
	    			}
	    			else {
	    				showMsg(msg['message'], 'error');
	    			}
    			}
    		}
    	});

		$(this).parents('li').slideUp('fast', function() {
            $(this).remove();
        });

	});
});
</script>

<?php include_once 'footer.php'; ?>