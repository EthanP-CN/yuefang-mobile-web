<?php include_once 'header.php'; ?>
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <h3>反馈</h3>
            </header>
            
            <div class="content">                
                <section>
                    <div>
                        <textarea id="feed_content" type="text" placeholder="请输入您宝贵的意见或建议"></textarea>
                        <input id="feed_name" type="text" placeholder="您的姓名">
                        <input id="feed_email" type="text" placeholder="您的邮箱（选题）以便我们回复您">
                    </div>
                    <button id="btn_feedback" class="btn btn-block btn-orange">提交</button>
                </section>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    
<script type="text/javascript">
$(function() {	
	if($.cookie('userid')) {
		showLoader();
		$('#load_fade').show();
		$.ajax({
	        cache: false,
	        url: apiUrl + "/profile/"+$.cookie('userid'),
	        type: "GET",
	        success: function(msg) {
	        	$('#load_fade').hide();
				hideLoader();
                $('#feed_name').val(msg['result']['username']);
                $('#feed_email').val(msg['result']['email']);
	        }
	    });
	}
});
</script>
<?php include_once 'footer.php'; ?>