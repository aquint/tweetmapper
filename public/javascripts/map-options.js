(function(window, google, mapper){

	mapper.MAP_OPTIONS = {

		center: {
			lat: 43.658275,
			lng: -79.378526
		},
		zoom: 15,
		disableDefaultUI: false,
		scrollwheel: true,
		draggable: true
		//mapTypeId: google.maps.mapTypeId.ROADMAP,

	}

}(window, google, window.Mapper || (window.Mapper = {})));
