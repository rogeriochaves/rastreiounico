Rastreiounico.Rastreio = DS.Model.extend({
	//uid: DS.attr('string'),
	user_id: DS.attr('string'),
	lat: DS.attr('number'),
	lng: DS.attr('number'),
	description: DS.attr('string'),
	bitly_url: DS.attr('string'),

	full_url: function(){
		return window.location.host + window.location.pathname + "#/rastreio/" + this.get("id")
	}.property('id'),

	full_url_with_protocol: function(){
		return window.location.protocol + "//" + this.get("full_url")
	}.property('id'),

	bitly_link: function(){
		var self = this;
		if(!self.get('id')){
			return null;
		}else if(!self.get('bitly_url')){
			$.getJSON("http://api.bitly.com/v3/shorten?callback=?", { 
	                "format": "json",
	                "apiKey": "R_32a8cf74a50d660fcb5639b1db99358d",
	                "login": "rogeriocfj",
	                "longUrl": self.get("full_url_with_protocol").replace("localhost", "lvh.me")
	            }, function(response){
	            	if(response.data && response.data.url){
	            		self.set('bitly_url', response.data.url);
	            	}else{
	            		self.set('bitly_url', self.get("full_url_with_protocol"));
	            	}
	            }
	        );
	        self.set('bitly_url', "");
		    return null;
		}else{
			return self.get('bitly_url');
		}
	}.property('bitly_url', 'id'),

	bitly_link_without_http: function(){
		return (this.get('bitly_link') ? this.get('bitly_link') : "").replace("https://", "").replace("http://", "");
	}.property('bitly_url')

});