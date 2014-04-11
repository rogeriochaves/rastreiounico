Rastreiounico.RastreioShowController = Ember.Controller.extend({
	initialLocation: null,
	last_lat: 0,
	last_lng: 0,
	browserSupportFlag: new Boolean(),
	map: null,
	marker: null,
	mapInterval: null,
	resizeInterval: null,
	modelDbConnection: null,
  	afterRender: function() {
  		$(window).resize(this.onResize);
  		self = this;
		self.last_lat = 0;
		self.last_lng = 0;
		self.marker = null;
		self.map = null;
		self.mapInterval = setInterval(function(){
			if(typeof google !== "undefined"){
				self.onMapLoad();
				clearInterval(self.mapInterval);
			}
		}, 1000);
		self.modelDbConnection = null;
  	},
  	onResize: function(){
		$('#mapa').height($(window).height() - $("header").outerHeight(true));
		if(this.map) google.maps.event.trigger(this.map, 'resize');
	},
  	beforeDestroy: function(){
		clearInterval(this.mapInterval);
		clearInterval(this.resizeInterval);
		$(window).off("resize");
		if(self.modelDbConnection) self.modelDbConnection.off('child_changed');
  	},
  	onMapLoad: function(){
		var self = this;
		self.onResize();
		self.map = new google.maps.Map($("#mapa")[0], {
		    zoom: 18,
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		resizeInterval = setInterval(function(){
			self.onResize();
		}, 1000);

		self.updateLocation();
		self.setModelChangeListener();
		//self.updateLocationInterval = setInterval(self.updateLocation, 1000);
	},
	updateLocation: function(){
		var self = this;
		var model = self.get("model");
		if(model && self.map){
			var lat = model.get("lat");
			var lng = model.get("lng");
			self.initialLocation = new google.maps.LatLng(lat,lng);
			self.map.setCenter(self.initialLocation);

			if(!self.marker){
		  		var image = new google.maps.MarkerImage($("#marker").attr('src'),
			        // This self.marker is 25 pixels wide by 25 pixels tall.
			        null, 
			        // The origin for this image is 0,0.
			        new google.maps.Point(0,0),
			        // The anchor for this image is the base of the flagpole at 0,32.
			        new google.maps.Point(12.5, 12.5)
			    );

	      		self.marker = new google.maps.Marker({
				  position: self.initialLocation,
				  title: "Você está aqui",
				  icon: image,
				  map: self.map
				});
				self.map.setZoom(18);
		  	}else{
		  		self.marker.setPosition(self.initialLocation);
		  	}

			self.last_lat = lat;
			self.last_lng = lng;
		}
	}.observes('model.lat', 'model.lng'),
	setModelChangeListener: function(){
		var self = this;
		var model = self.get('model');
		if(model){
			self.modelDbConnection = new Firebase('https://scorching-fire-178.firebaseio.com/rastreios/' + model.get('id'));
			self.modelDbConnection.on('child_changed', function(childSnapshot, prevChildName){
				if(childSnapshot.name() == "lat"){
					model.set("lat", childSnapshot.val());
				}else if (childSnapshot.name() == "lng"){
					model.set("lng", childSnapshot.val());
				}
			});
		}
	}.observes('model')
});