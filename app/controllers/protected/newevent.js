import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  newEventInstance: null,
  init: function() {
    this._super(...arguments);
    const store = this.get('store');
    //init empty event instance and set default values
    const eventInstance = store.createRecord('event');
    eventInstance.get('locations').pushObject(store.createRecord('location'));
    eventInstance.get('contactInfos').pushObject(store.createRecord('contactInfo'));
    eventInstance.get('annotations').pushObject(store.createRecord('annotation'));
    this.set('newEventInstance', eventInstance);
  },
  actions: {
    save: function() {
      const store = this.get('store');
      let event = this.get('newEventInstance');
      event.save().then((savedEvent)=> {
        /*set contactable
        this.get('contactInfoInstance').set('contactable', savedEvent);
        this.get('locationInstance').set('locatable', savedEvent);
        this.get('annotationInstance').set('annotatable', savedEvent);

        const saveMeta = RSVP.hash({
          contact: this.get('contactInfoInstance').save(),
          location: this.get('locationInstance').save(),
          annotation: this.get('annotationInstance').save()
        });
        saveMeta.then((hash) => {
          history.back();
        });
        */
      });
    },
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaID) {
      if(parentOrgaID === -1) {
        this.set('newEventInstance.orga', null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set('newEventInstance.orga', parentOrga);
      }
    }
  }
});
