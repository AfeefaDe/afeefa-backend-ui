import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: Ember.inject.service('session'),

  afterModel() {
    if (this.get('session').isAuthenticated) {
    this.get('session').invalidate();
    this.transitionTo('login');
  }
}
});
