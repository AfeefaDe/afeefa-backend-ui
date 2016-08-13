import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model() {
		return this.store.findRecord('user', this.get('session.currentUser'));
		//@question: how to get only orgas... - this just calls /orgas
		//return this.store.findAll('orga');
	}
});
