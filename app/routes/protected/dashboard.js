import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      events: this.store.peekAll('event', {include: 'annotations'}),
      orgas: this.store.peekAll('orga', {include: 'annotations'}),
      todos: this.store.query('entry', {filter: {todo: 'all'}}),
      /*limit entry lists on dashboard*/
      listLimit: 5
    });
  }
});
