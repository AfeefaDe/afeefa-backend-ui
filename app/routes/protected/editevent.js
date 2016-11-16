import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(params) {
    return RSVP.hash({
      event: this.store.peekRecord('event', params.event_id),
      orgas: this.store.peekAll('orga')
    });
  },
});
