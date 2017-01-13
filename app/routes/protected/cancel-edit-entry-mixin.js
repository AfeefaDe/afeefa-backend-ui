import Ember from 'ember';

export default Ember.Mixin.create({
  dialogService: Ember.inject.service('global-dialog'),

  actions: {
    willTransition(transition) {
      const rollback = () => {
        this.controller.get('model.entryInstance').rollbackAttributes();
        this.controller.get('model.contactInfoInstance').rollbackAttributes();
        this.controller.get('model.locationInstance').rollbackAttributes();
        this.controller.get('model.entryInstance.annotations').reload();
      }

      const hasChanges = () => {
        const hasUnsavedAttributes = (modelName) => {
          const model = this.controller.get(`model.${modelName}`);
          return Object.keys(model.changedAttributes()).length !== 0 || model.get('hasDirtyAttributes');
        }

        const entryChanges = hasUnsavedAttributes('entryInstance');
        const contactChanges = hasUnsavedAttributes('contactInfoInstance');
        const locationChanges = hasUnsavedAttributes('locationInstance');
        return entryChanges || contactChanges || locationChanges;
      }

      if (hasChanges()) {
        const isEdit = this.controller.get('model.entryInstance').id !== null;
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
