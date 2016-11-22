import Ember from 'ember';
import RSVP from 'rsvp';

/*
 * mixins with function validateForm
 */
import ErrorHandler from '../mixins/error-handler';
import RouteHelper from '../mixins/route-helper';


export default Ember.Component.extend(ErrorHandler, RouteHelper, {
  store: Ember.inject.service(),
  headline: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.constructor.modelName === 'orga' ? 'Neue Organisation' : 'Neues Event';
  }),
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date || entry.date === null;
  }),
	actions: {
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      entry.save().then((savedEntry)=> {
        /*set contactable*/
        this.get('model.contactInfoInstance').set('contactable', savedEntry);
        this.get('model.locationInstance').set('locatable', savedEntry);
        this.get('model.annotationInstance').set('annotatable', savedEntry);
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
      const entry = this.get('model.entryInstance');
      // @hack
      const orgaProp = entry.parentOrga || entry.parentOrga === null ? 'parentOrga' : 'orga'
      if(parentOrgaID === -1) {
          this.set(`model.entryInstance.${orgaProp}`, null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set(`model.entryInstance.${orgaProp}`, parentOrga);
      }
    }
	}
});
