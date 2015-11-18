(function(){
	$(function(){
		
		chatModel= {
			currentObjectId:ko.observable(),
			currentHistory:ko.observableArray([]),
			conversationList:ko.observableArray([]),
			expressions:ko.observableArray([]),
			selectConversation:function(conversation){
				var objectId=conversation.object.id();
				//clear current conversation
				chatModel.currentHistory([]);
				var conversation=util.getConversationByObjectId(objectId);
				if(!conversation)
					return;
				for(var i=0;i<conversation.history().length;i++){
					chatModel.currentHistory.push(conversation.history()[i]);
				}
				chatModel.currentObjectId(objectId);
				util.removeNewMessageByObjectId(objectId);
				util.updateLocalNewMessage();
			},
			selectExpression:function(expression){
				var newContent=$('#messageText').val()+'['+expression.chineseName+']';
				$('#messageText').val(newContent);
			}
		};
		//if current conversation changed,update the content to current conversation.
		// chatModel.currentObjectId.subscribe(function(){
			// //clear current conversation
			// chatModel.currentHistory([]);
			// var agentId=chatModel.currentAgentId();
			// var conversation=getConversation(agentId);
			// if(!conversation)
				// return;
			// for(var i=0;i<conversation.history().length;i++){
				// chatModel.currentHistory.push(conversation.history()[i]);
			// }
		// });
		
		document.getElementById('chatWrapper') && ko.applyBindings(chatModel,document.getElementById('chatWrapper'));
		
		/**
		*Connect to chatting server.
		*/
		var connect=function(token){
			RongIMClient.connect(token,{
				onSuccess: function (userId) {
					loadConversationListFromLocal();
					loadHistoryMessagesByTargetId(GET['oid']);
				},
				onError: function (errorCode) {
					var info = '';
					switch (errorCode) {
						case RongIMClient.callback.ErrorCode.TIMEOUT:
							info = '超时';
							break;
						case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
							info = '未知错误';
							break;
						case RongIMClient.ConnectErrorStatus.UNACCEPTABLE_PROTOCOL_VERSION:
							info = '不可接受的协议版本';
							break;
						case RongIMClient.ConnectErrorStatus.IDENTIFIER_REJECTED:
							info = 'appkey不正确';
							break;
						case RongIMClient.ConnectErrorStatus.SERVER_UNAVAILABLE:
							info = '服务器不可用';
							break;
						case RongIMClient.ConnectErrorStatus.TOKEN_INCORRECT:
							info = 'token无效';
							break;
						case RongIMClient.ConnectErrorStatus.NOT_AUTHORIZED:
							info = '未认证';
							break;
						case RongIMClient.ConnectErrorStatus.REDIRECT:
							info = '重新获取导航';
							break;
						case RongIMClient.ConnectErrorStatus.PACKAGE_ERROR:
							info = '包名错误';
							break;
						case RongIMClient.ConnectErrorStatus.APP_BLOCK_OR_DELETE:
							info = '应用已被封禁或已被删除';
							break;
						case RongIMClient.ConnectErrorStatus.BLOCK:
							info = '用户被封禁';
							break;
						case RongIMClient.ConnectErrorStatus.TOKEN_EXPIRE:
							info = 'token已过期';
							break;
						case RongIMClient.ConnectErrorStatus.DEVICE_ERROR:
							info = '设备号错误';
							break;
					}
					console.log("失败:" + info);
				}
			});
		};
		
		var getUserChatHtml = function(content, avatar, username){
			var html = '';
			if(avatar == '') avatar = '/static/img/avatar.jpg';
			
			html += '<div class="chatUser"><img style="float: right; margin: 0 0 0 10px;" width="40" src="'+avatar+'"><span class="floatRight">'+username+'</span></div> ';
	        html += '<div class="floatRight msgContent" style="margin: -15px 50px 0 0; background: #03a9f4; color: #fff;">';
	        html += content;
	        html += '</div>';
	        return html;
		}
		
		var getAgentChatHtml = function(content, avatar, username){
			var html = '';
			html += '<div class="chatUser"><img width="40" src="' + avatar + '"><span>' + username;
			html += '</span></div>';
			html += '<div class="msgContent">' + content + '</div>';
			
			return html;
		}
		

		
		
		/**
		*Close the chatting dialog
		*/
		var hideDialog=function(){
			$('#chatWrapper').hide();
		};
		
		/**
		*Parse message's expressions.
		*/
		var parseMessage=function(message){
			return RongIMClient.Expression.retrievalEmoji(message,function(emojiObject){
				return emojiObject.img.outerHTML;
			});
		}
		/**
		*Send message.
		*/
		var sendMessage=function(objectId,message){
			var msg = new RongIMClient.TextMessage();
			var dataObj = {};
			var message=message.replace(/\[.+?\]/g, function (x) {
				return RongIMClient.Expression.getEmojiObjByEnglishNameOrChineseName(x.slice(1, x.length - 1)).tag || x;
			})
			msg.setContent(message);
			var conversationtype = RongIMClient.ConversationType.PRIVATE;
			//var objectId=chatModel.currentObjectId();
			//add to history
			var history={
				role:'slef',
				content:parseMessage(message)
			};
			var c=getConversation(objectId);
			if(c){
				c.history.push(ko.mapping.fromJS(history));
			}
			chatModel.currentHistory.push(ko.mapping.fromJS(history));
			util.updateLocalHistory();
			
			RongIMClient.getInstance().sendMessage(conversationtype, objectId, msg, null, {
				onSuccess: function () {
					dataObj.cmd = 'message';
					dataObj.fuid = $.cookie('userid');
					dataObj.tuid = GET['oid'];
					dataObj.channal = 1;
					dataObj.data = message;
					dataObj.type = 'text';
					showNewMsg(dataObj);
				},
				onError: function (errorCode) {
					var info = '';
					switch (errorCode) {
						case RongIMClient.callback.ErrorCode.TIMEOUT:
							info = '超时';
							break;
						case RongIMClient.callback.ErrorCode.UNKNOWN_ERROR:
							info = '未知错误';
							break;
						case RongIMClient.SendErrorStatus.REJECTED_BY_BLACKLIST:
							info = '在黑名单中，无法向对方发送消息';
							break;
						case RongIMClient.SendErrorStatus.NOT_IN_DISCUSSION:
							info = '不在讨论组中';
							break;
						case RongIMClient.SendErrorStatus.NOT_IN_GROUP:
							info = '不在群组中';
							break;
						case RongIMClient.SendErrorStatus.NOT_IN_CHATROOM:
							info = '不在聊天室中';
							break;
						default :
							info = x;
							break;
					}
					showMsg('发送失败：'+info, 'error');
					//alert('发送失败:' + info);
				}
			});
		};
		var loadConversationListFromLocal = function(){

			//load chat history from local data
			if(sessionStorage.CHAT_HISTORY){
				var chatHistory=JSON.parse(sessionStorage.CHAT_HISTORY);
				if(chatHistory){
					for(var i=0;i<chatHistory.length;i++){
						chatModel.conversationList.push(ko.mapping.fromJS(chatHistory[i]));
					}
				}
			}
		};
		
		var loadHistoryMessagesByTargetId = function(targetId){
			//此方法最多一次行拉取20条消息。拉取顺序按时间倒序拉取。
			RongIMClient.getInstance().getHistoryMessages(RongIMClient.ConversationType.PRIVATE,targetId,20,{
                 onSuccess:function(symbol,HistoryMessages){
                	 var hisMsg = HistoryMessages;
                	 console.log(hisMsg);
                	 
                	 if(hisMsg){
                		 for(var i = 0; i < hisMsg.length; i++){
     						var targetId = hisMsg[i].getTargetId();
     						var content = hisMsg[i].getContent();
     						var sentTime = hisMsg[i].getSentTime();
     						var agentName = GET['aname'];
     						var agentAvatar = GET['avatar'];
     						
     						var userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
     						var userName = userInfo.username;
     						var userAvatar = userInfo.userAvatar;
     						var html = '';
     						
     						
     						sentTimeObj = new Date(sentTime);
     						console.log(sentTimeObj)
     						$("#msg-template .msg-time").html(sentTimeObj.getHours() + ':' + sentTimeObj.getMinutes() + ':' + sentTimeObj.getSeconds());
     						
     						if(targetId == GET['oid']){
     							html = getAgentChatHtml(content, agentAvatar, agentName);
     						}else{
     							html = getUserChatHtml(content, userAvatar, userName);
     						}
     						
     						$("#msg-template .chatContent").html(html);
     					    $("#chat-messages").append($("#msg-template").html());
     					    
                		 }
                	 }
                	 
                	 $('#chat-messages')[0].scrollTop = 1000000;
                	 
                    // symbol为boolean值，如果为true则表示还有剩余历史消息可拉取，为false的话表示没有剩余历史消息可供拉取。
                    // HistoryMessages 为拉取到的历史消息列表，列表中消息为对应消息类型的消息实体
                },onError:function(){
                    // APP未开启消息漫游或处理异常
                    // throw new ERROR ......
                }
            });
		}
		
		//if user is logged in ,active the chatting service
		if(isAuthenticated){
			RongIMClient.init(config.rongyun.appKey);

			$.get(apiUrl+'/token',function(data){
				if(data.code==200){
					sessionStorage.CHAT_TOKEN=data.result.token;
					connect(data.result.token);
					
					//检测是否有未读的消息，此接口可独立使用，不依赖 init() 和 connect() 方法。
					RongIMClient.hasUnreadMessages(config.rongyun.appKey, data.result.token, {
					    onSuccess:function(symbol){
					        if(symbol){
					            console.log(symbol)
					        }else{
					            // 没有未读的消息
					        }
					    },onError:function(err){
					        console.log(err)
					    }
					});
					
				}else{
					console.log(data.message);
				}
			}).fail(function(error){});

			RongIMClient.setConnectionStatusListener({
				onChanged: function (status) {
					switch (status) {
							//链接成功
							case RongIMClient.ConnectionStatus.CONNECTED:
								console.log('链接成功');
								break;
							//正在链接
							case RongIMClient.ConnectionStatus.CONNECTING:
								console.log('正在链接');
								break;
							//重新链接
							case RongIMClient.ConnectionStatus.RECONNECT:
								console.log('重新链接');
								break;
							//其他设备登陆
							case RongIMClient.ConnectionStatus.OTHER_DEVICE_LOGIN:
							//连接关闭
							case RongIMClient.ConnectionStatus.CLOSURE:
							//未知错误
							case RongIMClient.ConnectionStatus.UNKNOWN_ERROR:
							//登出
							case RongIMClient.ConnectionStatus.LOGOUT:
							//用户已被封禁
							case RongIMClient.ConnectionStatus.BLOCK:
								break;
					}
				}
			});
			
			
			RongIMClient.getInstance().setOnReceiveMessageListener({
				onReceived: function (message) {
					console.log(message);
					switch(message.getMessageType()){
						case RongIMClient.MessageType.TextMessage:
							var objectId=message.getTargetId();
							var history = {
								role:'other',
								content:parseMessage(message.getContent())
							};
							var c=util.getConversationByObjectId(objectId);
							if(c) {
								c.history.push(ko.mapping.fromJS(history));
								chatModel.currentHistory.push(ko.mapping.fromJS(history));
								util.updateLocalHistory();
							}
							//update new message nofitication
							if(objectId && objectId != chatModel.currentObjectId()) {
								var m = util.getNewMessageByObjectId(objectId);
								var dataObj = {};
								
								if(m) {
									m.history.push(ko.mapping.fromJS(history));
								} else {
									m= {
										object:{
											id:objectId,
											username:'未知名称',
											email:'',
											portrait:''
										},
										history:[history]
									};
									navModel.newMessageList.push(ko.mapping.fromJS(m));
								}
								console.log(m);
								
								util.updateLocalNewMessage();
								
								dataObj.cmd = 'message';
								dataObj.fuid = objectId;
								dataObj.tuid = $.cookie('userid');
								dataObj.channal = 1;
								dataObj.data = parseMessage(message.getContent());
								dataObj.type = 'text';
								name = GET['aname'];
								avatar = GET['avatar'];
								
								showNewMsg(dataObj, name, avatar);
								
							}
							
							break;
						case RongIMClient.MessageType.ImageMessage:
							// do something...
							break;
						case RongIMClient.MessageType.VoiceMessage:
							// do something...
							break;
						case RongIMClient.MessageType.RichContentMessage:
							// do something...
							break;
						case RongIMClient.MessageType.LocationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.DiscussionNotificationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.InformationNotificationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.ContactNotificationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.ProfileNotificationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.CommandNotificationMessage:
							// do something...
							break;
						case RongIMClient.MessageType.UnknownMessage:
							// do something...
							break;
						default:
							// 自定义消息
							// do something...
					}
				}
			});
		}
		
		//try to chat the agent
		$('#agentWrapper #chatAgentBtn').click(function(){
			if(!util.checkLogin())
				return;
			var property=util.getCurrentProperty();
			if(!property)
				return;
			//load expressions
			if(chatModel.expressions().length==0){
				var emojiObjectList = RongIMClient.Expression.getAllExpression(64,0);
				for(var i=0,item;item=emojiObjectList[i++];){
					chatModel.expressions.push(item);
				}
			}
			var mlsId=property.mlsId();
			var agentId=property.agent.id();
			var message='您好，可以介绍一下'+mlsId+'吗？';
			//check if has the conversation with the agent
			var conversation=getConversation(agentId);
			if(conversation){
				//update current chatting hisotory box
				chatModel.currentHistory([]);
				for(var i=0;i<conversation.history().length;i++){
					chatModel.currentHistory.push(conversation.history()[i]);
				}
				openDialog();
				//send a default message auto
				chatModel.currentObjectId(conversation.object.id())
				sendMessage(conversation.object.id(),message);
			}else{
				$.get(apiUrl+'/chat/'+agentId+'?mlsId='+mlsId,function(data){
				if(data.code==200){
					chatModel.currentHistory([]);
					conversation={
						agentId:agentId,
						object:data.result,
						history:[]
					};
					chatModel.conversationList.push(ko.mapping.fromJS(conversation));
					chatModel.currentObjectId(data.result.id)
					openDialog();
					sendMessage(data.result.id,message);
				}else{
					alert(data.message);
				}
			}).fail(function(error){
				alert('Error');
				});
			}
			
		});
		var getConversation=function(agentId){
			for(var i=0;i<chatModel.conversationList().length;i++){
				if(chatModel.conversationList()[i].agentId==agentId){
					return chatModel.conversationList()[i];
				}
			}
			return null;
		}
		
		$('#sendMessageBtn').click(function(){
			var objectId = chatModel.currentObjectId();
			var message = $.trim($('#messageText').val());
			console.log(objectId + '---' + message);
			if(!message) {
				showMsg('对不起，不能发送空信息', 'error');
		        return false;
			}
			sendMessage(GET['oid'], message);
			$('#messageText').val('');
		});
	});
})();