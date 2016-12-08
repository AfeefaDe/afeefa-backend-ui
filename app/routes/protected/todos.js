import Ember from 'ember';
import RSVP from 'rsvp';


export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      todos: this.store.query('entry', {filter: {todo: 'all'}}),
      attributes: ['category','annotations']
    });
  }
});
