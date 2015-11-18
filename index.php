<?php include_once 'header.php'; ?>

<style>
<!--
.dropdown-menu {
	position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 200px;
    padding: 5px 0;
    margin: 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 0px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}

.typeahead li {
	width: 100%;
	float: left;
	display: block;
	height: 26px;
	line-height: 26px;
}
.typeahead li a {
	font-size: 0.8em;
	width: 94%;
	margin: 0 3%;
	height: 100%;
	display: block;
	float: left;
	color: #696969;
}
-->
</style>
        <div id="site">
            <header id="header">
                <a id="nav"></a>
                <div id="top_search">
                    <form id="headerSearchForm" action="">
                        <input id="input_search" type="search" placeholder="请输入城市名" autocomplete="off" value="<?= isset($_GET['q']) ? $_GET['q'] : '' ?>">
                        <button id="btn_search" type="submit"></button>
                    </form>
                </div>
                <a id="filterBtn" href="javascript:void(0);">筛选</a>
            </header>
            
            <div class="content">
                <div id="mapWrapper" class="full-height">
            		<div id="googleMap"></div>
            	</div>
            </div>
        </div>
        <div id="fade"></div>
        <div id="load_fade"></div>
    </div>
    
    <div id="filterBlock" class="pop" style="display: none;"><?php include_once './filter.php'; ?></div>
   

<script src="http://maps.google.cn/maps/api/js?sensor=false&amp;libraries=drawing"></script>
<script src="/static/js/infobox.js"></script>

<script type="text/javascript">
$(function() {

	$('#headerSearchForm').on('submit', function(e){
		return false;
	});
	
	// Index Search
	$('#btn_search').click(function() {
		var search = $('#input_search').val();
		var type = $('#house_type').val(),
		    status = $('#house_status').val();
	        minprice = $('#minprice').val(),
	        maxprice = $('#maxprice').val(),
	        minarea = $('#minarea').val(),
	        minbaths = $('#minbaths').val(),
	        minbeds = $('#minbeds').val(),
	        maxdom = $('#maxdom').val(),
	        minyear = $('#minyear').val();
	    var params = "";

		if(search && search.trim() != '') {
			if( search.indexOf('(') != '-1' && search.indexOf(')') != '-1' ){
    			var start = search.indexOf('(') + 1;
    			var end = search.indexOf(')');
    			search = search.substring(start, end).toLowerCase();
			}else if(search.indexOf('mls#') != '-1'){
				//搜索MLSID add by penghk 2015.11.16 15:53
				showLoader();
				$('#load_fade').show();
				mlsid = parseInt(search.substring(search.indexOf('#') + 1));
				if(mlsid !== '' && mlsid === +mlsid){
					$.get(apiUrl + '/properties/' + mlsid, function(data){
						if(data.code == '400'){
							showMsg('对不起，没有找到对应的结果', 'error');
							hideLoader();
							$('#load_fade').fadeOut(100);
						}else{
							window.location.href = "/view.php?id=" + mlsid;
						}
					});			
				}else{
					showMsg('Id 格式不正确', 'error');
					hideLoader();
					$('#load_fade').fadeOut(100);
				}
				return false;
			}

			if(maxdom == 0) {
				params = 'q='+search+'&type='+type+'&status='+status+'&minprice='+minprice+'&maxprice='+maxprice+'&minbaths='+minbaths+'&minbeds='+minbeds+'&minarea='+minarea+'&minyear='+minyear;
			} else {
				params = 'q='+search+'&type='+type+'&status='+status+'&minprice='+minprice+'&maxprice='+maxprice+'&minbaths='+minbaths+'&minbeds='+minbeds+'&minarea='+minarea+'&maxdom='+maxdom+'&minyear='+minyear;
			}
			window.location.href = './search.php?' + params;
		} else {
		    showMsg('Please input city name', 'error');
		}
		$('#city_complete').css('display', 'none');
	});

	/*
	 * Toggle filter pop
	 */
	$('#filterBtn').click(function() {
		var $filterBlock = $('#filterBlock');

		if('none' === $filterBlock.css('display')){
			$filterBlock.slideDown(100);
			$(this).text('确定');

		}else{
			$filterBlock.slideUp(100);
			$(this).text('筛选');

// 			var url = apiUrl + '/properties';
			var url = '/search.php'
			var q = $('#input_search').val();
			var filterDataJson = filterModel.getFilterData();
			var filterObj = null;
			if(null !== filterDataJson){
				filterObj = JSON.parse(filterDataJson);
			}

			if(null !== filterObj){
				url += '?q=' + q;
				for(var i = 0; i < filterObj.length; i++){
					if(undefined !== filterObj[i].val){
    					url += '&';
    					url += filterObj[i].name;
    					url += '=';
    					url += filterObj[i].val;
					}
				}
			}
			window.location.href = url;
		}
	});
});
</script>
<?php include_once 'footer.php'; ?>