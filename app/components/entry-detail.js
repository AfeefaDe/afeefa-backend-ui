import Ember from 'ember';

export default Ember.Component.extend({
  attr: Ember.computed('model', function() {
    let model = this.get('model');
    var attributes = [];
    model.eachAttribute(function(name, meta) {
      let entry = {name: name, type: meta.type};
      attributes.push(entry);
    });
    return attributes;
  }),
  actions: {
    /*
     * change of entry status
     */
    setNewStateTransistion: function(newStateTransistion) {
      //get current model instance
      let ownInstance = this.get('model');
      //change status and save
      ownInstance.set('stateTransition', newStateTransistion);
      ownInstance.save();
    }
  }
});
