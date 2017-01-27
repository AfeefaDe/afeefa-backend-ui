import Ember from 'ember';
import RSVP from 'rsvp';
import CancelEditMixin from '../../mixins/cancel-edit-entry-route';

export default Ember.Route.extend(CancelEditMixin, {
  model(params) {
    const entryInstance = this.store.peekRecord('event', params.event_id);
    const locationInstance = entryInstance.get('locations').then((locations) => {
       return locations.get('firstObject') || this.store.createRecord('location'); // fallback if no location info has been received
    });
    const contactInfoInstance = entryInstance.get('contactInfos').then((contactInfos) => {
       return contactInfos.get('firstObject') || this.store.createRecord('contactInfo'); // fallback if no contact info has been received
    });
    const annotationInstance = entryInstance.get('annotations').then((annotations) => {
       return annotations.get('firstObject');
    });

    return RSVP.hash({
      entryInstance,
      contactInfoInstance,
      annotationInstance,
      locationInstance,
      orgas: this.store.peekAll('orga')
    });
  }
});
