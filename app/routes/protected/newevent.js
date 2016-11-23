import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance: this.store.createRecord('event'),
      contactInfoInstance: this.store.createRecord('contactInfo'),
      locationInstance: this.store.createRecord('location'),
      annotationInstance: this.store.createRecord('annotation')
    })
  },
  actions: {
    /*
     * clear store with unsaved models
     */
    willTransition(transition) {
      const controller = this.controllerFor('protected.newevent');
      controller.get('model.entryInstance').rollbackAttributes();
      controller.get('model.contactInfoInstance').rollbackAttributes();
      controller.get('model.locationInstance').rollbackAttributes();
      controller.get('model.annotationInstance').rollbackAttributes();
      return true;
    }
  }
});
