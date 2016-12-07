import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    const baseData = RSVP.hash({
      user:   this.store.findRecord('user', this.get('session.currentUser')),
      events: this.store.query('event', {include: 'annotations', sort:'title'}),
      orgas: this.store.query('orga', {include: 'annotations', sort:'title'}),
    });
    baseData.catch((reason) =>  {
      const alertData = {title: "Fehler beim Laden der Daten", description: 'Unbekannter Fehler', isError: true};
      if(reason && reason.errors[0]) alertData.description = reason.errors[0];
      this.EventBus.publish('showAlert', this.handleError(reason));
    });
    return baseData;
  },
  actions: {
    willTransition() {
      //publish to global event bus
      this.EventBus.publish('willTransition');
    }
  }
});
