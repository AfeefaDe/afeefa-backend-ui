import Ember from 'ember';
import afeefaMenu from '../models/afeefa-menu';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
  didReceiveAttrs() {
    this.EventBus.subscribe('willTransition', this, 'hideMenu');
    this.EventBus.subscribe('didTransition', this, 'updateNavigation');
    this.updateNavigation();
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
    this.set('pathNavigation', afeefaMenu.getPathNavigation());
		this.set('level1Navigation', afeefaMenu.getLevel1Navigation());
  },
	actions: {
		toggleMenu: function() {
      this.set('menuVisible', !this.get('menuVisible'));
    },
		invalidateSession() {
			this.get('session').invalidate();
		}
	},
	pathNavigation: [],
	level1Navigation: [],
	menuVisible: false
});
