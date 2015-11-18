<?php include_once 'header.php'; ?>
        
        <div id="site">
            <header style="background: transparent;">
                <a id="nav"></a>
            </header>
            
            <div class="content imgBg" style="margin-top: 0px; padding-bottom: 40px;">                
                <section class="logoSection">
                    <img alt="" src="/static/img/logo.png" width="180">
                </section>
                
                <section id="tabsContent">
        			<div id="login" class="formSection">
        				<ul class="logiForm">
        				    <li><input id="login_tel" type="tel" placeholder="请输入手机号"></li>
        				    <li><input id="login_password" type="password" placeholder="请输入密码"></li>
        				</ul>
        				<div><a id="forgot_pass" href="./forgot.php">忘记密码？</a></div>
        				<button id="btn_login" class="btn btn-block btn-orange" style="margin-top: 10px;">登录</button>
        			</div>
        			
        			<div id="register" class="formSection" style="display: none;">
        				<ul class="logiForm">
        				    <li><input id="register_name" type="text" placeholder="请输入姓名"></li>
        				    <li style="text-align: center;">
        				        <input id="register_gender1" name="gender" type="radio" value="1">
        				        <span  class="genderSpan" style="margin-right: 30px;">男</span>
        				        &nbsp;&nbsp;
        				        <input id="register_gender0" type="radio" name="gender" value="0">
        				        <span class="genderSpan">女</span>
        				    </li>
        				    <li><input id="register_tel" type="tel" placeholder="请输入手机号"></li>
        				    <li><input id="register_code" type="number" placeholder="请输入验证码"><button id="btn_captcha" class="btn btn-sm btn-primary">获取验证码</button></li>
        				    <li><input id="register_password" type="password" placeholder="请输入密码"></li>
        				    <li><input id="register_repass" type="password" placeholder="请重复密码"></li>
        				</ul>
        				<button id="btn_register" class="btn btn-block btn-orange">注册</button>
        			</div>
        		</section>
                
                <ul id="tabs">
                    <li><a id="loginTab" href="#" name="#login" id="current">登录</a></li>
        			<li><a id="registerTab" href="#" name="#register">注册</a></li>
                </ul>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
<?php include_once 'footer.php'; ?>