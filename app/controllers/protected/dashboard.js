import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showAlert: function() {
      this.EventBus.publish('showAlert', 'Hallo Welt');
    }
  }
});
