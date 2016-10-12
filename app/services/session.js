import Ember from 'ember';
import ESASession from "ember-simple-auth/services/session";

export default ESASession.extend({
  store: Ember.inject.service('store'),
  currentUser: Ember.computed('isAuthenticated', function() {
    if (this.get('isAuthenticated')) {
      return this.get('data.authenticated.id');
    }
  })
});
