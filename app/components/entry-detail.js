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
  /*
   * possible states: hardcoded
   */
  states: Ember.computed('model', function() {
    return ["inactive","active"];
  }),
  actions: {
    /*
     * change of entry status
     */
    setStatus: function(newStatusIndex) {
      //get current model instance
      let ownInstance = this.get('model');
      //change status and save
      if(ownInstance && newStatusIndex>=0) {
        ownInstance.set('state', this.get('states')[newStatusIndex]);
        ownInstance.save();
      }
      else {
        Materialize.toast("Error changing status", 1000);
      }
    }
  }
});
