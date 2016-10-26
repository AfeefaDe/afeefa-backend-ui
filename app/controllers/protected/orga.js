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

/* diabled
  actions: {

    delete: function() {
      let orga = this.get('model');
      orga.destroyRecord().then(() => {
        //@todo: transistion to /orgas
        console.log("Success");
      }, (err) => {
        this.set('errorMessage', err.message);
      });
    }

  }*/
});
