import Ember from 'ember';
import RSVP from 'rsvp';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
    //returns model when all promises are resolved
    return RSVP.hash({
      instances: this.store.findRecord('user', this.get('session.currentUser')),
      attributes: ['description', 'status', 'subOrgas']
    });
	}
});
