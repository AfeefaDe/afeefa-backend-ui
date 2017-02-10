import Ember from 'ember';
import RSVP from 'rsvp';
import CancelEditMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-route';

export default Ember.Route.extend(CancelEditMixin, {
  model() {
    const entryInstance = this.store.createRecord('event');
    const contactInfoInstance = this.store.createRecord('contactInfo');
    const locationInstance = this.store.createRecord('location');
    entryInstance.get('contactInfos').addObject(contactInfoInstance);
    entryInstance.get('locations').addObject(locationInstance);

    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance,
      contactInfoInstance,
      locationInstance
    });
  }
});
