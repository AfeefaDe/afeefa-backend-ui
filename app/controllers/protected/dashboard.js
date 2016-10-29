import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service('session'),
  actions: {
    test: function() {
      //UI Tests shortcut
    }
  }
});
