var Rastreiounico = window.Rastreiounico = Ember.Application.create();

Ember.View.reopen({
  didInsertElement: function(){
    this._super();
    if(this.get('controller') && this.get('controller').afterRender) this.get('controller').afterRender();
  },
  willDestroyElement: function(){
  	this._super();
    if(this.get('controller') && this.get('controller').beforeDestroy) this.get('controller').beforeDestroy();
  }
});

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');
