import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	actions: {
		toggleMenu: function() {
      this.set('menuVisible', !this.get('menuVisible'));
      console.debug('toggle menu', this.get('menuVisible'));
    },

		invalidateSession() {
			this.get('session').invalidate();
		}
	},

	title: 'Dashboard',
	menuVisible: false

});
