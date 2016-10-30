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
    orgaInstance.set('state', 'active');
    this.set('newOrgaInstance', orgaInstance);
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

      const saveMeta = RSVP.hash({
        contact: this.get('contactInfoInstance').save(),
        location: this.get('locationInstance').save(),
        annotation: this.get('annotationInstance').save()
      });
      saveMeta.then((hash) => {
        let orga = this.get('newOrgaInstance');
        orga.get('contactInfos').addObject(this.get('contactInfoInstance'));
        orga.get('locations').addObject(this.get('locationInstance'));
        orga.get('annotations').addObject(this.get('annotationInstance'));
        orga.save();
      });
		},
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaId) {
      let parentOrga = this.get('store').peekRecord('orga', parentOrgaId);
      this.get('newOrgaInstance').set('parentOrga', parentOrga);
    },
    /*
     * Input type select for setting state
     */
    selectState: function(stateId) {
      let state = this.get('states')[stateId];
      this.get('newOrgaInstance').set('state', state);
    }
	},
  states: ['active', 'inactive']
});

