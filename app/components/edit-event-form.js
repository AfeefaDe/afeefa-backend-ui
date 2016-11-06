import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  event: null,
  actions: {
    saveEvent: function() {
      const event = this.get('event');
      const eventSave = event.save();
      const annotations = event.get('annotations').then((annotation) => {
        annotation.save();
      });
      const contactInfos = event.get('contactInfos').then((contactInfo) => {
        contactInfo.save();
      });
      const locations = event.get('locations').then((location) => {
        location.save();
      });
      const diff = RSVP.hash({
        eventSave,
        annotations,
        contactInfos,
        locations,
      });
      diff.then((success)=>{
        history.back();
      });
    }
  }
});

