import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  event: null,
  didReceiveAttrs() {
    this._super(...arguments);
    /*
     * workaround to cut off time from date object and pass it into input[type="date"]
     * not proud at all :(
     */
    const date = this.get('event.date');
    if(date && date.getYear()) {
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      this.set('event.date', dateString);
    }
  },
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

