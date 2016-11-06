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
  newEntryInstance: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const store = this.get('store');
    //init empty orga instance and set default values

    //@todo!!!!!!!!
    const orgaInstance = store.createRecord('orga');
    this.set('newOrgaInstance', orgaInstance);
    //@todo!!!!!!!!

    //init empty contactInfo instance
    this.set('contactInfoInstance', store.createRecord('contactInfo'));
    //init empty localtion instance
    this.set('locationInstance', store.createRecord('location'));
    //init empty annotation instance
    this.set('annotationInstance', store.createRecord('annotation'));
  },
  actions: {
    save: function() {
      let store = this.get('store');

      let newEntryInstance = this.get('newEntryInstance');
      newEntryInstance.save().then((savedInstance)=> {
        /*set contactable*/
        this.get('contactInfoInstance').set('contactable', savedInstance);
        this.get('locationInstance').set('locatable', savedInstance);
        this.get('annotationInstance').set('annotatable', savedInstance);
        const saveMeta = RSVP.hash({
          contact: this.get('contactInfoInstance').save(),
          location: this.get('locationInstance').save(),
          annotation: this.get('annotationInstance').save()
        });
        saveMeta.then((hash) => {
          history.back();
        });
      });
    },
    setAttribute: function(key, value) {
      console.log("Set in paren",key, value);
    }
  }
});

