var apiUrl='http://api.fun-fang.com/v1.1';

var userid = "";
var GET = getRequest();

var isAuthenticated;
var map,neighborhoodMap,markerCluster,mapZoneMarks=[];
var propertyInfoWindows = [];
var cities = [];
var tpage;
var limit = 20;
var rate = "", sqft = "";
var scrollTop = "";

$.ajaxSetup({
	xhrFields: {
        withCredentials: true
    },
	error:function(error) {
		console.log(error);
	}
});

(function(){
	$(function() {
		//jQuery.support.cors = true;
		
		
		var dHeight = $(document).height();
		$('#site, #search_pop, #order_pop').height(dHeight-50);
		$('#fade').height(dHeight);

		// init app
		$.get(apiUrl + '/misc', function(data){
			sessionStorage.setItem('misc', JSON.stringify(data));
		});

		
		var mWidth = $('#menu').width();
		$('.menuItem span').width(mWidth-50)
	
		$(window).on('resize', function() {
			var dHeight = $(document).height();
			$('#site, #search_pop, #order_pop').height(dHeight-50);
			$('#menu, #fade').height(dHeight);
			
			var mWidth = $('#menu').width();
			$('.menuItem span').width(mWidth-50)
		});
		
		$('#nav').click(function(){
			changeFull();
			$('#filter_pop').hide();
			$('#order_pop').hide();
		});

		$('#logo').mouseenter(function(){
			$('.hover').slideDown(300);
		}).mouseleave(function(){
			$('.hover').slideUp(200);
		});
		
		// Load cities for home search
		util.loadCities(function(cities){
			cities = cities;
			
			$('#input_search').typeahead({
				source: cities,
				items:'all',
				scrollBar:true
			});
		});
		
		// Get captcha
		$('#btn_captcha').click(function() {
			var tel = $('#register_tel').val();
			
			if (tel == "" || tel == null) {
				showMsg('手机号码格式不正确', 'error');
			}
			else {
				time($(this));
				$.ajax({
			        cache: false, 
					url: apiUrl + "/verifyphone/" + tel,
					type: "GET",
					dataType: 'json',
					success: function (msg) {
						if(msg){
							console.log(msg);
						}
					}
				});
			}	
		});
	
		// User register
		$('#btn_register').click(function() {
			var reg_tel = $('#register_tel').val(),
			    reg_code = $('#register_code').val(),
		        reg_password = $('#register_password').val(),
		        reg_name = $('#register_name').val(),
		        reg_gender = $('input[type=radio]:checked').val();
	        var reg_data = { 'phone':reg_tel, 'code':reg_code, 'password':reg_password, 'nick':reg_name, 'gender':reg_gender };
	        
	        if (reg_tel == "" || reg_tel == null) {
	        	showMsg('Please input telephone', 'error');
	        }
	        else if (reg_code == "" || reg_code == null) {
	        	showMsg('Please input captcha', 'error');
	        }
	        else if (reg_password == "" || reg_password == null) {
	        	showMsg('Please input password', 'error');
	        }
	        else if (reg_name == "" || reg_name == null) {
	        	showMsg('Please input name', 'error');
	        }
	        else {
	        	showLoader();
				$('#load_fade').show();
	        	$.ajax({
	    	        cache: false, 
	    			url: apiUrl + "/register",
	    			type: "POST",
	    			dataType : 'json',
	    			data : reg_data,
	    			success: function (msg) {
	    				$('#load_fade').hide();
	    				hideLoader();
	    				if(msg['code'] == 200){
	    					showMsg(Constants.MSG_REGISTER_SUCCESS, 'ok', function() { window.location.href="./login.php"; });
	    				}
	    				else {
	    					showMsg(msg['message'], 'error');
	    				}
	    			}
	    		});
	        }
				
		});
	
		// User login
		$('#btn_login').click(function() {
			var log_tel = $('#login_tel').val(),
		        log_pass = $('#login_password').val();
	
			var log_data = { 'username':log_tel, 'password':log_pass};
			console.log(log_data);
			
			$.ajax({
		        cache: false, 
				url: apiUrl + "/login",
				type: "POST",
				data : log_data,
				dataType: 'json',
				success: function (msg) {
					console.log(msg);
					if(msg['code'] == 200){
						$.cookie('userid', msg['result']['id'], {expires: 1});
						$.cookie('tel', log_tel, { expires : 1 });
						$.cookie('password', log_pass, { expires : 1 });
						isAuthenticated = true;
						showMsg(Constants.MSG_LOGIN_SUCCESS, 'ok', function() { window.location.href="./index.php"; });
					}
					else {
						showMsg(msg['message'], 'error');
					}
				}
			});	
		});
		
		// User logout
		$('#mlogout').click(function() {
			$.ajax({
		        cache: false, 
				url: apiUrl + "/logout",
				type: "POST",
				dataType: 'json',
				success: function (msg) {
					if(msg['code'] == 200){
						showMsg(Constants.MSG_LOGOUT_SUCCESS, 'ok', function() { window.location.href= "./login.php"; });
					}
				}
			});
			$.cookie('userid', null);
		});
		
		// User feedback
		$('#btn_feedback').click(function() {
			var name = $('#feed_name').val(),
			    email = $('#feed_email').val(),
			    content = $('#feed_content').val();
		    var data = {"name":name, "email":email, "content":content};
		    
		    if(name == "" || name == null) {
		    	showMsg('Please input name', 'error');
		    }
		    else if(content == "" || content == null){
		    	showMsg('Please input content', 'error');
		    }
		    else if (email == "" || email == null) {
		    	showMsg('Please input email', 'error');
		    }
		    else {
		    	showLoader();
		    	$('#load_fade').show();
		    	$.ajax({
			        cache: false, 
					url: apiUrl + "/feedback",
					type: "POST",
					dataType: 'json',
					data: data,
					success: function (msg) {
						$('#load_fade').hide();
						hideLoader();
						if(msg['code'] == 200){
							showMsg(msg['message'], 'ok', function(){ window.location.href="./about.php"; });
						}
						else {
							showMsg(msg['message'], 'error');
						}
					}
				});
		    }
		});

		// Coupon
		$('#btn_coupon').click(function() {
			var code = $('#coupon_code').val();

			if(code) {
				$.ajax({
			        cache: false, 
					url: apiUrl + "/verifyprompt/"+code,
					type: "GET",
					dataType: 'json',
					success: function (msg) {
						if(msg['code'] == 206) {
			            	showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			            }
						else if(msg['code'] == 200) {
							alert(msg['result']['tip']);
							$('#coupon_pop').hide();
//							$('#coupon_pop').show().html('<p>'+msg['result']['tip']+'</p><div><button class="btn btn-primary" id="yes_coupon_btn">确定</button></div>');
//							$('#yes_coupon_btn').click(function() {					
//								$('#coupon_pop').hide();
//							});
						}
						else {
							showMsg(msg['message'], 'error');
						}
					}
				});
			}
			else {
				showMsg('Please input coupon code', 'error');
			}
		});
		
		// Sidebar menu click
		$('#mset').click(function() {
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			}
			else {
				window.location.href = './set.php';
			}
		});
		
		$('#mfavori').click(function() {
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			}
			else {
				window.location.href = './favori.php';
			}
		});
		
		$('#mmsg').click(function() {
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			}
			else {
				window.location.href = './message.php';
			}
		});
		
		$('#mcoupon').click(function() {
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			}
			else {
				window.location.href = './coupon.php';
			}
		});
		
		$('#mcontact').click(function() {
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
			}
			else {
				window.location.href = './contact.php';
			}
		});
		
		// User logout
		$('#mlogout').click(function() {
			$.cookie('userid', "");
			showMsg('登出成功', 'ok', function() { window.location.href = './login.php';; });
		});
		
		if ((!($.cookie('userid'))) || $.cookie('userid') == null) {
			$('#mlogout').css({"display":"none"});
			$('#mlogin').css({"display":"block"});
		}
		else {
			$('#mlogin').css({"display":"none"});
			$('#mlogout').css({"display":"block"});
		}
	
		$('#fade').click(function() {
			$('#header').css({"background":"#eb6334"});
			$('#menu').animate({left: '-80%', opacity: 'hide'}, 'fast',function(){ $('#menu').hide();});
			$('#site').css({'display': 'block'}).animate({paddingLeft:'0px', opacity: 1},'fast',function(){});
			$('#fade').hide();
		});
		
		/*
		 * Contact - telephone call
		 */
		$('#contact_list').on({
		    click : function() {
		    	var agentId = $(this).attr('aid');
		    	$('#call_pop').show().html('<p>已为您联系经纪人<br>是否现在接通（本次通话为免费电话）</p><div><button class="popBtn" id="yes_btn">确定</button><button class="popBtn" id="no_btn">取消</button></div>');
				$('#yes_btn').click(function() {
					$('#call_pop').hide();
				    agentCall(agentId);
				});
				$('#no_btn').click(function() {
				    $('#call_pop').hide();
				});
		    }
		}, 'li .agentCall');

		/*
		 * Contact - Chat online
		 */
		$('#contact_list').on({
		    click : function() {
		    	var agentId = $(this).attr('aid');
		    	var agentName = $(this).attr('name');
		    	var agentAvatar = $(this).attr('avatar');
		    	
		    	agentChat(agentId, agentName, agentAvatar);
		    }
		}, 'li .agentChat');
		
		/*
		 * Agent contacted properties
		 */
	    $('#contact_list').on({
	    	'click':function() {
	    		
	    	}
	    },'li');
		
		/*
		 * Left sliding delete
		 */
	    var current_page = document.location.href;
		if (!current_page.match(/recomm/)) {
			var x;
		    $('#favori_list').on({
		    	'touchstart': function(e) {
		            $('#favori_list li > a').css('left', '0px') // close em all
		            $(e.currentTarget).addClass('open')
		            x = e.originalEvent.targetTouches[0].pageX // anchor point
		            $(this).prev().prev('.behind').find('a.delete-btn').css({display: 'block'});
		        },
		        'touchmove': function(e) {
		            var change = e.originalEvent.targetTouches[0].pageX - x
		            change = Math.min(Math.max(-100, change), 0) // restrict to -100px left, 0px right
		            e.currentTarget.style.left = change + 'px'
		            if (change < -10) disable_scroll() // disable scroll once we hit 10px horizontal slide
		        },
		        'touchend': function(e) {
		            var left = parseInt(e.currentTarget.style.left)
		            var new_left;
		            if (left < -35) {
		                new_left = '-100px'
		            } else if (left > 35) {
		                new_left = '100px'
		            } else {
		                new_left = '0px'
		            }
		            $(e.currentTarget).animate({left: new_left}, 200)
		            enable_scroll();
		        }
		    }, 'li>a');
		    
		    if (current_page.match(/favori/)) {
		    	$('#favori_list').on({
			    	'click': function(e) {		    		
				        e.preventDefault();
				        
				        showLoader();
				    	$('#load_fade').show();
				    	
				        var objectId = $(this).attr('odata');
				        $.ajax({
				            cache: false, 
				    		url: apiUrl + "/delfavorite",
				    		type: "POST",
				    		data: {'objectId' : objectId },
				    		dataType: 'json',
				    		success: function (msg) {
				    			hideLoader();
				    			$('#load_fade').hide();
				    			if(msg['code'] == 200) {
				    				showMsg(msg['message'], 'ok');
				    			}
				    			else {
				    				showMsg(msg['message'], 'error');
				    			}
				    		}
				    	});
				        $(this).parents('li').slideUp('fast', function() {
				            $(this).remove();
				        });
			    	}
			    }, 'li .delete-btn');
		    }
		    else {
		    	$('#favori_list').on({
			    	'click': function(e) {		
				        e.preventDefault();
				        
				        $(this).parents('li').slideUp('fast', function(){
				            $(this).remove();
				        });
				        $(this).parents('.pop').css({display: 'none'});
				        $('#fullFade').fadeOut(100);
			    	}
			    }, 'li .delete-btn');
		    }
		    
		}
		
	    /*
	     * Property favorite toggle
	     */
	    var ffavori = true;
	    $('body').on('click','.btnFavori',function(e){
			e.preventDefault();
			e.stopPropagation();
			
			showLoader();
			$('#load_fade').show();
			
			var mlsId=$(this).attr('idata');
			var ithis = $(this);
			
			if(!($.cookie('userid'))) {
				showMsg('Please login', 'error', function() { window.location.href = './login.php'; });
				return;
			}

			if(ffavori) {
				$(this).css({"background":"url(/static/img/favori_red.png) no-repeat", "background-size":"contain"});

				$.ajax({
		            cache: false, 
		    		url: apiUrl + "/favorite",
		    		type: "POST",
		    		dataType: 'json',
		    		data: { 'mlsId' : mlsId },
		    		success: function (msg) {
		    			hideLoader();
		    			$('#load_fade').hide();
		    			if(msg['code'] == 200){
		    				var obj = msg['result']['objectId'];
		    				console.log(obj);
		    				
	    	    			$(this).attr('value', obj);
	    	    			
			    			showMsg('收藏成功 ', 'ok');
		    			}
		    		}
		    	});
				ffavori = false;
			}
			else {
				$(this).css({"background":"url(/static/img/ico_favori.png) no-repeat", "background-size":"contain"});
				
				objectId = $(this).attr('value');
				
				$.ajax({
    	            cache: false, 
    	    		url: apiUrl + "/delfavorite",
    	    		type: "POST",
    	    		data: {'objectId':objectId },
    	    		dataType: 'json',
    	    		success: function (msg) {
    	    			hideLoader();
    	    			$('#load_fade').hide();
    	    			if(msg){
    		    			showMsg(msg['message'], 'ok');
    	    			}
    	    		}
    	    	});
				ffavori = true;
			}
		});
	    
	    
	});

})();

