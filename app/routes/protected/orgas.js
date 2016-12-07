import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
	model() {
    let parentModel = this.modelFor("protected");
    return RSVP.hash({
      orgas: parentModel.orgas,
      attributes: ['category', 'createdAt']
    });
	}
});
