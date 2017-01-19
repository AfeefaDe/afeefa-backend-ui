import Ember from 'ember';
import RSVP from 'rsvp';

import RouteHelper from '../mixins/route-helper';
import FormatReasonErrorMessage from '../mixins/format-reason-error-message';

export default Ember.Component.extend(FormatReasonErrorMessage, {
  store: Ember.inject.service(),
  dialogService: Ember.inject.service('global-dialog'),
  /* determine if the entryInstance has attribute model*/
  showDate: Ember.computed('model', function() {
    const entry = this.get('model.entryInstance');
    return entry.date_start || entry.date_start === null;
  }),
  oldAnnotations: null,
  // start date and start time variables
  dateStartObject: '',
  hasStartTime: '',
  showStartTime: '',
  startTimeIconState: '',
  startTimeButtonColor: '',
  // end date and end time variables
  dateEndObject: '',
  hasEndTime: '',
  showEndTime: '',
  endTimeIconState: '',
  endTimeButtonColor: '',
  didReceiveAttrs() {
    this._super(...arguments);
    const dateStart = this.get('model.entryInstance.date_start');
    if(dateStart) {
      this.set('dateStartObject', dateStart);
    } else {
      this.set('dateStartObject', new Date());
    }
    const dateEnd = this.get('model.entryInstance.date_end');
    if(dateEnd) {
      this.set('dateEndObject', dateEnd);
    } else {
      this.set('dateEndObject', new Date());
    }

    const has_time_start = this.get('model.entryInstance.has_time_start');
    //const has_time_start = true;
    if(has_time_start) {
      this.set('hasStartTime', true);
      this.set('showStartTime', true);
      this.set('startTimeIconState', 'delete_forever');
      this.set('startTimeButtonColor', 'red');
    } else {
      this.set('hasStartTime', false);
      this.set('showStartTime', false);
      this.set('startTimeIconState', 'alarm');
    }

    const has_time_end = this.get('model.entryInstance.has_time_end');
    //const has_time_end = true;
    if(has_time_end) {
      this.set('hasEndTime', true);
      this.set('showEndTime', true);
      this.set('endTimeIconState', 'delete_forever');
      this.set('endTimeButtonColor', 'red');
    } else {
      this.set('hasEndTime', false);
      this.set('showEndTime', false);
      this.set('endTimeIconState', 'alarm');
    }
  },
  didRender() {
    /* materialize: trigger the autoresze action to set height*/
    $('#description').trigger('autoresize');
  },
	actions: {
    // start date and start time
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
      this.set('hasStartTime', true);
    },
    toggleStartTimeElement: function() {
      if(this.get('showStartTime')) {
        // hide start time and delete start time values
        this.set('startTimeIconState', 'alarm');
        this.set('startTimeButtonColor', '');
        this.get('dateStartObject').setHours(0);
        this.get('dateStartObject').setMinutes(0);
        this.get('dateStartObject').setMilliseconds(0)
        this.set('hasStartTime', false);
      } else {
        // show start time
        this.set('startTimeIconState', 'delete_forever');
        this.set('startTimeButtonColor', 'red');
      }
      this.toggleProperty('showStartTime');
    },
    //end date and end time
    updateEndDate: function(newEndDate) {
      const day = newEndDate[0].getDate();
      const month = newEndDate[0].getMonth();
      const year = newEndDate[0].getFullYear();

      this.get('dateEndObject').setDate(day);
      this.get('dateEndObject').setMonth(month);
      this.get('dateEndObject').setFullYear(year);
    },
    updateEndTime: function(newEndTime) {
      const hours = newEndTime[0].getHours();
      const minutes = newEndTime[0].getMinutes();

      this.get('dateEndObject').setHours(hours);
      this.get('dateEndObject').setMinutes(minutes);
      this.set('hasEndTime', true);
    },
    toggleEndTimeElement: function() {
      if(this.get('showEndTime')) {
        // hide end time and delete end time values
        this.set('endTimeIconState', 'alarm');
        this.set('endTimeButtonColor', '');
        this.get('dateEndObject').setHours(0);
        this.get('dateEndObject').setMinutes(0);
        this.get('dateEndObject').setMilliseconds(0)
        this.set('hasEndTime', false);
      } else {
        // show end time
        this.set('endTimeIconState', 'delete_forever');
        this.set('endTimeButtonColor', 'red');
      }
      this.toggleProperty('showEndTime');
    },
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      //determine new or edit mode
      const isEditMode = entry.get('id');
      // save start date in entry model
      if(entry.date_start || entry.date_start === null) {
          this.set('model.entryInstance.date_start', this.get('dateStartObject'));
          this.set('model.entryInstance.has_time_start', this.get('hasStartTime'));
      }
      // save end date in entry model
      if(entry.date_end || entry.date_end === null) {
          this.set('model.entryInstance.date_end', this.get('dateEndObject'));
          this.set('model.entryInstance.has_time_end', this.get('hasEndTime'));
      }

      entry.get('contactInfos').pushObject(this.get('model.contactInfoInstance'));
      entry.get('locations').pushObject(this.get('model.locationInstance'));
      entry.save().then((savedEntry)=> {
        // #66 hack to prevend "dirty"-dialog on save
        const relations = ['contactInfoInstance', 'locationInstance'];
        for (let relation of relations) {
          let record = this.get(`model.${relation}`);
          if (record.id) {
            // http://stackoverflow.com/questions/13342250/how-to-manually-set-an-object-state-to-clean-saved-using-ember-data
            Ember.assign(record._internalModel._data, record._internalModel._attributes);
            record.send('pushedData');
          } else {
            record.rollbackAttributes();
          }
        }
        // end #66 hack

        const alertData = {title: 'Erfolgreich gespeichert', description: 'Dein Eintrag wurde erfolgreich angelegt.', isError: false, autoHide: 3000};
        if(isEditMode) alertData.description = 'Deine Änderungen wurden erfolgreich gespeichert.';
        this.EventBus.publish('showAlert', alertData);
        // goto view
        let id = entry.get('id');
        let type = entry.get('modelName');
        if(id && type) {
          const router = this.get('router');
          router.transitionTo('protected.'+type, id);
        }
        else throw 'Invalid transistion type or id - Cancel transition';
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
      this.get('dialogService').showDialog({
        title: 'Eintrag wirklich löschen ?',
        message: 'Diese Aktion kann nicht rückgängig gemacht werden.'
      }).yes(() => {
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
      });
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
      entryInstance.set('hasAnnotationChanges', true);
    },
     /*
     * action that gets triggered by annotation-new
     * to add new annotation to the current entryInstance
     */
    addAnnotation: function(annotation) {
      const entryInstance = this.get('model.entryInstance');
      entryInstance.get('annotations').addObject(annotation)
      entryInstance.set('hasAnnotationChanges', true);
    }
	},

});