/*
 * For login and register switch
 */
var myUrl = window.location.href; //get URL
var myUrlTab = myUrl.substring(myUrl.indexOf("#")); // For mywebsite.com/tabs.html#tab2, myUrlTab = #tab2     
var myUrlTabName = myUrlTab.substring(0,4); // For the above example, myUrlTabName = #tab
$(function() {
    $("#tabsContent > div").hide(); // Initially hide all content
    $("#tabs li a").removeClass('currentTab');
    $("#tabs li:first a").attr("class","currentTab"); // Activate first tab

    $("#tabsContent > div:first").fadeIn(); // Show first tab content
    
    $("#tabs a").on("click",function(e) {
        e.preventDefault();
        if ($(this).attr("class") == "currentTab"){ //detection for current tab
         return       
        }
        else{             
        	resetTabs();
        	$("#tabs li a").removeClass('currentTab');
        	$(this).attr("class","currentTab"); // Activate this
        	$($(this).attr('name')).fadeIn(); // Show content for current tab
        }
    });

    for (i = 1; i <= $("#tabs li").length; i++) {
      if (myUrlTab == myUrlTabName + i) {
          resetTabs();
          $(this).siblings('a').removeClass('currentTab');
          
          $("a[name='"+myUrlTab+"']").attr("class","currentTab"); // Activate url tab
          $(myUrlTab).fadeIn(); // Show url tab content        
      }
    }
    
    $.fn.extend({
        insertAtCaret: function (myValue) {
            var $t = $(this)[0];
            if (document.selection) {
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if ($t.selectionStart || $t.selectionStart == '0') {

                var startPos = $t.selectionStart;
                var endPos = $t.selectionEnd;
                scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            }
            else {

                this.value += myValue;
                this.focus();
            }
        }
    });
    
    navModel = {
			newMessageList:ko.observableArray([]),
			selectNewMessage:function(message){
				var objectId=message.object.id();
				var conversation=util.getConversationByObjectId(objectId);
				util.loadExpressions();			
				if(!conversation){
					chatModel.conversationList.push(message);
				}
				chatModel.currentHistory([]);
				for(var i=0;i<conversation.history().length;i++){
					chatModel.currentHistory.push(conversation.history()[i]);
				}
				chatModel.currentObjectId(objectId);
				util.removeNewMessageByObjectId(objectId);
				util.updateLocalNewMessage();
				$('#chatWrapper').show();
			}
		};
		document.getElementById('navWrapper') && ko.applyBindings(navModel, document.getElementById('navWrapper'));
		
//		var filterModel = {
//				a: ko.observable('1')
//		};
//		
//		ko.applyBindings(filterModel, document.getElementById('filter_pop'));
});

/*
 * Order function
 */
//function orderBy(name) {
//    return function(o, p){
//        var a, b;
//        if (typeof o === "object" && typeof p === "object" && o && p) {
//            if(name == 'hot' || name == 'listPrice') {
//            	a = o['item'][name];
//                b = p['item'][name];
//            }
//            else if(name == 'full') {
//            	a = o['item']['address'][name];
//                b = p['item']['address'][name];
//            }
//            else if(name == 'bedrooms' || name == 'bathrooms' || name == 'area') {
//            	a = o['item']['property'][name];
//                b = p['item']['property'][name];
//            }
//            
//            if (a === b) {
//                return 0;
//            }
//            if (typeof a === typeof b) {
//                return a < b ? -1 : 1;
//            }
//            return typeof a < typeof b ? -1 : 1;
//        }
//        else {
//            throw ("error");
//        }
//    }
//}
//
//function orderNewBy(name) {
//    return function(o, p){
//        var a, b;
//        if (typeof o === "object" && typeof p === "object" && o && p) {
//            if(name == 'hot' || name == 'listPrice') {
//            	a = o[name];
//                b = p[name];
//            }
//            else if(name == 'full') {
//            	a = o['address'][name];
//                b = p['address'][name];
//            }
//            else if(name == 'bedrooms' || name == 'bathrooms' || name == 'area') {
//            	a = o['property'][name];
//                b = p['property'][name];
//            }
//            
//            if (a === b) {
//                return 0;
//            }
//            if (typeof a === typeof b) {
//                return a < b ? -1 : 1;
//            }
//            return typeof a < typeof b ? -1 : 1;
//        }
//        else {
//            throw ("error");
//        }
//    }
//}


function resetTabs(){
    $("#tabsContent > div").hide(); //Hide all content
    $("#tabs a").attr("id",""); //Reset id's      
}

/*
 * Notification showing
 */
function showMsg(msg, errorType, callback){
	if(errorType == 'error'){
		$('#msgHint').attr('class','errorHint');
	} else if(errorType == 'ok') {
		$('#msgHint').attr('class','okayHint');
	}
	$('#msgContent').text(msg);
	$('#msgHint').fadeIn(200);
	setTimeout(function() { $("#msgHint").fadeOut(200); if(callback){callback()}}, 2000);
}

/*
 * Sidebar toggle control
 */
function changeFull(){
	if($('#menu').is(':hidden')) {
		$('.fullback').attr('class','full');
		$('#menu').animate({left: '0px', opacity: 'show'}, 'fast',function(){ $('#menu').show();});
		$('#site').hide().animate({paddingLeft:'80%'},'fast',function(){});
		$('#header').css({"background":"transparent"});
		$('#fade').show();
		$('#search_pop').hide();
	} else {
		console.log(1);
		$('#header').css({"background":"#eb6334"});
		$('#menu').animate({left: '-80%', opacity: 'hide'}, 'fast',function(){ $('#menu').hide();});
		$('#site').animate({ paddingLeft:'0px'},'fast', function(){ $('#site').show() });
		$('#fade').hide();
	}
}

function full(quick){
	$('.full').attr('class','fullback');
	if(quick){
		$('#header').css({"background":"#eb6334"});
		$('#menu').hide();
		$('#site').css('padding-left','40px');
	}else {
		$('#header').css({"background":"transparent"});
		$('#menu').animate({left: '-80%', opacity: 'hide'}, 'fast',function(){ $('#menu').hide();});
		$('#site').animate({paddingLeft:'0px'},'fast',function(){});
	}
}

/*
 * Get URL params
 */
function getRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);

        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            var decodeParam = decodeURIComponent(strs[i]);
            var param = decodeParam.split("=");
            theRequest[param[0]] = param[1];
        }
    }
    return theRequest;
}

