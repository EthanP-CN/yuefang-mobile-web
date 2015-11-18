<!-- Contact Records -->

<?php include_once 'header.php'; ?>
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <h3>联系记录</h3>
            </header>
            
            <div class="content">
                <ul id="contact_list">
                </ul>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    <div id="call_pop" class="pop" style="display: none;">

    </div>
<script type="text/javascript" src="/static/js/jquery.raty.js"></script>
<script type="text/javascript">
$(function() {
	showLoader();
	$('#load_fade').show();
	var properties = {};
	
	$.ajax({
        cache: false, 
		url: apiUrl + "/contact",
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			$('#load_fade').hide();
			hideLoader();
			if(msg['code'] == 206) {
            	showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
            } else if(msg['code'] == 200){
				$.each(msg['result'], function(idx, ele) {
					properties[ele['agentId']] = ele['username'];
			
					var html = '<li class="contactItem"><div class="contactLeft"><div class="contactLine"></div><div class="contactDate"><i class="iconDate"></i><span>08/22</span></div></div><div class="contactInfo"><img alt="" src="'
					html += ele['portrait'];
					html += '"><div class="contactBasic"><p class="contactName">';
					html += ele['username'];
					html += '</p><div class="raty"></div><p>微信：</p><p>邮箱：</p>';
					html += '</div>';
					html += '<div class="agentContact" style="margin: 12px 0;">';
					html += '<a class="agentCall" aid="' + ele['agentId'] + '" href="javascript:void(0);">电话联系</a>';
					html += '<a class="agentChat" aid="' + ele['agentId'] + '" name="' + ele['username'] + '" avatar="' + ele['portrait'] + 'href="javascript:void(0);" onclick="return false;">在线联系</a>';
					html += '</div>';
					html += '</div></li>';
					
				    $('#contact_list').append(html);
				    $('.raty').raty({ score : ele['star'] });
				});
			}
		}
	});
	$('#contact_list').on({
	    click:function() {
		    var cid = $(this).next().find('.agentCall').attr('aid');
		    var cname = $(this).find('.contactName').text();
		    
	        window.location.href='./cproperty.php?id='+cid+'&name='+cname;
	    }
	}, 'li .contactBasic');
});
</script>

<?php include_once 'footer.php'; ?>