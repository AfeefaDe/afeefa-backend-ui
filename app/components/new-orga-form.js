import Ember from 'ember';
import RSVP from 'rsvp';

/*
 * mixins with function validateForm
 */
import ErrorHandler from '../mixins/error-handler';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(ErrorHandler, RouteHelper, {
  store: Ember.inject.service(),
	actions: {
    /*
     * Save Orga with meta models
     */
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
        }, this.handleError);
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
