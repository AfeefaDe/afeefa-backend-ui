import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    search: function() {
      let term = this.get('term');
      console.log("Search for: ",term);
    }
  }
});
