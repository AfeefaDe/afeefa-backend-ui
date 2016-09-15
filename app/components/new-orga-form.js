import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
	actions: {
		save: function() {
      var orga = this.get('store').createRecord('orga', {
        title: this.get('title'),
        description: this.get('description')
      });
      orga.save();
		}
	}
});
