<?php include_once 'header.php'; ?>
        <div id="site">
            <header>
                <a id="return" href=""></a>
                <h3>周边信息</h3>
            </header>
            
            <div class="content">
                <div id="mapWrapper" class="full-height">
                    <div id="googleMap"></div>
            	</div>
            </div>
        </div>
        <div id="load_fade"></div>
    </div>	
<script src="http://maps.google.cn/maps/api/js?sensor=false&amp;libraries=drawing"></script>
<script src="/static/js/map.js"></script>

<script type="text/javascript">

$(function() {	
	
	
	
	if(GET['id'] && GET['lat'] && GET['lng']) {
		showLoader();
		$('#load_fade').show();
		
		var id = GET['id'],
		    lat = parseInt(GET['lat']),
		    lng = parseInt(GET['lng']);

		map.setCenter({lat:lat, lng:lng});
		map.setZoom(10);
	    
		$('#return').attr('href', './view.php?id='+id);
		if(lat && lng) {			
			//util.setMapCenter(lat, lng);

			var position = new google.maps.LatLng(lat, lng);
			var marker = new google.maps.Marker({
				position: position,
				icon: '/static/img/orange_position.png'
			});
			markerCluster.addMarker(marker);
			
			$.ajax({
		        cache: false, 
				url: apiUrl + "/neighborhood?lat="+lat+"&lng="+lng,
				type: "GET",
				dataType: 'json',
				success: function (msg) {
					hideLoader();
					$('#load_fade').hide();
					console.log(msg);
					if(msg['total'] == 0){
						showMsg('No result searched', 'error');						
					}
					else {
						
						$.each(msg['result'], function(idx, ele) {
							var position = new google.maps.LatLng(ele.lat, ele.lng);
							var marker = new google.maps.Marker({
								position: position,
								icon: '/static/img/school_position.png'
							});
							markerCluster.addMarker(marker);
						});
					}
				}
			});

			//var map = new google.maps.Map(document.getElementById('googleMap'));
			//map.setCenter(position);
		}
	}
});
</script>
<?php include_once 'footer.php'; ?>