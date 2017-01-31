import Ember from 'ember';

export default Ember.Component.extend({
  navigationService: Ember.inject.service('navigation'),
  pathNavigation: [],
  didReceiveAttrs() {
    this.get('navigationService').on('change', this, 'updateNavigation');
    this.updateNavigation();
  },
  updateNavigation: function() {
    const navigationService = this.get('navigationService');
    this.set('pathNavigation', navigationService.getPathNavigation());
  },
});
