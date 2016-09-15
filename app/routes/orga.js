import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
	model(params) {
		//@question better to make this a subroute of /orgas and simply filter the model
    return this.get('store').findRecord('orga', params.orga_id);
  },
  //@question: easier way to reset controller errorMessage
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('errorMessage', false);
  }
});
