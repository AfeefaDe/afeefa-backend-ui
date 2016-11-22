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
      let orga = this.get('model.entryInstance');
      orga.save().then((savedOrga)=> {
        /*set contactable*/
        this.get('model.contactInfoInstance').set('contactable', savedOrga);
        this.get('model.locationInstance').set('locatable', savedOrga);
        this.get('model.annotationInstance').set('annotatable', savedOrga);
        const saveMeta = RSVP.hash({
          contact: this.get('model.contactInfoInstance').save(),
          location: this.get('model.locationInstance').save(),
          annotation: this.get('model.annotationInstance').save()
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
        this.set('model.entryInstance.parentOrga', null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set('model.entryInstance.parentOrga', parentOrga);
      }
    }
	}
});
