import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  navigationService: Ember.inject.service('navigation'),

  pathNavigation: [],
  level1Navigation: [],
  menuVisible: false,

  didReceiveAttrs() {
    this.get('EventBus').subscribe('willTransition', this, 'hideMenu');
    this.get('navigationService').on('change', this, 'updateNavigation');
    this.updateNavigation();
  },


  hideMenu: function() {
    this.set('menuVisible', false);
  },


  updateNavigation: function() {
    const navigationService = this.get('navigationService');
    this.set('pathNavigation', navigationService.getPathNavigation());
    this.set('level1Navigation', navigationService.getLevel1Navigation());
  },

  actions: {
    toggleMenu: function() {
      this.set('menuVisible', !this.get('menuVisible'));
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
