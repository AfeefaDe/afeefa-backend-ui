import Ember from 'ember';

import FormatReasonErrorMessage from '../mixins/format-reason-error-message';

export default Ember.Component.extend(FormatReasonErrorMessage, {
  store: Ember.inject.service(),
  dialogService: Ember.inject.service('dialog'),
  datePickerRef: null,
  didRender() {
    /* materialize: trigger the autoresze action to set height*/
    $('#description').trigger('autoresize');
  },
	actions: {
    /*
     * Save Entry with meta models
     */
		save: function() {
      let entry = this.get('model.entryInstance');
      const isEditMode = entry.get('id');
      entry.get('contactInfos').pushObject(this.get('model.contactInfoInstance'));
      entry.get('locations').pushObject(this.get('model.locationInstance'));

      entry.save().then(()=> {
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
      entryInstance.get('annotations').addObject(annotation);
      entryInstance.set('hasAnnotationChanges', true);
    }
	},

});
