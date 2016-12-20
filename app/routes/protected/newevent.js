import Ember from 'ember';
import RSVP from 'rsvp';
import RouteHelper from '../../mixins/route-helper';

export default Ember.Route.extend(RouteHelper, {
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
      //check for unsaved changes:
      const entryChanges = hasUnsavedAttributes(controller.get('model.entryInstance'));
      const contactChanges = hasUnsavedAttributes(controller.get('model.contactInfoInstance'));
      const locationChanges = hasUnsavedAttributes(controller.get('model.locationInstance'));

      if(entryChanges || contactChanges || locationChanges) {
        console.log(entryChanges, contactChanges, locationChanges);
        const alertData = {title: 'Ungespeicherte Informationen', description: 'Die eingetragenen Informationen wurden nicht gespeichert', isError: true, autoHide: false};
        this.EventBus.publish('showAlert', alertData);
        transition.abort();
      }
      else {
        controller.get('model.entryInstance').rollbackAttributes();
        controller.get('model.contactInfoInstance').rollbackAttributes();
        controller.get('model.locationInstance').rollbackAttributes();
        return true;
      }
    }
  }
});

function hasUnsavedAttributes(model) {
  console.log(model.changedAttributes());
  return !isEmpty(model.changedAttributes());
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
