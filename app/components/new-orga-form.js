import Ember from 'ember';
/*
 * mixins with function validateForm
 */
import FormValidatorMixin from '../mixins/form-validator';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(FormValidatorMixin, RouteHelper, {
  store: Ember.inject.service(),
  parentOrgaId: null,
	actions: {
		save: function() {
      let validated = this.validateForm(['title', 'description']);
      let store = this.get('store');
      let parentOrga = store.peekRecord('orga', this.get('parentOrgaId'));
      if(validated) {
        var orga = store.createRecord('orga', {
          title: this.get('title'),
          description: this.get('description'),
          parentOrga: parentOrga
        });
        orga.save();
      }
		},
    /*
     * set parent orga id from input select
     */
    selectParent: function(parentOrgaId) {
      this.set('parentOrgaId', parentOrgaId);
    }
	}
});

