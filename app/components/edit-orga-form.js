import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    saveOrga: function() {
      this.get('orga').save();
    }
  }
});
