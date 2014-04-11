Rastreiounico.db = new Firebase('https://scorching-fire-178.firebaseio.com');
Rastreiounico.dbLoggedUser = null;
Rastreiounico.dbAuthCallback = function(error, user){
	if (error) {
		alert(error);
	}else{
		Rastreiounico.dbLoggedUser = user;
	}
}
Rastreiounico.dbAuth = new FirebaseSimpleLogin(Rastreiounico.db, function(error, user){
	Rastreiounico.dbAuthCallback(error, user);
});

/*Rastreiounico.dbChildChange = function(childSnapshot, prevChildName){
	console.log(childSnapshot);
}
Rastreiounico.dbRastreios = new Firebase('https://scorching-fire-178.firebaseio.com/rastreios');
Rastreiounico.dbRastreios.on('child_changed', Rastreiounico.dbChildChange);*/

Rastreiounico.ApplicationAdapter = DS.FirebaseAdapter.extend({
	firebase: Rastreiounico.db
});