import Ember from 'ember';
import RSVP from 'rsvp';
import RouteHelper from '../../mixins/route-helper';

export default Ember.Route.extend(RouteHelper, {
  model() {
    return RSVP.hash({
      orgas: this.modelFor('protected').orgas,
      entryInstance: this.store.createRecord('orga'),
      contactInfoInstance: this.store.createRecord('contactInfo'),
      locationInstance: this.store.createRecord('location'),
      annotationInstance: this.store.createRecord('annotation')
    });
  },
  actions: {
    /*
     * clear store with unsaved models
     */
    willTransition() {
      const controller = this.controllerFor('protected.neworga');
      controller.get('model.entryInstance').rollbackAttributes();
      controller.get('model.contactInfoInstance').rollbackAttributes();
      controller.get('model.locationInstance').rollbackAttributes();
      controller.get('model.annotationInstance').rollbackAttributes();
      return true;
    }
  }
});
