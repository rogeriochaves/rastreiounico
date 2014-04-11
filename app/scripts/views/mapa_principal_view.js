Rastreiounico.MapaPrincipalView = Ember.View.extend({
	templateName: 'mapa_principal',
	didInsertElement: function(){
		var initialLocation;
		var rio = new google.maps.LatLng(-22.066441, -42.924029);
		var browserSupportFlag = new Boolean();

		function initialize() {
		  var myOptions = {
		    zoom: 17,
		    mapTypeId: google.maps.MapTypeId.ROADMAP,
		    disableDefaultUI: true,
		    center: rio
		  };
		  var map = new google.maps.Map(this.$("#mapa-principal")[0], myOptions);
		  
		  // Try W3C Geolocation (Preferred)
		  if(navigator.geolocation) {
		    browserSupportFlag = true;
		    navigator.geolocation.getCurrentPosition(function(position) {
		      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		      map.setCenter(initialLocation);
		    }, function() {
		      handleNoGeolocation(browserSupportFlag);
		    });
		  }
		  // Browser doesn't support Geolocation
		  else {
		    browserSupportFlag = false;
		    handleNoGeolocation(browserSupportFlag);
		  }
		  
		  function handleNoGeolocation(errorFlag) {
		    if (errorFlag == true) {
		      //alert("Geolocation service failed.");
		      initialLocation = rio;
		    } else {
		      //alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
		      initialLocation = rio;
		    }
		    map.setCenter(initialLocation);
		  }
		}

		initialize();
	}
});