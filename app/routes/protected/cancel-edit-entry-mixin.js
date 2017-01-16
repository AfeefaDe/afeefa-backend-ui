import Ember from 'ember';

export default Ember.Mixin.create({
  dialogService: Ember.inject.service('global-dialog'),

  actions: {
    willTransition(transition) {
      const entryInstance = this.controller.get('model.entryInstance');

      const rollback = () => {
        entryInstance.rollbackAttributes();
        this.controller.get('model.contactInfoInstance').rollbackAttributes();
        this.controller.get('model.locationInstance').rollbackAttributes();
        this.controller.get('model.entryInstance.annotations').reload();
      }

      const hasChanges = () => {
        const hasUnsavedAttributes = (modelName) => {
          const model = this.controller.get(`model.${modelName}`);
          return Object.keys(model.changedAttributes()).length !== 0;
        }

        // setting/deleting an annotation will mark the entryInstance dirty and make hasDirtyAttributes true
        // so we test on dirty attributes explicitly for the entry even if no genuin attributes is changed
        const entryChanges = hasUnsavedAttributes('entryInstance') || entryInstance.get('hasDirtyAttributes');
        const contactChanges = hasUnsavedAttributes('contactInfoInstance');
        const locationChanges = hasUnsavedAttributes('locationInstance');
        return entryChanges || contactChanges || locationChanges;
      }

      if (hasChanges()) {
        const isEdit = entryInstance.id !== null;
        const action = isEdit ? 'Bearbeiten' : 'Hinzufügen';
        this.get('dialogService').showDialog({
          title: 'Abbrechen',
          message: `Soll das ${action} abgebrochen werden?`
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
