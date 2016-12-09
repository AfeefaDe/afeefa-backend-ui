import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    removeAnnotation: function() {
      this.get('instance').destroyRecord();
    }
  }
});
