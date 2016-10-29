import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
	model() {
    //returns model when all promises are resolved
    let parentModel = this.modelFor("protected");
    return RSVP.hash({
      orgas: parentModel.orgas,
      attributes: ['description', 'status', 'subOrgas']
    });
	}
});
