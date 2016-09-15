import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    delete: function() {
      let orga = this.get('model');
      orga.destroyRecord();
    }
  }
});
