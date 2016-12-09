import Ember from 'ember';
import RSVP from 'rsvp';

import RouteHelper from '../mixins/route-helper';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  /* determine if the entryInstance has attribute model*/
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date || entry.date === null;
  }),
  //this string cached the instance date for the input:type date
  dateString: '',
  didReceiveAttrs() {
    this._super(...arguments);
    /*
     * workaround to cut off time from date object and pass it into input[type="date"]
     * not proud at all :(
     */
    const date = this.get('model.entryInstance.date');
    if(date && typeof date.getMonth === 'function') {
      const dateString = date.toISOString().slice(0,10);
      this.set('dateString', dateString);
    }
  },
	actions: {
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      //this converts the  yyyy-mm-dd String from the input:type date to an js object because ember doesent support date inputs
      if(entry.date || entry.date === null) {
        const dateString = this.get('dateString').split('-');
        var date = new Date(dateString[0], dateString[1]-1, dateString[2]);
        entry.set('date', date);
      }

      entry.get('contactInfos').pushObject(this.get('model.contactInfoInstance'));
      entry.get('locations').pushObject(this.get('model.locationInstance'));
      entry.get('annotations').pushObject(this.get('model.annotationInstance'));
      entry.save().then((savedEntry)=> {
        this.EventBus.publish('showAlert', {title: 'Erfolgreich gespeichert', description: 'Deine Änderungen wurden erfolgreich gespeichert', isError: false, autoHide: 2000});
        history.back();
      }, (reason)=> {
          console.log("Failed with reason: ", reason);
          this.EventBus.publish('showAlert', this.handleError(reason));
      });
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
	},
  /*
   * function that creates the alertData object
   * @todo: I want to call this.EventBus.publish('showAlert',...)from here. But this is undefined!
   */
  handleError(reason) {
      const alertData = {title: 'Fehler beim Speichern', description: 'Unbekannter Fehler', isError: true, autoHide: false};
      if(reason && reason.errors) {
        let errorDetail = '';
        for (var singleError of reason.errors) {
          errorDetail = errorDetail + ' ' + singleError.detail + '\n';
        }
        alertData.description = errorDetail;
      }
      return alertData;
  }
});
