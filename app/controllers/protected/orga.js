import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  actions: {
    /*
     * change of orga status
     */
    setStatus: function(newStatus) {
      console.log("@todo: save new status:", newStatus);
    }
  }
});
