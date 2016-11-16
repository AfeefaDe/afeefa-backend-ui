import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(params) {
    return RSVP.hash({
      orga:  this.store.peekRecord('orga', params.orga_id),
      orgas: this.store.peekAll('orga')
    });
  },
});
