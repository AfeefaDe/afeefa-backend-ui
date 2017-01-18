import Ember from 'ember';
import RSVP from 'rsvp';

import RouteHelper from '../mixins/route-helper';
import FormatReasonErrorMessage from '../mixins/format-reason-error-message';

export default Ember.Component.extend(FormatReasonErrorMessage, {
  store: Ember.inject.service(),
  /* determine if the entryInstance has attribute model*/
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date_start || entry.date_start === null;
  }),
  dateStartObject: '',
  hasStartTime: '',
  showStartTime: '',
  startTimeIconState: '',
  startTimeButtonColor: '',
  didReceiveAttrs() {
    this._super(...arguments);
    const dateStart = this.get('model.entryInstance.date_start');
    if(dateStart) {
      this.set('dateStartObject', dateStart);
    } else {
      // date object is needed to set values
      this.set('dateStartObject', new Date());
    }
    //const hasStartTime = this.get('model.entryInstance.hasStartTime'); // TODO
    const hasStartTime = true;
    if(hasStartTime) {
      this.set('hasStartTime', true);
      this.set('showStartTime', true);
      this.set('startTimeIconState', 'alarm_off');
      this.set('startTimeButtonColor', 'red');
    } else {
      this.set('hasStartTime', false);
      this.set('showStartTime', false);
      this.set('startTimeIconState', 'alarm');
    }
  },
	actions: {
    updateStartDate: function(newStartDate) {
      const day = newStartDate[0].getDate();
      const month = newStartDate[0].getMonth();
      const year = newStartDate[0].getFullYear();

      this.get('dateStartObject').setDate(day);
      this.get('dateStartObject').setMonth(month);
      this.get('dateStartObject').setFullYear(year);
    },
    updateStartTime: function(newStartTime) {
      const hours = newStartTime[0].getHours();
      const minutes = newStartTime[0].getMinutes();

      this.get('dateStartObject').setHours(hours);
      this.get('dateStartObject').setMinutes(minutes);
    },
    toggleStartTimeElement: function() {
      if(this.get('showStartTime')) {
        // hide start time and delete time values
        this.set('startTimeIconState', 'alarm');
        this.set('startTimeButtonColor', '');
        this.get('dateStartObject').setHours(0);
        this.get('dateStartObject').setMinutes(0);
        this.get('dateStartObject').setMilliseconds(0)
      } else {
        // show start time
        this.set('startTimeIconState', 'alarm_off');
        this.set('startTimeButtonColor', 'red');
      }
      this.toggleProperty('showStartTime');
    },


    // toggleFlatpickrStatus() {
    //   this.get('flatpickr').close();
    // },
    // clearFlatpickrDate() {
    //   this.get('flatpickr').clear();
    // },
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      //determine new or edit mode
      const isEditMode = entry.get('id');
      // save date in entry model
      if(entry.date_start || entry.date_start === null) {
          this.set('model.entryInstance.date_start', this.get('dateStartObject'));
      }

      entry.get('contactInfos').pushObject(this.get('model.contactInfoInstance'));
      entry.get('locations').pushObject(this.get('model.locationInstance'));
      entry.save().then((savedEntry)=> {
        const alertData = {title: 'Erfolgreich gespeichert', description: 'Dein Eintrag wurde erfolgreich angelegt.', isError: false, autoHide: 3000};
        if(isEditMode) alertData.description = 'Deine Änderungen wurden erfolgreich gespeichert.';
        this.EventBus.publish('showAlert', alertData);
        history.back();
      }, (reason)=> {
          let error = this.handleError(reason);
          error.title = 'Fehler beim Speichern';
          this.EventBus.publish('showAlert', error);
      });
		},
    /*
     * delete button pushed
     */
    deleteEntry: function() {
      let entry = this.get('model.entryInstance');
      var confirm = window.confirm("Eintrag wirklich löschen ? \nDiese Aktion kann nicht rückgängig gemacht werden.");
      if(confirm === true) {
        entry.deleteRecord();
        entry.save().then(()=> {
          const targetRoute = `protected.${entry.get('modelName')}s`;
          this.get('router').transitionTo(targetRoute);
        }, (reason)=> {
          entry.rollbackAttributes();
          let alertData = this.handleError(reason);
          alertData.title = 'Fehler beim Löschen des Eintrags';
          this.EventBus.publish('showAlert', alertData);
        });
      }
    },
    /*
     * Input type select for setting parent orga
     */
    selectParent: function(parentOrgaID) {
      const entry = this.get('model.entryInstance');
      if(parentOrgaID === -1) {
        this.set('model.entryInstance.parentOrga', null);
      }
      else {
        let parentOrga = this.get('store').peekRecord('orga', parentOrgaID);
        this.set('model.entryInstance.parentOrga', parentOrga);
      }
    },
    /*
     * action that gets triggered by annotation-tag
     * to remove the annotation from the current entryInstance
     */
    deleteAnnotation: function(annotation) {
      const entryInstance = this.get('model.entryInstance');
      entryInstance.get('annotations').removeObject(annotation);
    },
     /*
     * action that gets triggered by annotation-new
     * to add new annotation to the current entryInstance
     */
    addAnnotation: function(annotation) {
      const entryInstance = this.get('model.entryInstance');
      entryInstance.get('annotations').addObject(annotation)
    }
	},

});
