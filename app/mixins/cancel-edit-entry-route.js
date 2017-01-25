import Ember from 'ember';

export default Ember.Mixin.create({

  setupController: function(controller, model){
    this._super(controller, model);
    controller.modelReady();
  },

  actions: {
    willTransition (transition) {
      this.controller.willTransition(transition);
    }
  }

});
