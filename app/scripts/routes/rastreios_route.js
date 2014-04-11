Rastreiounico.RastreioShowRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('rastreio', params.rastreio_id);
	}
});

Rastreiounico.RastreioEditRoute = Ember.Route.extend({
	model: function(params) {
		this.set('password', params.password);
	    return this.store.find('rastreio', params.rastreio_id)
	},
	afterModel: function(){
		var model = this.modelFor(this.routeName);
		var controller = this.controllerFor(this.routeName);
		var password = this.get('password');
		var current_user = {};
		controller.set('qrcode', "http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=" + encodeURIComponent(model.get('full_url_with_protocol') + "/" + password));

    	Rastreiounico.dbAuthCallback = function(error, user){
			if (error) {
				alert(error);
				self.transitionToRoute('/rastreio/' + model.get('id'));
			} else if (user && current_user.id != model.user_id) {
				Rastreiounico.dbAuth.logout();
			} else if (!user) {
				Rastreiounico.dbAuth.login('password', {
					email: password + "@rastreiounico.com.br",
					password: password,
					debug: true
				});
			} else {
				controller.set("current_usuario", user)
			}
		}
		Rastreiounico.dbAuthCallback(null, Rastreiounico.dbLoggedUser);
	}
});