import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    test: function() {
      //exmaple todo action
      let todo = this.store.peekRecord('todo', 1);

      todo.get('orgas').then((orgas) => {
        console.log(orgas);
      });
    }
  }
});
