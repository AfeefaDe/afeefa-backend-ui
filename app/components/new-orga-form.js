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
  newOrgaInstance: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const store = this.get('store');
    //init empty orga instance and set default values
    const orgaInstance = store.createRecord('orga');
    //set default valus
    this.set('newOrgaInstance', orgaInstance);
    //init empty contactInfo instance
    this.set('contactInfoInstance', store.createRecord('contactInfo'));
    //init empty localtion instance
    this.set('locationInstance', store.createRecord('location'));
    //init empty annotation instance
    this.set('annotationInstance', store.createRecord('annotation'));
  },
  handleError: function(reason) {
    if(reason.errors) {
      for (var singleError of reason.errors) {
        const singleErrorString = `Error saving orga (HTTP: ${singleError.status}): <br>${singleError.detail}`;
        Materialize.toast(singleErrorString, 1000000);
      }
    }
  },
	actions: {
		save: function() {
      let orga = this.get('newOrgaInstance');
      orga.save().then((savedOrga)=> {
        /*set contactable*/
        this.get('contactInfoInstance').set('contactable', savedOrga);
        this.get('locationInstance').set('locatable', savedOrga);
        this.get('annotationInstance').set('annotatable', savedOrga);
        const saveMeta = RSVP.hash({
          contact: this.get('contactInfoInstance').save(),
          location: this.get('locationInstance').save(),
          annotation: this.get('annotationInstance').save()
        });
        saveMeta.then(() => {
          history.back();
        });
      }, this.handleError);
		},
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaID) {
      if(parentOrgaID === -1) {
        this.set('newOrgaInstance.parentOrga', null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set('newOrgaInstance.parentOrga', parentOrga);
      }
    }
	}
});
