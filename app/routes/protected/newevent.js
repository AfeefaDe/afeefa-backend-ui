import Ember from 'ember';
import RSVP from 'rsvp';
import CancelEditMixin from '../../mixins/cancel-edit-entry-route';

export default Ember.Route.extend(CancelEditMixin, {
  model() {
    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance: this.store.createRecord('event'),
      contactInfoInstance: this.store.createRecord('contactInfo'),
      locationInstance: this.store.createRecord('location'),
    });
  }
});
