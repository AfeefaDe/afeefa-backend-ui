import Ember from 'ember';
import RSVP from 'rsvp';


export default Ember.Route.extend({
  model() {
    const protectedModel = this.modelFor('protected');
    return RSVP.hash({
      todos: protectedModel.todos,
      attributes: ['category','annotations']
    });
  }
});
