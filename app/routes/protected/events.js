import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
    model() {
    //returns model when all promises are resolved
    return RSVP.hash({
      instances: this.store.peekAll('event'),
      attributes: ['category', 'date']
    });
  }
});
