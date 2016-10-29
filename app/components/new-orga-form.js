import Ember from 'ember';
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
  contactInfoInstance: null,
  didReceiveAttrs() {
    this._super(...arguments);
    //init empty contactInfo instance
    this.set('contactInfoInstance', this.get('store').createRecord('contactInfo'));
    //init empty localtion instance
    this.set('locationInstance', this.get('store').createRecord('location'));
  },
	actions: {
		save: function() {
      let validated = this.validateForm(['title', 'description']);
      let store = this.get('store');
      if(validated) {
        var orga = store.createRecord('orga', {
          title: this.get('title'),
          description: this.get('description'),
          parentOrga: this.get('parentOrga'),
          category: this.get('categoryInstance'),
          state: this.get('state')
        });
        orga.get('contactInfos').pushObject(this.get('contactInfoInstance'));
        orga.get('locations').pushObject(this.get('locationInstance'));
        orga.save();
      }
		},
    /*
     * Input type select setting theit values
     */
    selectParent: function(parentOrgaId) {
      let parentOrga = this.get('store').peekRecord('orga', parentOrgaId);
      this.set('parentOrga', parentOrga);
    },
    selectCategory: function(categoryId) {
      if(categoryId === -1) this.set('category', '');
      else this.set('category', this.get('categories')[categoryId]);
    },
    selectState: function(stateId) {
      this.set('state', this.get('states')[stateId]);
    }
	},
  categories: ['community', 'welcome_ini', 'sport'],
  states: ['active', 'inactive']
});

