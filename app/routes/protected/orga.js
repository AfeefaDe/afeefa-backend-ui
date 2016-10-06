import Ember from 'ember';

export default Ember.Route.extend({
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
