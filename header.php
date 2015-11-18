<!DOCTYPE html>
<html lang="cn">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="description" content="悦房微网站" />
    <meta name="keywords" content="" />
    <meta name="author" content="上海华琳信息科技有限公司" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <title><?= isset($headerTitle) && !empty($headerTitle) ? $headerTitle : '悦房微网站' ?></title>
    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
    <link rel="stylesheet" type="text/css" href="/static/css/jquery.bxslider.css" />
    <link rel="stylesheet" href="/static/css/bootstrap.button.css" />
    <link rel="stylesheet" type="text/css" href="/static/components/fontawesome/css/font-awesome.css" />
    <link rel="shortcut icon" href="" />
    
    <script src="/static/js/jquery.min.js"></script>
    <script src="/static/js/config.js"></script>
    <script src="/static/js/constants.js"></script>
    <script src="/static/components/underscore.js"></script>
    <script src="/static/components/handlebars.js"></script>
<!--     <script src="/static/js/jquery.mobile.min.js"></script> -->
    <script src="/static/js/jquery.cookie.js"></script>
</head>
    
<body>
<div id="menu">
    <div id="logo"><img alt="" src="/static/img/logo.png" width="120"></div>
    <div id="menu_list">
        <a id="mhome" class="menuItem" href="/index.php" title="" attr=""><i id="menu_home"></i><span>首页</span></a>
        <a id="mrecomm" class="menuItem" href="/recomm.php" title="" attr=""><i id="menu_recomm"></i><span>推荐房源</span></a>
        <a id="mfavori" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_favori"></i><span>我的收藏</span></a>
        <a id="mcontact" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_contact"></i><span>联系记录</span></a>
        <a id="mmsg" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_message"></i><span>消息 <label class="label label-orange">168条新消息</label></span></a>
        <a id="mcoupon" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_coupon"></i><span>使用优惠码</span></a>
        <a id="mset" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_set"></i><span>个人设置</span></a>
        <a id="mabout" class="menuItem" href="/about.php" title="" attr=""><i id="menu_about"></i><span>关于我们</span></a>
        <a id="mlogin" class="menuItem" href="/login.php" title="" attr=""><i id="menu_sign"></i><span>登录</span></a>
        <a id="mlogout" class="menuItem" href="javascript:void(0);" title="" attr=""><i id="menu_sign"></i><span>退出</span></a>
    </div>
</div>
<div id="wrapper">
    <span id="msgHint"><span id="msgContent"></span></span>
    <div id="loader" style="display: none;"><img src="../static/img/loader.gif"></div>