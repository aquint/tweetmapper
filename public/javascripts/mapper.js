(function(window,google){
	var Mapper = (function(){
		function Mapper(element, opts){
			this.gMap = new google.maps.Map(element, opts);
		}
		Mapper.prototype = {
			zoom: function(level){
				if (level) {
					this.gMap.setZoom(level);
				} else { 
					return this.gMap.getZoom();
				}
			},
		    _on: function(opts) {
		    	var self = this;
		        if(opts.obj){
		        	google.maps.event.addListener(opts.obj, opts.event, function(e) {
		          		opts.callback.call(self, e);
		        	});
		        } else{
		        	google.maps.event.addListener(self.gMap, opts.event, function(e) {
		          		opts.callback.call(self, e);
		        	});
		        }
		        
		    },
			addMarker: function(opts){
				opts.position = {
					lat: opts.lat,
					lng: opts.lng
				}
				
				var marker = this._createMarker(opts);

				if (opts.event) {
		          this._on({
		            obj: marker,
		            event: opts.event.name,
		            callback: opts.event.callback
		          });
		        }
		        if (opts.content) {
		          this._on({
		            obj: marker,
		            event: 'click',
		            callback: function() {
		              var infoWindow = new google.maps.InfoWindow({
		                content: opts.content
		              });
		            
		              infoWindow.open(this.gMap, marker);
		            }
		          })  
		        }
		        markers.push(marker);
		        return marker;
			},
			_createMarker: function(opts){
				opts.map = this.gMap;
				return new google.maps.Marker(opts);
			},
			clearMarkers: function(){
				for (var i = 0; i < markers.length; i++) {
					markers[i].setMap(null);
				};
				markers = [];
			}
		};
		return Mapper;
	}());

	Mapper.create = function(element, opts){
		return new Mapper(element, opts);
	};

	window.Mapper = Mapper;

}(window, google))