function showLoader() {
	$('#loader').fadeIn(300);
}

function hideLoader() {
	$('#loader').fadeOut(300);
}

/*
 * Call agent
 */
function agentCall(agentId) {
	$.ajax({
        cache: false, 
		url: apiUrl + "/call/" + agentId,
		type: "GET",
		dataType: 'json',
		success: function (msg) {
			console.log(msg);
			if(msg['code'] != 200){
    			showMsg(msg['message'], 'error');
			}
		}
	});
}
/*
 * Chat with agent
 */
function agentChat(agentId, agentName, agentAvatar) {
	window.location.href = "./chat.php?oid="+agentId+"&aname=" + agentName+'&avatar='+agentAvatar;
}

/*
 * Check login status
 */
function checkLogin(tel, pass) {
	$.ajax({
        cache: false, 
		url: apiUrl + "/login",
		type: "POST",
		data : log_data,
		dataType: 'json',
		success: function (msg) {
			console.log(msg);
			if(msg['code'] == 200){
				$.cookie('userid', msg['result']['id'], {expires: 1});
				$.cookie('tel', log_tel, { expires : 1 });
				$.cookie('password', log_pass, { expires : 1 });
				isAuthenticated = true;
				showMsg('登录成功', 'ok', function() { location.reload(); });
			}
			else {
				showMsg(msg['message'], 'error');
			}
		}
	});	
}

/*
 * Captch 60 seconds delay
 */
var wait=60;
function time(o) {
	if (wait == 0) {
		o.removeAttr("disabled"); 
		o.html("获取验证码");
		wait = 60;
	} else {
		o.attr("disabled", true);
		o.html(wait + "秒后重发");
		wait--;
		setTimeout(function() {
			time(o)
		},1000)
	}
}

/*
 * Date format for chat messages
 */
function GetDateT(time_stamp) {
    var d;
    d = new Date();

    if (time_stamp) {
        d.setTime(time_stamp * 1000);
    }
    var h, i, s;
    h = d.getHours();
    i = d.getMinutes();
    s = d.getSeconds();

    h = ( h < 10 ) ? '0' + h : h;
    i = ( i < 10 ) ? '0' + i : i;
    s = ( s < 10 ) ? '0' + s : s;
    
    return h + ":" + i + ":" + s;
}


function prevent_default(e) {
    e.preventDefault();
}

function disable_scroll() {
    $(document).on('touchmove', prevent_default);
}

function enable_scroll() {
    $(document).unbind('touchmove', prevent_default)
}