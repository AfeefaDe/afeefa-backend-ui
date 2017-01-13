import Ember from 'ember';
import RSVP from 'rsvp';
import RouteHelper from '../../mixins/route-helper';

export default Ember.Route.extend(RouteHelper, {
  dialogService: Ember.inject.service('global-dialog'),

  model() {
    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance: this.store.createRecord('event'),
      contactInfoInstance: this.store.createRecord('contactInfo'),
      locationInstance: this.store.createRecord('location'),
    });
  },

  actions: {
    /*
     * clear store with unsaved models
     */
    willTransition(transition) {
      const controller = this.controllerFor('protected.newevent');

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
