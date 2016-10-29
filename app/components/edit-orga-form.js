import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    saveOrga: function() {
      this.get('orga').save();
    },
    /*
    delete: function() {
      let orga = this.get('orga');
      orga.destroyRecord().then(() => {
        //@todo: transistion to /orgas; error handling
        console.log("Success");
      }, (err) => {
        console.log("@todo handle error: ", err);
      });
    }*/
  }
});
