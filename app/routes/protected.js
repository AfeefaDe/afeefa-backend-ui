import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model() {
    return RSVP.hash({
      user:   this.store.findRecord('user', this.get('session.currentUser')),
      events: this.store.findAll('event', {include: 'annotations'}),
      orgas: this.store.query('orga', {include: 'annotations', page: {offset: '0', limit: '5'}}),
      todos: this.store.query('entry', {filter: {todo: 'all'}}),
      /*limit entry lists on dashboard*/
      listLimit: 5
    });
  },
  actions: {
    willTransition() {
      //publish to global event bus
      this.EventBus.publish('willTransition');
    }
  }
});
