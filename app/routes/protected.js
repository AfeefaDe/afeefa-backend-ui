import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import afeefaMenu from '../models/afeefa-menu';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  // bootstrap history service by getting its instance on init()
  // unless explicitly initialized the service won't connect to event bus
  historyService: Ember.inject.service('route-history'),
  init() {
    this.get('historyService');
  },

  model() {
    const baseData = RSVP.hash({
      user: this.store.findRecord('user', this.get('session.currentUser')),
      events: this.store.query('event', {include: 'annotations,category,sub_category', sort:'title'}),
      orgas: this.store.query('orga', {include: 'annotations,category,sub_category', sort:'title'}),
      todos: this.store.query('entry', {filter: {todo: 'all'}}),
      categories: this.store.findAll('category'),
      annotations: this.store.findAll('annotation')
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
      this.EventBus.publish('willTransition');
    },

    didTransition () {
      const routes = this.get('router.router.state.handlerInfos');
      afeefaMenu.setRoute(routes);

      this.get('EventBus').publish('didTransition');
      window.scrollTo(0,0);
    },

    /*
     * called (magically) by failing model promises: redirect to dashboard and show error message
     */
    error(reason) {
      let message = 'Die angeforderte Seite konnte nicht geladen werden.';
      if(reason.message) message = reason.message;
      const alertData = {title: 'Fehler beim Laden der Seite', description: message, isError: true, autoHide: false};
      this.EventBus.publish('showAlert', alertData);
      this.transitionTo('protected.dashboard');
    }
  }
});
