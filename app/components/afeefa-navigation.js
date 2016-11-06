import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
  didReceiveAttrs() {
    this.EventBus.subscribe('willTransition', this, 'hideMenu');
  },
  willDestroyElement() {
    this.EventBus.unsubscribe('willTransition');
  },
  /*
   * Hide menu on EventBus transiton
   */
  hideMenu: function() {
    this.set('menuVisible', false);
  },
	actions: {
		toggleMenu: function() {
      this.set('menuVisible', !this.get('menuVisible'));
    },
		invalidateSession() {
			this.get('session').invalidate();
		}
	},
	title: 'Dashboard',
	menuVisible: false
});
