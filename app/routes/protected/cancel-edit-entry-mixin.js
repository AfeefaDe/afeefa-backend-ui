import Ember from 'ember';

export default Ember.Mixin.create({
  dialogService: Ember.inject.service('global-dialog'),

  actions: {
    willTransition(transition) {
      const controller = this.controller;

      function hasUnsavedAttributes(modelName) {
        const model = controller.get(`model.${modelName}`);
        return Object.keys(model.changedAttributes()).length !== 0;
      }

      function rollback() {
        controller.get('model.entryInstance').rollbackAttributes();
        controller.get('model.contactInfoInstance').rollbackAttributes();
        controller.get('model.locationInstance').rollbackAttributes();
      }

      const entryChanges = hasUnsavedAttributes('entryInstance');
      const contactChanges = hasUnsavedAttributes('contactInfoInstance');
      const locationChanges = hasUnsavedAttributes('locationInstance');

      if (entryChanges || contactChanges || locationChanges) {
        this.get('dialogService').showDialog({
          title: 'Abbrechen',
          message: 'Soll das Hinzufügen abgebrochen werden?'
        }).yes(() => {
          rollback();
          transition.retry();
        });
        transition.abort();
      } else {
        rollback();
      }
      return true;
    }
  }
});
