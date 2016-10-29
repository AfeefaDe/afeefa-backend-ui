import Ember from 'ember';
import RSVP from 'rsvp';

/*
 * mixins with function validateForm
 */
import FormValidatorMixin from '../mixins/form-validator';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(FormValidatorMixin, RouteHelper, {
  store: Ember.inject.service(),
  parentOrga: null,
  locationInstance: null,
  state: 'active',
  annotationInstance: null,
  contactInfoInstance: null,
  didReceiveAttrs() {
    this._super(...arguments);
    const store = this.get('store');
    //init empty contactInfo instance
    this.set('contactInfoInstance', store.createRecord('contactInfo'));
    //init empty localtion instance
    this.set('locationInstance', store.createRecord('location'));
    //init empty annotation instance
    this.set('annotationInstance', store.createRecord('annotation'));
  },
	actions: {
		save: function() {
      let validated = this.validateForm(['title', 'description']);
      let store = this.get('store');

      const saveMeta = RSVP.hash({
        contact: this.get('contactInfoInstance').save(),
        location: this.get('locationInstance').save(),
        annotation: this.get('annotationInstance').save()
      });
      saveMeta.then((hash) => {
        if(validated) {
          var orga = store.createRecord('orga', {
            title: this.get('title'),
            description: this.get('description'),
            parentOrga: this.get('parentOrga'),
            category: this.get('categoryInstance'),
            state: this.get('state'),
            contactInfo: this.get('contactInfoInstance'),
            location: this.get('locationInstance'),
            annotation: this.get('annotationInstance')
          });
          orga.save();
        }
      })
		},
    /*
     * Input type select setting theit values
     */
    selectParent: function(parentOrgaId) {
      let parentOrga = this.get('store').peekRecord('orga', parentOrgaId);
      this.set('parentOrga', parentOrga);
    },
    selectState: function(stateId) {
      this.set('state', this.get('states')[stateId]);
    }
	},
  states: ['active', 'inactive']
});

