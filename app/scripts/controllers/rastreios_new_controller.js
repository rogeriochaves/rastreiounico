Rastreiounico.RastreiosNewController = Ember.Controller.extend({
  	afterRender: function() {
  		var current_user = {};
  		var store = this.store;
  		var self = this;
  		var password;

  		Rastreiounico.dbAuthCallback = function(error, user){
			if (error) {
				alert(error);
				//alert("The page will be refreshed now");
				//window.location.reload();
			} else if (user && current_user.id != user.id) {
				Rastreiounico.dbAuth.logout();
			} else if (!user) {
				// Generate password
				password = (function guid() {
				  function s4() {
				    return Math.floor((1 + Math.random()) * 0x10000)
				               .toString(16)
				               .substring(1);
				  }
				  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				         s4() + '-' + s4() + s4() + s4();
				})();

				// Create user
				Rastreiounico.dbAuth.createUser(password + "@rastreiounico.com.br", password, function(error, user) {
				  	if (error) {
				  		alert(error);
				  	}else{
				    	current_user = user;
			    		Rastreiounico.dbAuth.login('password', {
							email: password + "@rastreiounico.com.br",
							password: password,
							debug: true
						});
				  	}
				});

			} else if (user){
				//var uid = ((new Date()).getTime() - (new Date(2014,3,10)).getTime()).toString(30);
				var rastreio = store.createRecord('rastreio', {
					user_id: user.id + "",
					//uid: uid,
					lat: 0,
					lng: 0,
					description: "Nenhuma descrição"
				}).save().then(function(rastreio){
					self.transitionToRoute('/rastreio/' + rastreio.get('id') + '/' + password, rastreio);
				});
				
			}
		}
		Rastreiounico.dbAuthCallback(null, Rastreiounico.dbLoggedUser);
	}
});