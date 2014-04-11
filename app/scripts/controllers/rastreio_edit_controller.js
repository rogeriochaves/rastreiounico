Rastreiounico.RastreioEditController = Ember.Controller.extend({
	initialLocation: null,
	last_lat: 0,
	last_lng: 0,
	browserSupportFlag: new Boolean(),
	map: null,
	marker: null,
	circle: null,
	alreadyAsked: false,
	allowed: false,
	reclamou: false,
	updateLocationInterval: null,
	mapInterval: null,
	resizeInterval: null,
	email: null,
	beforeDestroy: function(){
		clearInterval(this.updateLocationInterval);
		clearInterval(this.mapInterval);
		clearInterval(this.resizeInterval);
		$(window).off("resize");
	},
	afterRender: function() {
		if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))){
			$('#qrcode').show().animate({bottom: '0%'}, 500);
		}

		$('#qrcode .btt-close').click(function(){
			$('#qrcode').animate({bottom: '-100%'}, 500);
		});

		$(window).resize(this.onResize);
		var clip = new ZeroClipboard($("#lnk-copiar"));

		self = this;
		self.last_lat = 0;
		self.last_lng = 0;
		self.marker = null;
		self.circle = null;
		self.map = null;
		self.mapInterval = setInterval(function(){
			if(typeof google !== "undefined"){
				self.onMapLoad();
				clearInterval(self.mapInterval);
			}
		}, 1000);
	},
	onResize: function(){
		$('#mapa').height($(window).height() - $("header").outerHeight(true));
		if(this.map) google.maps.event.trigger(this.map, 'resize');
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

		if(navigator.geolocation) {
			self.browserSupportFlag = true;

			var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
			    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
			var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
			var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
			    // At least Safari 3+: "[object HTMLElementConstructor]"
			var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
			var isIE = /*@cc_on!@*/false || document.documentMode;   // At least IE6

			setTimeout(function(){
				if(!self.allowed) $(".ative-localizacao").show();
			}, 2500);
		    if(isFirefox){
		    	$(".ative-localizacao").addClass('firefox');
		    	$(".ative-localizacao p").html("Precisamos que você clique em <b>Compartilhar Localização > Sempre Compartilhar Localização</b> para continuar");
		    }else if(isIE){
		    	$(".ative-localizacao").addClass('ie');
		    	$(".ative-localizacao p").html("Precisamos que você clique em <b>Opções deste site > Sempre Permitir</b> para continuar");
		    }

			self.updateLocationInterval = setInterval(self.updateLocation(self), 1000);
			self.updateLocation();
		}
		// Browser doesn't support Geolocation
		else {
			self.browserSupportFlag = false;
			handleNoGeolocation(self.browserSupportFlag);
		}
	},
	updateLocation: function(self){
		return function(){
			if(self.alreadyAsked && !self.allowed) return false;
			self.alreadyAsked = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				self.allowed = true;
				$(".ative-localizacao, .ative-localizacao-fade").hide();
				var accuracy = position.coords.accuracy;
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				if(lat && lng && !isNaN(lat) && !isNaN(lng)  ){// && (Math.abs(self.last_lat - lat) > 0.000001 || Math.abs(self.last_lng - lng) > 0.000001)){
		      		self.initialLocation = new google.maps.LatLng(lat,lng);
		      		//console.log(self);
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
						self.circle = new google.maps.Circle({
						    center: self.initialLocation,
						    radius: accuracy,
						    map: self.map,
						    fillColor: '#1faee3',
						    fillOpacity: 0.2,
						    strokeColor: '#1faee3',
						    strokeOpacity: 0.4
						});
						self.map.fitBounds(self.circle.getBounds());
						self.map.setZoom(18);
			      	}else{
			      		self.marker.setPosition(self.initialLocation);
			      		self.circle.setCenter(self.initialLocation);
			      		self.circle.setRadius(accuracy);
			      		if(accuracy < 10){
			      			self.circle.setMap(null);
			      		}else{
			      			self.circle.setMap(self.map);
			      		}
			      	}

		      		self.last_lat = lat;
		      		self.last_lng = lng;

		      		setTimeout(function(){
			      		self.map.setCenter(self.initialLocation);
			      	}, 500);

		      		var model = self.get('model');
		      		model.set('lat', lat);
		      		model.set('lng', lng);
		      		model.save();
		      	}
		      	
		    }, function() {
		    	handleNoGeolocation(self.browserSupportFlag);
		    }, {enableHighAccuracy: true});
		}
	},
	handleNoGeolocation: function(errorFlag) {
		if(!self.reclamou){
			$(".ative-localizacao").hide();
		    if (errorFlag == true) {
		    	alert("Você bloqueou a localização automática para esta página, por favor, permita a localização automática e atualize a página");
		    } else {
		    	alert("Seu navegador não suporta localização automática, por favor, utilize outro navegador");
		    }
		    self.reclamou = true;
		}
	},
	actions: {
		enviarEmail: function(email){
			var email = this.get("email");
			var model = this.get('model');
			if(email.match(/([^\s]+)((?:[-a-z0-9]\.)[a-z]{2,})([a-z ])?/i)){
				if(model){
					var m = new mandrill.Mandrill('aLX0qXmlZDUoot3glnWBRw');
					var params = {
					    "message": {
					        "from_email":"rastreiounico@gmail.com",
					        "to":[{"email":email}],
					        "subject": "Código de Rastreio Rastreio Único",
					        "text": "Olá,\n\nVocê recebeu um código de rastreio, acesse o link abaixo e acompanhe:\n\n" + model.get('full_url_with_protocol')
					    }
					};

					$("#enviar-email").modal('hide');
					m.messages.send(params, function(res) {
				    	alert("Email Enviado!");
				    }, function(err) {
				        console.log("Erro: " + err);
				    });
				}
			}else{
				alert("Email inválido");
			}
		}
	}
});