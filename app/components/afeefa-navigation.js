import Ember from 'ember';
import pathNavigation from '../models/path-navigation';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
  didReceiveAttrs() {
    this.EventBus.subscribe('willTransition', this, 'hideMenu');
    this.EventBus.subscribe('didTransition', this, 'updateNavigation');
    this.updateNavigation()
  },
  willDestroyElement() {
    this.EventBus.unsubscribe('willTransition');
    this.EventBus.unsubscribe('didTransition');
  },
  /*
   * Hide menu on EventBus transiton
   */
  hideMenu: function() {
    this.set('menuVisible', false);
  },
  updateNavigation: function() {
    this.set('navigation', pathNavigation.getNavigation());
  },
	actions: {
		toggleMenu: function() {
      this.set('menuVisible', !this.get('menuVisible'));
    },
		invalidateSession() {
			this.get('session').invalidate();
		}
	},
	navigation: [],
	menuVisible: false
});
