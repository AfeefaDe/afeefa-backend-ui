import Ember from 'ember';
import RSVP from 'rsvp';

import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(RouteHelper, {
  store: Ember.inject.service(),
  actions: {
    save: function() {
      let event = this.get('newEventInstance');
      event.save().then((savedEvent)=> {
        /*set contactable*/
        this.get('contactInfoInstance').set('contactable', savedEvent);
        this.get('locationInstance').set('locatable', savedEvent);
        this.get('annotationInstance').set('annotatable', savedEvent);
        const saveMeta = RSVP.hash({
          contact: this.get('contactInfoInstance').save(),
          location: this.get('locationInstance').save(),
          annotation: this.get('annotationInstance').save()
        });
        saveMeta.then(() => {
          history.back();
        });
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
