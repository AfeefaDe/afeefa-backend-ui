import Ember from 'ember';

export default Ember.Controller.extend({
	store: Ember.inject.service(),
	queryParams: ['type'],
  	//default orga
  	type: "orga",
  	outputType: Ember.computed('type', function(){
  		if(this.get('type')==="orga") {
  			return "Orga";
  		}
  		if(this.get('type')==="user") {
  			return "User";
  		}
  		return "undefined";
  	}),
  	//ugly; better solution ?????
  	isOrga: Ember.computed('type', function(){
  		if(this.get('type')==='orga') return true;
  		return false;
  	}),
  	actions: {
  		create: function(orgaObject) {
  			console.log("get object form child component: "+orgaObject);
  			var newOrga = this.get('store').createRecord(this.get('type'), orgaObject);
			newOrga.save();
  		}
  	}
});
