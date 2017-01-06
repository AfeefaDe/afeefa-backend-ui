import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(params) {
    const entryInstance = this.store.peekRecord('orga', params.orga_id);
    const locationInstance = entryInstance.get('locations').then((locations) => {
       return locations.get('firstObject');
    });
    const contactInfoInstance = entryInstance.get('contactInfos').then((contactInfos) => {
       return contactInfos.get('firstObject') || this.store.createRecord('contactInfo');
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
  },
});
