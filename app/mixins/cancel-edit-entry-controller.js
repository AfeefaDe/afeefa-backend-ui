import Ember from 'ember';

export default Ember.Mixin.create({
  historyService: Ember.inject.service('route-history'),
  dialogService: Ember.inject.service('dialog'),
  oldAnnotations: null,

  // called by associated route within setupController()'
  modelReady () {
    this.set('oldAnnotations', Ember.A());
    const annotations = this.get('model.entryInstance.annotations');
    annotations.forEach(annotation => {
      this.get('oldAnnotations').pushObject(annotation);
    });
  },

  // rollback all changes
  rollback () {
    const entryInstance = this.get('model.entryInstance');
    entryInstance.rollbackAttributes();

    this.get('model.contactInfoInstance').rollbackAttributes();
    this.get('model.locationInstance').rollbackAttributes();

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
  },

  hasChanges () {
    const hasUnsavedAttributes = (modelName) => {
      const model = this.get(`model.${modelName}`);
      return Object.keys(model.changedAttributes()).length !== 0;
    };

    // setting/deleting an annotation will mark the entryInstance dirty and make hasDirtyAttributes true
    // so we test on dirty attributes explicitly for the entry even if no genuin attributes is changed
    const entryInstance = this.get('model.entryInstance');
    const entryChanges = hasUnsavedAttributes('entryInstance') || entryInstance.get('hasAnnotationChanges');
    const contactChanges = hasUnsavedAttributes('contactInfoInstance');
    const locationChanges = hasUnsavedAttributes('locationInstance');
    return entryChanges || contactChanges || locationChanges;
  },

  showCancelDialog (yes) {
    const entryInstance = this.get('model.entryInstance');
    const isEdit = entryInstance.id !== null;
    const action = isEdit ? 'Bearbeiten' : 'Hinzufügen';
    this.get('dialogService').showDialog({
      title: 'Abbrechen',
      message: `Soll das ${action} abgebrochen werden?`
    }).yes(() => {
      this.rollback();
      yes();
    });
  },

  // called by associated route on willTransition()'
  willTransition (transition) {
    // cancel with changes
    if (this.hasChanges()) {
      this.showCancelDialog(() => {
        transition.retry();
      })
      transition.abort();
    // cancel without changes
    // autoremove runtime created models
    } else {
      this.rollback();
    }
  },

  actions: {
    // component button action
    cancel: function() {
      // cancel with changes
      if (this.hasChanges()) {
        this.showCancelDialog(() => {
          this.get('historyService').goBack();
        })
      // cancel without changes
      // autoremove runtime created models
      } else {
        this.rollback();
        this.get('historyService').goBack();
      }
    }
  }
});
