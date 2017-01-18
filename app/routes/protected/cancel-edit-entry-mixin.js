import Ember from 'ember';

export default Ember.Mixin.create({
  dialogService: Ember.inject.service('global-dialog'),
  oldAnnotations: null,

  afterModel: function(model) {
    this.set('oldAnnotations', Ember.A());

    const entryInstance = model.entryInstance;
    const annotations = entryInstance.get('annotations');
    annotations.forEach(annotation => {
      this.get('oldAnnotations').pushObject(annotation);
    });
  },

  actions: {
    willTransition(transition) {
      const entryInstance = this.controller.get('model.entryInstance');

      const rollback = () => {
        entryInstance.rollbackAttributes();

        this.controller.get('model.contactInfoInstance').rollbackAttributes();
        this.controller.get('model.locationInstance').rollbackAttributes();

        // rollback annotation changes, if any marked
        if (entryInstance.get('hasAnnotationChanges')) {
          const annotations = entryInstance.get('annotations');
          annotations.clear();
          const oldAnnotations = this.get('oldAnnotations');
          oldAnnotations.forEach(oldAnnotation => {
            annotations.pushObject(oldAnnotation);
          });

          entryInstance.set('hasAnnotationChanges', false);
        }
      }

      const hasChanges = () => {
        const hasUnsavedAttributes = (modelName) => {
          const model = this.controller.get(`model.${modelName}`);
          return Object.keys(model.changedAttributes()).length !== 0;
        }

        // setting/deleting an annotation will mark the entryInstance dirty and make hasDirtyAttributes true
        // so we test on dirty attributes explicitly for the entry even if no genuin attributes is changed
        const entryChanges = hasUnsavedAttributes('entryInstance') || entryInstance.get('hasAnnotationChanges');
        const contactChanges = hasUnsavedAttributes('contactInfoInstance');
        const locationChanges = hasUnsavedAttributes('locationInstance');
        return entryChanges || contactChanges || locationChanges;
      }

      // cancel with changes
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
      // cancel without changes
      // autoremove runtime created models
      } else {
        rollback();
      }
      return true;
    }
  }
});
