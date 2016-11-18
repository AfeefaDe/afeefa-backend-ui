import Ember from 'ember';
import RSVP from 'rsvp';

/*
 * mixins with function validateForm
 */
import FormValidatorMixin from '../mixins/form-validator';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(FormValidatorMixin, RouteHelper, {
  store: Ember.inject.service(),
  locationInstance: null,
  annotationInstance: null,
  contactInfoInstance: null,
  newEventInstance: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const store = this.get('store');
    //init empty event instance and set default values
    const eventInstance = store.createRecord('event');
    this.set('newEventInstance', eventInstance);
    //init empty contactInfo instance
    this.set('contactInfoInstance', store.createRecord('contactInfo'));
    //init empty localtion instance
    this.set('locationInstance', store.createRecord('location'));
    //init empty annotation instance
    this.set('annotationInstance', store.createRecord('annotation'));
  },
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
