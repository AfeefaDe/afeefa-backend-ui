import Ember from 'ember';
import RSVP from 'rsvp';

/*
 * mixins with function validateForm
 */
import FormValidatorMixin from '../mixins/form-validator';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(FormValidatorMixin, RouteHelper, {
  didReceiveAttrs() {
    this._super(...arguments);

  },
	actions: {
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaId) {
      let parentOrga = this.get('store').peekRecord('orga', parentOrgaId);
      this.get('newOrgaInstance').set('parentOrga', parentOrga);
    }
	}
});

