import Ember from 'ember';
import RSVP from 'rsvp';
import CancelEditMixin from 'afeefa-backend-ui/mixins/cancel-edit-entry-route';

export default Ember.Route.extend(CancelEditMixin, {
  model(params) {
    const entryInstance = this.store.peekRecord('event', params.event_id);

    const locationInstance = entryInstance.get('locations').then((locations) => {
      let location = locations.get('firstObject');
      if (!location) {
        location = this.store.createRecord('location');
        locations.pushObject(location);
      }
      return location;
    });

    const contactInfoInstance = entryInstance.get('contactInfos').then((contactInfos) => {
      let contactInfo = contactInfos.get('firstObject');
      if (!contactInfo) {
        contactInfo = this.store.createRecord('contactInfo');
        contactInfos.pushObject(contactInfo);
      }
      return contactInfo;
    });

    return RSVP.hash({
      entryInstance,
      contactInfoInstance,
      locationInstance,
      orgas: this.store.peekAll('orga')
    });
  }
});
