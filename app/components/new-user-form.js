import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		save: function() {
			var newUser = {	
				email: this.get('email'), 
				forename: this.get('forename'), 
				surname: this.get('surname')
			};
			this.get('onDataReady')(newUser);
		}
	}
});
