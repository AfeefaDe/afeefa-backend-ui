import Ember from 'ember';

export default Ember.Controller.extend({
  errorMessage: false,
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
  }
});
