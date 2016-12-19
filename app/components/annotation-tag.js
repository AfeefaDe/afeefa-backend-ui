import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    removeAnnotation: function() {
      if(this.get('onDelete')) this.get('onDelete')(this.get('instance'));
    }
  }
});
