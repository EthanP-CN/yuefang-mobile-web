<!-- Coupon -->

<?php include_once 'header.php'; ?>
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <h3>优惠码</h3>
            </header>
            
            <div class="content imgBg">
                <section class="logoSection" style="margin-top: 30px;">
                    <img alt="" src="/static/img/logo.png" width="160">
                </section>
                
                <section style="margin-top: 30px;">
                    <div>
                        <input id="coupon_code" type="text" placeholder="请输入优惠码">
                    </div>
                    <button id="btn_coupon" class="btn btn-block btn-orange">确定</button>
                    <a id="coupon_detail" href="">优惠码详情 》</a>
                </section>
            </div>
        </div>
        <div id="fade"></div>
    </div>
    
    <div id="coupon_pop" class="pop" style="display: none;"></div>
<script type="text/javascript">
$(function(){
	$('#coupon_code').on('focus', function(){
		$('#site').css('scroll', 'none');
	});
});
</script>
<?php include_once 'footer.php'; ?>