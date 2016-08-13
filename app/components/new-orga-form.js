import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		save: function() {
			var newOrga = {title: this.get('title'), description: this.get('description')};
			this.get('onDataReady')(newOrga);
		}
	}
});
