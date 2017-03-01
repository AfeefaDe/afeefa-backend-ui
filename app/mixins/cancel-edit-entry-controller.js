import Ember from 'ember';

export default Ember.Mixin.create({
  historyService: Ember.inject.service('route-history'),
  dialogService: Ember.inject.service('dialog'),
  oldRelationsCache: null,
  justSaved: false,

  // setup non shared state properties here
  // otherwise other instances use the same references
  init () {
    this.set('oldRelationsCache', {});
  },

  // called by associated route within setupController()'
  modelReady () {
    const entryInstance = this.get('model.entryInstance');
    const cache = this.get('oldRelationsCache');

    entryInstance.eachAttribute((name, descriptor) => {
      if (descriptor.type === 'date') {
        const oldDate = entryInstance.get(name);
        cache[name] = oldDate ? new Date(oldDate.getTime()) : oldDate;
      }
    });

    entryInstance.eachRelationship((name, descriptor) => {
      if (descriptor.kind === 'hasMany') {
        cache[name] = Ember.A();
        const oldRelations = entryInstance.get(name);
        oldRelations.forEach(oldRelation => {
          cache[name].pushObject(oldRelation);
        });
      }
      if (descriptor.kind === 'belongsTo') {
        cache[name] = entryInstance.get(name);
      }
    });


    entryInstance.__SAVED = () => {
      this.set('justSaved', true);
    };
  },

  // rollback all changes
  rollback () {
    const entryInstance = this.get('model.entryInstance');
    const cache = this.get('oldRelationsCache');

    entryInstance.rollbackAttributes();

    entryInstance.eachAttribute((name, descriptor) => {
      if (descriptor.type === 'date') {
        const oldDate = cache[name];
        const currentDate = entryInstance.get(name);
        if (currentDate && oldDate) {
          // in any case the date instance has been reset, it will be reverted to
          // the old instance within rollbackAttributes(). should we have set new
          // date values on the sole date instance, we need to reinitialize that
          // instance with the former value:
          currentDate.setTime(oldDate.getTime());
        }
      }
    });

    entryInstance.eachRelationship((name, descriptor) => {
      if (descriptor.kind === 'hasMany') {
        const currentRelations = entryInstance.get(name);
        currentRelations.clear();
        const oldRelations = cache[name];
        oldRelations.forEach(oldRelation => {
          currentRelations.pushObject(oldRelation);
          oldRelation.rollbackAttributes();
        });
      }
      if (descriptor.kind === 'belongsTo') {
        const oldRelation = cache[name];
        entryInstance.set(name, oldRelation);
        if (oldRelation.content) {
          oldRelation.content.rollbackAttributes();
        }
      }
    });

    // reset cache
    this.init();
    // init cache from current status
    this.modelReady();
  },

  hasChanges () {
    const hasUnsavedAttributes = model => {
      const numberOfChanges = Object.keys(model.changedAttributes()).length;
      if (numberOfChanges !== 0) {
        // prevent cancel hook, if date end is set to null in entry-detail
        let sameDate = false;
        if(this.get('model.entryInstance.date_start') && this.get('model.entryInstance.date_end')) {
          const dateStart = this.get('model.entryInstance.date_start');
          const dateEnd = this.get('model.entryInstance.date_end');
          const hasEndTime = this.get('model.entryInstance.has_time_end');
          if(dateStart.getDate() === dateEnd.getDate() && dateStart.getMonth() === dateEnd.getMonth() && dateStart.getFullYear() === dateEnd.getFullYear() && !hasEndTime) {
            sameDate = true;
          }
        }
        if (sameDate && numberOfChanges === 1 && this.get('oldRelationsCache.date_end') === null && model.changedAttributes().date_end !== undefined) {
          return false;
        } else {
          return true;
        }
      } else { // no changes
        return false;
      }
    };

    const entryInstance = this.get('model.entryInstance');
    const cache = this.get('oldRelationsCache');

    const hasEntryChanges = hasUnsavedAttributes(entryInstance);

    let hasDateChanges = false;
    entryInstance.eachAttribute((name, descriptor) => {
      if (descriptor.type === 'date') {
        const currentDate = entryInstance.get(name);
        const oldDate = cache[name];

        // prevent to show cancel menu when date end is automaticly set to null
        if(name === 'date_end' && oldDate === null) {
          return;
        }
        if (currentDate && !oldDate || oldDate && !currentDate) {
          hasDateChanges = true;
          return;
        }
        if (currentDate && currentDate.toString() !== oldDate.toString()) {
          hasDateChanges = true;
          return;
        }
      }
    });

    let hasRelationChanges = false;
    entryInstance.eachRelationship((name, descriptor) => {
      if (descriptor.kind === 'hasMany') {
        const currentRelations = entryInstance.get(name);
        const oldRelations = cache[name];
        if (currentRelations.get('length') !== oldRelations.get('length')) {
          hasRelationChanges = true;
          return;
        }
        for (let i = 0; i < currentRelations.get('length'); i++) {
          if (currentRelations.objectAt(i) !== oldRelations.objectAt(i)) {
            hasRelationChanges = true;
            return;
          }
          if (hasUnsavedAttributes(currentRelations.objectAt(i))) {
            hasRelationChanges = true;
            return;
          }
        }
      }
      if (descriptor.kind === 'belongsTo') {
        const currentRelation = entryInstance.get(name).content;
        const oldRelation = cache[name].content;
        if (currentRelation !== oldRelation) {
          hasRelationChanges = true;
          return;
        }
        if (currentRelation) {
          if (hasUnsavedAttributes(currentRelation)) {
            hasRelationChanges = true;
            return;
          }
        }
      }
    });

    return hasEntryChanges || hasRelationChanges || hasDateChanges;
  },

  showCancelDialog (yes) {
    const entryInstance = this.get('model.entryInstance');
    const isEdit = entryInstance.id !== null;
    const action = isEdit ? 'Bearbeiten' : 'Hinzufügen';
    this.get('dialogService').showDialog({
      title: 'Abbrechen',
      message: `Soll das ${action} abgebrochen werden?`
    }).yes(() => {
      yes();
    });
  },

  // called by associated route on willTransition()'
  willTransition (transition) {
    const justSaved = this.get('justSaved');
    if (justSaved) {
      this.set('justSaved', false);
    }
    if (!justSaved) {
      // cancel with changes
      if (this.hasChanges()) {
        this.showCancelDialog(() => {
          this.rollback();
          transition.retry();
        });
        transition.abort();
        // cancel without changes
        // autoremove runtime created models
      } else {
        this.rollback();
      }
    }
  },

  actions: {
    // component button action
    cancel: function() {
      // cancel with changes
      if (this.hasChanges()) {
        this.showCancelDialog(() => {
          this.rollback();
          this.get('historyService').goBack();
          this.send('deleteEndDate');
        });
      // cancel without changes
      } else {
        // autoremove runtime created models
        this.rollback();
        this.get('historyService').goBack();
        this.send('deleteEndDate');
      }
    },
    deleteEndDate: function() {
      // delete date end if it is not used (datepicker always needs an instance)
      if(this.get('model.entryInstance.date_start') && this.get('model.entryInstance.date_end')) {
        const dateStart = this.get('model.entryInstance.date_start');
        const dateEnd = this.get('model.entryInstance.date_end');
        const hasEndTime = this.get('model.entryInstance.has_time_end');
        if(dateStart.getDate()===dateEnd.getDate() && dateStart.getMonth()===dateEnd.getMonth() && dateStart.getFullYear()===dateEnd.getFullYear() && !hasEndTime) {
          this.set('model.entryInstance.date_end', null);
        }
      }
    },
  }
});
