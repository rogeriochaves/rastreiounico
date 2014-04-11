Rastreiounico.Router.map(function () {
	this.resource('rastreios', { path: '/rastreios' }, function() {
	    this.route('new');
	});
	this.resource('rastreio.show', { path: '/rastreio/:rastreio_id' });
	this.resource('rastreio.edit', { path: '/rastreio/:rastreio_id/:password' });
});
