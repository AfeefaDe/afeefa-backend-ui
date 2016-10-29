import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    test: function() {
      this.store.findRecord('todo', 1).then((todo) => {
        todo.get('events').then((orgas) => {
          console.log(orgas.length);
        });
      });
    }
  }
});
