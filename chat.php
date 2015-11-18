<?php include_once 'header.php'; ?>
<link rel="stylesheet" type="text/css" href="/static/css/chat.css" />
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <h3 id="agent_name"></h3>
            </header>
            
            <div class="content">                
                <div id="chat-messages"><div class="msgBox"></div>
                
                <div id="chat_input">
                    <input type="text" id="messageText" placeholder="请输入文字">
                    <button id="sendMessageBtn" class="btn btn-default">发  送</button>
                </div>
            </div>
        </div>
       
        
        <div id="msg-template" style="display: none;">
            <div class="message-container">
                <div class="msg-time"></div>
                <div class="message">
                    <div class="cloud cloudText">
                        <div style="" class="cloudPannel">
                            <div class="sendStatus"></div>
                            <div class="cloudBody">
                                <div class="chatContent"></div>
                            </div>
                            <div class="cloudArrow "></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
     <div id="fade"></div>
<script type="text/javascript">
var mName = "", mAvatar = "";

$(function() {
	isAuthenticated = true;
	RongIMClient.init("sfci50a7chtpi");
	
    $('#agent_name').text(GET['aname']);

    $.ajax({
        cache: false,
        url: apiUrl + "/profile/"+$.cookie('userid'),
        type: "GET",
        success: function(msg) {
            mName = msg['result']['username'];
            mAvatar = msg['result']['portrait'];
            var userInfo = {uid: $.cookie('userid'), username: mName, userAvatar: mAvatar}
            sessionStorage.setItem('USER_INFO', JSON.stringify(userInfo));
        }
    });
});

function sendMsg(content, type) {
    var msg = {};

    if (typeof content == "string") {
        content = content.replace(" ", "&nbsp;");
    }

    if (!content) {
    	showMsg('Empty message', 'error');
        return false;
    }

    msg.cmd = 'message';
	msg.fuid = $.cookie('userid');
	msg.tuid = GET['oid'];
    msg.channal = 1;
    msg.data = content;
    msg.type = type;
    
    showNewMsg(msg);
    $('#messageText').val('');
}


/**
 * 显示新消息
 */
function showNewMsg(dataObj) {
// 	if(arguments.length > 1) {
// 		mAvatar = GET['avatar'];
// 		mName = GET['aname'];
// 	}

	var content;
    if (!dataObj.type || dataObj.type == 'text') {
        content = dataObj.data;
    }

    var fromId = dataObj.fuid;
    var fromAvatar = dataObj.avatar;
    var fromName = dataObj.name;
    var channal = dataObj.channal;

    var said = '';
    var time_str;

    if (dataObj.time) {
    	time_str = dataObj.time;
    } else {
        time_str = GetDateT()
    }

    $("#msg-template .msg-time").html(time_str);
    var html = '';
    var to = dataObj.tuid;

	if ($.cookie('userid') == fromId) {
		userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
		mAvatar = userInfo.userAvatar;
		mName = userInfo.username;
		
		if(mAvatar == ''){
			mAvatar = '/static/img/avatar.jpg'
		}
        content = '<div class="floatRight msgContent" style="margin: -15px 50px 0 0; background: #03a9f4; color: #fff;">' + content + '</div>';
        html += '<div class="chatUser"><img style="float: right; margin: 0 0 0 10px;" width="40" src="' + mAvatar + '"><span class="floatRight">'+mName+'</span></div> ';
    }
    else {            
        html += '<div class="chatUser"><img width="40" src="' + GET['avatar'] + '"><span>' + GET['aname'];
        html += '</span></div>';
        content = '<div class="msgContent">' + content + '</div>';
    }
    html += content + '</span>';
    $("#msg-template .chatContent").html(html);
    $("#chat-messages").append($("#msg-template").html());
    $('#chat-messages')[0].scrollTop = 1000000;
}


</script>
<?php include_once 'footer.php'; ?>