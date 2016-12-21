import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
	model() {
    return RSVP.hash({
      orgas: this.store.peekAll('orgas'),,
      attributes: ['category', 'createdAt']
    });
	}
});
