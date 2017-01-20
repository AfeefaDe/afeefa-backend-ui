import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import afeefaMenu from '../models/afeefa-menu';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  historyService: Ember.inject.service('route-history'),

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
      //publish to global event bus
      this.EventBus.publish('willTransition');
    },
    didTransition () {
      const historyService = this.get('historyService');
      const routes = this.get("router.router.state.handlerInfos");
      const current = routes[routes.length - 1];
      historyService.setCurrentRoute(current);

      afeefaMenu.setRoute(routes);
      this.EventBus.publish('didTransition');
      window.scrollTo(0,0);
    },
    /*
     * called (magically) by failing model promisses: redirect to dashboard and show error message
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
