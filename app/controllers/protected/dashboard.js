import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showAlert: function() {
      const alertData = {title: 'Hello World', description: 'A long text that descripes the error quite well and ist longer than one', isError: true};
      this.EventBus.publish('showAlert', alertData);
    }
  }
});
