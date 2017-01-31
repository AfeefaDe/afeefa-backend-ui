import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  navigationService: Ember.inject.service('navigation'),

  level1Navigation: [],

  didReceiveAttrs() {
    this.get('navigationService').on('change', this, 'updateNavigation');
    this.updateNavigation();
  },

  updateNavigation: function() {
    const navigationService = this.get('navigationService');
    this.set('level1Navigation', navigationService.getLevel1Navigation());
  },

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
