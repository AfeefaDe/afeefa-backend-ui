import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    const protectedModel = this.modelFor('protected');
    return RSVP.hash({
      events: this.store.peekAll('event', {include: 'annotations'}),
      orgas: this.store.peekAll('orga', {include: 'annotations'}),
      todos: protectedModel.todos,
      categories: this.store.peekAll('category'),
      /*limit entry lists on dashboard*/
      listLimit: 5,
      attrOrga: ['category', 'createdAt'],
      attrEvent: ['category', 'date_start'],
      attrTodo: ['annotations','category']
    });
  },
  actions: {
    loading: function() {
      var view = this.container.lookup('view:loading').append();
      this.router.one('didTransition', view, 'destroy');
    }
  }

});
