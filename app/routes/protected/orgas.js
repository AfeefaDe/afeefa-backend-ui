import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
	model() {
    return RSVP.hash({
      orgas: this.store.peekAll('orga', {include: 'annotations'}),
      attributes: ['category', 'createdAt']
    });
	}
});
