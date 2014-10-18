var markers = [];

(function(window, mapper){

	//map options
	var options = mapper.MAP_OPTIONS;
	var element = document.getElementById('map-canvas');
	var emit = 0;
	//map
	var map = mapper.create(element, options);
	map.zoom(10);
	
	var socket = io();
	var keyword = '';

	// Emit the coordinates of the google maps view after the bounds have changed (i.e. if the map view was dragged)
	map._on({
	            event: 'dragend',
	            callback: function() {
		              var bounds = map.gMap.getBounds();
		              var corners = { 
			              sw : {
			              	lat: bounds.getSouthWest().lat(),
			              	lng: bounds.getSouthWest().lng()
			              },
			              ne : {
			              	lat: bounds.getNorthEast().lat(),
			              	lng: bounds.getNorthEast().lng()
			              }
		          	  }
		              socket.emit('bound_change', corners);
		          }
		    });

	// On tweet emission, prepend the tweet to the list with id #tweet-list and add marker to map 
	socket.on('tweets', function (twt) {
		var alltxt = (twt.user.name + " " + twt.text).toLowerCase();
		// Add to #tweet-list if it matches filter, or add all if no filter
		if (alltxt.indexOf(keyword) >= 0){
		    $('#tweet-list').prepend($('<li>').append($('<p>').text(twt.text)).attr('val', twt.id).prepend(($('<h3>')).text(twt.user.name)).prepend('<img src="' + twt.user.image + '">'));
		    
		    // Add marker to map based on tweet geolocation data
		    map.addMarker({
				lat: twt.geo[0], 
				lng: twt.geo[1],
				icon: '/images/tweet.png',
				content: twt.text
			});
		}
		// Remove oldest tweets when the list contains more than 30 tweets
		var lis = $('#tweet').children(); 
		if(lis.length>30){
			$('#tweet-list li:last').remove();
		}
	});

	//store the filter keyword and reset the form upon submitting
	$('#filter').on('submit', function(e){
		//prevent default submission action
		e.preventDefault();
		console.log('submitted');
		var input = $(this).find('[name=keyword]');
		keyword = input.val();

		if(keyword === ''){
			$(this).find('.form-group').addClass('has-error');
		}else{
			$(this).find('.form-group').removeClass('has-error');
			input.val('');
			map.clearMarkers();
			$('#tweet-list').empty();
		}
	})
	$('#location').on('submit', function(e){
		//prevent default submission action
		e.preventDefault();
		console.log('submitted');
		var input = $(this).find('[name=place]');
		keyword = input.val();

		if(keyword === ''){
			$(this).find('.form-group').addClass('has-error');
		}else{
			$(this).find('.form-group').removeClass('has-error');
			input.val('');
			map.clearMarkers();
			$('#tweet-list').empty();
		}
	})
}(window, window.Mapper || (window.Mapper = {})));