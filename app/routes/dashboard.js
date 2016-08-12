import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
//import SessionService from 'ember-simple-auth/services/session';

//export default Ember.Route.extend(AuthenticatedRouteMixin);

export default Ember.Route.extend(AuthenticatedRouteMixin, {

	model() {
		return this.store.findRecord('user', this.get('session.currentUser'));
	},
});
