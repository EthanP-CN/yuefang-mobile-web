<?php include_once 'header.php'; ?>
        <div id="site">
            <header style="background: transparent;">
                <a id="return" href="./set.php"></a>
            </header>
            
            <div class="content imgBg" style="margin-top: 0px; padding-bottom: 70px;">                
                <section class="logoSection">
                    <img alt="" src="/static/img/logo.png" width="160">
                </section>
                
                <section>        			
        			<div id="password" class="formSection">
        				<ul class="logiForm">
        				    <li><input id="pass_tel" type="tel" placeholder="请输入手机号"></li>
        				    <li><input id="pass_code" type="number" placeholder="请输入验证码"><button id="btn_pass_captcha" class="btn btn-primary">获取验证码</button></li>
        				    <li><input id="pass_password" type="password" placeholder="请输入密码"></li>
        				    <li><input id="pass_repass" type="password" placeholder="请重复密码"></li>
        				</ul>
        				<button id="btn_password" class="btn btn-block btn-orange pass-modify-btn">确认修改</button>
        			</div>
        		</section>
            </div>
        </div>
        <div id="fade"></div>
    </div>
<script type="text/javascript">
$(function() {
	// Get captcha
	$('#btn_pass_captcha').click(function() {
		var tel = $('#pass_tel').val();
	    console.log(tel);
	    
	    if(tel == "" || tel == null) {
		    showMsg('Please input telephone', 'error');
	    }
	    else {
	    	time($(this));
    		$.ajax({
    	        cache: false, 
    			url: apiUrl + "/resetpassword/"+tel,
    			type: "GET",
    			dataType: 'json',
    			success: function (msg) {
    				if(msg['code'] == 200) {
    					showMsg('Captcha sent successfully', 'ok');
    				}
    				else {
        				showMsg(msg['message'], 'error');
    				}
    			}
    		});	
	    }
	});

	// Change password
	$('#btn_password').click(function() {
		var pass_tel = $.trim($('#pass_tel').val()),
			pass_code = $.trim($('#pass_code').val()),
	        pass_password = $.trim($('#pass_password').val()),
	        pass_repass = $.trim($('#pass_repass').val());
        var pass_data = { 'code':pass_code, 'password':pass_password, 'phone': pass_tel };

        if(pass_tel == "" || pass_tel == null) {
            showMsg('Please input your phone', 'error');
        }
        if(pass_code == "" || pass_code == null) {
            showMsg('Please input captcha', 'error');
        }
        else if(pass_password == "" || pass_password == null) {
            showMsg('Please input password', 'error');
        }
        else if(pass_password !== pass_repass) {
            showMsg('Two password are not the same', 'error');
        }
        else {
    		$.ajax({
    	        cache: false, 
    			url: apiUrl + "/resetpassword",
    			type: "POST",
    			dataType : 'json',
    			data : pass_data,
    			success: function (msg) {
    				if(msg){
    					showMsg('Password reset successfully, please re-login', 'ok', function() { $.cookie('userid', "");; window.location.href="./login.php"; });
    				}
    			}
    		});	
        }
	});
});
</script>
<?php include_once 'footer.php'; ?>