<?php include_once 'header.php'; ?>
        <div id="site">
            <header style="background: transparent;">
                <a id="nav" style="z-index: 88888888"></a>
                <h3>个人设置</h3>
            </header>
            <div class="content" style="margin-top: 0;">
                <section class="editBg">
                    <div id="edit_avatar">
                        <img id="img_avatar" alt="" src="">
                    </div>
                    <div id="edit_password">
                        <a id="btn_avatar" href="javascript:void(0);"><span>更改头像</span></a>
                        <a href="./password.php">更改密码</a>
                    </div>
                </section>
                
                <section class="editInfo">
                    <input id="edit_name" type="text" placeholder="请输入您的姓名">
                    <input id="edit_email" type="email" placeholder="请输入您的邮箱">
                    <button id="btn_edit" class="btn btn-orange btn-block profile-edit-btn">修改</button>
                </section>
            
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    <div id="avatar_pop" class="pop" style="display: none;">
        <div>
            <ul id="avatar_list">
            </ul>
        </div>
    </div>
<script type="text/javascript">
$(function() {
	showLoader();
	$('#load_fade').show();
	$.ajax({
        cache: false,
        url: apiUrl + "/portraits",
        type: "GET",
        success: function(msg) {
        	
            if(msg) {
                console.log(msg);
                $.each(msg['result'], function(idx, ele) {
                	$('#avatar_list').append('<li><a href="javascript:void(0);"><img alt="" src="'+ele['url']+'"></a></li>')
                });
            }
        }
    });

    $('#avatar_list').on({
    	click: function() {
            var img = $('a>img', this).attr("src");        
            $('#img_avatar').attr("src", img);
            $('#avatar_pop').css({"display":"none"});

            $.post(apiUrl + '/update', {portrait: img}, function(data){
				console.log(data);
            });
    	}
    },'li');

	var span = $('#btn_avatar span');
	$('#btn_avatar').click(function() {
		if(span.text() == '修改') {
			$('#avatar_pop').css({"display":"none"});
			span.text('更改头像');
		}
		else {
			$('#avatar_pop').css({"display":"block"});
			span.text('修改');
		}
    });

    $.ajax({
        cache: false,
        url: apiUrl + "/profile/"+$.cookie('userid'),
        type: "GET",
        success: function(msg) {
        	hideLoader();
			$('#load_fade').hide();
            console.log(msg);
            if(msg['code'] == 206) {
            	showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
            }
            else {
                $('#edit_name').val(msg['result']['username']);
                $('#edit_email').val(msg['result']['email']);
                if(msg['result']['portrait'] != ''){
                	$('#img_avatar').attr("src", msg['result']['portrait']);
                }else{
                	$('#img_avatar').attr("src", '/static/img/avatar.jpg');
                }
            }
        }
    });
	
	$('#btn_edit').click(function() {
		var nick = $('#edit_name').val(),
	        email = $('#edit_email').val(),
	        portrait = $('#img_avatar').attr("src");

		var edit_data = { 'nick':nick, 'email':email, 'portrait':portrait};
		showLoader();
		$('#load_fade').show();
		
		$.ajax({
	        cache: false,
			url: apiUrl + "/update",
			type: "POST",
			data : edit_data,
			dataType: 'json',
			success: function (msg) {
				$('#load_fade').hide();
	            console.log(msg);
				if(msg['code'] == 200){
					showMsg(msg['message'], 'ok', function(){location.reload();});
				}
				else {
					showMsg(msg['message'], 'error');
				}
			}
		});	
	});
});
</script>
<?php include_once 'footer.php'; ?>